import { describe, it, expect } from 'vitest';
import { isLogoUrl, getCategoryFallbackImage } from './imageUtils';

describe('imageUtils - Detección de Logos y Fallbacks de Categoría', () => {
  describe('isLogoUrl', () => {
    // Casos normales y discriminación de CDN de comercio electrónico
    it('debe identificar URLs de productos reales en CDNs conocidas como NO logos (false)', () => {
      expect(isLogoUrl('https://img.kwcdn.com/image/goods/2024/product_main_12345.jpg')).toBe(false);
      expect(isLogoUrl('https://http2.mlstatic.com/d_nq_np_2x_789456-MLA123_042024-F.webp')).toBe(false);
      expect(isLogoUrl('https://media-amazon.com/images/i/71abcXYZ123._AC_SL1500_.jpg')).toBe(false);
      expect(isLogoUrl('https://img.ltwebstatic.com/images3_pi/2023/shein_dress_hero.jpg')).toBe(false);
      expect(isLogoUrl('https://cdn.shopify.com/s/files/1/001/products/summer_shirt.png')).toBe(false);
      expect(isLogoUrl('https://ae01.alicdn.com/kf/S123456789.jpg')).toBe(false);
    });

    // Casos de URLs que sí son logos o elementos estructurales
    it('debe identificar URLs con palabras clave de logo o favicon como logos (true)', () => {
      expect(isLogoUrl('https://example.com/assets/brand_logo.png')).toBe(true);
      expect(isLogoUrl('https://example.com/favicon.ico')).toBe(true);
      expect(isLogoUrl('https://temu.com/images/temu_logo_white.svg')).toBe(true);
      expect(isLogoUrl('https://example.com/icons/avatar-default.jpg')).toBe(true);
      expect(isLogoUrl('https://example.com/ui/header-banner_share.png')).toBe(true);
      expect(isLogoUrl('https://example.com/watermark.png')).toBe(true);
    });

    // Caso cuando un CDN de comercio contiene explícitamente "logo"
    it('debe detectar como logo si la URL de la CDN incluye expresamente "/logo" o "favicon"', () => {
      expect(isLogoUrl('https://img.kwcdn.com/image/goods/store/logo.png')).toBe(true);
      expect(isLogoUrl('https://cdn.shopify.com/s/files/1/001/header_logo.png')).toBe(true);
      expect(isLogoUrl('https://http2.mlstatic.com/d_favicon_ml.ico')).toBe(true);
    });

    // Casos de subida de usuario (Base64 y Blobs locales)
    it('debe respetar fotos subidas por el usuario en Base64 o Blob (false)', () => {
      expect(isLogoUrl('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...')).toBe(false);
      expect(isLogoUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...')).toBe(false);
      expect(isLogoUrl('blob:http://localhost:3000/a83b276e-9821-4d9b-b0b2')).toBe(false);
    });

    // Casos límite: valores vacíos, nulos, undefined
    it('debe retornar true ante URLs nulas, indefinidas o cadenas vacías', () => {
      expect(isLogoUrl(null)).toBe(true);
      expect(isLogoUrl(undefined)).toBe(true);
      expect(isLogoUrl('')).toBe(true);
    });

    // Casos de texto insensible a mayúsculas/minúsculas
    it('debe manejar mayúsculas y minúsculas sin fallar', () => {
      expect(isLogoUrl('https://example.com/BRAND_LOGO.PNG')).toBe(true);
      expect(isLogoUrl('https://example.com/FAVICON.ICO')).toBe(true);
      expect(isLogoUrl('https://media-amazon.com/images/I/71ABCXYZ123._AC_SL1500_.JPG')).toBe(false);
    });
  });

  describe('getCategoryFallbackImage', () => {
    it('debe devolver imagen de calzado para términos de zapatillas/tenis/zapatos', () => {
      const url = getCategoryFallbackImage('Zapatillas Deportivas Running Nike');
      expect(url).toContain('photo-1542291026-7eec264c27ff');
    });

    it('debe devolver imagen de relojes para términos de watch/reloj/cronografo', () => {
      const url = getCategoryFallbackImage('Reloj de cuarzo de lujo resistente al agua');
      expect(url).toContain('photo-1522335789203-aabd1fc54bc9');
    });

    it('debe devolver imagen de bolsos para términos de bolso/cartera/mochila/bag', () => {
      const url = getCategoryFallbackImage('Mochila escolar de cuero impermeable');
      expect(url).toContain('photo-1584917865442-de89df76afd3');
    });

    it('debe devolver imagen de gafas para términos de gafas/lentes/sunglasses', () => {
      const url = getCategoryFallbackImage('Gafas de sol polarizadas vintage');
      expect(url).toContain('photo-1511499767150-a48a237f0083');
    });

    it('debe devolver imagen de ropa para términos de ropa/camisa/vestido/pantalón', () => {
      const url = getCategoryFallbackImage('Vestido largo de fiesta floral');
      expect(url).toContain('photo-1515886657613-9f3515b0c78f');
    });

    it('debe devolver la imagen genérica por defecto cuando no coincide ninguna palabra clave', () => {
      const url = getCategoryFallbackImage('Accesorio decorativo misterioso');
      expect(url).toContain('photo-1523275335684-37898b6baf30');
    });

    it('debe ser resistente a texto con mayúsculas y espacios múltiples', () => {
      const url = getCategoryFallbackImage('   TENIS   PARA CABALLERO   ');
      expect(url).toContain('photo-1542291026-7eec264c27ff');
    });
  });
});
