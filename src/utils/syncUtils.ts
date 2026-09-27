import { Catalog, Product } from '../types/catalog';
import { rehydrateCatalog, rehydrateProduct } from '../lib/firestoreService';

/**
 * Filtra productos eliminados basados en un Set de IDs eliminados.
 */
export function filterOutDeletedProducts(catalogs: Catalog[], deletedIds: Set<string>): Catalog[] {
  if (!catalogs || catalogs.length === 0 || !deletedIds || deletedIds.size === 0) {
    return catalogs;
  }
  return catalogs.map((cat) => ({
    ...cat,
    products: (cat.products || []).filter((p) => p && p.id && !deletedIds.has(p.id)),
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

export function reconcileCatalogs(
  localCatalogs: Catalog[],
  cloudCatalogs: Catalog[],
  deletedIds?: Set<string>
): Catalog[] {
  if (!cloudCatalogs || cloudCatalogs.length === 0) {
    return filterOutDeletedProducts(localCatalogs || [], deletedIds || new Set());
  }

  // La nube es la fuente autoritativa de la verdad
  const safeCloud = cloudCatalogs.map(rehydrateCatalog);

  if (!deletedIds || deletedIds.size === 0) {
    return safeCloud;
  }

  return filterOutDeletedProducts(safeCloud, deletedIds);
}
