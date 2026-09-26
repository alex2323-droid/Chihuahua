import { CartItem, StoreSettings } from '../types/catalog';

/**
 * Gets the unit price for a cart item, preferring custom variant price or product base price.
 */
export const getItemUnitPrice = (item: CartItem): number => {
  if (typeof item.unitPrice === 'number' && !isNaN(item.unitPrice)) {
    return item.unitPrice;
  }
  return item.product?.price || 0;
};

/**
 * Calculates total amount for a list of cart items.
 */
export const calculateCartTotal = (cart: CartItem[]): number => {
  if (!Array.isArray(cart) || cart.length === 0) return 0;
  return cart.reduce((sum, item) => {
    const unitPrice = getItemUnitPrice(item);
    const quantity = Math.max(0, item.quantity || 0);
    return sum + unitPrice * quantity;
  }, 0);
};

/**
 * Counts total quantity of physical items in the cart.
 */
export const calculateCartQuantityCount = (cart: CartItem[]): number => {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, item) => sum + Math.max(0, item.quantity || 0), 0);
};

/**
 * Sanitizes phone number by removing spaces, hyphens, plus signs and letters.
 */
export const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
};

/**
 * Generates formatted WhatsApp text message for an order.
 */
export interface WhatsAppMessageOptions {
  cart: CartItem[];
  settings: StoreSettings;
  customerName?: string;
  notes?: string;
}

export const generateWhatsAppOrderMessage = ({
  cart,
  settings,
  customerName = '',
  notes = '',
}: WhatsAppMessageOptions): string => {
  if (!cart || cart.length === 0) return '';

  const totalAmount = calculateCartTotal(cart);
  const storeName = settings.storeName || 'Tienda';
  const currencySymbol = settings.currencySymbol || '$';

  let message = `👋 Hola *${storeName}*, me gustaría realizar el siguiente pedido:\n\n📋 *PRODUCTOS SELECCIONADOS:*\n`;

  cart.forEach((item, index) => {
    const itemPrice = getItemUnitPrice(item);
    const skuText = item.product.sku ? ` [Cód: ${item.product.sku}]` : '';
    const sizeText = item.selectedSize ? ` 📏 (Talla: *${item.selectedSize}*)` : '';
    const codeText = item.selectedImageCode ? ` 📸 [Sub-Cód: *${item.selectedImageCode}*]` : '';
    const currency = item.product.currency || currencySymbol;
    const subtotal = (itemPrice * item.quantity).toFixed(2);

    message += `${index + 1}. *${item.product.title}*${skuText}${sizeText}${codeText}\n   Cantidad: ${item.quantity}x | Precio: ${currency}${subtotal}\n`;
  });

  message += `\n💰 *TOTAL A PAGAR: ${currencySymbol}${totalAmount.toFixed(2)}*\n`;

  if (customerName && customerName.trim()) {
    message += `\n👤 *Nombre del Cliente:* ${customerName.trim()}`;
  }

  if (notes && notes.trim()) {
    message += `\n📝 *Notas/Dirección de Entrega:* ${notes.trim()}`;
  }

  message += `\n\n¡Quedo a la espera de su confirmación!`;

  return message;
};

/**
 * Generates full WhatsApp wa.me link with encoded order message.
 */
export const getWhatsAppOrderUrl = (options: WhatsAppMessageOptions): string => {
  const cleanPhone = sanitizePhoneNumber(options.settings.whatsappNumber);
  const message = generateWhatsAppOrderMessage(options);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
