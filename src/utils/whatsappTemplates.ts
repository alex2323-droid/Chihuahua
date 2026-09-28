import { StoreSettings, CartItem, Product, MRWShippingInfo } from '../types/catalog';
import { getItemUnitPrice, calculateCartTotal } from './cartUtils';
import { formatMRWShippingMessage } from './mrwData';

export interface WhatsAppTemplatePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: string;
  template: string;
}

export interface WhatsAppSingleProductPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: string;
  template: string;
}

/**
 * Cart Order Message Presets
 * Variables supported:
 * {storeName}      -> Nombre de la tienda
 * {products}       -> Lista numerada de productos seleccionados
 * {total}          -> Monto total formateado con moneda (ej: $149.90)
 * {customerName}   -> Bloque con nombre del cliente (o vacío si no se especificó)
 * {notes}          -> Bloque con notas / dirección de entrega (o vacío)
 * {itemCount}      -> Número total de artículos
 */
export const WHATSAPP_CART_PRESETS: WhatsAppTemplatePreset[] = [
  {
    id: 'standard',
    name: 'Estándar & Amigable',
    badge: 'Recomendado',
    icon: '🌟',
    description: 'El formato clásico, claro y ordenado preferido por la mayoría de tiendas.',
    template: `👋 Hola *{storeName}*, me gustaría realizar el siguiente pedido:

📋 *PRODUCTOS SELECCIONADOS:*
{products}

💰 *TOTAL A PAGAR: {total}*
{customerName}
{notes}

¡Quedo a la espera de su confirmación para proceder con el pago! ✨`,
  },
  {
    id: 'formal',
    name: 'Formal / Comercial',
    badge: 'Empresarial',
    icon: '🏢',
    description: 'Ideal para empresas, compras por volumen o atención comercial formal.',
    template: `Estimado equipo de *{storeName}*,

Por medio del presente solicito la cotización y confirmación de disponibilidad para el siguiente pedido:

🛍️ *DETALLE DE LA ORDEN ({itemCount} ítems):*
{products}

💵 *Monto Total:* {total}
{customerName}
{notes}

Agradezco me indiquen las cuentas bancarias o métodos de pago disponibles y el tiempo estimado de entrega. Saludos cordiales.`,
  },
  {
    id: 'direct',
    name: 'Directo & Rápido',
    badge: 'Ágil',
    icon: '⚡',
    description: 'Mensaje conciso y al grano para agilizar la compra en 1 solo paso.',
    template: `¡Hola *{storeName}*! Quiero comprar esto:

{products}
*Total: {total}*
{customerName}
{notes}
¿Tienen stock disponible para coordinar el pago de inmediato?`,
  },
  {
    id: 'boutique',
    name: 'Boutique & Exclusivo',
    badge: 'Lujo',
    icon: '💫',
    description: 'Estilo elegante y sofisticado para marcas de moda, joyas o alta gama.',
    template: `✨ *Solicitud de Pedido - {storeName}* ✨

Hola, he seleccionado las siguientes piezas de su catálogo:

{products}

🏷️ *Inversión Total:* {total}
{customerName}
{notes}

Por favor confirmen disponibilidad de las piezas para coordinar el envío exclusivo. ¡Muchas gracias!`,
  },
  {
    id: 'promo',
    name: 'Promoción & Ofertas',
    badge: 'Ventas',
    icon: '🔥',
    description: 'Enfocado en descuentos y promociones de temporada.',
    template: `🔥 ¡Hola *{storeName}*! Aprovechando las promociones de su catálogo, deseo ordenar:

{products}

💳 *Total a pagar:* {total}
{customerName}
{notes}

¿Me indican si aplica alguna promoción adicional o envío gratis? ¡Gracias! 🎉`,
  },
  {
    id: 'delivery',
    name: 'Delivery & Despacho',
    badge: 'Envíos',
    icon: '🛵',
    description: 'Especial para entregas a domicilio, comida o logística rápida.',
    template: `🛵 *NUEVO PEDIDO PARA ENVÍO - {storeName}*

{products}

💰 *Subtotal Productos:* {total}
{customerName}
{notes}

Por favor confírmenme el costo de envío / delivery y el tiempo aproximado de llegada. ¡Listo para pagar!`,
  },
];

