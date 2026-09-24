import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Tag,
  Ruler,
  Maximize2,
  ZoomIn,
  Store,
  Share2,
} from 'lucide-react';
import { Product, StoreSettings } from '../types/catalog';
import { isLogoUrl, getCategoryFallbackImage } from '../utils/imageUtils';

interface ProductDetailModalProps {
  isOpen: boolean;
  product: Product | null;
  settings: StoreSettings;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize?: string, customUnitPrice?: number) => void;
  isCustomerMode?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  product,
  settings,
  onClose,
  onAddToCart,
  isCustomerMode = true,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedToCartAnim, setAddedToCartAnim] = useState(false);

  // Compute all available gallery images
  const allImages = React.useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return product.image ? [product.image] : [];
  }, [product]);

  // Compute available sizes list
  const sizesList = React.useMemo(() => {
    if (!product) return [];
    if (product.availableSizes && product.availableSizes.length > 0) {
      return product.availableSizes;
    }
    if (product.sizes) {
      return product.sizes.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    }
    return [];
  }, [product]);

  // Sync index and default size on product change
  React.useEffect(() => {
    setActiveImageIndex(0);
    if (sizesList.length > 0) {
      setSelectedSize(sizesList[0]);
    } else {
      setSelectedSize('');
    }
  }, [product, sizesList]);

  // Active selected size variant custom price
  const activeVariant = React.useMemo(() => {
    if (!product || !product.sizeVariants || !selectedSize) return null;
    return product.sizeVariants.find(
      (v) => v.size.toLowerCase().trim() === selectedSize.toLowerCase().trim()
    ) || null;
  }, [product, selectedSize]);

  if (!isOpen || !product) return null;

  const currentDisplayImage = allImages[activeImageIndex] || product.image;
  const isLogo = isLogoUrl(currentDisplayImage);
  const fallbackDisplay = getCategoryFallbackImage(`${product.title} ${product.description}`);
  const displayImage = isLogo ? fallbackDisplay : currentDisplayImage;

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentOriginalPrice = activeVariant && activeVariant.originalPrice !== undefined
    ? activeVariant.originalPrice
    : product.originalPrice;

  // Discount percentage
  const discountPercent =
    currentOriginalPrice && currentOriginalPrice > currentPrice
      ? Math.round(
          ((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100
        )
      : null;

  // WhatsApp order link
  const buildWhatsAppOrderUrl = () => {
    const rawNumber = (settings.whatsappNumber || '573000000000').replace(/[^0-9]/g, '');
    const message = `Hola *${settings.storeName}*, me interesa este producto de su catálogo:\n\n📌 *${product.title}*\n💰 *Precio:* ${product.currency}${currentPrice.toFixed(2)}\n${
      selectedSize ? `📏 *Talla Elegida:* ${selectedSize}\n` : product.sizes ? `📏 *Tallas:* ${product.sizes}\n` : ''
    }🔗 *Imagen:* ${displayImage || product.sourceUrl || ''}\n\n¿Tienen disponibilidad?`;
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  };

  const copyProductDetails = () => {
    const text = `🛍️ *${product.title}*\n💰 Precio: ${product.currency}${currentPrice.toFixed(
      2
    )}${
      currentOriginalPrice ? ` (Antes ${product.currency}${currentOriginalPrice.toFixed(2)})` : ''
    }\n${selectedSize ? `📏 Talla seleccionada: ${selectedSize}\n` : product.sizes ? `📏 Tallas: ${product.sizes}\n` : ''}📝 ${product.description}\n${
      product.sourceUrl ? `🔗 Enlace: ${product.sourceUrl}` : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdd = () => {
    onAddToCart(product, selectedSize || undefined, currentPrice);
    setAddedToCartAnim(true);
    setTimeout(() => setAddedToCartAnim(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Lightbox Fullscreen Image View */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={displayImage}
            alt={product.title}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Main Modal Container */}
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[94vh] md:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-md transition-colors shadow-md"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image Gallery Viewer */}
          <div className="relative bg-slate-950 aspect-[4/3] sm:aspect-square md:aspect-auto md:min-h-[440px] flex flex-col justify-between overflow-hidden group">
            
            {/* Main Active Image */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              {displayImage && displayImage.trim() !== '' ? (
                <img
                  src={displayImage}
                  alt={product.title}
                  className="w-full h-full object-cover cursor-zoom-in group-hover:scale-102 transition-transform duration-300"
                  onClick={() => setIsZoomed(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(true)}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl backdrop-blur-md flex items-center gap-1.5 shadow-md transition-all z-10"
              >
                <ZoomIn className="w-4 h-4 text-emerald-400" />
                <span>Ver Completa</span>
              </button>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none z-10">
                {product.badge && (
                  <span className="bg-emerald-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
                    {product.badge}
                  </span>
                )}
                {discountPercent && (
                  <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-md">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery Strip (Multi-Image) */}
            {allImages.length > 1 && (
              <div className="p-2.5 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none z-10">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-emerald-400 scale-105 shadow-md'
                        : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Public Listing Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between md:max-h-[90vh] md:overflow-y-auto">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                <span className="font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                  {product.category || 'General'}
                </span>
                <span className="font-medium text-slate-400">{product.brand}</span>
              </div>

              {/* Title */}
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-snug mb-3">
                {product.title}
              </h2>

              {/* Price Tag */}
              <div className="flex items-baseline gap-3 mb-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {product.currency}
                  {currentPrice.toFixed(2)}
                </span>
                {currentOriginalPrice && (
                  <span className="font-mono text-sm text-slate-400 line-through">
                    {product.currency}
                    {currentOriginalPrice.toFixed(2)}
                  </span>
                )}
                {activeVariant && (
                  <span className="ml-auto text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200">
                    Precio para talla {selectedSize}
                  </span>
                )}
              </div>

              {/* Interactive Size Selection Chips */}
              {sizesList.length > 0 && (
                <div className="mb-5 p-3.5 bg-purple-50/80 border border-purple-200/90 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5 uppercase tracking-wider">
                      <Ruler className="w-4 h-4 text-purple-600" />
                      <span>Selecciona tu Talla:</span>
                    </span>
                    {selectedSize && (
                      <span className="text-xs font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200 shadow-2xs">
                        {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizesList.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                          selectedSize === sz
                            ? 'bg-purple-700 text-white border-purple-800 shadow-sm scale-105'
                            : 'bg-white text-purple-900 border-purple-200 hover:border-purple-400 hover:bg-purple-100/50'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Descripción del Producto:
                </h4>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                  {product.description}
                </div>
              </div>
            </div>

            {/* Actions: Add to Cart & Direct WhatsApp Purchase */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Add to Cart Button */}
                <button
                  onClick={handleAdd}
                  className={`py-3 px-4 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                    addedToCartAnim
                      ? 'bg-slate-900 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {addedToCartAnim ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>¡Agregado al Pedido!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Agregar al Pedido {selectedSize ? `(${selectedSize})` : ''}</span>
                    </>
                  )}
                </button>

                {/* Direct WhatsApp Purchase Button */}
                <a
                  href={buildWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Comprar por WhatsApp</span>
                </a>
              </div>

              {/* Additional options: Copy details or View Original URL */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <button
                  onClick={copyProductDetails}
                  className="hover:text-slate-900 flex items-center gap-1 font-semibold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Detalles copiados!' : 'Copiar info para compartir'}</span>
                </button>

                {product.sourceUrl && (
                  <a
                    href={product.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-700 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <span>Ver en tienda origen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
