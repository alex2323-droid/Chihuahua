import { Catalog, Product } from '../types/catalog';
import { rehydrateCatalog, rehydrateProduct } from '../lib/firestoreService';

/**
 * Filtra productos eliminados basados en un Set o Array de IDs eliminados.
 * Normaliza las cadenas y recorta espacios en blanco para comparación estricta.
 */
export function filterOutDeletedProducts(
  catalogs: Catalog[],
  deletedIds?: Set<string> | string[] | Iterable<string> | null
): Catalog[] {
  if (!catalogs || catalogs.length === 0) return [];
  if (!deletedIds) return catalogs;

  const deletedSet = new Set<string>();
  for (const id of deletedIds) {
    if (id) {
      const s = String(id);
      deletedSet.add(s);
      deletedSet.add(s.trim());
    }
  }

  if (deletedSet.size === 0) return catalogs;

  return catalogs.map((cat) => ({
    ...cat,
    products: (cat.products || []).filter((p) => {
      if (!p || !p.id) return false;
      const pid = String(p.id);
      const pidTrim = pid.trim();
      return !deletedSet.has(pid) && !deletedSet.has(pidTrim);
    }),
  }));
}

/**
 * Reensambla de forma segura los fragmentos (chunks) de un catálogo fraccionado en Firestore.
 * Ignora estrictamente fragmentos huérfanos con chunkIndex >= chunkCount para evitar
 * resucitar productos que ya fueron eliminados.
 */
export function reassembleChunkedCatalog(
  rawCat: any,
  chunkDocs: any[]
): Catalog {
  if (!rawCat) {
    return {
      id: 'cat_principal',
      title: 'Catálogo',
      description: '',
      createdAt: new Date().toISOString(),
      products: [],
    };
  }

  if (!rawCat.isChunked || !rawCat.chunkCount || rawCat.chunkCount <= 0) {
    return rehydrateCatalog(rawCat as Catalog);
  }

  const maxValidChunks = rawCat.chunkCount;

  // Filtrar solo los fragmentos autorizados dentro del rango oficial [0, chunkCount - 1]
  const validChunks = (chunkDocs || []).filter(
    (cd) => typeof cd.chunkIndex === 'number' && cd.chunkIndex >= 0 && cd.chunkIndex < maxValidChunks
  );

  validChunks.sort((a, b) => (a.chunkIndex ?? 0) - (b.chunkIndex ?? 0));

  const allProducts: Product[] = [];
  const seenIds = new Set<string>();

  for (const cd of validChunks) {
    if (Array.isArray(cd.products)) {
      for (const p of cd.products) {
        if (p && p.id && !seenIds.has(p.id)) {
          seenIds.add(p.id);
          allProducts.push(rehydrateProduct(p));
        }
      }
    }
  }

  return rehydrateCatalog({
    ...rawCat,
    products: allProducts,
  });
}

/**
 * Reconcilia los catálogos locales y remotos (nube), garantizando que ningún producto
 * que haya sido eliminado localmente o listado en deletedIds sea resucitado por el estado de la nube.
 */
export function reconcileCatalogs(
  localCatalogs: Catalog[],
  cloudCatalogs: Catalog[],
  deletedIds?: Set<string> | string[] | Iterable<string> | null
): Catalog[] {
  // Construir conjunto estricto de IDs eliminados
  const deletedSet = new Set<string>();
  if (deletedIds) {
    for (const id of deletedIds) {
      if (id) {
        const s = String(id);
        deletedSet.add(s);
        deletedSet.add(s.trim());
      }
    }
  }

  // 1. Filtrar catálogos locales
  const cleanLocal = filterOutDeletedProducts(localCatalogs || [], deletedSet);

  if (!cloudCatalogs || cloudCatalogs.length === 0) {
    return cleanLocal;
  }

  // 2. Normalizar e higienizar catálogos de la nube con rehidratación
  const safeCloud = cloudCatalogs.map(rehydrateCatalog);
  const cleanCloud = filterOutDeletedProducts(safeCloud, deletedSet);

  // 3. Garantizar que ningún producto eliminado en deletedSet persista en el resultado
  return cleanCloud.map((cCat) => {
    // Si el catálogo local existe para este ID, asegurarnos de respetar productos eliminados localmente
    const localMatch = cleanLocal.find((l) => l.id === cCat.id);
    if (localMatch && Array.isArray(localMatch.products)) {
      const localProductIds = new Set(localMatch.products.map((p) => String(p.id).trim()));
      // Si el estado local tiene menos productos y tiene timestamp igual o más reciente
      const localTime = new Date(localMatch.updatedAt || 0).getTime();
      const cloudTime = new Date(cCat.updatedAt || 0).getTime();
      
      if (localTime >= cloudTime && localMatch.products.length < cCat.products.length) {
        return {
          ...cCat,
          products: (cCat.products || []).filter((p) => {
            const pid = String(p.id).trim();
            return !deletedSet.has(pid) && localProductIds.has(pid);
          }),
        };
      }
    }

    return {
      ...cCat,
      products: (cCat.products || []).filter((p) => {
        if (!p || !p.id) return false;
        const pid = String(p.id).trim();
        return !deletedSet.has(pid) && !deletedSet.has(String(p.id));
      }),
    };
  });
}
