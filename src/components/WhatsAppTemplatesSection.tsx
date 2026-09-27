import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Check,
  RotateCcw,
  Copy,
  Info,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { StoreSettings } from '../types/catalog';
import {
  WHATSAPP_CART_PRESETS,
  WHATSAPP_SINGLE_PRESETS,
  WhatsAppTemplatePreset,
  WhatsAppSingleProductPreset,
} from '../utils/whatsappTemplates';

interface WhatsAppTemplatesSectionProps {
  formData: StoreSettings;
  onChange: (updated: Partial<StoreSettings>) => void;
}

export const WhatsAppTemplatesSection: React.FC<WhatsAppTemplatesSectionProps> = ({
  formData,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<'cart' | 'single'>('cart');
  const [copiedPreview, setCopiedPreview] = useState(false);

  // Current Cart Template
  const activeCartTemplateId = formData.whatsappTemplateId || 'standard';
  const customCartText = formData.whatsappCustomCartTemplate || '';

  // Current Single Product Template
  const activeSingleTemplateId = formData.whatsappSingleTemplateId || 'standard';
  const customSingleText = formData.whatsappCustomSingleTemplate || '';

  // Get raw text to display in editor or preview
  const getRawCartTemplate = (): string => {
    if (activeCartTemplateId === 'custom') {
      return customCartText || WHATSAPP_CART_PRESETS[0].template;
    }
    const found = WHATSAPP_CART_PRESETS.find((p) => p.id === activeCartTemplateId);
    return found ? found.template : WHATSAPP_CART_PRESETS[0].template;
  };

  const getRawSingleTemplate = (): string => {
    if (activeSingleTemplateId === 'custom') {
      return customSingleText || WHATSAPP_SINGLE_PRESETS[0].template;
    }
    const found = WHATSAPP_SINGLE_PRESETS.find((p) => p.id === activeSingleTemplateId);
    return found ? found.template : WHATSAPP_SINGLE_PRESETS[0].template;
  };

  // Render sample preview with sample store data
  const renderCartSample = (template: string): string => {
    const store = formData.storeName || 'Mi Tienda';
    const curr = formData.currencySymbol || '$';
    const sampleProducts = `1. *Zapatillas Urban Minimalist* [Cód: CH-4819] 📏 (Talla: *42*) 📸 [Sub-Cód: *BLANCO*]\n   Cantidad: 1x | Precio: ${curr}49.99\n2. *Camiseta Oversized Cotton* [Cód: CH-1022] 📏 (Talla: *L*)\n   Cantidad: 2x | Precio: ${curr}39.98`;
    const sampleTotal = `${curr}89.97`;
    const sampleCustomer = `👤 *Nombre del Cliente:* Carlos Mendoza`;
    const sampleNotes = `📝 *Notas / Dirección:* Av. Principal #142, Apto 4B (Entrega en la tarde)`;

    return template
      .replace(/{storeName}/g, store)
      .replace(/{products}/g, sampleProducts)
      .replace(/{total}/g, sampleTotal)
      .replace(/{itemCount}/g, '3')
      .replace(/{customerName}/g, sampleCustomer)
      .replace(/{notes}/g, sampleNotes)
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const renderSingleSample = (template: string): string => {
    const store = formData.storeName || 'Mi Tienda';
    const curr = formData.currencySymbol || '$';
    return template
      .replace(/{storeName}/g, store)
      .replace(/{title}/g, 'Zapatillas Urban Minimalist')
      .replace(/{sku}/g, 'CH-4819')
      .replace(/{subCode}/g, '📸 *Sub-Código:* BLANCO\n')
      .replace(/{price}/g, `${curr}49.99`)
      .replace(/{size}/g, '📏 *Talla Elegida:* 42')
      .replace(/{link}/g, '🔗 *Enlace:* https://tutienda.com/p/CH-4819')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const currentPreviewText =
    activeTab === 'cart'
      ? renderCartSample(getRawCartTemplate())
      : renderSingleSample(getRawSingleTemplate());

  const handleSelectCartPreset = (preset: WhatsAppTemplatePreset) => {
    onChange({
      whatsappTemplateId: preset.id,
      whatsappCustomCartTemplate: preset.template,
    });
  };

  const handleSelectSinglePreset = (preset: WhatsAppSingleProductPreset) => {
    onChange({
      whatsappSingleTemplateId: preset.id,
      whatsappCustomSingleTemplate: preset.template,
    });
  };

  const handleInsertVariable = (variableTag: string) => {
    const textareaId = activeTab === 'cart' ? 'cartTemplateEditor' : 'singleTemplateEditor';
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    const newValue = currentValue.substring(0, start) + variableTag + currentValue.substring(end);

    if (activeTab === 'cart') {
      onChange({
        whatsappTemplateId: 'custom',
        whatsappCustomCartTemplate: newValue,
      });
    } else {
      onChange({
        whatsappSingleTemplateId: 'custom',
        whatsappCustomSingleTemplate: newValue,
      });
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variableTag.length, start + variableTag.length);
    }, 50);
  };

  const handleCopyPreview = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentPreviewText).then(() => {
        setCopiedPreview(true);
        setTimeout(() => setCopiedPreview(false), 2000);
      });
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-2xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Plantillas de Mensajes WhatsApp</h3>
            <p className="text-[10px] text-slate-500">Personaliza el texto de los pedidos y consultas</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Vendedor</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white border border-emerald-200/70 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('cart')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'cart'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Pedidos Carrito ({WHATSAPP_CART_PRESETS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('single')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'single'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Consulta Producto ({WHATSAPP_SINGLE_PRESETS.length})</span>
        </button>
      </div>

      {/* TAB 1: CART ORDER TEMPLATES */}
      {activeTab === 'cart' && (
        <div className="space-y-3">
          <label className="block text-[11px] font-bold text-slate-700">
            Selecciona una Plantilla Predeterminada:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {WHATSAPP_CART_PRESETS.map((preset) => {
              const isSelected = activeCartTemplateId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectCartPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{preset.icon}</span>
                      <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                    </div>
                    {isSelected ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {preset.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-snug">
                    {preset.description}
                  </p>
                </button>
              );
            })}

            {/* Custom Option Button */}
            <button
              type="button"
              onClick={() => {
                onChange({
                  whatsappTemplateId: 'custom',
                  whatsappCustomCartTemplate: getRawCartTemplate(),
                });
              }}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer sm:col-span-2 ${
                activeCartTemplateId === 'custom'
                  ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">✍️</span>
                  <span className="text-xs font-bold text-slate-900">Personalizado / Modo Libre</span>
                </div>
                {activeCartTemplateId === 'custom' && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                Escribe tu propio texto o ajusta el saludo, despedida y emojis con las etiquetas dinámicas.
              </p>
            </button>
          </div>

          {/* Editor Area when in custom mode */}
          {activeCartTemplateId === 'custom' && (
            <div className="space-y-2 pt-2 border-t border-emerald-200/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">Editor de Plantilla:</span>
                <button
                  type="button"
                  onClick={() => handleSelectCartPreset(WHATSAPP_CART_PRESETS[0])}
                  className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restablecer a Estándar</span>
                </button>
              </div>

              {/* Dynamic Tag Pills */}
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] text-slate-400 font-medium">Insertar variable:</span>
                {[
                  { tag: '{storeName}', label: 'Tienda' },
                  { tag: '{products}', label: 'Lista Productos' },
                  { tag: '{total}', label: 'Total $' },
                  { tag: '{customerName}', label: 'Nombre Cliente' },
                  { tag: '{notes}', label: 'Notas / Dirección' },
                  { tag: '{itemCount}', label: 'Cant. Ítems' },
                ].map((v) => (
                  <button
                    key={v.tag}
                    type="button"
                    onClick={() => handleInsertVariable(v.tag)}
                    className="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-md text-[10px] font-mono font-bold transition-colors cursor-pointer"
                    title={`Insertar ${v.tag}`}
                  >
                    +{v.label}
                  </button>
                ))}
              </div>

              <textarea
                id="cartTemplateEditor"
                rows={6}
                value={customCartText || getRawCartTemplate()}
                onChange={(e) => {
                  onChange({
                    whatsappTemplateId: 'custom',
                    whatsappCustomCartTemplate: e.target.value,
                  });
                }}
                className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-200 font-mono text-slate-800"
                placeholder="Escribe tu plantilla aquí..."
              />
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SINGLE PRODUCT TEMPLATES */}
      {activeTab === 'single' && (
        <div className="space-y-3">
          <label className="block text-[11px] font-bold text-slate-700">
            Plantilla para Ficha de Producto Individual:
          </label>

          <div className="grid grid-cols-1 gap-2">
            {WHATSAPP_SINGLE_PRESETS.map((preset) => {
              const isSelected = activeSingleTemplateId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectSinglePreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{preset.icon}</span>
                      <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                    </div>
                    {isSelected ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {preset.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    {preset.description}
                  </p>
                </button>
              );
            })}

            {/* Custom Single Option */}
            <button
              type="button"
              onClick={() => {
                onChange({
                  whatsappSingleTemplateId: 'custom',
                  whatsappCustomSingleTemplate: getRawSingleTemplate(),
                });
              }}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                activeSingleTemplateId === 'custom'
                  ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">✍️</span>
                  <span className="text-xs font-bold text-slate-900">Personalizado</span>
                </div>
                {activeSingleTemplateId === 'custom' && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                Escribe tu propio mensaje para consultas de productos individuales.
              </p>
            </button>
          </div>

          {/* Editor Area for Single Product */}
          {activeSingleTemplateId === 'custom' && (
            <div className="space-y-2 pt-2 border-t border-emerald-200/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">Editor de Plantilla:</span>
                <button
                  type="button"
                  onClick={() => handleSelectSinglePreset(WHATSAPP_SINGLE_PRESETS[0])}
                  className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restablecer</span>
                </button>
              </div>

              {/* Dynamic Tag Pills */}
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] text-slate-400 font-medium">Insertar variable:</span>
                {[
                  { tag: '{storeName}', label: 'Tienda' },
                  { tag: '{title}', label: 'Título' },
                  { tag: '{sku}', label: 'Código' },
                  { tag: '{price}', label: 'Precio' },
                  { tag: '{subCode}', label: 'Sub-Cód' },
                  { tag: '{size}', label: 'Talla' },
                  { tag: '{link}', label: 'Enlace' },
                ].map((v) => (
                  <button
                    key={v.tag}
                    type="button"
                    onClick={() => handleInsertVariable(v.tag)}
                    className="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-md text-[10px] font-mono font-bold transition-colors cursor-pointer"
                    title={`Insertar ${v.tag}`}
                  >
                    +{v.label}
                  </button>
                ))}
              </div>

              <textarea
                id="singleTemplateEditor"
                rows={5}
                value={customSingleText || getRawSingleTemplate()}
                onChange={(e) => {
                  onChange({
                    whatsappSingleTemplateId: 'custom',
                    whatsappCustomSingleTemplate: e.target.value,
                  });
                }}
                className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-200 font-mono text-slate-800"
                placeholder="Escribe tu plantilla aquí..."
              />
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Message Live Preview Bubble */}
      <div className="pt-2 border-t border-emerald-200/60 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <span>📱 Vista Previa en Vivo (WhatsApp):</span>
          </span>
          <button
            type="button"
            onClick={handleCopyPreview}
            className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-md border border-emerald-200"
          >
            {copiedPreview ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copiar Texto</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3 bg-[#e5ddd5] dark:bg-slate-900 rounded-2xl border border-slate-300/80 shadow-inner">
          <div className="max-w-xs ml-auto bg-[#dcf8c6] dark:bg-emerald-950 text-slate-900 dark:text-slate-100 p-3 rounded-2xl rounded-tr-none shadow-xs text-[11px] leading-relaxed relative whitespace-pre-wrap font-sans border border-emerald-200/50">
            {currentPreviewText}
            <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-500">
              <span>12:00 PM</span>
              <span className="text-emerald-700 font-bold">✓✓</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Cuando tus clientes hagan clic en comprar, este será el mensaje que se abrirá en su WhatsApp.</span>
        </p>
      </div>
    </div>
  );
};