/**
 * Single Product Inquiry Presets
 * Variables supported:
 * {storeName}      -> Nombre de la tienda
 * {title}          -> Título del producto
 * {sku}            -> Código del producto (ej: CH-4812)
 * {subCode}        -> Sub-código de la foto/variante (ej: Sub-Cód: CH-1029)
 * {price}          -> Precio formateado (ej: $35.00)
 * {size}           -> Talla elegida o tallas disponibles
 * {link}           -> Enlace a la imagen o publicación
 */
export const WHATSAPP_SINGLE_PRESETS: WhatsAppSingleProductPreset[] = [
  {
    id: 'standard',
    name: 'Estándar de Producto',
    badge: 'Popular',
    icon: '🛍️',
    description: 'Consulta rápida con código, foto y talla.',
    template: `Hola *{storeName}*, me interesa este producto de su catálogo:

📌 *{title}*
📌 *Código:* {sku}
{subCode}💰 *Precio:* {price}
{size}
{link}
¿Tienen disponibilidad para envío o entrega?`,
  },
  {
    id: 'direct',
    name: 'Directo / Stock',
    badge: 'Rápido',
    icon: '⚡',
    description: 'Pregunta directa de disponibilidad y precio.',
    template: `¡Hola *{storeName}*! ¿Tienen disponible *{title}* (Cód: {sku}) en {price}? {size}{subCode}`,
  },
  {
    id: 'boutique',
    name: 'Boutique Elegante',
    badge: 'Elegante',
    icon: '✨',
    description: 'Tono sofisticado para cotizar prendas o artículos únicos.',
    template: `✨ Saludos cordiales *{storeName}*, deseo consultar disponibilidad de la pieza *{title}* [Cód: {sku} - {price}]. {size}{subCode}\n\n¿Podrían brindarme información para adquirirlo?`,
  },
];

/**
 * Format Cart Items list into readable WhatsApp text lines
 */
export const formatCartProductsList = (cart: CartItem[], currencySymbol: string = '$'): string => {
  if (!cart || cart.length === 0) return '';
  return cart
    .map((item, index) => {
      const itemPrice = getItemUnitPrice(item);
      const skuText = item.product.sku ? ` [Cód: ${item.product.sku}]` : '';
      const sizeText = item.selectedSize ? ` 📏 (Talla: *${item.selectedSize}*)` : '';
      const codeText = item.selectedImageCode ? ` 📸 [Sub-Cód: *${item.selectedImageCode}*]` : '';
      const currency = item.product.currency || currencySymbol;
      const subtotal = (itemPrice * item.quantity).toFixed(2);

      return `${index + 1}. *${item.product.title}*${skuText}${sizeText}${codeText}\n   Cantidad: ${item.quantity}x | Precio: ${currency}${subtotal}`;
    })
    .join('\n');
};

/**
 * Renders the WhatsApp Cart Order Message using the store's configured template
 */
