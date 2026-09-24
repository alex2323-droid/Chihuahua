import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
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
        // Initialize seller profile
        const sellerPath = `sellers/${newCred.user.uid}`;
        await setDoc(doc(db, 'sellers', newCred.user.uid), {
          username: username.trim(),
          sellerId: newCred.user.uid,
          createdAt: new Date().toISOString(),
        });
        return { user: newCred.user, username: username.trim() };
      } catch (createErr: any) {
        throw new Error('Error al registrar usuario en la base de datos: ' + createErr.message);
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

// Save Catalog to Firestore under seller account
export async function saveCatalogToFirestore(
  sellerId: string,
  catalog: Catalog
): Promise<void> {
  const path = `sellers/${sellerId}/catalogs/${catalog.id}`;
  try {
    const optimized = optimizeImagesForFirestore(catalog);
    const payload = sanitizeForFirestore({
      ...optimized,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'sellers', sellerId, 'catalogs', catalog.id), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Delete Catalog from Firestore
export async function deleteCatalogFromFirestore(
  sellerId: string,
  catalogId: string
): Promise<void> {
  const path = `sellers/${sellerId}/catalogs/${catalogId}`;
  try {
    await deleteDoc(doc(db, 'sellers', sellerId, 'catalogs', catalogId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Subscribe to all Catalogs for a seller
export function subscribeToSellerCatalogs(
  sellerId: string,
  onData: (catalogs: Catalog[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = `sellers/${sellerId}/catalogs`;
  return onSnapshot(
    collection(db, 'sellers', sellerId, 'catalogs'),
    (snapshot) => {
      const catalogs: Catalog[] = [];
      snapshot.forEach((doc) => {
        catalogs.push(doc.data() as Catalog);
      });
      // Sort by creation date or title
      catalogs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      onData(catalogs);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
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
      handleFirestoreError(err, OperationType.GET, path);
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

// Convert human customer username to internal email
export function formatCustomerUsernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  return `${clean || 'client'}@client.internal`;
}

// Customer Auth Handler (Strict login and registration)
export async function signInCustomer(username: string, rawPassword: string): Promise<{ user: User; username: string }> {
  const email = formatCustomerUsernameToEmail(username);
  const password = formatPasswordForFirebase(rawPassword);

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCred.user, username: username.trim() };
  } catch (err: any) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      throw new Error('Usuario o contraseña incorrectos. Si no tienes una cuenta, por favor regístrate.');
    }
    throw new Error(err.message || 'Error al iniciar sesión.');
  }
}

export async function registerCustomer(username: string, rawPassword: string): Promise<{ user: User; username: string }> {
  const clean = username.trim();
  if (clean.toLowerCase() === 'chihuahua') {
    throw new Error('El nombre de usuario "Chihuahua" está reservado para el administrador.');
  }
  if (clean.length < 3) {
    throw new Error('El nombre de usuario debe tener al menos 3 caracteres.');
  }
  if (rawPassword.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.');
  }

  const email = formatCustomerUsernameToEmail(username);
  const password = formatPasswordForFirebase(rawPassword);

  try {
    const newCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'customers', newCred.user.uid), {
      username: clean,
      customerId: newCred.user.uid,
      createdAt: new Date().toISOString(),
    });
    return { user: newCred.user, username: clean };
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      throw new Error('El nombre de usuario ya está registrado. Por favor, inicia sesión.');
    }
    throw new Error(err.message || 'Error al registrarse.');
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
  const path = 'sellers';
  try {
    const snap = await getDocs(collection(db, 'sellers'));
    const sellers: { sellerId: string; username: string }[] = [];
    snap.forEach((doc) => {
      const data = doc.data();
      if (data.username && data.sellerId) {
        sellers.push({
          sellerId: data.sellerId,
          username: data.username,
        });
      }
    });
    return sellers;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}
