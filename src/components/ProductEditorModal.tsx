import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
  X,
  Upload,
  Ruler,
  DollarSign,
  Plus,
  Trash2,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { Product, SizeVariant, ProductImageDetail } from '../types/catalog';
import { generateProductSku, generateSubCode } from '../utils/codeUtils';
import { uploadBase64ImageToSupabase } from '../lib/supabase';
import { compressImageBase64 } from '../utils/imageUtils';

interface ProductEditorModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    image: '',
    price: 0,
    originalPrice: null,
    currency: '$',
    category: 'General',
    brand: 'Mi Tienda',
    sizes: '',
    badge: 'Nuevo',
    inStock: true,
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'promotional' | 'luxury' | 'whatsapp'>('whatsapp');

  const [imageList, setImageList] = useState<string[]>([]);
  const [imageDetailsList, setImageDetailsList] = useState<ProductImageDetail[]>([]);
  const [useCustomVariantPrices, setUseCustomVariantPrices] = useState(false);
  const [variantsList, setVariantsList] = useState<SizeVariant[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        sku: product.sku || generateProductSku(),
      });
      const existingImages = product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []);
      setImageList(existingImages);

      const existingDetails = product.imageDetails && product.imageDetails.length > 0
        ? product.imageDetails
        : existingImages.map(img => ({ url: img, price: null, code: generateSubCode() }));
      // Sync imageDetailsList with existingImages to maintain order and presence
      const syncedDetails = existingImages.map(img => {
        const found = existingDetails.find(d => d.url === img);
        return found
          ? { ...found, code: (found.code && found.code.trim() !== '') ? found.code.trim().toUpperCase() : generateSubCode() }
          : { url: img, price: null, code: generateSubCode() };
      });
      setImageDetailsList(syncedDetails);

      if (product.sizeVariants && product.sizeVariants.length > 0) {
        setVariantsList(product.sizeVariants);
        setUseCustomVariantPrices(true);
      } else {
        setVariantsList([]);
        setUseCustomVariantPrices(false);
      }
    } else {
      const defaultImg = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
      setFormData({
        id: 'prod_' + Date.now(),
        sku: generateProductSku(),
        title: '',
        description: '',
        image: defaultImg,
        images: [defaultImg],
        price: 29.99,
        originalPrice: null,
        currency: '$',
        category: 'General',
        brand: 'Mi Tienda',
        sizes: 'S, M, L, XL',
        availableSizes: ['S', 'M', 'L', 'XL'],
        badge: 'Nuevo',
        inStock: true,
      });
      setImageList([defaultImg]);
      setImageDetailsList([{ url: defaultImg, price: null, code: generateSubCode() }]);
      setVariantsList([]);
      setUseCustomVariantPrices(false);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleAddVariantRow = () => {
    const baseP = Number(formData.price) || 29.99;
    setVariantsList((prev) => [
      ...prev,
      { size: '', price: baseP, originalPrice: null },
    ]);
  };

  const handleUpdateVariantRow = (index: number, field: keyof SizeVariant, value: any) => {
    setVariantsList((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariantsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAutoGenerateVariantsFromSizes = () => {
    if (!formData.sizes) return;
    const sizeNames = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const baseP = Number(formData.price) || 29.99;
    const baseOrig = formData.originalPrice ? Number(formData.originalPrice) : null;

    const generated = sizeNames.map((sz) => ({
      size: sz,
      price: baseP,
      originalPrice: baseOrig,
    }));

    setVariantsList(generated);
    setUseCustomVariantPrices(true);
  };

  const MAX_GALLERY_IMAGES = 10;

  const handleMultipleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const currentLength = imageList.length;
    const remainingSlots = MAX_GALLERY_IMAGES - currentLength;

    if (remainingSlots <= 0) {
      alert("Límite de 10 imágenes alcanzado para la galería de este producto.");
      return;
    }

    const filesToLoad = fileArray.slice(0, remainingSlots);
    if (fileArray.length > remainingSlots) {
      alert(`Solo se cargarán ${remainingSlots} imágenes debido al límite máximo de 10.`);
    }

    let loadedCount = 0;
    const loadedImages: string[] = new Array(filesToLoad.length);

    filesToLoad.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = async () => {
        if (reader.result) {
          const raw = reader.result as string;
          try {
            // Compress phone camera images down to crisp 1200px HD WebP (~120KB)
            const compressed = await compressImageBase64(raw, 1200, 0.82);
            loadedImages[index] = compressed;
          } catch {
            loadedImages[index] = raw;
          }
        }
        loadedCount++;
        if (loadedCount === filesToLoad.length) {
          const filteredLoaded = loadedImages.filter(Boolean);
          setImageList((current) => {
            const combined = [...current, ...filteredLoaded].slice(0, MAX_GALLERY_IMAGES);
            setImageDetailsList((currentDetails) => {
              return combined.map((url) => {
                const found = currentDetails.find((d) => d.url === url);
                return found
                  ? { ...found, code: (found.code && found.code.trim() !== '') ? found.code.trim().toUpperCase() : generateSubCode() }
                  : { url, price: null, code: generateSubCode() };
              });
            });
            setFormData((f) => ({
              ...f,
              image: combined[0] || '',
              images: combined,
            }));
            return combined;
          });
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === filesToLoad.length) {
          const filteredLoaded = loadedImages.filter(Boolean);
          setImageList((current) => {
            const combined = [...current, ...filteredLoaded].slice(0, MAX_GALLERY_IMAGES);
            setImageDetailsList((currentDetails) => {
              return combined.map((url) => {
                const found = currentDetails.find((d) => d.url === url);
                return found
                  ? { ...found, code: (found.code && found.code.trim() !== '') ? found.code.trim().toUpperCase() : generateSubCode() }
                  : { url, price: null, code: generateSubCode() };
              });
            });
            setFormData((f) => ({
              ...f,
              image: combined[0] || '',
              images: combined,
            }));
            return combined;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = (urlInput: string) => {
    if (!urlInput.trim()) return;
    const cleanUrl = urlInput.trim();
    setImageList((prev) => {
      if (prev.length >= MAX_GALLERY_IMAGES) {
        alert("Límite de 10 imágenes alcanzado para la galería de este producto.");
        return prev;
      }
      const updated = [...prev, cleanUrl].slice(0, MAX_GALLERY_IMAGES);
      setImageDetailsList((currentDetails) => {
        return updated.map((url) => {
          const found = currentDetails.find((d) => d.url === url);
          return found
            ? { ...found, code: (found.code && found.code.trim() !== '') ? found.code.trim().toUpperCase() : generateSubCode() }
            : { url, price: null, code: generateSubCode() };
        });
      });
      setFormData((f) => ({
        ...f,
        image: updated[0] || '',
        images: updated,
      }));
      return updated;
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setImageList((prev) => {
      if (index === 0 || index >= prev.length) return prev;
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      const reordered = [target, ...rest];
      setImageDetailsList((currentDetails) => {
        return reordered.map((url) => {
          const found = currentDetails.find((d) => d.url === url);
          return found ? found : { url, price: null, code: '' };
        });
      });
      setFormData((f) => ({
        ...f,
        image: reordered[0],
        images: reordered,
      }));
      return reordered;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImageList((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setImageDetailsList((currentDetails) => {
        return updated.map((url) => {
          const found = currentDetails.find((d) => d.url === url);
          return found ? found : { url, price: null, code: '' };
        });
      });
      setFormData((f) => ({
        ...f,
        image: updated[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        images: updated,
      }));
      return updated;
    });
  };

  const handlePresetSizes = (presetStr: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: presetStr,
    }));
  };

  const handleEnhanceWithAi = async () => {
    if (!formData.title && !formData.description) return;
    setAiLoading(true);

    try {
      const res = await fetch('/api/enrich-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          tone: selectedTone,
        }),
      });

      const data = await res.json();
      if (data.enhancedDescription) {
        setFormData((prev) => ({
          ...prev,
          description: data.enhancedDescription,
        }));
      }
    } catch {
      // Ignored
    } finally {
      setAiLoading(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Active size variants with custom prices
      const activeVariants = useCustomVariantPrices
        ? variantsList.filter((v) => v.size.trim().length > 0 && !isNaN(v.price))
        : [];

      const parsedSizes = activeVariants.length > 0
        ? activeVariants.map((v) => v.size.trim())
        : formData.sizes
        ? formData.sizes
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : [];

      const basePrice = activeVariants.length > 0
        ? Math.min(...activeVariants.map((v) => v.price))
        : Number(formData.price) || 0;

      const rawImages = imageList.length > 0
        ? imageList
        : [formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'];

      // Automatically upload Base64 images directly to Supabase Storage CDN
      const finalImages = await Promise.all(
        rawImages.map((img) =>
          img && img.startsWith('data:')
            ? uploadBase64ImageToSupabase(img, 'prod')
            : Promise.resolve(img)
        )
      );

      const finalImageDetails = await Promise.all(
        imageDetailsList.map(async (d) => ({
          ...d,
          url:
            d.url && d.url.startsWith('data:')
              ? await uploadBase64ImageToSupabase(d.url, 'prod')
              : d.url,
          code:
            d.code && d.code.trim() !== ''
              ? d.code.trim().toUpperCase()
              : generateSubCode(),
        }))
      );

      onSave({
        id: formData.id || 'prod_' + Date.now(),
        sku: formData.sku || generateProductSku(),
        title: formData.title || 'Producto',
        description: formData.description || '',
        image: finalImages[0],
        images: finalImages,
        imageDetails: finalImageDetails,
        price: basePrice,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        currency: formData.currency || '$',
        category: formData.category || 'General',
        brand: formData.brand || 'Mi Tienda',
        sizes: formData.sizes || undefined,
        availableSizes: parsedSizes.length > 0 ? parsedSizes : undefined,
        sizeVariants: activeVariants.length > 0 ? activeVariants : undefined,
        badge: formData.badge || '',
        inStock: formData.inStock !== false,
        sourceUrl: formData.sourceUrl,
      });

      onClose();
    } catch (err) {
      console.error('Error saving product images:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h2 className="font-display font-bold text-lg text-slate-900">
            {product ? 'Editar Producto' : 'Crear Producto Manual'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-medium p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Zapatillas Urban Minimalist"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Código Único *
              </label>
              <input
                type="text"
                required
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.trim().toUpperCase() })}
                placeholder="Ej: CH-4819"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-mono font-bold text-emerald-700"
              />
            </div>
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Moneda
              </label>
              <select
                value={formData.currency || '$'}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
              >
                <option value="$">$ (USD / MXN / COP)</option>
                <option value="€">€ (EUR)</option>
                <option value="S/.">S/. (PEN)</option>
                <option value="CLP">CLP ($)</option>
                <option value="ARS">ARS ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Precio Actual *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="29.99"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Precio Anterior (Opcional)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalPrice: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                placeholder="39.99"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          {/* Category, Brand, Badge */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoría
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ej: Calzado"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marca / Tienda
              </label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Ej: Nike"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Etiqueta / Badge
              </label>
              <select
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
              >
                <option value="">Sin Etiqueta</option>
                <option value="NUEVO">NUEVO</option>
                <option value="OFERTA">OFERTA</option>
                <option value="MÁS VENDIDO">MÁS VENDIDO</option>
                <option value="DESTACADO">DESTACADO</option>
                <option value="EXCLUSIVO">EXCLUSIVO</option>
              </select>
            </div>
          </div>

          {/* Tallas / Medidas y Precios por Talla */}
          <div className="bg-purple-50/50 border border-purple-200/80 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-purple-600" />
                <span>Tallas, Medidas y Precios por Talla</span>
              </label>

              {/* Toggle Custom Variant Pricing */}
              <button
                type="button"
                onClick={() => {
                  const nextState = !useCustomVariantPrices;
                  setUseCustomVariantPrices(nextState);
                  if (nextState && variantsList.length === 0) {
                    handleAutoGenerateVariantsFromSizes();
                  }
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  useCustomVariantPrices
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-white text-purple-800 border border-purple-300 hover:bg-purple-100/60'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>{useCustomVariantPrices ? '✓ Precios Diferentes por Talla' : '+ Asignar Precio por Talla'}</span>
              </button>
            </div>

            {/* Basic Sizes String */}
            {!useCustomVariantPrices && (
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className="text-slate-600 font-medium">Tallas disponibles (Mismo precio)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Plantillas:</span>
                    <button
                      type="button"
                      onClick={() => handlePresetSizes('S, M, L, XL')}
                      className="px-1.5 py-0.5 bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 rounded font-bold"
                    >
                      Ropa (S,M,L,XL)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetSizes('37, 38, 39, 40, 41, 42, 43')}
                      className="px-1.5 py-0.5 bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 rounded font-bold"
                    >
                      Calzado (37-43)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetSizes('Talla Única')}
                      className="px-1.5 py-0.5 bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 rounded font-bold"
                    >
                      Única
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.sizes || ''}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="Ej: S, M, L, XL  ó  38, 39, 40, 41, 42  ó  Única"
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>
            )}

            {/* Custom Prices Per Size Manager */}
            {useCustomVariantPrices && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-900">
                    Define cada talla con su precio específico:
                  </span>
                  {formData.sizes && variantsList.length === 0 && (
                    <button
                      type="button"
                      onClick={handleAutoGenerateVariantsFromSizes}
                      className="text-[11px] text-purple-700 font-bold hover:underline"
                    >
                      ⚡ Generar desde "{formData.sizes}"
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {variantsList.map((variant, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-white border border-purple-200 rounded-xl shadow-2xs"
                    >
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Talla / Nombre</label>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) => handleUpdateVariantRow(idx, 'size', e.target.value)}
                          placeholder="Ej: S, 38, 1 Litro..."
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none font-bold text-slate-900"
                        />
                      </div>

                      <div className="w-28">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Precio ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.price || ''}
                          onChange={(e) => handleUpdateVariantRow(idx, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="29.99"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none font-bold text-emerald-700"
                        />
                      </div>

                      <div className="w-28">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Antes ($) Opc</label>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.originalPrice || ''}
                          onChange={(e) => handleUpdateVariantRow(idx, 'originalPrice', e.target.value ? parseFloat(e.target.value) : null)}
                          placeholder="39.99"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none font-medium text-slate-400"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveVariantRow(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors shrink-0 mt-3"
                        title="Eliminar esta talla"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddVariantRow}
                  className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Otra Talla con Precio Especial</span>
                </button>
              </div>
            )}
          </div>

          {/* Multi-Image Gallery Manager */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Galería de Imágenes del Producto ({imageList.length}/{MAX_GALLERY_IMAGES})
              </label>
              <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>+ Subir Fotos (Teléfono/PC)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFilesUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* URL Add Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="urlAddInput"
                placeholder="O pega un enlace de imagen https:// y presiona agregar..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImageUrl(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('urlAddInput') as HTMLInputElement;
                  if (el && el.value) {
                    handleAddImageUrl(el.value);
                    el.value = '';
                  }
                }}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                Agregar URL
              </button>
            </div>

            {/* Gallery Thumbnails List */}
            {imageList.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                {imageList.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-square bg-white group ${
                      idx === 0 ? 'border-emerald-500 shadow-sm' : 'border-slate-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {imgUrl && imgUrl.trim() !== '' ? (
                      <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">Sin foto</div>
                    )}
                    
                    {/* Badge */}
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs">
                        Principal
                      </span>
                    )}

                    {/* Hover Controls */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="px-1.5 py-0.5 bg-emerald-500 text-white font-extrabold text-[9px] rounded hover:bg-emerald-600 transition-colors"
                        >
                          Principal
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="px-1.5 py-0.5 bg-rose-600 text-white font-extrabold text-[9px] rounded hover:bg-rose-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
                Aún no has agregado fotos. Sube imágenes desde tu teléfono o PC.
              </div>
            )}

            {/* Custom Prices and Codes for Images Section */}
            {imageList.length > 0 && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                  Precios y Sub-Códigos por Imagen (Opcional):
                </span>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Si dejas el precio vacío, se usará el precio base del producto. El sub-código ayudará a identificar la foto seleccionada en los pedidos de WhatsApp (ej: "ROJO", "AZUL", "MODELO A").
                </p>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {imageDetailsList.map((detail, idx) => {
                    return (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl shadow-3xs">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                          {detail.url && detail.url.trim() !== '' ? (
                            <img src={detail.url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No</div>
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-slate-600 w-12 truncate">
                          Foto #{idx + 1} {idx === 0 && <span className="text-emerald-600 block text-[9px]">(Principal)</span>}
                        </div>
                        <div className="flex-1 flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Sub-Código (Ej: CH-4812)"
                            value={detail.code || ''}
                            onChange={(e) => {
                              const val = e.target.value.toUpperCase();
                              setImageDetailsList(current =>
                                current.map((d, i) => i === idx ? { ...d, code: val } : d)
                              );
                            }}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500 font-mono font-bold text-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newCode = generateSubCode();
                              setImageDetailsList(current =>
                                current.map((d, i) => i === idx ? { ...d, code: newCode } : d)
                              );
                            }}
                            className="p-1 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-slate-100 transition-colors shrink-0"
                            title="Generar nuevo sub-código aleatorio"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="w-24">
                          <div className="relative">
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">$</span>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Precio"
                              value={detail.price === null || detail.price === undefined ? '' : detail.price}
                              onChange={(e) => {
                                const val = e.target.value === '' ? null : parseFloat(e.target.value);
                                setImageDetailsList(current =>
                                  current.map((d, i) => i === idx ? { ...d, price: val } : d)
                                );
                              }}
                              className="w-full pl-4 pr-1 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500 font-semibold text-emerald-700"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Description & Gemini AI Enhancer */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Descripción Comercial
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value as any)}
                  className="text-[11px] bg-slate-100 border border-slate-200 rounded-lg px-2 py-0.5 text-slate-700"
                >
                  <option value="whatsapp">📱 Estilo WhatsApp</option>
                  <option value="promotional">🔥 Promocional</option>
                  <option value="luxury">✨ Elegante / Lujo</option>
                </select>
                <button
                  type="button"
                  onClick={handleEnhanceWithAi}
                  disabled={aiLoading}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg transition-colors"
                >
                  {aiLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                  )}
                  <span>Mejorar con IA</span>
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Escribe los detalles y beneficios principales..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Guardar Producto
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
