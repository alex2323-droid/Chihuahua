import { describe, it, expect } from 'vitest';
import { reconcileCatalogs, filterOutDeletedProducts } from './syncUtils';
import { Catalog, Product } from '../types/catalog';

describe('syncUtils - Sincronización de Catálogo y Eliminación de Productos', () => {
  const createProduct = (id: string, title: string): Product => ({
    id,
    sku: `CH-${id}`,
    title,
    description: 'Descripción de prueba',
    price: 20,
    currency: '$',
    category: 'General',
    brand: 'Chihuahua',
    image: 'https://example.com/img.jpg',
    inStock: true,
  });

  const baseLocalCatalog: Catalog = {
    id: 'cat_principal',
    title: 'Colección Destacada 2026',
    description: 'Catálogo',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
    products: Array.from({ length: 14 }).map((_, i) =>
      createProduct(`prod_${i + 1}`, `Producto #${i + 1}`)
    ),
  };

  it('debe aceptar el estado oficial de la nube (11 productos) y descartar los 3 productos eliminados por el vendedor', () => {
    // La nube ahora tiene 11 productos (el vendedor borró prod_12, prod_13, prod_14)
    const incomingCloudCatalog: Catalog = {
      ...baseLocalCatalog,
      updatedAt: '2026-01-01T12:00:00.000Z',
      products: baseLocalCatalog.products.slice(0, 11), // 11 productos
    };

    const result = reconcileCatalogs([baseLocalCatalog], [incomingCloudCatalog]);

    expect(result).toHaveLength(1);
    expect(result[0].products).toHaveLength(11);
    expect(result[0].products.map((p) => p.id)).not.toContain('prod_12');
    expect(result[0].products.map((p) => p.id)).not.toContain('prod_13');
    expect(result[0].products.map((p) => p.id)).not.toContain('prod_14');
  });

  it('no debe resucitar productos eliminados aunque el cliente tenga timestamps desfasados en localStorage', () => {
    // Cliente con timestamp local alterado o futuro
    const localWithFutureTimestamp: Catalog = {
      ...baseLocalCatalog,
      updatedAt: '2026-01-01T15:00:00.000Z',
      products: Array.from({ length: 14 }).map((_, i) =>
        createProduct(`prod_${i + 1}`, `Producto #${i + 1}`)
      ),
    };

    const cloudAuthoritative: Catalog = {
      ...baseLocalCatalog,
      updatedAt: '2026-01-01T12:00:00.000Z',
      products: baseLocalCatalog.products.slice(0, 11), // 11 productos
    };

    const result = reconcileCatalogs([localWithFutureTimestamp], [cloudAuthoritative]);

    // Para clientes/visitantes, el estado de la nube es autoritativo
    expect(result[0].products).toHaveLength(11);
  });

  it('debe filtrar cualquier producto que haya sido explícitamente marcado como eliminado', () => {
    const deletedIds = new Set(['prod_1', 'prod_2']);
    const catalogWith14: Catalog = {
      ...baseLocalCatalog,
      products: Array.from({ length: 14 }).map((_, i) =>
        createProduct(`prod_${i + 1}`, `Producto #${i + 1}`)
      ),
    };

    const filtered = filterOutDeletedProducts([catalogWith14], deletedIds);
    expect(filtered[0].products).toHaveLength(12);
    expect(filtered[0].products.find((p) => p.id === 'prod_1')).toBeUndefined();
    expect(filtered[0].products.find((p) => p.id === 'prod_2')).toBeUndefined();
  });
});
