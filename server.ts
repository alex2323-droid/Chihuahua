import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '50mb' }));

// Initialize Upstash Redis Client with user credentials
const UPSTASH_URL =
  process.env.UPSTASH_REDIS_REST_URL || 'https://touched-gnat-44365.upstash.io';
const UPSTASH_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || 'Aa1NAAIgcDE4MTdlZGI2NGQwZDg0YWI5YjA5MmJmMjdjZDRmZmJiMQ';

const redis =
  UPSTASH_URL && UPSTASH_TOKEN
    ? new Redis({
        url: UPSTASH_URL,
        token: UPSTASH_TOKEN,
      })
    : null;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Robust Gemini caller with automatic retry, backoff, and model fallback
 * to gracefully handle temporary 503 high demand or rate limits.
 */
async function callGeminiWithRetry(
  params: { contents: any; config?: any },
  modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']
): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });
        if (response?.text) {
          return response.text;
        }
      } catch (err: any) {
        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (modelsToTry.indexOf(modelName) + 1)));
        }
      }
    }
  }
  return null;
}

interface ScrapedRawData {
  title?: string;
  description?: string;
  image?: string;
  price?: string;
  siteName?: string;
  favicon?: string;
  domain?: string;
}

/**
 * Helper: Detect if an image URL is a store logo, icon, or placeholder
 * to ensure we ALWAYS extract real product photos.
 */
