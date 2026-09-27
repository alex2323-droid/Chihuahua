import { describe, it, expect } from 'vitest';
import { reconcileCatalogs, filterOutDeletedProducts, reassembleChunkedCatalog } from './syncUtils';
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

  it('debe descartar fragmentos huérfanos (stale chunks) cuyo chunkIndex >= chunkCount', () => {
    // El catálogo oficial indica que solo tiene 6 chunks
    const rawCat = {
      id: 'cat_principal',
      title: 'Colección Destacada 2026',
      description: 'Catálogo',
      createdAt: '2026-01-01T00:00:00.000Z',
      isChunked: true,
      chunkCount: 6,
      products: [],
    };

    // La subcolección contiene 7 chunks (el chunk_6 quedó de un guardado anterior con productos eliminados)
    const chunkDocs = [
      { chunkIndex: 0, products: [createProduct('p1', 'Prod 1')] },
      { chunkIndex: 1, products: [createProduct('p2', 'Prod 2')] },
      { chunkIndex: 2, products: [createProduct('p3', 'Prod 3')] },
      { chunkIndex: 3, products: [createProduct('p4', 'Prod 4')] },
      { chunkIndex: 4, products: [createProduct('p5', 'Prod 5')] },
      { chunkIndex: 5, products: [createProduct('p6', 'Prod 6')] },
      { chunkIndex: 6, products: [createProduct('p_eliminado', 'Producto que fue eliminado')] }, // Stale chunk!
    ];

    const reassembled = reassembleChunkedCatalog(rawCat as any, chunkDocs);

    expect(reassembled.products).toHaveLength(6);
    expect(reassembled.products.map((p) => p.id)).not.toContain('p_eliminado');
  });

  it('reconcileCatalogs debe respetar estrictamente deletedProductIds eliminando productos que aún existen en la nube', () => {
    // La nube todavía tiene los productos 1 y 2
    const cloudCatalog: Catalog = {
      ...baseLocalCatalog,
      products: [
        createProduct('prod_1', 'Producto 1'),
        createProduct('prod_2', 'Producto 2'),
        createProduct('prod_3', 'Producto 3'),
        createProduct('prod_4', 'Producto 4'),
      ],
    };

    // El vendedor eliminó prod_1 y prod_2 localmente
    const deletedIds = new Set(['prod_1', ' prod_2 ']); // Con espacio en blanco
    const reconciled = reconcileCatalogs([], [cloudCatalog], deletedIds);

    expect(reconciled[0].products).toHaveLength(2);
    expect(reconciled[0].products.map((p) => p.id)).toEqual(['prod_3', 'prod_4']);
  });

  it('reconcileCatalogs debe aceptar un array de strings en deletedIds y filtrar correctamente', () => {
    const cloudCatalog: Catalog = {
      ...baseLocalCatalog,
      products: [
        createProduct('prod_A', 'Prod A'),
        createProduct('prod_B', 'Prod B'),
        createProduct('prod_C', 'Prod C'),
      ],
    };

    const reconciled = reconcileCatalogs([], [cloudCatalog], ['prod_A']);
    expect(reconciled[0].products).toHaveLength(2);
    expect(reconciled[0].products.map((p) => p.id)).toEqual(['prod_B', 'prod_C']);
  });
});
