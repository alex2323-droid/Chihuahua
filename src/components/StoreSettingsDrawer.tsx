import React, { useState } from 'react';
import {
  Settings,
  Store,
  Phone,
  Palette,
  LayoutGrid,
  Image as ImageIcon,
  X,
  Upload,
} from 'lucide-react';
import { StoreSettings } from '../types/catalog';
import { compressImageBase64 } from '../utils/imageUtils';

interface StoreSettingsDrawerProps {
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: StoreSettings) => void;
}

export const StoreSettingsDrawer: React.FC<StoreSettingsDrawerProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });

  if (!isOpen) return null;

  const colorOptions: { id: StoreSettings['themeColor']; label: string; class: string }[] = [
    { id: 'emerald', label: 'Esmeralda', class: 'bg-emerald-600' },
    { id: 'amber', label: 'Ámbar Cálido', class: 'bg-amber-600' },
    { id: 'cobalt', label: 'Azul Cobalto', class: 'bg-blue-600' },
    { id: 'rose', label: 'Rosa Boutique', class: 'bg-rose-600' },
    { id: 'dark', label: 'Negro Elegante', class: 'bg-slate-900' },
    { id: 'violet', label: 'Violeta Royal', class: 'bg-violet-600' },
  ];

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (reader.result) {
          const compressed = await compressImageBase64(reader.result as string, 800, 0.85);
          setFormData((prev) => ({ ...prev, storeLogo: compressed }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (reader.result) {
          const compressed = await compressImageBase64(reader.result as string, 1200, 0.85);
          setFormData((prev) => ({ ...prev, coverImage: compressed }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white max-w-md w-full h-full shadow-2xl p-6 overflow-y-auto border-l border-slate-100 animate-in slide-in-from-right duration-250 flex flex-col justify-between">
        <div>
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <h2 className="font-display font-bold text-lg text-slate-900">
                Personalizar Tienda
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="settings-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Store Name & Tagline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre de la Tienda
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Slogan / Subtítulo
              </label>
              <input
                type="text"
                value={formData.storeTagline}
                onChange={(e) => setFormData({ ...formData, storeTagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
              />
            </div>

            {/* WhatsApp Contact for Orders */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de WhatsApp (con código de país)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+525512345678"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500 font-mono"
                />
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Los clientes enviarán los pedidos directamente a este WhatsApp.
              </p>
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Usuario de Instagram
              </label>
              <input
                type="text"
                placeholder="@tu.tienda"
                value={formData.instagramHandle}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
              />
            </div>

            {/* Cart Announcement / Aviso para Carrito */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aviso / Anuncio para el Carrito (Opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Ej: 🚚 ¡Envío gratis por compras mayores a $50! O: Hacemos entregas a domicilio de lunes a viernes."
                value={formData.cartAnnouncement || ''}
                onChange={(e) => setFormData({ ...formData, cartAnnouncement: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Este anuncio saldrá destacado arriba de la confirmación de compra en el carrito del cliente.
              </p>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Símbolo de Moneda
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none font-mono"
              />
            </div>

            {/* Color Theme */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Color Principal de Marca
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, themeColor: c.id })}
                    className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                      formData.themeColor === c.id
                        ? 'border-slate-900 bg-slate-50 shadow-2xs ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${c.class}`} />
                    <span className="truncate text-slate-800">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo and Cover Image */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Logo de la Tienda
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={formData.storeLogo}
                    onChange={(e) => setFormData({ ...formData, storeLogo: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                  />
                  <label className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banner Portada del Catálogo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                  />
                  <label className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

          </form>

        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="settings-form"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  );
};