function isLogoUrl(url: string | null | undefined): boolean {
  if (!url) return true;
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

// Utility: Fallback image based on product keywords if no image is detected in the publication
function getCategoryFallbackImage(titleAndDesc: string): string {
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
 * Deep Extraction: Unescapes JSON slashes and extracts original e-commerce CDN photos
 * embedded inside inline scripts and raw state payloads.
 */
function extractOriginalProductImageFromHtml(html: string): string | undefined {
  if (!html) return undefined;

  // Unescape backslash-escaped slashes common in inline JSON (<script> tags)
  const unescapedHtml = html.replace(/\\\/ font/g, '').replace(/\\\//g, '/');

  // 1. E-Commerce CDN specific regex patterns for high-res product photos
  const cdnRegexes = [
    // Temu product images
    /https?:\/\/[a-z0-9.-]*kwcdn\.com\/[^\s"'<>\\)]*\.(?:jpg|jpeg|png|webp|avif)[^\s"'<>\\)]*/gi,
    // MercadoLibre product images
    /https?:\/\/[a-z0-9.-]*mlstatic\.com\/[^\s"'<>\\)]*\.(?:jpg|jpeg|png|webp|avif)[^\s"'<>\\)]*/gi,
    // Amazon high-res product images
    /https?:\/\/[a-z0-9.-]*images-?amazon\.com\/images\/I\/[^\s"'<>\\)]*\.(?:jpg|jpeg|png|webp|avif)[^\s"'<>\\)]*/gi,
    /https?:\/\/m\.media-amazon\.com\/images\/I\/[^\s"'<>\\)]*\.(?:jpg|jpeg|png|webp|avif)[^\s"'<>\\)]*/gi,
    // Shein product images
    /https?:\/\/[a-z0-9.-]*(?:shein|ltwebstatic|romwe)\.com\/[^\s"'<>\\)]*\.(?:jpg|jpeg|png|webp|avif)[^\s"'<>\\)]*/gi,
    // AliExpress product images
    /https?:\/\/[a-z0-9.-]*(?:alicdn|alibaba)\.com\/[^\s"'<>\\)]*\.(?:jpg|jpeg|png|webp|avif)[^\s"'<>\\)]*/gi,
    // Shopify product images
    /https?:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'<>\\)]*\.(?:jpg|jpeg|png|webp|avif)[^\s"'<>\\)]*/gi,
    // Ebay product images
    /https?:\/\/i\.ebayimg\.com\/[^\s"'<>\\)]*\.(?:jpg|jpeg|png|webp|avif)[^\s"'<>\\)]*/gi,
    // Etsy product images
    /https?:\/\/i\.etsystatic\.com\/[^\s"'<>\\)]*\.(?:jpg|jpeg|png|webp|avif)[^\s"'<>\\)]*/gi,
  ];

  for (const regex of cdnRegexes) {
    const matches = unescapedHtml.match(regex);
    if (matches && matches.length > 0) {
      for (const candidate of matches) {
        const cleanCand = candidate.replace(/[\\"'`;>)]+$/, '').trim();
        if (!isLogoUrl(cleanCand) && cleanCand.length > 20) {
          return cleanCand;
        }
      }
    }
  }

  // 2. Generic product image JSON keys in script tags
  const jsonKeyRegexes = [
    /"hd_thumb_url"\s*:\s*"([^"]+)"/i,
    /"goods_img"\s*:\s*"([^"]+)"/i,
    /"thumb_url"\s*:\s*"([^"]+)"/i,
    /"image_url"\s*:\s*"([^"]+)"/i,
    /"product_image"\s*:\s*"([^"]+)"/i,
    /"main_image"\s*:\s*"([^"]+)"/i,
    /"largeImage"\s*:\s*"([^"]+)"/i,
    /"hiRes"\s*:\s*"([^"]+)"/i,
    /"imageUrl"\s*:\s*"([^"]+)"/i,
    /"cover"\s*:\s*"([^"]+)"/i,
    /"origin_image"\s*:\s*"([^"]+)"/i,
  ];

  for (const regex of jsonKeyRegexes) {
    const match = unescapedHtml.match(regex);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (!isLogoUrl(candidate) && candidate.startsWith('http')) {
        return candidate;
      }
    }
  }

  // 3. Fallback: Search all image URLs in unescaped HTML
  const allImgMatches = unescapedHtml.match(/https?:\/\/[^\s"'<>\\)]+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^\s"'<>\\)]*)?/gi);
  if (allImgMatches) {
    for (const imgUrl of allImgMatches) {
      const cleanUrl = imgUrl.replace(/[\\"'`;>)]+$/, '').trim();
      if (
        !isLogoUrl(cleanUrl) &&
        !cleanUrl.includes('tracking') &&
        !cleanUrl.includes('pixel') &&
        !cleanUrl.includes('sprite') &&
        cleanUrl.length > 25
      ) {
        return cleanUrl;
      }
    }
  }

  return undefined;
}

/**
 * Headless Rendering Scraper using Jina Reader API to execute JavaScript
 * and retrieve exact rendered product image URLs for SPAs like Temu/Shein.
 */
async function scrapeWithJinaReader(targetUrl: string): Promise<ScrapedRawData | null> {
  try {
    const jinaEndpoint = `https://r.jina.ai/${targetUrl}`;
    const res = await fetch(jinaEndpoint, {
      headers: {
        'Accept': 'application/json',
        'X-With-Generated-Alt': 'true',
        'X-No-Cache': 'true',
      },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.data;
    if (!data) return null;

    const title = data.title;
    const description = data.description || data.content?.slice(0, 300);
    const content = data.content || '';

    // Extract image markdown links or raw URLs from rendered page
    let image: string | undefined;

    // A. Check images property if available in json
    if (data.images && typeof data.images === 'object') {
      const imgValues = Object.values(data.images) as string[];
      for (const val of imgValues) {
        if (typeof val === 'string' && !isLogoUrl(val) && val.length > 20) {
          image = val;
          break;
        }
      }
    }

    // B. Check Markdown image links
    if (!image) {
      const imgMatches = content.match(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g);
      if (imgMatches) {
        for (const m of imgMatches) {
          const urlMatch = m.match(/\((https?:\/\/[^\s\)]+)\)/);
          if (urlMatch && urlMatch[1]) {
            const imgUrl = urlMatch[1];
            if (!isLogoUrl(imgUrl) && imgUrl.length > 20) {
              image = imgUrl;
              break;
            }
          }
        }
      }
    }

    // C. Deep extraction on Jina rendered content
    if (!image && content) {
      image = extractOriginalProductImageFromHtml(content);
    }

    if (title || image) {
      return {
        title,
        description,
        image,
      };
    }
  } catch (err) {
    console.warn('Jina reader fallback error:', err);
  }
  return null;
}

/**
 * Image sanitization and high-resolution upgrade helper for e-commerce CDNs
 */
function cleanAndUpgradeImageUrl(rawUrl: string | undefined | null, finalUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  let url = rawUrl.trim();
  if (!url) return undefined;

  if (url.startsWith('//')) {
    url = `https:${url}`;
  } else if (!url.startsWith('http') && finalUrl) {
    try {
      url = new URL(url, finalUrl).href;
    } catch {}
  }

  if (!url.startsWith('http')) return undefined;

  // Amazon max resolution upgrade
  if (url.includes('amazon.com/images/I/') || url.includes('media-amazon.com/images/I/')) {
    url = url.replace(/\._AC_[^.]+\./, '.').replace(/\._SL\d+_\./, '.').replace(/\._SX\d+_\./, '.').replace(/\._SY\d+_\./, '.');
  }

  // MercadoLibre max resolution upgrade
  if (url.includes('mlstatic.com')) {
    url = url.replace(/-[IV]\.(jpg|jpeg|webp|png)/i, '-O.jpg').replace(/-O\.webp/i, '-O.jpg');
  }

  // AliExpress max resolution upgrade
  if (url.includes('alicdn.com')) {
    url = url.replace(/_\d+x\d+\.(jpg|jpeg|webp|png)/i, '.jpg');
  }

  // eBay max resolution upgrade
  if (url.includes('ebayimg.com')) {
    url = url.replace(/s-l\d+\.(jpg|jpeg|png|webp)/i, 's-l1600.jpg');
  }

  // Shopify max resolution upgrade
  if (url.includes('cdn.shopify.com')) {
    url = url.replace(/_(small|thumb|pico|icon|compact|medium|large|100x100|200x200|300x300)\./i, '.');
  }

  if (isLogoUrl(url)) return undefined;
  return url;
}

/**
 * Price parser helper robust to international numeric formats (1.299,00 vs 1,299.00)
 */
function parsePriceNumber(raw: string | number | null | undefined): number | null {
  if (typeof raw === 'number') return isNaN(raw) || raw <= 0 ? null : raw;
  if (!raw) return null;
  const str = String(raw).trim();
  if (!str) return null;

  let cleaned = str.replace(/[^0-9.,]/g, '');
  if (!cleaned) return null;

  if (cleaned.includes(',') && cleaned.includes('.')) {
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      cleaned = parts[0] + '.' + parts[1];
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  }

  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? null : num;
}

/**
 * Fallback URL-Path parser to recover product name & store brand when page is blocked by anti-scraping
 */
function extractProductFromUrlPath(urlStr: string): { title?: string; brand?: string } {
  try {
    const parsed = new URL(urlStr);
    const domain = parsed.hostname.replace('www.', '');
    const pathname = decodeURIComponent(parsed.pathname);

    const segments = pathname.split('/').filter((s) => s.length > 2 && !s.match(/^(p|dp|item|goods|product|catalog|buy|es|mx|co|pe|cl|ar|br|it|de|fr|en|us)$/i));
    if (segments.length > 0) {
      const best = segments.reduce((a, b) => (a.length > b.length ? a : b), '');
      let cleanTitle = best
        .replace(/[-_]/g, ' ')
        .replace(/\b(id|ref|sku|pdp|html|php|asp|index|detail)\b.*$/i, '')
        .replace(/\d{5,}/g, '')
        .trim();

      if (cleanTitle.length > 3) {
        cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
        const rawBrand = domain.split('.')[0];
        const formattedBrand = rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1);
        return {
          title: cleanTitle,
          brand: formattedBrand,
        };
      }
    }
  } catch {}
  return {};
}

// Utility: Scrape metadata using direct HTTP request + cheerio + deep JSON unescaping
async function scrapeDirectUrl(targetUrl: string): Promise<ScrapedRawData> {
  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
  }

  // Handle redirects and use the final URL for domain resolution
  const finalUrl = response.url || targetUrl;
  const parsedUrl = new URL(finalUrl);
  const domain = parsedUrl.hostname.replace('www.', '');

  const html = await response.text();
  const $ = cheerio.load(html);

  let title: string | undefined;
  let description: string | undefined;
  let image: string | undefined;
  let price: string | undefined;

  // 1. Amazon specific dynamic image attribute parsing
  const landingImg = $('#landingImage, #imgBlkFront, #main-image').first();
  if (landingImg.length > 0) {
    const dynamicAttr = landingImg.attr('data-a-dynamic-image');
    if (dynamicAttr) {
      try {
        const parsed = JSON.parse(dynamicAttr);
        const keys = Object.keys(parsed);
        if (keys.length > 0 && !isLogoUrl(keys[0])) {
          image = keys[0];
        }
      } catch {}
    }
    if (!image) {
      const src = landingImg.attr('src') || landingImg.attr('data-old-hires');
      if (src && !isLogoUrl(src)) image = src;
    }
  }

  // 2. MercadoLibre gallery parser
  if (!image) {
    $('.ui-pdp-gallery img, img.ui-pdp-image, figure.ui-pdp-gallery__figure img').each((_, el) => {
      const src = $(el).attr('data-zoom') || $(el).attr('src') || $(el).attr('data-src');
      if (src && !isLogoUrl(src) && src.includes('mlstatic.com')) {
        image = src;
        return false; // break loop
      }
    });
  }

  // 3. Deep Extraction from raw HTML / JavaScript payload
  if (!image) {
    image = extractOriginalProductImageFromHtml(html);
  }

  // 4. Check JSON-LD Schema (<script type="application/ld+json">)
  if (!image) {
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const content = $(el).html();
        if (!content) return;
        const json = JSON.parse(content);
        const items = Array.isArray(json) ? json : [json];
        for (const item of items) {
          if (
            item['@type'] === 'Product' ||
            item['@type']?.includes?.('Product') ||
            item.image ||
            item.offers
          ) {
            if (!title && item.name) title = item.name;
            if (!description && item.description) description = item.description;
            if (!price && item.offers) {
              const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
              if (offer?.price) price = String(offer.price);
            }
            if (!image && item.image) {
              let candidate: string | undefined;
              if (Array.isArray(item.image) && item.image.length > 0) {
                const first = item.image[0];
                candidate = typeof first === 'string' ? first : first?.url || first?.contentUrl;
              } else if (typeof item.image === 'string') {
                candidate = item.image;
              } else if (item.image?.url) {
                candidate = item.image.url;
              }
              if (candidate && !isLogoUrl(candidate)) {
                image = candidate;
              }
            }
          }
        }
      } catch {}
    });
  }

  // 5. Extract meta tags
  if (!title) {
    title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text();
  }

  if (!description) {
    description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('p').first().text();
  }

  if (!image) {
    const metaCandidates = [
      $('meta[property="og:image"]').attr('content'),
      $('meta[property="og:image:secure_url"]').attr('content'),
      $('meta[name="twitter:image"]').attr('content'),
      $('meta[name="twitter:image:src"]').attr('content'),
      $('meta[itemprop="image"]').attr('content'),
      $('link[rel="image_src"]').attr('href'),
    ];
    for (const cand of metaCandidates) {
      if (cand && !isLogoUrl(cand)) {
        image = cand;
        break;
      }
    }
  }

  // Sanitize & format image URL
  if (image) {
    image = image.trim();
    if (image.startsWith('//')) {
      image = `https:${image}`;
    } else if (!image.startsWith('http')) {
      try {
        image = new URL(image, finalUrl).href;
      } catch {}
    }
  }

  // Extract price tag if missing
  if (!price) {
    price =
      $('meta[property="og:price:amount"]').attr('content') ||
      $('meta[property="product:price:amount"]').attr('content') ||
      $('meta[name="price"]').attr('content') ||
      $('[itemprop="price"]').attr('content') ||
      $('[data-price]').attr('data-price');
  }

  const siteName =
    $('meta[property="og:site_name"]').attr('content') || domain;

  let favicon =
    $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  if (favicon && !favicon.startsWith('http')) {
    try {
      favicon = new URL(favicon, finalUrl).href;
    } catch {}
  }

  return {
    title: title?.trim(),
    description: description?.trim(),
    image: isLogoUrl(image) ? undefined : image?.trim(),
    price: price?.trim(),
    siteName: siteName?.trim(),
    favicon,
    domain,
  };
}

