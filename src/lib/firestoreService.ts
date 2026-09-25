import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { db, auth } from './firebase';
import { StoreSettings, Catalog, Product } from '../types/catalog';
import { getStoredItem, setStoredItem } from './indexedDbStorage';

// In-memory cache for chunked catalogs to avoid redundant network reads and reduce Firestore quota usage
const chunkedCatalogCache = new Map<string, { updatedAt: string; products: any[] }>();
const savedCatalogFingerprints = new Map<string, string>();

let isWriteQuotaExhausted = false;
let quotaExhaustedTimestamp = 0;
const QUOTA_COOLDOWN_MS = 3 * 60 * 1000; // 3 minutes cooldown

export function markQuotaExhausted() {
  isWriteQuotaExhausted = true;
  quotaExhaustedTimestamp = Date.now();
  try {
    sessionStorage.setItem('firestore_quota_exhausted', String(quotaExhaustedTimestamp));
  } catch {}
}

export function isQuotaBlocked(): boolean {
  if (!isWriteQuotaExhausted) {
    try {
      const stored = sessionStorage.getItem('firestore_quota_exhausted');
      if (stored) {
        const ts = Number(stored);
        if (Date.now() - ts < QUOTA_COOLDOWN_MS) {
          isWriteQuotaExhausted = true;
          quotaExhaustedTimestamp = ts;
          return true;
        } else {
          sessionStorage.removeItem('firestore_quota_exhausted');
        }
      }
    } catch {}
    return false;
  }
  if (Date.now() - quotaExhaustedTimestamp > QUOTA_COOLDOWN_MS) {
    isWriteQuotaExhausted = false;
    return false;
  }
  return true;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const isQuota =
    errMsg.includes('resource-exhausted') ||
    errMsg.includes('Quota limit exceeded') ||
    errMsg.includes('quota');

  if (isQuota) {
    markQuotaExhausted();
    console.warn(`Firestore write quota reached. Switched seamlessly to local storage.`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Info: ', JSON.stringify(errInfo));
}

// Convert human username (e.g. "Chihuahua") to internal email
export function formatUsernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  return `${clean || 'vendor'}@catalogcraft.internal`;
}

// Ensure password complies with Firebase Auth minimum length (6 chars)
export function formatPasswordForFirebase(rawPass: string): string {
  if (rawPass.length >= 6) return rawPass;
  // Pad short passwords safely (e.g., "1306" -> "13061306")
  return (rawPass + rawPass + '000000').slice(0, 10);
}

// Seller Auth Handler
export async function loginSeller(username: string, rawPassword: string): Promise<{ user: User; username: string }> {
  const email = formatUsernameToEmail(username);
  const password = formatPasswordForFirebase(rawPassword);

  try {
    // Try signing in
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    // Non-blocking background touch
    setDoc(doc(db, 'sellers', userCred.user.uid), {
      username: username.trim(),
      sellerId: userCred.user.uid,
    }, { merge: true }).catch(() => {});
    return { user: userCred.user, username: username.trim() };
  } catch (err: any) {
    // If user not found, create new account automatically
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/invalid-email'
    ) {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, email, password);
        // Initialize seller profile in background
        setDoc(doc(db, 'sellers', newCred.user.uid), {
          username: username.trim(),
          sellerId: newCred.user.uid,
          createdAt: new Date().toISOString(),
        }).catch(() => {});
        return { user: newCred.user, username: username.trim() };
      } catch (createErr: any) {
        throw new Error('Error al registrar usuario: ' + createErr.message);
      }
    }
    throw new Error('Contraseña o usuario incorrecto.');
  }
}

export async function logoutSeller(): Promise<void> {
  await firebaseSignOut(auth);
}

// Subscribe to Auth State
export function subscribeToAuth(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

/**
 * Recursively removes `undefined` fields from objects and arrays
 * so Firestore setDoc() never fails due to "Unsupported field value: undefined".
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

/**
 * Optimizes base64 images before saving to Firestore to prevent exceeding the 1MB document size limit.
 */
function optimizeImagesForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => optimizeImagesForFirestore(item)) as any;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        if (
          typeof value === 'string' &&
          value.startsWith('data:image/') &&
          value.length > 950000
        ) {
          // If extremely large, keep up to 950k chars or truncate safely
          cleaned[key] = value.substring(0, 950000);
        } else {
          cleaned[key] = optimizeImagesForFirestore(value);
        }
      }
    }
    return cleaned as T;
  }
  return data;
}

