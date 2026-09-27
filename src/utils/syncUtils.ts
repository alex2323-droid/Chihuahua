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
 * Reconcilia los catálogos locales y los recibidos de la nube.
 * Da prioridad total y autoritativa a la nube para evitar "resucitar" productos eliminados por el vendedor.
 */
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
