import React, { useState, useRef, useEffect } from 'react';
import {
  Link2,
  Sparkles,
  Loader2,
  AlertCircle,
  Copy,
  Layers,
  ArrowRight,
  HelpCircle,
  Camera,
  UploadCloud,
  Image as ImageIcon,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../types/catalog';
import { cropImageBase64, compressImageBase64 } from '../utils/imageUtils';

interface UrlExtractorBarProps {
  onProductExtracted: (product: Product) => void;
  onBatchExtracted?: (products: Product[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Robust URL extractor and validator helper
 */
export function extractAndValidateUrl(input: string): { isValid: boolean; cleanUrl: string; error?: string } {
  if (!input || !input.trim()) {
    return { isValid: false, cleanUrl: '', error: 'Por favor, pega un enlace de producto.' };
  }

  const trimmed = input.trim();

  // Handle pasted string containing surrounding text (e.g. "Mira este producto https://temu.com/goods...")
  const urlRegex = /(https?:\/\/[^\s]+|[\w-]+\.[\w-]+\.[^\s]+)/gi;
  const matches = trimmed.match(urlRegex);

  let candidate = matches && matches.length > 0 ? matches[0] : trimmed;
  // Clean trailing punctuation
  candidate = candidate.replace(/[.,;)]+$/, '');

  if (!candidate.startsWith('http://') && !candidate.startsWith('https://')) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return {
        isValid: false,
        cleanUrl: candidate,
        error: 'El enlace ingresado no parece tener un dominio web válido (ejemplo: tienda.com).',
      };
    }
    return { isValid: true, cleanUrl: parsed.href };
  } catch {
    return {
      isValid: false,
      cleanUrl: candidate,
      error: 'La URL ingresada no es válida. Revisa que tenga un formato correcto (ej: https://tienda.com/producto).',
    };
  }
}

export const UrlExtractorBar: React.FC<UrlExtractorBarProps> = ({
  onProductExtracted,
  onBatchExtracted,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'screenshot' | 'bulk'>('single');

  // Single URL state
  const [url, setUrl] = useState('');

  // Bulk state
  const [bulkUrls, setBulkUrls] = useState('');

  // Screenshot state
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common UI state
  const [loading, setLoading] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Global paste listener for pasting images anywhere in modal
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (!isOpen) return;
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          const reader = new FileReader();
          reader.onload = async (ev) => {
            if (ev.target?.result) {
              const compressed = await compressImageBase64(ev.target.result as string);
              setScreenshotBase64(compressed);
              setScreenshotName('Captura_Pegada.png');
              setActiveTab('screenshot');
              setError(null);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle paste from clipboard button
  const handlePasteFromClipboard = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const reader = new FileReader();
          reader.onload = async (e) => {
            if (e.target?.result) {
              const compressed = await compressImageBase64(e.target.result as string);
              setScreenshotBase64(compressed);
              setScreenshotName('Captura_Portapapeles.png');
              setActiveTab('screenshot');
              setError(null);
            }
          };
          reader.readAsDataURL(blob);
          return;
        }
      }

      // Fallback: Clipboard contains text
      const text = await navigator.clipboard.readText();
      if (text) {
        if (activeTab === 'bulk') {
          setBulkUrls((prev) => (prev ? `${prev}\n${text}` : text));
        } else {
          setUrl(text);
        }
        setError(null);
      }
    } catch {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
          setError(null);
        }
      } catch {}
    }
  };

  // Handle Image File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const compressed = await compressImageBase64(event.target.result as string);
        setScreenshotBase64(compressed);
        setScreenshotName(file.name);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop image handling
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const compressed = await compressImageBase64(event.target.result as string);
          setScreenshotBase64(compressed);
          setScreenshotName(file.name);
          setActiveTab('screenshot');
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleUrls = [
    { label: 'Zapatillas (Temu / Shein)', url: 'https://www.temu.com/goods.html?goods_id=60109951234567' },
    { label: 'Reloj (MercadoLibre)', url: 'https://www.mercadolibre.com.mx/reloj-casio-edifice' },
    { label: 'Bolso (Amazon)', url: 'https://www.amazon.es/dp/B08N5WRWNW' },
  ];

  const handleExtractSingle = async (targetUrl?: string) => {
    const rawInput = targetUrl || url;
    const validation = extractAndValidateUrl(rawInput);

    if (!validation.isValid) {
      setError(validation.error || 'URL inválida.');
      return;
    }

    setLoading(true);
    setError(null);
    setStepMessage('Conectando a la tienda y analizando HTML...');

    try {
      const stepTimer1 = setTimeout(() => {
        setStepMessage('Extrayendo imagen HD original, título y precio...');
      }, 600);

      const stepTimer2 = setTimeout(() => {
        setStepMessage('Optimizando texto comercial en español...');
      }, 1400);

      const res = await fetch('/api/extract-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: validation.cleanUrl }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error('La respuesta del servidor no fue válida. Por favor, intenta de nuevo.');
      }

      if (!res.ok || !data.success || !data.product) {
        throw new Error(
          data.error ||
            'No se pudo extraer la información del producto de este sitio. Puedes agregar el producto manualmente.'
        );
      }

      onProductExtracted(data.product);
      setUrl('');
      onClose();
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        setError(
          'Error de red o conexión al servidor. Revisa tu conexión a internet o intenta ingresar los datos manualmente.'
        );
      } else {
        setError(
          err.message ||
            'No se pudo extraer automáticamente de este sitio. Puedes intentar con otra URL o ingresar los datos manualmente.'
        );
      }
    } finally {
      setLoading(false);
      setStepMessage('');
    }
  };

  const handleAnalyzeScreenshot = async () => {
    if (!screenshotBase64) {
      setError('Por favor selecciona o pega una captura de pantalla.');
      return;
    }

    setLoading(true);
    setError(null);
    setStepMessage('Enviando captura a la IA Multimodal (Gemini Vision)...');

    try {
      const stepTimer1 = setTimeout(() => {
        setStepMessage('Analizando texto, título, precio e imagen visible...');
      }, 800);

      const stepTimer2 = setTimeout(() => {
        setStepMessage('Organizando producto y redactando descripción comercial...');
      }, 1800);

      const res = await fetch('/api/extract-from-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: screenshotBase64 }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();

      if (!res.ok || !data.success || !data.product) {
        throw new Error(data.error || 'No se pudo analizar la captura de pantalla.');
      }

      let finalProduct = data.product;

      // Crop image to isolate product photo if bounding box is present
      if (finalProduct.productBoundingBox && Array.isArray(finalProduct.productBoundingBox)) {
        try {
          const croppedBase64 = await cropImageBase64(
            finalProduct.image,
            finalProduct.productBoundingBox
          );
          finalProduct = { ...finalProduct, image: croppedBase64 };
        } catch {}
      }

      onProductExtracted(finalProduct);
      setScreenshotBase64(null);
      setScreenshotName('');
      onClose();
    } catch (err: any) {
      setError(
        err.message ||
          'Ocurrió un error al analizar la captura. Asegúrate de que la imagen contenga texto claro del producto.'
      );
    } finally {
      setLoading(false);
      setStepMessage('');
    }
  };

  const handleExtractBatch = async () => {
    const lines = bulkUrls
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setError('Ingresa al menos una URL por línea.');
      return;
    }

    const validatedUrls: string[] = [];
    for (const line of lines) {
      const val = extractAndValidateUrl(line);
      if (val.isValid) {
        validatedUrls.push(val.cleanUrl);
      }
    }

    if (validatedUrls.length === 0) {
      setError('Ninguna de las líneas ingresadas parece ser una URL válida.');
      return;
    }

    setLoading(true);
    setError(null);
    setStepMessage(`Procesando lote de ${validatedUrls.length} productos...`);

    try {
      const res = await fetch('/api/batch-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: validatedUrls }),
      });

      const data = await res.json();

      if (data.success && data.products && data.products.length > 0) {
        if (onBatchExtracted) {
          onBatchExtracted(data.products);
        } else {
          data.products.forEach((p: Product) => onProductExtracted(p));
        }
        setBulkUrls('');
        onClose();
      } else {
        throw new Error('No se pudieron extraer productos del lote.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar lote.');
    } finally {
      setLoading(false);
      setStepMessage('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 leading-snug">
                Agregar Producto con IA
              </h2>
              <p className="text-xs text-slate-500">
                Pega una URL, sube una Captura de Pantalla o procesa varias tiendas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-medium p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Toggle Mode Tabs */}
        <div className="flex items-center gap-1.5 mb-5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('single');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'single' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Por URL</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('screenshot');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'screenshot' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-purple-600" />
            <span>Por Captura de Pantalla</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bulk');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bulk' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Lote de URLs</span>
          </button>
        </div>

        {/* TAB 1: SINGLE URL */}
        {activeTab === 'single' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Pega el enlace https://..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleExtractSingle()}
                disabled={loading}
                className="w-full pr-28 pl-4 py-3 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Pegar</span>
              </button>
            </div>

            {/* Quick Test Samples */}
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1.5 uppercase tracking-wider">
                O prueba con una tienda de ejemplo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleUrls.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrl(s.url);
                      handleExtractSingle(s.url);
                    }}
                    disabled={loading}
                    className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-lg border border-slate-200/80 transition-colors flex items-center gap-1"
                  >
                    <span>{s.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCREENSHOT AI ANALYSIS */}
        {activeTab === 'screenshot' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!screenshotBase64 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/50 rounded-2xl p-8 text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900 mb-1">
                  Arrastra tu captura de pantalla aquí o haz clic para buscar
                </h3>
                <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                  Sube cualquier captura de la publicación, tienda o catálogo. La IA detectará título, precio y foto.
                </p>

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePasteFromClipboard();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-purple-600" />
                    <span>Pegar desde Portapapeles (Ctrl+V)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden p-3 border border-slate-800 flex items-center gap-4">
                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 relative">
                  <img
                    src={screenshotBase64}
                    alt="Captura cargada"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 text-white">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Captura lista para análisis</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono truncate mb-2">
                    {screenshotName || 'captura_producto.png'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Gemini Vision extraerá automáticamente el nombre del artículo, precio, descripción e imagen.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setScreenshotBase64(null);
                    setScreenshotName('');
                  }}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors shrink-0"
                  title="Eliminar captura"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BULK URLS */}
        {activeTab === 'bulk' && (
          <div className="space-y-2">
            <textarea
              rows={4}
              placeholder="Pega varias URLs (una por línea):&#10;https://tienda.com/producto-1&#10;https://tienda.com/producto-2&#10;https://tienda.com/producto-3"
              value={bulkUrls}
              onChange={(e) => {
                setBulkUrls(e.target.value);
                setError(null);
              }}
              disabled={loading}
              className="w-full p-3 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Soporta hasta 5 URLs en simultáneo. Se extraerán automáticamente fotos reales HD, títulos y precios.
            </p>
          </div>
        )}

        {/* Loading Progress State */}
        {loading && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-900">{stepMessage}</p>
              <p className="text-[11px] text-emerald-700">
                Procesando datos con Inteligencia Artificial Multimodal...
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 leading-snug">
              <span className="font-semibold block mb-0.5">Atención:</span>
              {error}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>También puedes ingresar productos manualmente</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              Cancelar
            </button>

            {activeTab === 'single' && (
              <button
                type="button"
                onClick={() => handleExtractSingle()}
                disabled={loading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extrayendo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extraer de URL</span>
                  </>
                )}
              </button>
            )}

            {activeTab === 'screenshot' && (
              <button
                type="button"
                onClick={handleAnalyzeScreenshot}
                disabled={loading || !screenshotBase64}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analizando Captura...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Analizar Captura con IA</span>
                  </>
                )}
              </button>
            )}

            {activeTab === 'bulk' && (
              <button
                type="button"
                onClick={handleExtractBatch}
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Procesando Lote...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Extraer Lote</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
