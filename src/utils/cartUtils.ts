import { CartItem, StoreSettings, MRWShippingInfo } from '../types/catalog';
import { renderCartWhatsAppMessage } from './whatsappTemplates';

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
  mrwInfo?: MRWShippingInfo;
}

export const generateWhatsAppOrderMessage = ({
  cart,
  settings,
  customerName = '',
  notes = '',
  mrwInfo,
}: WhatsAppMessageOptions): string => {
  return renderCartWhatsAppMessage({ cart, settings, customerName, notes, mrwInfo });
};

/**
 * Generates full WhatsApp wa.me link with encoded order message.
 */
export const getWhatsAppOrderUrl = (options: WhatsAppMessageOptions): string => {
  const cleanPhone = sanitizePhoneNumber(options.settings.whatsappNumber);
  const message = generateWhatsAppOrderMessage(options);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
