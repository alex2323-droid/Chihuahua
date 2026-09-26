import { describe, it, expect } from 'vitest';
import {
  calculateCartTotal,
  getItemUnitPrice,
  calculateCartQuantityCount,
  sanitizePhoneNumber,
  generateWhatsAppOrderMessage,
  getWhatsAppOrderUrl,
} from './cartUtils';
import { CartItem, Product, StoreSettings } from '../types/catalog';

describe('cartUtils - Lógica Crítica de Carrito y WhatsApp', () => {
  const mockSettings: StoreSettings = {
    storeName: 'Team Chihuahua',
    storeTagline: 'Catálogo Oficial',
    storeLogo: '',
    coverImage: '',
    whatsappNumber: '+58 414-924-7532',
    instagramHandle: '@teamchihuahua',
    currencySymbol: '$',
    themeColor: 'emerald',
    catalogLayout: 'grid-3',
  };

  const mockProduct1: Product = {
    id: 'prod-1',
    title: 'Pinzas para el pelo de flores',
    sku: 'CH-4461',
    price: 3.5,
    currency: '$',
    category: 'Accesorios',
    brand: 'Chihuahua Accessories',
    inStock: true,
    image: 'https://example.com/img1.jpg',
    description: 'Pinzas elegantes',
  };

  const mockProduct2: Product = {
    id: 'prod-2',
    title: 'Vestido Vintage Elegante',
    sku: 'CH-2223',
    price: 25.0,
    currency: '$',
    category: 'Ropa',
    brand: 'Chihuahua Fashion',
    inStock: true,
    image: 'https://example.com/img2.jpg',
    description: 'Vestido de fiesta',
  };

  describe('getItemUnitPrice', () => {
    it('debe devolver el precio base del producto si no hay unitPrice personalizado', () => {
      const item: CartItem = {
        product: mockProduct1,
        quantity: 2,
      };
      expect(getItemUnitPrice(item)).toBe(3.5);
    });

    it('debe priorizar el unitPrice personalizado de la variante de talla', () => {
      const item: CartItem = {
        product: mockProduct2,
        quantity: 1,
        selectedSize: 'XL',
        unitPrice: 28.5,
      };
      expect(getItemUnitPrice(item)).toBe(28.5);
    });
  });

  describe('calculateCartTotal', () => {
    it('debe devolver 0 si el carrito está vacío', () => {
      expect(calculateCartTotal([])).toBe(0);
    });

    it('debe calcular correctamente el total para múltiples productos con cantidades', () => {
      const cart: CartItem[] = [
        { product: mockProduct1, quantity: 2 }, // 3.5 * 2 = 7.0
        { product: mockProduct2, quantity: 3 }, // 25.0 * 3 = 75.0
      ];
      expect(calculateCartTotal(cart)).toBe(82.0);
    });

    it('debe calcular el total considerando precios por variantes y tallas', () => {
      const cart: CartItem[] = [
        { product: mockProduct1, quantity: 4, unitPrice: 3.0 }, // 3.0 * 4 = 12.0
        { product: mockProduct2, quantity: 2, selectedSize: 'XL', unitPrice: 29.99 }, // 29.99 * 2 = 59.98
      ];
      expect(calculateCartTotal(cart)).toBeCloseTo(71.98, 2);
    });

    it('debe ignorar cantidades negativas o corruptas', () => {
      const cart: CartItem[] = [
        { product: mockProduct1, quantity: -5 },
        { product: mockProduct2, quantity: 1 },
      ];
      expect(calculateCartTotal(cart)).toBe(25.0);
    });
  });

  describe('calculateCartQuantityCount', () => {
    it('debe contar la cantidad total de artículos físicos', () => {
      const cart: CartItem[] = [
        { product: mockProduct1, quantity: 3 },
        { product: mockProduct2, quantity: 5 },
      ];
      expect(calculateCartQuantityCount(cart)).toBe(8);
    });
  });

  describe('sanitizePhoneNumber', () => {
    it('debe limpiar números con prefijo +, espacios, guiones y paréntesis', () => {
      expect(sanitizePhoneNumber('+58 414-924-7532')).toBe('584149247532');
      expect(sanitizePhoneNumber('+52 (55) 1234-5678')).toBe('525512345678');
      expect(sanitizePhoneNumber('  584149247532  ')).toBe('584149247532');
    });

    it('debe manejar cadenas vacías o sin números', () => {
      expect(sanitizePhoneNumber('')).toBe('');
      expect(sanitizePhoneNumber('abc-xyz')).toBe('');
    });
  });

  describe('generateWhatsAppOrderMessage', () => {
    it('debe devolver cadena vacía si no hay productos en el carrito', () => {
      const message = generateWhatsAppOrderMessage({
        cart: [],
        settings: mockSettings,
      });
      expect(message).toBe('');
    });

    it('debe generar el mensaje completo y desglosado con SKUs, Tallas, Totales y Datos de Entrega', () => {
      const cart: CartItem[] = [
        {
          product: mockProduct1,
          quantity: 2,
        },
        {
          product: mockProduct2,
          quantity: 1,
          selectedSize: 'M',
          selectedImageCode: 'VINT-01',
          unitPrice: 25.0,
        },
      ];

      const message = generateWhatsAppOrderMessage({
        cart,
        settings: mockSettings,
        customerName: 'Carolina Gómez',
        notes: 'Calle Principal #45, Apto 2B',
      });

      expect(message).toContain('Hola *Team Chihuahua*');
      expect(message).toContain('1. *Pinzas para el pelo de flores* [Cód: CH-4461]');
      expect(message).toContain('Cantidad: 2x | Precio: $7.00');
      expect(message).toContain('2. *Vestido Vintage Elegante* [Cód: CH-2223] 📏 (Talla: *M*) 📸 [Sub-Cód: *VINT-01*]');
      expect(message).toContain('Cantidad: 1x | Precio: $25.00');
      expect(message).toContain('💰 *TOTAL A PAGAR: $32.00*');
      expect(message).toContain('👤 *Nombre del Cliente:* Carolina Gómez');
      expect(message).toContain('📝 *Notas/Dirección de Entrega:* Calle Principal #45, Apto 2B');
    });
  });

  describe('getWhatsAppOrderUrl', () => {
    it('debe generar una URL wa.me válida y codificada correctamente', () => {
      const cart: CartItem[] = [{ product: mockProduct1, quantity: 1 }];

      const url = getWhatsAppOrderUrl({
        cart,
        settings: mockSettings,
        customerName: 'Juan Pérez',
      });

      expect(url.startsWith('https://wa.me/584149247532?text=')).toBe(true);
      expect(url).toContain(encodeURIComponent('Pinzas para el pelo de flores'));
      expect(url).toContain(encodeURIComponent('$3.50'));
      expect(url).toContain(encodeURIComponent('Juan Pérez'));
    });
  });
});
