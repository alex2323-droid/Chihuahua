export function isLogoUrl(url: string | null | undefined): boolean {
  if (!url) return true;

  // Always respect user-uploaded images (base64 data URIs or blob URLs from phone/PC storage)
  if (url.startsWith('data:image/') || url.startsWith('blob:')) {
    return false;
  }

  const lower = url.toLowerCase();

  // Known e-commerce CDN product photo patterns are exempt from logo matching
  // unless they explicitly contain '/logo', '_logo', or 'logo.' in their filename.
  const isPdpCdn =
    lower.includes('kwcdn.com/image/goods') ||
    lower.includes('http2.mlstatic.com/d_') ||
    lower.includes('media-amazon.com/images/i/') ||
    lower.includes('ltwebstatic.com/') ||
    lower.includes('cdn.shopify.com/') ||
    lower.includes('alicdn.com/') ||
    lower.includes('ebayimg.com/') ||
    lower.includes('etsystatic.com/');

  if (isPdpCdn) {
    if (
      lower.includes('/logo') ||
      lower.includes('_logo') ||
      lower.includes('logo.') ||
      lower.includes('favicon')
    ) {
      return true;
    }
    return false;
  }

  const logoKeywords = [
    'logo',
    'app_share',
    'share_logo',
    'site_logo',
    'brand_logo',
    'temu_logo',
    'amazon_logo',
    'shein_logo',
    'mercadolibre_logo',
    'header',
    'favicon',
    'icon',
    'avatar',
    'banner_share',
    'og_default',
    'store_logo',
    'badge',
    'placeholder',
    'watermark',
    'footer',
    'square_logo',
    'share_banner',
    'brand_share',
    'nav_logo',
  ];

  return logoKeywords.some((kw) => lower.includes(kw));
}

export function getCategoryFallbackImage(titleAndDesc: string): string {
  const text = titleAndDesc.toLowerCase();
  if (
    text.includes('zapatilla') ||
    text.includes('tenis') ||
    text.includes('running') ||
    text.includes('calzado') ||
    text.includes('zapato')
  ) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80';
  }
  if (
    text.includes('reloj') ||
    text.includes('watch') ||
    text.includes('cronografo')
  ) {
    return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80';
  }
  if (
    text.includes('bolso') ||
    text.includes('cartera') ||
    text.includes('mochila') ||
    text.includes('bag')
  ) {
    return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80';
  }
  if (
    text.includes('gafas') ||
    text.includes('lentes') ||
    text.includes('sunglasses')
  ) {
    return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80';
  }
  if (
    text.includes('ropa') ||
    text.includes('camisa') ||
    text.includes('vestido') ||
    text.includes('pantal')
  ) {
    return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
}

/**
 * Client-side helper to compress and downscale large screenshot images
 * to optimize upload speed, fit in Firestore document limits (1MB), and eliminate memory/payload errors.
 */
export function compressImageBase64(
  base64Str: string,
  maxDim = 1200,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image')) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Maintain crisp 1200px HD resolution for retina displays
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Prefer WebP format for 30% better compression at equal visual fidelity
      const webpUrl = canvas.toDataURL('image/webp', quality);
      if (webpUrl && webpUrl.startsWith('data:image/webp')) {
        resolve(webpUrl);
      } else {
        resolve(canvas.toDataURL('image/jpeg', quality));
      }
    };
    img.onerror = () => resolve(base64Str);
    img.src = base64Str;
  });
}

/**
 * Client-side HTML5 Canvas crop helper to isolate the product photo from screenshots
 * based on Gemini Vision normalized bounding box coordinates [ymin, xmin, ymax, xmax] (0-1000).
 * Constrained to 600px maximum dimension and highly compressed (0.7 quality) to protect database storage limits.
 */
export function cropImageBase64(
  base64Str: string,
  box?: [number, number, number, number] | null
): Promise<string> {
  return new Promise((resolve) => {
    if (!base64Str || !box || !Array.isArray(box) || box.length !== 4) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let [ymin, xmin, ymax, xmax] = box;

      ymin = Math.max(0, Math.min(1000, Number(ymin) || 0));
      xmin = Math.max(0, Math.min(1000, Number(xmin) || 0));
      ymax = Math.max(0, Math.min(1000, Number(ymax) || 1000));
      xmax = Math.max(0, Math.min(1000, Number(xmax) || 1000));

      if (ymax <= ymin || xmax <= xmin) {
        resolve(base64Str);
        return;
      }

      const width = img.width;
      const height = img.height;

      const sx = Math.max(0, Math.floor((xmin / 1000) * width));
      const sy = Math.max(0, Math.floor((ymin / 1000) * height));
      const sw = Math.min(width - sx, Math.ceil(((xmax - xmin) / 1000) * width));
      const sh = Math.min(height - sy, Math.ceil(((ymax - ymin) / 1000) * height));

      // If cropped area is almost the full image (>95%), or too tiny (<3%), keep original
      if ((sw >= width * 0.95 && sh >= height * 0.95) || sw < width * 0.03 || sh < height * 0.03) {
        // Still compress the original image
        compressImageBase64(base64Str).then(resolve);
        return;
      }

      // Resize crop target to max 1000px to maintain crisp HD original quality
      let targetWidth = sw;
      let targetHeight = sh;
      const maxDim = 1000;
      if (targetWidth > maxDim || targetHeight > maxDim) {
        if (targetWidth > targetHeight) {
          targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
          targetWidth = maxDim;
        } else {
          targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
          targetHeight = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

      const webpUrl = canvas.toDataURL('image/webp', 0.85);
      if (webpUrl && webpUrl.startsWith('data:image/webp')) {
        resolve(webpUrl);
      } else {
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      }
    };
    img.onerror = () => resolve(base64Str);
    img.src = base64Str;
  });
}

/**
 * Asynchronously compress both main image and gallery images of a product if they are in Base64 format.
 * This guarantees the final product payload is extremely lightweight and easily fits in Firestore.
 */
export async function optimizeProductImageSize(product: any): Promise<any> {
  const optimized = { ...product };
  if (optimized.image && typeof optimized.image === 'string' && optimized.image.startsWith('data:')) {
    optimized.image = await compressImageBase64(optimized.image);
  }
  if (optimized.images && Array.isArray(optimized.images) && optimized.images.length > 0) {
    optimized.images = await Promise.all(
      optimized.images.map(async (img: string) => {
        if (typeof img === 'string' && img.startsWith('data:')) {
          return await compressImageBase64(img);
        }
        return img;
      })
    );
  }
  if (optimized.imageDetails && Array.isArray(optimized.imageDetails) && optimized.imageDetails.length > 0) {
    optimized.imageDetails = await Promise.all(
      optimized.imageDetails.map(async (det: any) => {
        if (det && det.url && typeof det.url === 'string' && det.url.startsWith('data:')) {
          return {
            ...det,
            url: await compressImageBase64(det.url)
          };
        }
        return det;
      })
    );
  }
  return optimized;
}