// Save Store Settings to Firestore under seller account
export async function saveStoreSettingsToFirestore(
  sellerId: string,
  settings: StoreSettings
): Promise<void> {
  const path = `sellers/${sellerId}/settings/current`;
  setStoredItem(`cached_settings_${sellerId}`, settings).catch(() => {});
  setStoredItem('cached_settings_latest', settings).catch(() => {});

  if (isQuotaBlocked()) {
    return;
  }

  try {
    const optimized = optimizeImagesForFirestore(settings);
    const payload = sanitizeForFirestore({
      ...optimized,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'sellers', sellerId, 'settings', 'current'), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Load Store Settings from Firestore
export async function loadStoreSettingsFromFirestore(sellerId: string): Promise<StoreSettings | null> {
  const path = `sellers/${sellerId}/settings/current`;
  try {
    const snap = await getDoc(doc(db, 'sellers', sellerId, 'settings', 'current'));
    if (snap.exists()) {
      return snap.data() as StoreSettings;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

// De-duplicates image base64 strings inside a Product to drastically reduce payload size before saving to Firestore.
export function deDuplicateProduct(product: any): any {
  if (!product) return product;
  const copy = { ...product };

  if (copy.imageDetails && Array.isArray(copy.imageDetails) && copy.imageDetails.length > 0) {
    // 1. If primary image is in imageDetails, replace with sentinel
    const detailIdx = copy.imageDetails.findIndex((d: any) => d && d.url === copy.image);
    if (detailIdx !== -1) {
      copy.image = `__SAME_AS_DETAIL_${detailIdx}__`;
    }

    // 2. Check if copy.images matches copy.imageDetails
    if (Array.isArray(copy.images) && copy.images.length > 0) {
      const detailsUrls = copy.imageDetails.map((d: any) => d?.url);
      const isIdentical =
        copy.images.length === detailsUrls.length &&
        copy.images.every((url: any, idx: number) => url === detailsUrls[idx]);

      if (isIdentical) {
        copy.images = ["__SAME_AS_DETAILS__"];
      } else {
        copy.images = copy.images.map((url: any) => {
          const match = detailsUrls.indexOf(url);
          return match !== -1 ? `__DET_${match}__` : url;
        });
      }
    }
  } else if (Array.isArray(copy.images) && copy.images.length > 0) {
    const imgIdx = copy.images.indexOf(copy.image);
    if (imgIdx !== -1) {
      copy.image = `__SAME_AS_IMAGE_${imgIdx}__`;
    }
  }

  return copy;
}

// Restores duplicate image base64 strings inside a Product after fetching from Firestore.
export function rehydrateProduct(product: any): any {
  if (!product) return product;
  const copy = { ...product };

  if (copy.imageDetails && Array.isArray(copy.imageDetails) && copy.imageDetails.length > 0) {
    // 1. Rehydrate images array
    if (
      Array.isArray(copy.images) &&
      copy.images.length === 1 &&
      copy.images[0] === "__SAME_AS_DETAILS__"
    ) {
      copy.images = copy.imageDetails.map((d: any) => d?.url || "");
    } else if (Array.isArray(copy.images)) {
      copy.images = copy.images.map((img: string) => {
        if (typeof img === 'string' && img.startsWith("__DET_") && img.endsWith("__")) {
          const idx = parseInt(img.replace("__DET_", "").replace("__", ""), 10);
          return copy.imageDetails[idx]?.url || "";
        }
        return img;
      });
    }

    // 2. Rehydrate primary image
    if (typeof copy.image === 'string') {
      if (copy.image === "__SAME_AS_DETAIL_0__") {
        copy.image = copy.imageDetails[0]?.url || "";
      } else if (copy.image.startsWith("__SAME_AS_DETAIL_") && copy.image.endsWith("__")) {
        const idx = parseInt(copy.image.replace("__SAME_AS_DETAIL_", "").replace("__", ""), 10);
        copy.image = copy.imageDetails[idx]?.url || copy.imageDetails[0]?.url || "";
      }
    }
  } else if (Array.isArray(copy.images) && copy.images.length > 0) {
    if (typeof copy.image === 'string' && copy.image.startsWith("__SAME_AS_IMAGE_") && copy.image.endsWith("__")) {
      const idx = parseInt(copy.image.replace("__SAME_AS_IMAGE_", "").replace("__", ""), 10);
      copy.image = copy.images[idx] || copy.images[0] || "";
    }
  }

  // Safe fallback if primary image is empty
  if (!copy.image) {
    copy.image = copy.imageDetails?.[0]?.url || copy.images?.[0] || "";
  }

  return copy;
}

export function deDuplicateCatalog(catalog: Catalog): Catalog {
  if (!catalog || !catalog.products) return catalog;
  const seenIds = new Set<string>();
  const uniqueProducts: Product[] = [];
  for (const p of catalog.products) {
    if (p && p.id && !seenIds.has(p.id)) {
      seenIds.add(p.id);
      uniqueProducts.push(deDuplicateProduct(p));
    }
  }
  return {
    ...catalog,
    products: uniqueProducts,
  };
}

export function rehydrateCatalog(catalog: Catalog): Catalog {
  if (!catalog || !catalog.products) return catalog;
  const seenIds = new Set<string>();
  const uniqueProducts: Product[] = [];
  for (const p of catalog.products) {
    if (p && p.id && !seenIds.has(p.id)) {
      seenIds.add(p.id);
      uniqueProducts.push(rehydrateProduct(p));
    }
  }
  return {
    ...catalog,
    products: uniqueProducts,
  };
}

// Partition products into smaller batches so no single document exceeds 550KB,
// enabling unlimited total catalog storage for high-resolution images in Firestore.
export function partitionProductsIntoChunks(products: any[], maxChunkBytes = 550000): any[][] {
  if (!products || products.length === 0) return [];
  const chunks: any[][] = [];
  let currentChunk: any[] = [];
  let currentSize = 0;

  for (const product of products) {
    const prodSize = JSON.stringify(product).length;
    if (currentChunk.length > 0 && currentSize + prodSize > maxChunkBytes) {
      chunks.push(currentChunk);
      currentChunk = [product];
      currentSize = prodSize;
    } else {
      currentChunk.push(product);
      currentSize += prodSize;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Save Catalog to Firestore under seller account with atomic batch writes and chunking support
export async function saveCatalogToFirestore(
  sellerId: string,
  catalog: Catalog
): Promise<void> {
  const path = `sellers/${sellerId}/catalogs/${catalog.id}`;
  const deDuplicated = deDuplicateCatalog(catalog);
  const cleaned = sanitizeForFirestore(deDuplicated);

  // Always cache locally in IndexedDB first
  setStoredItem(`cached_catalogs_${sellerId}`, [cleaned]).catch(() => {});
  setStoredItem('cached_catalogs_latest', [cleaned]).catch(() => {});

  if (isQuotaBlocked()) {
    return;
  }

  try {
    // Generate lightweight fingerprint to avoid redundant writes
    const fingerprint = `${catalog.id}_${cleaned.title}_${cleaned.products?.length}_${JSON.stringify(cleaned).length}`;
    if (savedCatalogFingerprints.get(catalog.id) === fingerprint) {
      return; // Skip identical write to protect Firestore write quota
    }

    // Calculate serialized total size
    const rawLength = JSON.stringify(cleaned).length;

    // If total catalog size fits safely within a single document (< 650KB)
    if (rawLength < 650000) {
      const payload = {
        ...cleaned,
        isChunked: false,
        chunkCount: 0,
        updatedAt: new Date().toISOString(),
      };
      
      const batch = writeBatch(db);
      batch.set(doc(db, 'sellers', sellerId, 'catalogs', catalog.id), payload);
      await batch.commit();
      savedCatalogFingerprints.set(catalog.id, fingerprint);

      // Clean up any old chunks if previously chunked
      getDocs(collection(db, 'sellers', sellerId, 'catalogs', catalog.id, 'chunks'))
        .then((oldChunksSnap) => {
          if (!oldChunksSnap.empty) {
            const delBatch = writeBatch(db);
            oldChunksSnap.docs.forEach((d) => delBatch.delete(d.ref));
            return delBatch.commit();
          }
        })
        .catch(() => {});
      return;
    }

    // High-Resolution Chunked Storage (bypasses the 1MB single-document limit!)
    // Each chunk is stored as a sub-document in /chunks/chunk_{i}
    const chunks = partitionProductsIntoChunks(cleaned.products || [], 500000);

    const batch = writeBatch(db);

    // Add all chunks into the single batch
    chunks.forEach((chunkProducts, i) => {
      batch.set(
        doc(db, 'sellers', sellerId, 'catalogs', catalog.id, 'chunks', `chunk_${i}`),
        {
          chunkIndex: i,
          products: chunkProducts,
          updatedAt: new Date().toISOString(),
        }
      );
    });

    // Save main catalog document (without heavy products array)
    const mainPayload = {
      id: catalog.id,
      title: catalog.title,
      description: catalog.description || '',
      createdAt: catalog.createdAt,
      updatedAt: new Date().toISOString(),
      isChunked: true,
      chunkCount: chunks.length,
      productCount: cleaned.products?.length || 0,
      products: [], // Heavy product data is safely stored in chunks!
    };

    batch.set(doc(db, 'sellers', sellerId, 'catalogs', catalog.id), mainPayload);

    // Commit all chunks and main document atomically in a SINGLE network call!
    await batch.commit();
    savedCatalogFingerprints.set(catalog.id, fingerprint);

    // Clean up any extra old chunks if chunk count decreased
    getDocs(collection(db, 'sellers', sellerId, 'catalogs', catalog.id, 'chunks'))
      .then((existingChunksSnap) => {
        const toDelete = existingChunksSnap.docs.filter((d) => {
          const idx = parseInt(d.id.replace('chunk_', ''), 10);
          return !isNaN(idx) && idx >= chunks.length;
        });
        if (toDelete.length > 0) {
          const delBatch = writeBatch(db);
          toDelete.forEach((d) => delBatch.delete(d.ref));
          return delBatch.commit();
        }
      })
      .catch(() => {});
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Save All Catalogs sequentially to avoid overloading the WebChannel write stream
export async function saveAllCatalogsToFirestore(
  sellerId: string,
  catalogs: Catalog[]
): Promise<void> {
  for (const cat of catalogs) {
    await saveCatalogToFirestore(sellerId, cat);
  }
}

// Delete Catalog from Firestore
export async function deleteCatalogFromFirestore(
  sellerId: string,
  catalogId: string
): Promise<void> {
  const path = `sellers/${sellerId}/catalogs/${catalogId}`;
  try {
    // Delete all chunks first if any
    try {
      const chunksSnap = await getDocs(
        collection(db, 'sellers', sellerId, 'catalogs', catalogId, 'chunks')
      );
      if (!chunksSnap.empty) {
        await Promise.all(chunksSnap.docs.map((d) => deleteDoc(d.ref)));
      }
    } catch {}

    await deleteDoc(doc(db, 'sellers', sellerId, 'catalogs', catalogId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Subscribe to all Catalogs for a seller (transparently reassembles chunked high-res catalogs)
// Subscribe to real-time catalog changes for a seller
export function subscribeToSellerCatalogs(
  sellerId: string,
  onData: (catalogs: Catalog[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = `sellers/${sellerId}/catalogs`;
  return onSnapshot(
    collection(db, 'sellers', sellerId, 'catalogs'),
    async (snapshot) => {
      try {
        const catalogPromises = snapshot.docs.map(async (docSnap) => {
          const rawCat = docSnap.data() as any;
          if (rawCat.isChunked && rawCat.chunkCount > 0) {
            // Check memory cache first
            const cached = chunkedCatalogCache.get(rawCat.id);
            if (cached && cached.updatedAt === rawCat.updatedAt && cached.products.length > 0) {
              return rehydrateCatalog({
                ...rawCat,
                products: cached.products,
              });
            }

            try {
              const chunkSnap = await getDocs(
                collection(db, 'sellers', sellerId, 'catalogs', rawCat.id, 'chunks')
              );
              const chunkDocs = chunkSnap.docs.map((cd) => cd.data());
              chunkDocs.sort((a, b) => (a.chunkIndex ?? 0) - (b.chunkIndex ?? 0));
              const allProducts: any[] = [];
              for (const cd of chunkDocs) {
                if (Array.isArray(cd.products)) {
                  allProducts.push(...cd.products);
                }
              }

              // Store in memory cache
              chunkedCatalogCache.set(rawCat.id, {
                updatedAt: rawCat.updatedAt || new Date().toISOString(),
                products: allProducts,
              });

              return rehydrateCatalog({
                ...rawCat,
                products: allProducts,
              });
            } catch (chunkErr) {
              console.warn('Error fetching catalog chunks (e.g. quota limit):', chunkErr);
              // Fallback to memory cache if present
              if (cached && cached.products.length > 0) {
                return rehydrateCatalog({
                  ...rawCat,
                  products: cached.products,
                });
              }
              return rehydrateCatalog(rawCat as Catalog);
            }
          } else {
            return rehydrateCatalog(rawCat as Catalog);
          }
        });

        const catalogs = await Promise.all(catalogPromises);
        catalogs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        // Cache to IndexedDB for offline instant load
        if (catalogs.length > 0) {
          setStoredItem(`cached_catalogs_${sellerId}`, catalogs).catch(() => {});
          setStoredItem('cached_catalogs_latest', catalogs).catch(() => {});
        }

        onData(catalogs);
      } catch (err) {
        console.warn('Snapshot error in catalogs processing:', err);
        if (onError) onError(err);
      }
    },
    (err) => {
      console.warn('Firestore subscription catalog error (e.g. quota limit):', err);
      if (onError) onError(err);
    }
  );
}

// Subscribe to Store Settings for a seller
export function subscribeToStoreSettings(
  sellerId: string,
  onData: (settings: StoreSettings | null) => void
): Unsubscribe {
  const path = `sellers/${sellerId}/settings/current`;
  return onSnapshot(
    doc(db, 'sellers', sellerId, 'settings', 'current'),
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as StoreSettings);
      } else {
        onData(null);
      }
    },
    (err) => {
      console.warn('Firestore subscription settings error (e.g. quota limit):', err);
    }
  );
}

export interface CustomerProfile {
  customerId: string;
  username: string;
  email: string;
  whatsapp?: string;
  address?: string;
  createdAt: string;
}

// Convert human customer username or email to Firebase compatible email
export function formatCustomerUsernameToEmail(username: string): string {
  const trimmed = username.trim().toLowerCase();
  // If the user already entered a standard email (e.g. usuario@gmail.com), use it directly
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return trimmed;
  }
  // Otherwise, remove accents (á->a, ñ->n) and special characters
  const normalized = trimmed
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9_.-]/g, '');
  
  const finalUsername = normalized.length > 0 ? normalized : 'cliente';
  return `${finalUsername}@catalogcraft.com`;
}

// Customer Auth Handler: Sign In
export async function signInCustomer(username: string, rawPassword: string): Promise<{ user: User; username: string }> {
  const clean = username.trim();
  if (!clean) {
    throw new Error('Por favor ingresa tu usuario o correo.');
  }
  if (!rawPassword.trim()) {
    throw new Error('Por favor ingresa tu contraseña.');
  }

  const email = formatCustomerUsernameToEmail(clean);
  const password = formatPasswordForFirebase(rawPassword);

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCred.user, username: clean };
  } catch (err: any) {
    // If sign in fails, check if the account was registered with legacy @client.internal domain
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      try {
        const legacyClean = clean.toLowerCase().replace(/[^a-z0-9_]/g, '');
        const legacyEmail = `${legacyClean || 'client'}@client.internal`;
        const legacyCred = await signInWithEmailAndPassword(auth, legacyEmail, password);
        return { user: legacyCred.user, username: clean };
      } catch {}
    }

    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/invalid-login-credentials' ||
      err.code === 'auth/wrong-password'
    ) {
      throw new Error('Usuario o contraseña incorrectos. Si no tienes cuenta, crea una en la pestaña "Registro".');
    }
    if (err.code === 'auth/too-many-requests') {
      throw new Error('Demasiados intentos fallidos. Espera un momento antes de volver a intentar.');
    }
    throw new Error(err.message || 'Error al iniciar sesión.');
  }
}

// Customer Auth Handler: Register
export async function registerCustomer(username: string, rawPassword: string): Promise<{ user: User; username: string }> {
  const clean = username.trim();
  if (!clean) {
    throw new Error('Por favor ingresa un nombre de usuario o correo.');
  }
  if (clean.toLowerCase() === 'chihuahua') {
    throw new Error('El nombre de usuario "Chihuahua" está reservado para el administrador.');
  }
  if (clean.length < 2) {
    throw new Error('El nombre de usuario debe tener al menos 2 caracteres.');
  }
  if (rawPassword.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.');
  }

  const email = formatCustomerUsernameToEmail(clean);
  const password = formatPasswordForFirebase(rawPassword);

  try {
    const newCred = await createUserWithEmailAndPassword(auth, email, password);
    
    // Save customer record in Firestore asynchronously without blocking registration
    setDoc(doc(db, 'customers', newCred.user.uid), {
      username: clean,
      email: email,
      customerId: newCred.user.uid,
      createdAt: new Date().toISOString(),
    }).catch((dbErr) => {
      console.warn('Could not persist customer profile to Firestore:', dbErr);
    });
    
    return { user: newCred.user, username: clean };
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      throw new Error(`El usuario o correo "${clean}" ya está registrado. Por favor, ve a "Iniciar Sesión".`);
    }
    if (err.code === 'auth/weak-password') {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
    if (err.code === 'auth/invalid-email') {
      throw new Error('El formato del nombre de usuario o correo no es válido.');
    }
    throw new Error(err.message || 'Error al registrar la cuenta.');
  }
}

// Legacy Customer Auth Handler (fallback)
export async function loginCustomer(username: string, rawPassword: string): Promise<{ user: User; username: string }> {
  const email = formatCustomerUsernameToEmail(username);
  const password = formatPasswordForFirebase(rawPassword);

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCred.user, username: username.trim() };
  } catch (err: any) {
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/invalid-email'
    ) {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'customers', newCred.user.uid), {
          username: username.trim(),
          customerId: newCred.user.uid,
          createdAt: new Date().toISOString(),
        });
        return { user: newCred.user, username: username.trim() };
      } catch (createErr: any) {
        throw new Error('Error al registrar cliente en la base de datos: ' + createErr.message);
      }
    }
    throw new Error('Contraseña o usuario incorrecto.');
  }
}

// Save Customer Profile
export async function saveCustomerProfileToFirestore(
  customerId: string,
  profile: Partial<CustomerProfile>
): Promise<void> {
  const path = `customers/${customerId}`;
  try {
    const payload = sanitizeForFirestore({
      ...profile,
      customerId,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'customers', customerId), payload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Load Customer Profile
export async function loadCustomerProfileFromFirestore(customerId: string): Promise<CustomerProfile | null> {
  const path = `customers/${customerId}`;
  try {
    const snap = await getDoc(doc(db, 'customers', customerId));
    if (snap.exists()) {
      return snap.data() as CustomerProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

// Get all active sellers/stores in the system so customers can browse catalogs
export async function getAllSellersFromFirestore(): Promise<{ sellerId: string; username: string }[]> {
  try {
    const snap = await getDocs(collection(db, 'sellers'));
    const sellers: { sellerId: string; username: string }[] = [];
    snap.forEach((doc) => {
      const data = doc.data();
      const sId = data.sellerId || doc.id;
      const uName = data.username || (doc.id === 'bdy3TcO5IAOpmkQEy8zLGpEkENG3' ? 'Chihuahua' : 'Tienda');
      sellers.push({
        sellerId: sId,
        username: uName,
      });
    });
    if (sellers.length > 0) {
      try {
        localStorage.setItem('cached_sellers', JSON.stringify(sellers));
      } catch {}
      return sellers;
    }
  } catch (err) {
    console.warn('Firestore listing sellers reached quota or offline limit, using cached/fallback sellers.', err);
  }

  // Graceful fallback from localStorage or default primary store
  try {
    const cached = localStorage.getItem('cached_sellers');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [{ sellerId: 'bdy3TcO5IAOpmkQEy8zLGpEkENG3', username: 'Chihuahua' }];
}

// Get the default primary store seller ID (Chihuahua) for customer browsing
export async function getPrimarySellerIdFromFirestore(): Promise<string> {
  const KNOWN_CHIHUAHUA_UID = 'bdy3TcO5IAOpmkQEy8zLGpEkENG3';
  try {
    const sellers = await getAllSellersFromFirestore();
    if (sellers.length > 0) {
      const chih = sellers.find((s) => s.username.toLowerCase() === 'chihuahua');
      if (chih) return chih.sellerId;
      return sellers[0].sellerId;
    }
  } catch {}
  return KNOWN_CHIHUAHUA_UID;
}