// Utility: Scrape metadata using Microlink API backup with JS prerendering
async function scrapeMicrolinkUrl(targetUrl: string): Promise<ScrapedRawData> {
  const parsedUrl = new URL(targetUrl);
  const domain = parsedUrl.hostname.replace('www.', '');

  const microlinkEndpoint = `https://api.microlink.io/?url=${encodeURIComponent(
    targetUrl
  )}&prerender=true`;
  const res = await fetch(microlinkEndpoint);
  const data = await res.json();

  if (data?.status === 'success' && data?.data) {
    const d = data.data;
    const candImage = d.image?.url;
    return {
      title: d.title,
      description: d.description,
      image: isLogoUrl(candImage) ? undefined : candImage,
      siteName: d.publisher || domain,
      favicon: d.logo?.url || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      domain,
    };
  }

  throw new Error('Microlink failed to fetch URL metadata');
}

// Image Proxy Endpoint with in-memory LRU cache to bypass CORS / Hotlink restrictions on e-commerce CDNs
const imageProxyCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const MAX_PROXY_CACHE_ITEMS = 200;

app.get('/api/proxy-image', async (req: Request, res: Response) => {
  try {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      res.status(400).send('Missing url');
      return;
    }

    const target = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl;

    // Check memory cache
    const cached = imageProxyCache.get(target);
    if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60 * 24 * 7) {
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400, immutable');
      res.send(cached.buffer);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const fetchRes = await fetch(target, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!fetchRes.ok) {
      res.redirect(target);
      return;
    }

    const contentType = fetchRes.headers.get('content-type') || 'image/jpeg';
    const arrayBuf = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    // Save in cache (manage size)
    if (imageProxyCache.size >= MAX_PROXY_CACHE_ITEMS) {
      const oldestKey = imageProxyCache.keys().next().value;
      if (oldestKey) imageProxyCache.delete(oldestKey);
    }
    imageProxyCache.set(target, { buffer, contentType, timestamp: Date.now() });

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400, immutable');
    res.send(buffer);
  } catch {
    res.status(500).send('Image proxy error');
  }
});

