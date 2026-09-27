import { Product, StoreSettings } from '../types/catalog';

export interface HermesMessage {
  id: string;
  sender: 'user' | 'hermes';
  text: string;
  recommendedProductIds?: string[];
  timestamp: string;
}

/**
 * Helper to match relevant products in the catalog based on user prompt keywords,
 * budget mentions, or category matches.
 */
export function findRelevantProductsForPrompt(prompt: string, products: Product[]): Product[] {
  if (!products || products.length === 0) return [];
  const clean = prompt.toLowerCase();

  // Extract budget number if present (e.g. "menos de 20", "hasta $15", "< 30")
  const budgetMatch = clean.match(/(?:menos de|hasta|menor a|m[aá]ximo|presupuesto de|\$)\s*(\d+(?:\.\d+)?)/i);
  const maxPrice = budgetMatch ? parseFloat(budgetMatch[1]) : null;

  const inStockProducts = products.filter((p) => p.inStock);
  const candidatePool = inStockProducts.length > 0 ? inStockProducts : products;

  // Score products based on matching title, category, description, brand, or SKU
  const scored = candidatePool.map((p) => {
    let score = 0;
    const titleLower = (p.title || '').toLowerCase();
    const catLower = (p.category || '').toLowerCase();
    const descLower = (p.description || '').toLowerCase();
    const brandLower = (p.brand || '').toLowerCase();

    // Budget condition
    if (maxPrice !== null) {
      if (p.price <= maxPrice) {
        score += 5;
      } else {
        score -= 10;
      }
    }

    const words = clean.split(/\s+/).filter((w) => w.length > 2);
    for (const w of words) {
      if (titleLower.includes(w)) score += 4;
      if (catLower.includes(w)) score += 5;
      if (descLower.includes(w)) score += 2;
      if (brandLower.includes(w)) score += 1;
    }

    // Keyword synonyms
    if ((clean.includes('lente') || clean.includes('gafa') || clean.includes('sol')) && (catLower.includes('lente') || titleLower.includes('gafa'))) {
      score += 8;
    }
    if ((clean.includes('billetera') || clean.includes('cartera') || clean.includes('tarjeta')) && (catLower.includes('billetera') || titleLower.includes('billetera'))) {
      score += 8;
    }
    if ((clean.includes('gorra') || clean.includes('sombrero') || clean.includes('cap')) && (catLower.includes('gorra') || titleLower.includes('gorra'))) {
      score += 8;
    }
    if ((clean.includes('zapato') || clean.includes('zapatilla') || clean.includes('calzado') || clean.includes('tenis')) && (catLower.includes('calzado') || titleLower.includes('zapato') || titleLower.includes('zapatilla'))) {
      score += 8;
    }

    return { product: p, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product)
    .slice(0, 4);
}

/**
 * Parses Hermes AI response looking for structured product tags:
 * [RECOMMENDED_PRODUCTS: id1, id2]
 */
export function parseHermesResponse(rawText: string): {
  cleanMessage: string;
  recommendedProductIds: string[];
} {
  if (!rawText) return { cleanMessage: '', recommendedProductIds: [] };

  const tagRegex = /\[RECOMMENDED_PRODUCTS:\s*([^\]]+)\]/i;
  const match = rawText.match(tagRegex);

  let recommendedProductIds: string[] = [];
  let cleanMessage = rawText;

  if (match) {
    const idsString = match[1];
    recommendedProductIds = idsString
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    cleanMessage = rawText.replace(tagRegex, '').trim();
  }

  return {
    cleanMessage,
    recommendedProductIds,
  };
}

/**
 * Fallback response generator when backend API is unreachable or offline
 */
export function generateOfflineHermesReply(
  userQuery: string,
  products: Product[],
  settings: StoreSettings
): { message: string; recommendedProductIds: string[] } {
  const q = userQuery.toLowerCase();
  const currency = settings.currencySymbol || '$';

  // Shipping / Delivery queries
  if (q.includes('envio') || q.includes('envío') || q.includes('entrega') || q.includes('domicilio') || q.includes('tiempo')) {
    return {
      message: `🚚 **Información de Entregas:**\n${settings.cartAnnouncement || 'Realizamos entregas directas y envíos seguros a domicilio.'}\n\nAl completar tu carrito, se genera tu orden para confirmarla directamente por WhatsApp con nosotros.`,
      recommendedProductIds: [],
    };
  }

  // How to buy / WhatsApp queries
  if (q.includes('como comprar') || q.includes('cómo comprar') || q.includes('whatsapp') || q.includes('pedido') || q.includes('pagar')) {
    return {
      message: `🛒 **¿Cómo comprar en ${settings.storeName}?**\n1. Elige tus artículos favoritos y agrégalos al carrito con el botón "+".\n2. Abre tu carrito y toca el botón verde "Enviar Pedido por WhatsApp".\n3. Te responderemos al instante para coordinar entrega y pago. ¡Es súper rápido y seguro!`,
      recommendedProductIds: [],
    };
  }

  // Product search / recommendations
  const matched = findRelevantProductsForPrompt(userQuery, products);
  if (matched.length > 0) {
    return {
      message: `✨ ¡Hola! Encontré estas excelentes opciones en nuestro catálogo que coinciden con lo que buscas:`,
      recommendedProductIds: matched.map((p) => p.id),
    };
  }

  // General fallback
  const topProducts = products.filter((p) => p.inStock).slice(0, 3);
  return {
    message: `¡Hola! Soy **Hermes**, tu asesor de compras en **${settings.storeName}**. 😊\n\nPuedo ayudarte a encontrar productos específicos, recomendarte ideas para regalos o responder tus dudas sobre envíos. Aquí tienes algunos de los artículos más pedidos:`,
    recommendedProductIds: topProducts.map((p) => p.id),
  };
}
