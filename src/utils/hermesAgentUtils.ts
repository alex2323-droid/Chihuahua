import { Product, StoreSettings } from '../types/catalog';

export interface HermesMessage {
  id: string;
  sender: 'user' | 'hermes';
  text: string;
  recommendedProductIds?: string[];
  timestamp: string;
}

export interface HermesSuggestedQuestion {
  id: string;
  category: 'popular' | 'budget' | 'shipping' | 'order' | 'special' | 'payment';
  categoryLabel: string;
  icon: string;
  question: string;
  shortLabel: string;
}

export const HERMES_PRESET_QUESTIONS: HermesSuggestedQuestion[] = [
  // Populares & Regalos
  {
    id: 'sug_gift',
    category: 'popular',
    categoryLabel: '🎁 Regalos & Ideas',
    icon: '🎁',
    question: '🎁 Recomiéndame un buen regalo',
    shortLabel: 'Ideas de regalo',
  },
  {
    id: 'sug_top',
    category: 'popular',
    categoryLabel: '🔥 Populares',
    icon: '🔥',
    question: '🔥 ¿Cuáles son los productos más vendidos y populares?',
    shortLabel: 'Más vendidos',
  },
  {
    id: 'sug_new',
    category: 'popular',
    categoryLabel: '⭐ Novedades',
    icon: '⭐',
    question: '⭐ ¿Qué novedades y artículos destacados tienen disponibles?',
    shortLabel: 'Novedades',
  },

  // Presupuesto & Ofertas
  {
    id: 'sug_under20',
    category: 'budget',
    categoryLabel: '💵 Por Presupuesto',
    icon: '💵',
    question: '💵 ¿Qué tienen por menos de $20?',
    shortLabel: 'Menos de $20',
  },
  {
    id: 'sug_discounts',
    category: 'budget',
    categoryLabel: '🏷️ Ofertas & Descuentos',
    icon: '🏷️',
    question: '🏷️ ¿Tienen productos con descuento, rebajas u ofertas especiales?',
    shortLabel: 'Ofertas y descuentos',
  },
  {
    id: 'sug_premium',
    category: 'budget',
    categoryLabel: '💎 Colección Premium',
    icon: '💎',
    question: '💎 ¿Cuáles son los artículos de gama alta o mayor calidad?',
    shortLabel: 'Gama alta',
  },

  // Envíos & MRW
  {
    id: 'sug_shipping',
    category: 'shipping',
    categoryLabel: '🚚 Envíos & Entregas',
    icon: '🚚',
    question: '🚚 ¿Cómo funcionan los envíos a domicilio y por MRW?',
    shortLabel: 'Envíos y MRW',
  },
  {
    id: 'sug_coverage',
    category: 'shipping',
    categoryLabel: '📍 Cobertura Nacional',
    icon: '📍',
    question: '📍 ¿Hacen envíos a todo el país y a agencias MRW?',
    shortLabel: 'Cobertura nacional',
  },
  {
    id: 'sug_delivery_time',
    category: 'shipping',
    categoryLabel: '⏱️ Tiempos de Entrega',
    icon: '⏱️',
    question: '⏱️ ¿Cuánto tiempo tarda en llegar mi paquete o entrega?',
    shortLabel: 'Tiempos de entrega',
  },

  // Cómo Comprar & WhatsApp
  {
    id: 'sug_how_to_buy',
    category: 'order',
    categoryLabel: '🛒 Cómo Comprar',
    icon: '🛒',
    question: '🛒 ¿Cómo hago mi pedido por WhatsApp paso a paso?',
    shortLabel: 'Cómo comprar',
  },
  {
    id: 'sug_sizes',
    category: 'order',
    categoryLabel: '📏 Tallas y Medidas',
    icon: '📏',
    question: '📏 ¿Cómo sé qué talla elegir o qué medidas tienen?',
    shortLabel: 'Guía de tallas',
  },

  // Pagos & Seguridad
  {
    id: 'sug_payment_methods',
    category: 'payment',
    categoryLabel: '💳 Métodos de Pago',
    icon: '💳',
    question: '💳 ¿Cuáles son los métodos de pago aceptados?',
    shortLabel: 'Métodos de pago',
  },
  {
    id: 'sug_safety',
    category: 'payment',
    categoryLabel: '🔒 Garantía y Seguridad',
    icon: '🔒',
    question: '🔒 ¿Qué garantía tienen las compras y qué tan seguro es el proceso?',
    shortLabel: 'Garantía y seguridad',
  },

  // Encargos Especiales
  {
    id: 'sug_special_order',
    category: 'special',
    categoryLabel: '📦 Encargos Especiales',
    icon: '📦',
    question: '📦 ¿Puedo encargar un producto que no veo en el catálogo? (Pedido Especial)',
    shortLabel: 'Pedido Especial',
  },
];

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

    // Discounts / Offers mention
    if ((clean.includes('descuento') || clean.includes('oferta') || clean.includes('rebaja')) && p.originalPrice && p.originalPrice > p.price) {
      score += 8;
    }

    // Premium mention
    if ((clean.includes('premium') || clean.includes('gama alta') || clean.includes('calidad')) && p.price > 30) {
      score += 6;
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
    if ((clean.includes('ropa') || clean.includes('camisa') || clean.includes('franela') || clean.includes('pantalon') || clean.includes('talla')) && (catLower.includes('ropa') || titleLower.includes('camisa') || p.sizes)) {
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

  // Shipping / Delivery / MRW queries
  if (q.includes('envio') || q.includes('envío') || q.includes('entrega') || q.includes('domicilio') || q.includes('mrw') || q.includes('tiempo') || q.includes('tarda') || q.includes('país') || q.includes('pais') || q.includes('ciudad')) {
    return {
      message: `🚚 **Envíos y Entregas en ${settings.storeName}:**\n\n• **Cobertura Nacional:** Realizamos envíos a agencias MRW autorizadas en toda Venezuela y entregas personalizadas a domicilio.\n• **Tiempos de Entrega:** Los pedidos se despachan en 24 a 48 horas hábiles una vez confirmados.\n• **Tarifas y Promociones:** ${settings.cartAnnouncement || 'Pregúntanos por la promoción de envío gratis vigente.'}\n\n¡Al enviar tu carrito por WhatsApp, coordinamos la agencia o dirección exacta contigo!`,
      recommendedProductIds: [],
    };
  }

  // Payment methods
  if (q.includes('pago') || q.includes('pagar') || q.includes('metodo') || q.includes('método') || q.includes('zelle') || q.includes('transferencia') || q.includes('efectivo') || q.includes('divisa') || q.includes('pago movil') || q.includes('pago móvil')) {
    return {
      message: `💳 **Métodos de Pago Aceptados:**\n\n• Pago Móvil y Transferencias bancarias nacionales.\n• Divisas en efectivo al momento de la entrega.\n• Zelle / Binance / Criptomonedas (según disponibilidad).\n\nAl enviar tu pedido por WhatsApp, te indicamos los datos exactos de la cuenta para tu comodidad.`,
      recommendedProductIds: [],
    };
  }

  // Special order
  if (q.includes('especial') || q.includes('encargo') || q.includes('no está') || q.includes('no veo') || q.includes('fuera de catalogo') || q.includes('fuera de catálogo') || q.includes('buscar otro')) {
    return {
      message: `📦 **¿Buscas un producto que no está en el catálogo?**\n\n¡Sí puedes encargarlo! Puedes usar el botón **"Encargar Pedido Especial"** en la barra superior o escribirnos directamente por WhatsApp (${settings.whatsappNumber || 'nuestro canal de atención'}) con la foto, link o descripción de lo que necesitas y te lo cotizamos al momento.`,
      recommendedProductIds: [],
    };
  }

  // Sizing and measurements
  if (q.includes('talla') || q.includes('medida') || q.includes('tamaño') || q.includes('size')) {
    const sizedProducts = products.filter((p) => Boolean(p.sizes || (p.sizeVariants && p.sizeVariants.length > 0)));
    return {
      message: `📏 **Tallas y Medidas:**\n\nEn la ficha de cada producto puedes ver las tallas disponibles (S, M, L, XL, etc.) o variantes de precio. Si tienes dudas con alguna medida exacta en centímetros, te asesoramos en tiempo real al coordinar tu pedido por WhatsApp.`,
      recommendedProductIds: sizedProducts.slice(0, 3).map((p) => p.id),
    };
  }

  // Discounts / Offers
  if (q.includes('descuento') || q.includes('oferta') || q.includes('rebaja') || q.includes('promocion') || q.includes('promoción') || q.includes('barato') || q.includes('menos de')) {
    const discounted = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    const matched = findRelevantProductsForPrompt(userQuery, products);
    const targetPool = discounted.length > 0 ? discounted : matched;
    return {
      message: `🏷️ **¡Aprovecha las Mejores Ofertas y Precios de ${settings.storeName}!**\n\nAquí tienes artículos con excelentes precios y promociones especiales listas para ordenar:`,
      recommendedProductIds: targetPool.slice(0, 4).map((p) => p.id),
    };
  }

  // How to buy / WhatsApp queries
  if (q.includes('como comprar') || q.includes('cómo comprar') || q.includes('whatsapp') || q.includes('paso a paso') || q.includes('orden')) {
    return {
      message: `🛒 **¿Cómo comprar en ${settings.storeName}?**\n\n1. Explora el catálogo y añade los artículos deseados con el botón **"+"** o **"Añadir al Carrito"**.\n2. Toca el botón verde **"Carrito"** en la parte superior.\n3. Revisa tu lista y presiona **"Enviar Pedido por WhatsApp"**.\n4. Te responderemos de inmediato para confirmar pago y envío. ¡Fácil, rápido y sin complicaciones!`,
      recommendedProductIds: [],
    };
  }

  // Safety & Guarantee
  if (q.includes('seguro') || q.includes('garantia') || q.includes('garantía') || q.includes('confianza') || q.includes('estafa') || q.includes('devolucion') || q.includes('devolución')) {
    return {
      message: `🔒 **Garantía y Compra Segura:**\n\n• **Transparencia Total:** Tu compra es atendida directamente por el equipo oficial de ${settings.storeName}.\n• **Inspección de Calidad:** Verificamos cada artículo antes de su despacho o entrega.\n• **Soporte Post-Venta:** Si ocurre algún inconveniente con tu paquete, te damos respuesta oportuna de inmediato.`,
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