/**
 * Unified Core Product Extraction Pipeline
 */
async function extractProductFromUrlCore(inputUrl: string) {
  let targetUrl = inputUrl.trim();
  const urlMatches = targetUrl.match(/(https?:\/\/[^\s]+|[\w-]+\.[\w-]+\.[^\s]+)/gi);
  if (urlMatches && urlMatches.length > 0) {
    targetUrl = urlMatches[0].replace(/[.,;)]+$/, '');
  }
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `https://${targetUrl}`;
  }

  let rawData: ScrapedRawData = {};
  let scrapingMethod = 'direct';

  // Phase 1: Try Direct Scrape
  try {
    rawData = await scrapeDirectUrl(targetUrl);
  } catch {
    // Direct scrape failed
  }

  // Phase 2: If image or title missing, try Jina Reader
  if (!rawData.image || isLogoUrl(rawData.image) || !rawData.title) {
    try {
      const jinaData = await scrapeWithJinaReader(targetUrl);
      if (jinaData) {
        rawData = {
          ...rawData,
          title: rawData.title || jinaData.title,
          description: rawData.description || jinaData.description,
          image: cleanAndUpgradeImageUrl(jinaData.image || rawData.image, targetUrl),
        };
        scrapingMethod = 'jina';
      }
    } catch {}
  }

  // Phase 3: If still missing image or title, try Microlink JS Prerender
  if (!rawData.image || isLogoUrl(rawData.image) || !rawData.title) {
    try {
      const microData = await scrapeMicrolinkUrl(targetUrl);
      if (microData) {
        rawData = {
          ...rawData,
          title: rawData.title || microData.title,
          description: rawData.description || microData.description,
          image: cleanAndUpgradeImageUrl(microData.image || rawData.image, targetUrl),
        };
        scrapingMethod = 'microlink';
      }
    } catch {}
  }

  // Phase 4: Path Fallback
  if (!rawData.title) {
    const pathInfo = extractProductFromUrlPath(targetUrl);
    if (pathInfo.title) {
      rawData.title = pathInfo.title;
      if (!rawData.siteName && pathInfo.brand) {
        rawData.siteName = pathInfo.brand;
      }
    }
  }

  const parsedPrice = parsePriceNumber(rawData.price);

  let aiEnhanced = {
    title: rawData.title || 'Producto de ' + (rawData.domain || 'Tienda'),
    description:
      rawData.description ||
      'Descripción del producto extraído automáticamente. Puedes editar este texto para destacar los mejores beneficios.',
    image: cleanAndUpgradeImageUrl(rawData.image, targetUrl),
    price: parsedPrice,
    currency: '$',
    originalPrice: null as number | null,
    category: 'General',
    brand: rawData.siteName || rawData.domain || 'Tienda Online',
    badge: 'Nuevo',
    sizes: null as string | null,
  };

  // Phase 5: Gemini AI refinement
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Analiza y extrae/mejora la información del producto a partir de la URL y los datos rescatados del sitio web.
URL del Producto: ${targetUrl}
Dominio: ${rawData.domain || ''}
Título rescatado: ${rawData.title || ''}
Descripción rescatada: ${rawData.description || ''}
Precio detectado: ${rawData.price || ''}
Nombre del sitio/marca: ${rawData.siteName || rawData.domain || ''}

