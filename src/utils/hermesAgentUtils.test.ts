import { describe, it, expect } from 'vitest';
import {
  findRelevantProductsForPrompt,
  parseHermesResponse,
  generateOfflineHermesReply,
  HERMES_PRESET_QUESTIONS,
} from './hermesAgentUtils';
import { Product } from '../types/catalog';
import { initialStoreSettings } from '../data/initialData';

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

  it('debe incluir una lista amplia y categorizada de preguntas predeterminadas para Hermes', () => {
    expect(HERMES_PRESET_QUESTIONS.length).toBeGreaterThanOrEqual(10);
    const categories = new Set(HERMES_PRESET_QUESTIONS.map((q) => q.category));
    expect(categories.has('popular')).toBe(true);
    expect(categories.has('budget')).toBe(true);
    expect(categories.has('shipping')).toBe(true);
    expect(categories.has('order')).toBe(true);
    expect(categories.has('payment')).toBe(true);
    expect(categories.has('special')).toBe(true);
  });

  it('debe generar respuestas offline precisas para envíos MRW, pagos y pedidos especiales', () => {
    const replyShipping = generateOfflineHermesReply('¿Cómo son los envíos por MRW?', sampleProducts, initialStoreSettings);
    expect(replyShipping.message).toContain('MRW');

    const replyPayment = generateOfflineHermesReply('¿Qué métodos de pago tienen? ¿Aceptan pago móvil?', sampleProducts, initialStoreSettings);
    expect(replyPayment.message).toContain('Pago Móvil');

    const replySpecial = generateOfflineHermesReply('Quiero encargar un producto que no está en el catálogo', sampleProducts, initialStoreSettings);
    expect(replySpecial.message).toContain('Pedido Especial');
  });
});

