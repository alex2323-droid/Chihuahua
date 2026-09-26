import { describe, it, expect } from 'vitest';
import { generateRandomCode, generateProductSku, generateSubCode } from './codeUtils';

describe('codeUtils - Generador de Códigos SKU y Sub-Códigos', () => {
  describe('generateRandomCode', () => {
    it('debe generar un código con el prefijo por defecto "CH-" seguido de 4 dígitos numéricos', () => {
      const code = generateRandomCode();
      expect(code).toMatch(/^CH-\d{4}$/);
    });

    it('debe respetar prefijos personalizados', () => {
      const customCode = generateRandomCode('PROMO');
      expect(customCode).toMatch(/^PROMO-\d{4}$/);
    });

    it('debe generar números dentro del rango de 4 dígitos (1000 a 9999)', () => {
      for (let i = 0; i < 25; i++) {
        const code = generateRandomCode('TEST');
        const numPart = parseInt(code.split('-')[1], 10);
        expect(numPart).toBeGreaterThanOrEqual(1000);
        expect(numPart).toBeLessThanOrEqual(9999);
      }
    });
  });

  describe('generateProductSku & generateSubCode', () => {
    it('debe generar un SKU de producto válido con formato CH-XXXX', () => {
      const sku = generateProductSku();
      expect(sku).toMatch(/^CH-\d{4}$/);
    });

    it('debe generar un Sub-Código de variante válido con formato CH-XXXX', () => {
      const subCode = generateSubCode();
      expect(subCode).toMatch(/^CH-\d{4}$/);
    });
  });
});