OBJETIVO:
Generar un perfil de producto limpio, muy profesional y 100% listo para un catálogo comercial en español.

INSTRUCCIONES:
1. TÍTULO ("title"): Título comercial atractivo y conciso en español (máximo 60 caracteres, elimina sufijos redundantes de tiendas como "- Temu", "- MercadoLibre", "| Amazon", etc.).
2. DESCRIPCIÓN ("description"): Redacta una descripción clara y persuasiva enfocada EXCLUSIVAMENTE en el producto (características, materiales, usos, beneficios). Elimina avisos sobre envíos, cupones o devoluciones.
3. TALLAS Y MEDIDAS ("sizes"): Si el producto es ropa, calzado o accesorio y hay tallas/medidas en el texto, indícalas aquí (ej: "S, M, L, XL", "38 a 43 EU", "32x34"). Si no aplica, devuelve null.
4. PRECIO ("price"): Número decimal con el precio de venta actual si existe o se deduce del texto.
5. MONEDA ("currency"): Símbolo o código de moneda (ej: "$", "€", "MXN", "COP", "PEN", "CLP", "ARS").
6. PRECIO ORIGINAL ("originalPrice"): Número decimal del precio anterior si hay oferta o descuento evidente, o null si no hay.
7. CATEGORÍA ("category"): Categoría precisa (ej: "Calzado", "Ropa", "Tecnología", "Hogar", "Belleza", "Accesorios", "Deportes").
8. MARCA ("brand"): Nombre comercial de la marca o tienda.
9. ETIQUETA ("badge"): Etiqueta comercial sugerida (ej: "Nuevo", "Destacado", "Más Vendido", "Oferta").`;

      const aiText = await callGeminiWithRetry({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              sizes: { type: Type.STRING, nullable: true },
              price: { type: Type.NUMBER, nullable: true },
              currency: { type: Type.STRING },
              originalPrice: { type: Type.NUMBER, nullable: true },
              category: { type: Type.STRING },
              brand: { type: Type.STRING },
              badge: { type: Type.STRING },
            },
            required: ['title', 'description', 'category', 'brand'],
          },
        },
      });

      if (aiText) {
        const parsedAi = JSON.parse(aiText);
        aiEnhanced = {
          ...aiEnhanced,
          title: parsedAi.title || aiEnhanced.title,
          description: parsedAi.description || aiEnhanced.description,
          sizes: parsedAi.sizes || null,
          price: typeof parsedAi.price === 'number' && parsedAi.price > 0 ? parsedAi.price : aiEnhanced.price,
          currency: parsedAi.currency || aiEnhanced.currency,
          originalPrice: typeof parsedAi.originalPrice === 'number' && parsedAi.originalPrice > 0 ? parsedAi.originalPrice : null,
          category: parsedAi.category || aiEnhanced.category,
          brand: parsedAi.brand || aiEnhanced.brand,
          badge: parsedAi.badge || aiEnhanced.badge,
        };
      }
    } catch {}
  }

  // Phase 6: Final image check & fallback image selection
  let finalImage = cleanAndUpgradeImageUrl(rawData.image || aiEnhanced.image, targetUrl);

  if (!finalImage || isLogoUrl(finalImage)) {
    finalImage = getCategoryFallbackImage(
      `${aiEnhanced.title || ''} ${aiEnhanced.description || ''}`
    );
  }

  return {
    id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    sourceUrl: targetUrl,
    title: aiEnhanced.title,
    description: aiEnhanced.description,
    sizes: aiEnhanced.sizes || undefined,
    image: finalImage,
    price: aiEnhanced.price ?? 29.99,
    originalPrice: aiEnhanced.originalPrice,
    currency: aiEnhanced.currency || '$',
    category: aiEnhanced.category || 'General',
    brand: aiEnhanced.brand || rawData.domain || 'Tienda',
    badge: aiEnhanced.badge || 'Nuevo',
    inStock: true,
    favicon: rawData.favicon,
    scrapingMethod,
  };
}

// API: Extract product metadata from URL
app.post('/api/extract-product', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Debes proporcionar una URL válida.' });
      return;
    }

    const product = await extractProductFromUrlCore(url);
    res.json({
      success: true,
      scrapingMethod: product.scrapingMethod,
      product,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'No se pudo extraer el producto automáticamente. Revisa la URL o ingresa el producto manualmente.',
      details: error.message,
    });
  }
});

// ENHANCED API: Multimodal AI Analysis of Product Screenshots
app.post('/api/extract-from-screenshot', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      res.status(400).json({ error: 'Debes proporcionar una captura de pantalla válida.' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const detectedMime = mimeType || (imageBase64.match(/^data:(image\/[a-z]+);base64,/) || [])[1] || 'image/png';

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: 'La API Key de Gemini no está configurada.' });
      return;
    }

    const prompt = `Analiza minuciosamente esta captura de pantalla de una publicación de producto o tienda.

