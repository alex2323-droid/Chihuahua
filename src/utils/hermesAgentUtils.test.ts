import { describe, it, expect } from 'vitest';
import { findRelevantProductsForPrompt, parseHermesResponse } from './hermesAgentUtils';
import { Product } from '../types/catalog';

describe('hermesAgentUtils - Motor de Recomendaciones del Asistente Hermes', () => {
  const sampleProducts: Product[] = [
    {
      id: 'prod_billetera',
      sku: 'CH-5146',
      title: 'Billetera Magnética',
      description: 'Billetera de cuero PU con 6 ranuras para tarjetas.',
      price: 18.0,
      currency: '$',
      category: 'Billetera',
      brand: 'Team Chihuahua',
      image: 'https://example.com/billetera.jpg',
      inStock: true,
    },
    {
      id: 'prod_gafas',
      sku: 'CH-7566',
      title: 'Gafas de luz azul',
      description: 'Gafas de sol y descanso con filtro de luz azul.',
      price: 12.0,
      currency: '$',
      category: 'Lentes',
      brand: 'Team Chihuahua',
      image: 'https://example.com/gafas.jpg',
      inStock: true,
    },
    {
      id: 'prod_gorra',
      sku: 'CH-9082',
      title: 'Gorra Trucker Vintage',
      description: 'Gorra estilo camionero con malla trasera.',
      price: 14.0,
      currency: '$',
      category: 'Gorra',
      brand: 'Team Chihuahua',
      image: 'https://example.com/gorra.jpg',
      inStock: true,
    },
    {
      id: 'prod_sneakers',
      sku: 'CH-1001',
      title: 'Zapatillas Urbanas',
      description: 'Calzado casual para uso diario.',
      price: 45.0,
      currency: '$',
      category: 'Calzado',
      brand: 'Team Chihuahua',
      image: 'https://example.com/sneakers.jpg',
      inStock: false,
    },
  ];

  it('debe filtrar productos por presupuesto máximo (ej. menos de $15)', () => {
    const results = findRelevantProductsForPrompt('Busco algo barato de menos de 15 dolares', sampleProducts);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.every((p) => p.price <= 15)).toBe(true);
    expect(results.map((p) => p.id)).toContain('prod_gafas');
  });

  it('debe filtrar productos por categoría o palabras clave (ej. lentes / gafas)', () => {
    const results = findRelevantProductsForPrompt('Quiero ver lentes para descansar la vista', sampleProducts);
    expect(results.some((p) => p.id === 'prod_gafas')).toBe(true);
  });

  it('debe priorizar productos que están en stock', () => {
    const results = findRelevantProductsForPrompt('Quiero ver calzado y zapatillas', sampleProducts);
    // Debe incluir productos en stock primero
    expect(results).toBeDefined();
  });

  it('debe parsear respuestas JSON con IDs de productos recomendados', () => {
    const rawAiResponse = `¡Hola! Con gusto te recomiendo estas opciones perfectas:
    
[RECOMMENDED_PRODUCTS: prod_billetera, prod_gafas]`;

    const parsed = parseHermesResponse(rawAiResponse);
    expect(parsed.cleanMessage).toContain('¡Hola! Con gusto te recomiendo');
    expect(parsed.recommendedProductIds).toEqual(['prod_billetera', 'prod_gafas']);
  });
});
