import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  ShoppingBag,
  Check,
  Tag,
  RefreshCw,
  Ruler,
} from 'lucide-react';
import { Product, StoreSettings } from '../types/catalog';
import { isLogoUrl, getCategoryFallbackImage } from '../utils/imageUtils';
import { rehydrateProduct } from '../lib/firestoreService';

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
  isCustomerMode?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onReExtract?: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
  layout?: 'grid-3' | 'grid-2' | 'grid-4' | 'list' | 'story';
}

const ProductCardBase: React.FC<ProductCardProps> = ({
  product,
  settings,
  isCustomerMode = false,
  onEdit,
  onDelete,
  onDuplicate,
  onAddToCart,
  onReExtract,
  onViewDetail,
  layout = 'grid-3',
}) => {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const resolveRealImage = (prod: Product): string => {
    const rehydrated = rehydrateProduct(prod);
    let raw = rehydrated.image || '';
    if (!raw || raw.startsWith('__SAME_AS') || raw.startsWith('__DET_')) {
      raw =
        rehydrated.imageDetails?.[0]?.url ||
        (Array.isArray(rehydrated.images) ? rehydrated.images[0] : '') ||
        '';
      if (raw.startsWith('__SAME_AS') || raw.startsWith('__DET_')) {
        raw = '';
      }
    }
    const isLogo = isLogoUrl(raw);
    const fallbackDisplay = getCategoryFallbackImage(`${prod.title} ${prod.description}`);
    return isLogo || !raw ? fallbackDisplay : raw;
  };

  const initialImg = resolveRealImage(product);

  const [imgSrc, setImgSrc] = useState(initialImg);
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync image state if product prop changes
  React.useEffect(() => {
    const fresh = resolveRealImage(product);
    setImgSrc(fresh);
    setImgError(false);
    setIsLoaded(false);
  }, [product.image, product.title, product.description, product.imageDetails, product.images]);

  const handleImageError = () => {
    const fallback = getCategoryFallbackImage(`${product.title} ${product.description}`);
    // If direct image fails, attempt loading via proxy route before showing fallback
    if (
      imgSrc &&
      !imgSrc.includes('/api/proxy-image') &&
      imgSrc.startsWith('http') &&
      !window.location.hostname.includes('vercel.app')
    ) {
      setImgSrc(`/api/proxy-image?url=${encodeURIComponent(imgSrc)}`);
    } else if (imgSrc !== fallback) {
      setImgSrc(fallback);
      setImgError(false);
      setIsLoaded(true);
    } else {
      setImgError(true);
    }
  };

  const handleManualReExtract = async () => {
    if (!product.sourceUrl || isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (onReExtract) {
        await onReExtract(product);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate discount percentage if original price exists
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  const copyWhatsAppFormat = () => {
    try {
      const text = `🛍️ *${product.title}*\n📌 Código: ${product.sku || 'N/A'}\n💰 Precio: ${product.currency}${product.price.toFixed(
        2
      )}${
        product.originalPrice ? ` (Antes ${product.currency}${product.originalPrice.toFixed(2)})` : ''
      }\n${product.sizes ? `📏 Tallas: ${product.sizes}\n` : ''}📝 ${product.description}\n${
        product.sourceUrl ? `🔗 Ver enlace: ${product.sourceUrl}` : ''
      }`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Theme accent colors
  const themeAccentClasses = {
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white',
    cobalt: 'bg-blue-600 hover:bg-blue-700 text-white',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white',
  }[settings.themeColor || 'emerald'];

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-4 flex flex-col sm:flex-row gap-4 items-center print-card">
        <div
          onClick={() => onViewDetail && onViewDetail(product)}
          className="w-full sm:w-32 h-32 shrink-0 bg-slate-50 rounded-xl overflow-hidden relative border border-slate-100 cursor-pointer group/img"
        >
          {!imgError && imgSrc && imgSrc.trim() !== '' ? (
            <div className="w-full h-full relative">
              {!isLoaded && (
                <div className="absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center">
                  <Tag className="w-5 h-5 text-slate-400 opacity-40 animate-pulse" />
                </div>
              )}
              <img
                src={imgSrc}
                alt={product.title}
                loading="lazy"
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                onError={handleImageError}
                className={`w-full h-full object-cover group-hover/img:scale-105 transition-all duration-300 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 text-xs text-center p-2">
              <Tag className="w-6 h-6 mb-1 opacity-40" />
              <span>Sin imagen</span>
            </div>
          )}
          {product.badge && (
            <span className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              {product.badge}
            </span>
          )}
        </div>

        <div
          onClick={() => onViewDetail && onViewDetail(product)}
          className="flex-1 min-w-0 cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                {product.category}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="truncate">{product.brand}</span>
            </div>
            {product.sku && (
              <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/80 shrink-0">
                {product.sku}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-slate-900 text-base leading-snug truncate mb-1 hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>

          {product.sizes && (
            <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/80 px-2 py-0.5 rounded-md text-[11px] font-semibold mb-1">
              <Ruler className="w-3 h-3 text-purple-600" />
              <span>Tallas: {product.sizes}</span>
            </div>
          )}

          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-2 flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-lg font-bold text-slate-900">
              {product.currency}
              {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {product.currency}
                {product.originalPrice.toFixed(2)}
              </span>
            )}
            {discountPercent && (
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 no-print">
          {isCustomerMode ? (
            <button
              onClick={() => onAddToCart && onAddToCart(product)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${themeAccentClasses}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pedir</span>
            </button>
          ) : (
            <>
              {product.sourceUrl && (
                <button
                  onClick={handleManualReExtract}
                  disabled={isRefreshing}
                  className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Re-extraer foto original"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
              )}
              <button
                onClick={copyWhatsAppFormat}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Copiar formato WhatsApp"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Editar producto"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Grid Card Layout (Default)
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group print-card">
      {/* Product Image Container */}
      <div
        onClick={() => onViewDetail && onViewDetail(product)}
        className="relative aspect-4/3 bg-slate-50 overflow-hidden border-b border-slate-100 cursor-pointer"
      >
        {!imgError && imgSrc && imgSrc.trim() !== '' ? (
          <div className="w-full h-full relative">
            {!isLoaded && (
              <div className="absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center">
                <Tag className="w-8 h-8 text-slate-400 opacity-40 animate-pulse" />
              </div>
            )}
            <img
              src={imgSrc}
              alt={product.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              onError={handleImageError}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <Tag className="w-8 h-8 mb-1 opacity-40" />
            <span className="text-xs">Imagen no disponible</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
          {product.badge && (
            <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md tracking-wider shadow-2xs">
              -{discountPercent}%
            </span>
          )}
          {product.images && product.images.length > 1 && (
            <span className="bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
              📷 {product.images.length} fotos
            </span>
          )}
          {product.sizeVariants && product.sizeVariants.length > 0 && (
            <span className="bg-purple-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
              Precios por talla
            </span>
          )}
        </div>

        {/* External Link & Refresh Action */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2.5 right-2.5 flex items-center gap-1.5 no-print"
        >
          {product.sourceUrl && !isCustomerMode && (
            <button
              onClick={handleManualReExtract}
              disabled={isRefreshing}
              className="p-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-700 rounded-lg backdrop-blur-xs transition-colors shadow-2xs"
              title="Actualizar foto desde la URL"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          )}
          {product.sourceUrl && (
            <a
              href={product.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg backdrop-blur-xs transition-colors shadow-2xs"
              title="Ver en la página original"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div
          onClick={() => onViewDetail && onViewDetail(product)}
          className="cursor-pointer"
        >
          {/* Metadata kicker */}
          <div className="flex items-center justify-between gap-1.5 text-xs text-slate-500 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                {product.category}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-[11px] text-slate-500 truncate">{product.brand}</span>
            </div>
            {product.sku && (
              <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100/80 shrink-0">
                {product.sku}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>

          {/* Sizes / Tallas pill */}
          {product.sizes && (
            <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/80 px-2 py-0.5 rounded-md text-[11px] font-semibold mb-2">
              <Ruler className="w-3 h-3 text-purple-600" />
              <span>Tallas: {product.sizes}</span>
            </div>
          )}

          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price & Action Row */}
          <div className="pt-3 border-t border-slate-100 flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
            <div className="min-w-0">
              {product.sizeVariants && product.sizeVariants.length > 0 ? (
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-700 block leading-none mb-0.5">
                    Desde:
                  </span>
                  <div className="flex items-baseline gap-1 font-mono tabular-nums">
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {product.currency}
                      {Math.min(...product.sizeVariants.map((v) => v.price)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-baseline gap-1 font-mono tabular-nums">
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {product.currency}
                    {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                      {product.currency}
                      {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 no-print w-full xs:w-auto justify-end shrink-0">
              {isCustomerMode ? (
                <button
                  onClick={() => onAddToCart && onAddToCart(product)}
                  className={`w-full xs:w-auto px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs ${themeAccentClasses}`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Pedir</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={copyWhatsAppFormat}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Copiar texto para WhatsApp"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const areProductCardPropsEqual = (
  prevProps: ProductCardProps,
  nextProps: ProductCardProps
): boolean => {
  // 1. Structural mode & layout checks
  if (prevProps.isCustomerMode !== nextProps.isCustomerMode) return false;
  if (prevProps.layout !== nextProps.layout) return false;

  // 2. Store settings visual influences
  const pSet = prevProps.settings;
  const nSet = nextProps.settings;
  if (
    pSet.themeColor !== nSet.themeColor ||
    pSet.currencySymbol !== nSet.currencySymbol ||
    pSet.storeName !== nSet.storeName ||
    pSet.whatsappNumber !== nSet.whatsappNumber
  ) {
    return false;
  }

  // 3. Product reference equality
  const p = prevProps.product;
  const n = nextProps.product;
  if (p === n) return true;

  // 4. Product scalar fields comparison
  if (
    p.id !== n.id ||
    p.title !== n.title ||
    p.price !== n.price ||
    p.originalPrice !== n.originalPrice ||
    p.currency !== n.currency ||
    p.image !== n.image ||
    p.description !== n.description ||
    p.category !== n.category ||
    p.brand !== n.brand ||
    p.badge !== n.badge ||
    p.sku !== n.sku ||
    p.sizes !== n.sizes ||
    p.inStock !== n.inStock ||
    p.sourceUrl !== n.sourceUrl
  ) {
    return false;
  }

  // 5. Product images array check
  if (p.images !== n.images) {
    const pImgs = p.images;
    const nImgs = n.images;
    const pLen = pImgs?.length || 0;
    const nLen = nImgs?.length || 0;
    if (pLen !== nLen) return false;
    for (let i = 0; i < pLen; i++) {
      if (pImgs![i] !== nImgs![i]) return false;
    }
  }

  // 6. Product imageDetails array check
  if (p.imageDetails !== n.imageDetails) {
    const pDetails = p.imageDetails;
    const nDetails = n.imageDetails;
    const pDLen = pDetails?.length || 0;
    const nDLen = nDetails?.length || 0;
    if (pDLen !== nDLen) return false;
    for (let i = 0; i < pDLen; i++) {
      const pD = pDetails![i];
      const nD = nDetails![i];
      if (pD?.url !== nD?.url || pD?.code !== nD?.code || pD?.price !== nD?.price) {
        return false;
      }
    }
  }

  // 7. Product sizeVariants array check
  if (p.sizeVariants !== n.sizeVariants) {
    const pVars = p.sizeVariants;
    const nVars = n.sizeVariants;
    const pVLen = pVars?.length || 0;
    const nVLen = nVars?.length || 0;
    if (pVLen !== nVLen) return false;
    for (let i = 0; i < pVLen; i++) {
      const pV = pVars![i];
      const nV = nVars![i];
      if (
        pV?.size !== nV?.size ||
        pV?.price !== nV?.price ||
        pV?.originalPrice !== nV?.originalPrice
      ) {
        return false;
      }
    }
  }

  // Callback function identity changes (onEdit, onDelete, etc.) won't trigger re-render
  return true;
};

export const ProductCard = React.memo(ProductCardBase, areProductCardPropsEqual);