REGLAS STRICTAS DE ANÁLISIS:
1. FOTO PRINCIPAL: Detecta únicamente la caja o rectángulo de la FOTO O ARTÍCULO PRINCIPAL (ignorando banners de descuento flotantes, contadores, barras de navegación o pies de página).
   "productBoundingBox": [ymin, xmin, ymax, xmax] coordenadas en números enteros de 0 a 1000 del recuadro de la foto del artículo en la captura.
2. TÍTULO: "title": Nombre o título del producto en español (máximo 60 caracteres).
3. DESCRIPCIÓN: "description": Redacta una descripción centrada EXCLUSIVAMENTE en las características del producto, estilo, materiales y detalles (sin mencionar promociones de la tienda, ni descuentos, ni envíos).
4. TALLAS / MEDIDAS: "sizes": Si el producto es ropa, calzado o accesorio, busca si hay información de TALLAS (ej: "S, M, L, XL", "38 a 43 EU", "32x34", "Única", "25 x 15 cm"). Si está presente, indícalo aquí. Si no aplica o no hay tallas visibles, pon null.
5. PRECIO: "price": Número del precio detectado (ej: 29.99), o null si no se observa un precio claro.
6. MONEDA: "currency": Símbolo de moneda (ej: "$", "€", "MXN", "COP", "PEN", "CLP", "S/.").
7. PRECIO ANTERIOR: "originalPrice": Precio tachado si existe, o null.
8. CATEGORÍA: "category": Categoría estimada ("Ropa", "Calzado", "Tecnología", "Hogar", "Belleza", "Accesorios", "Deportes").
9. MARCA: "brand": Marca del producto o nombre comercial limpio de la tienda.
10. ETIQUETA: "badge": Etiqueta corta de calidad (ej: "Calidad Premium", "Nuevo", "Destacado").`;

    const textPart = { text: prompt };
    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: detectedMime,
      },
    };

    const aiText = await callGeminiWithRetry({
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            sizes: { type: Type.STRING, nullable: true },
            productBoundingBox: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
              nullable: true,
            },
            price: { type: Type.NUMBER, nullable: true },
            currency: { type: Type.STRING },
            originalPrice: { type: Type.NUMBER, nullable: true },
            category: { type: Type.STRING },
            brand: { type: Type.STRING },
            badge: { type: Type.STRING },
          },
          required: ['title', 'description', 'category', 'brand'],
        },
      },
    });

    if (!aiText) {
      throw new Error('No se pudo analizar la captura de pantalla con Gemini AI.');
    }

    const parsedAi = JSON.parse(aiText);

    // Full Image Data URL
    const fullImageDataUrl = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:${detectedMime};base64,${cleanBase64}`;

    res.json({
      success: true,
      product: {
        id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        sourceUrl: '',
        title: parsedAi.title || 'Producto de Captura',
        description: parsedAi.description || 'Producto extraído mediante análisis de captura de pantalla con IA.',
        sizes: parsedAi.sizes || undefined,
        productBoundingBox: parsedAi.productBoundingBox || null,
        image: fullImageDataUrl,
        price: typeof parsedAi.price === 'number' ? parsedAi.price : 29.99,
        originalPrice: typeof parsedAi.originalPrice === 'number' ? parsedAi.originalPrice : null,
        currency: parsedAi.currency || '$',
        category: parsedAi.category || 'General',
        brand: parsedAi.brand || 'Captura de Pantalla',
        badge: parsedAi.badge || 'Novedad',
        inStock: true,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'No se pudo analizar la captura de pantalla. Intenta con una imagen más clara.',
      details: error.message,
    });
  }
});