export const renderCartWhatsAppMessage = ({
  cart,
  settings,
  customerName = '',
  notes = '',
  mrwInfo,
}: {
  cart: CartItem[];
  settings: StoreSettings;
  customerName?: string;
  notes?: string;
  mrwInfo?: MRWShippingInfo;
}): string => {
  if (!cart || cart.length === 0) return '';

  const totalAmount = calculateCartTotal(cart);
  const storeName = settings.storeName || 'Tienda';
  const currencySymbol = settings.currencySymbol || '$';
  const totalFormatted = `${currencySymbol}${totalAmount.toFixed(2)}`;
  const productsText = formatCartProductsList(cart, currencySymbol);
  const itemCount = cart.reduce((sum, item) => sum + Math.max(0, item.quantity || 0), 0);

  let customerBlock = customerName && customerName.trim()
    ? `👤 *Nombre del Cliente:* ${customerName.trim()}`
    : '';

  let notesBlock = notes && notes.trim()
    ? `📝 *Notas/Dirección de Entrega:* ${notes.trim()}`
    : '';

  if (mrwInfo && mrwInfo.fullName) {
    notesBlock += formatMRWShippingMessage(mrwInfo);
  }

  // Determine template to use
  let rawTemplate = WHATSAPP_CART_PRESETS[0].template;
  if (settings.whatsappTemplateId === 'custom' && settings.whatsappCustomCartTemplate?.trim()) {
    rawTemplate = settings.whatsappCustomCartTemplate;
  } else if (settings.whatsappTemplateId) {
    const matched = WHATSAPP_CART_PRESETS.find((p) => p.id === settings.whatsappTemplateId);
    if (matched) rawTemplate = matched.template;
  }

  // Replace placeholders
  let rendered = rawTemplate
    .replace(/{storeName}/g, storeName)
    .replace(/{products}/g, productsText)
    .replace(/{total}/g, totalFormatted)
    .replace(/{itemCount}/g, String(itemCount))
    .replace(/{customerName}/g, customerBlock)
    .replace(/{notes}/g, notesBlock);

  // Clean multiple contiguous empty lines
  rendered = rendered.replace(/\n{3,}/g, '\n\n').trim();

  return rendered;
};

/**
 * Renders Single Product WhatsApp Message
 */
export const renderSingleProductWhatsAppMessage = ({
  product,
  settings,
  selectedSize,
  activeImageDetail,
  displayImage,
  currentPrice,
}: {
  product: Product;
  settings: StoreSettings;
  selectedSize?: string;
  activeImageDetail?: { code?: string; price?: number | null } | null;
  displayImage?: string;
  currentPrice: number;
}): string => {
  const storeName = settings.storeName || 'Tienda';
  const currency = product.currency || settings.currencySymbol || '$';
  const priceFormatted = `${currency}${currentPrice.toFixed(2)}`;

  const cleanImageLink = displayImage && !displayImage.startsWith('data:') ? displayImage : '';
  const cleanSourceLink = product.sourceUrl && product.sourceUrl.startsWith('http') ? product.sourceUrl : '';
  const linkToShow = cleanImageLink || cleanSourceLink;

  const subCodeText = activeImageDetail?.code ? `📸 *Sub-Código:* ${activeImageDetail.code}\n` : '';
  const sizeText = selectedSize
    ? `📏 *Talla Elegida:* ${selectedSize}`
    : product.sizes
    ? `📏 *Tallas Disponibles:* ${product.sizes}`
    : '';
  const linkText = linkToShow ? `🔗 *Enlace:* ${linkToShow}` : '';

  let rawTemplate = WHATSAPP_SINGLE_PRESETS[0].template;
  if (settings.whatsappSingleTemplateId === 'custom' && settings.whatsappCustomSingleTemplate?.trim()) {
    rawTemplate = settings.whatsappCustomSingleTemplate;
  } else if (settings.whatsappSingleTemplateId) {
    const matched = WHATSAPP_SINGLE_PRESETS.find((p) => p.id === settings.whatsappSingleTemplateId);
    if (matched) rawTemplate = matched.template;
  }

  let rendered = rawTemplate
    .replace(/{storeName}/g, storeName)
    .replace(/{title}/g, product.title)
    .replace(/{sku}/g, product.sku || 'N/A')
    .replace(/{price}/g, priceFormatted)
    .replace(/{subCode}/g, subCodeText)
    .replace(/{size}/g, sizeText)
    .replace(/{link}/g, linkText);

  return rendered.replace(/\n{3,}/g, '\n\n').trim();
};