// API: Batch Extract
app.post('/api/batch-extract', async (req: Request, res: Response) => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls) || urls.length === 0) {
      res.status(400).json({ error: 'Proporciona una lista de URLs.' });
      return;
    }

    const validUrls = urls.slice(0, 5).filter((u) => typeof u === 'string' && u.trim().length > 0);

    const results = await Promise.all(
      validUrls.map(async (u) => {
        try {
          return await extractProductFromUrlCore(u);
        } catch {
          return null;
        }
      })
    );

    const successfulProducts = results.filter(Boolean);
    res.json({ success: true, products: successfulProducts });
  } catch (err: any) {
    res.status(500).json({ error: 'Error procesando lote de productos.' });
  }
});

// API: AI Revamp / Generate Sales Description
app.post('/api/enrich-product', async (req: Request, res: Response) => {
  try {
    const { title, description, tone } = req.body;

    const fallbackDesc = `${description}\n\n✨ ¡Producto destacado de excelente calidad con garantía de satisfacción!`;

    if (!process.env.GEMINI_API_KEY) {
      res.json({ enhancedDescription: fallbackDesc });
      return;
    }

    const toneInstructions =
      tone === 'promotional'
        ? 'estilo altamente persuasivo, enfocado en oferta especial y escasez'
        : tone === 'luxury'
        ? 'estilo elegante, sofisticado y exclusivo'
        : tone === 'whatsapp'
        ? 'estilo amigable con emojis, listo para compartir por WhatsApp'
        : 'estilo profesional, claro y descriptivo';

    const prompt = `Reescribe la descripción de este producto de tienda online en español usando un ${toneInstructions}.
Título: ${title}
Descripción original: ${description}

Genera un texto atractivo de 2 a 4 viñetas o frases vendedoras.`;

    const aiText = await callGeminiWithRetry({
      contents: prompt,
    });

    res.json({
      enhancedDescription: aiText?.trim() || fallbackDesc,
    });
  } catch (error: any) {
    res.json({
      enhancedDescription: `${req.body?.description || ''}\n\n✨ ¡Producto de alta calidad disponible en tienda!`,
    });
  }
});

// UPSTASH REDIS CACHE ENDPOINTS
app.get('/api/cache/status', (_req: Request, res: Response) => {
  res.json({
    enabled: !!redis,
    message: redis
      ? 'Upstash Redis está activo y reduciendo lecturas de Firestore.'
      : 'Upstash Redis no configurado. Agrega UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN en .env para activar el caché.',
  });
});

app.get('/api/cache/catalog/:sellerId', async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;
    if (!redis) {
      res.json({ hit: false, reason: 'redis_not_configured' });
      return;
    }

    const cacheKey = `catalog:${sellerId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsed = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      res.json({ hit: true, catalogs: parsed });
      return;
    }

    res.json({ hit: false });
  } catch (err: any) {
    res.json({ hit: false, error: err.message });
  }
});

app.post('/api/cache/catalog/:sellerId', async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;
    const { catalogs, ttlSeconds } = req.body;

    if (!redis) {
      res.json({ success: false, reason: 'redis_not_configured' });
      return;
    }

    const cacheKey = `catalog:${sellerId}`;
    const ttl = ttlSeconds && typeof ttlSeconds === 'number' ? ttlSeconds : 86400; // 24 hours default TTL

    await redis.set(cacheKey, JSON.stringify(catalogs), { ex: ttl });
    res.json({ success: true, cached: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/cache/catalog/:sellerId', async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;
    if (!redis) {
      res.json({ success: false, reason: 'redis_not_configured' });
      return;
    }

    const cacheKey = `catalog:${sellerId}`;
    await redis.del(cacheKey);
    res.json({ success: true, invalidated: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Express + Vite dev middleware or static serving
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
