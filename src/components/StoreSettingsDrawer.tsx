import React, { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  Phone,
  Palette,
  LayoutGrid,
  Image as ImageIcon,
  X,
  Upload,
  Zap,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  RotateCcw,
  Moon,
  Sun,
} from 'lucide-react';
import { StoreSettings } from '../types/catalog';
import { compressImageBase64 } from '../utils/imageUtils';
import {
  getSupabaseConfig,
  isSupabaseConfigured,
  uploadBase64ImageToSupabase,
} from '../lib/supabase';
import { clearAllStoredItems } from '../lib/indexedDbStorage';
import { WhatsAppTemplatesSection } from './WhatsAppTemplatesSection';

interface StoreSettingsDrawerProps {
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: StoreSettings) => void;
  onHardReset?: () => Promise<void> | void;
}

export const StoreSettingsDrawer: React.FC<StoreSettingsDrawerProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
  onHardReset,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isResetting, setIsResetting] = useState(false);
  
  // Supabase Configuration State
  const initialSupabase = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(initialSupabase.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(initialSupabase.key);
  const [supabaseStatus, setSupabaseStatus] = useState<{ connected: boolean; message: string } | null>(null);
  const [isSavingSupabase, setIsSavingSupabase] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setSupabaseUrlInput(cfg.url);
      setSupabaseKeyInput(cfg.key);
      if (cfg.url && cfg.key) {
        setSupabaseStatus({
          connected: true,
          message: 'Supabase PostgreSQL y Almacenamiento CDN configurados.',
        });
      }
    }
  }, [isOpen]);

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
          if (isSupabaseConfigured) {
            uploadBase64ImageToSupabase(compressed, 'branding_logo')
              .then((cdnUrl: string) => {
                if (cdnUrl && cdnUrl.startsWith('http')) {
                  setFormData((prev) => ({ ...prev, storeLogo: cdnUrl }));
                }
              })
              .catch(() => {});
          }
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
          if (isSupabaseConfigured) {
            uploadBase64ImageToSupabase(compressed, 'branding_cover')
              .then((cdnUrl: string) => {
                if (cdnUrl && cdnUrl.startsWith('http')) {
                  setFormData((prev) => ({ ...prev, coverImage: cdnUrl }));
                }
              })
              .catch(() => {});
          }
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
      <div className="bg-white dark:bg-slate-900 max-w-md w-full h-full shadow-2xl p-6 overflow-y-auto border-l border-slate-100 dark:border-slate-800 animate-in slide-in-from-right duration-250 flex flex-col justify-between">
        <div>
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Personalizar Tienda
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="settings-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Store Name & Tagline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre de la Tienda
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Slogan / Subtítulo
              </label>
              <input
                type="text"
                value={formData.storeTagline}
                onChange={(e) => setFormData({ ...formData, storeTagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500"
              />
            </div>

            {/* WhatsApp Contact for Orders */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Número de WhatsApp (con código de país)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+584141234567"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 font-mono"
                />
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Los clientes enviarán los pedidos directamente a este WhatsApp.
              </p>
            </div>

            {/* WhatsApp Templates Configuration Section */}
            <WhatsAppTemplatesSection
              formData={formData}
              onChange={(updated) => setFormData((prev) => ({ ...prev, ...updated }))}
            />

            {/* Instagram */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Usuario de Instagram
              </label>
              <input
                type="text"
                placeholder="@tu.tienda"
                value={formData.instagramHandle}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500"
              />
            </div>

            {/* Cart Announcement / Aviso para Carrito */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Aviso / Anuncio para el Carrito (Opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Ej: 🚚 ¡Envío gratis por compras mayores a $50! O: Hacemos entregas a domicilio de lunes a viernes."
                value={formData.cartAnnouncement || ''}
                onChange={(e) => setFormData({ ...formData, cartAnnouncement: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Este anuncio saldrá destacado arriba de la confirmación de compra en el carrito del cliente.
              </p>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Símbolo de Moneda
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none font-mono focus:border-emerald-500"
              />
            </div>

            {/* Color Theme */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Color Principal de Marca
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, themeColor: c.id })}
                    className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      formData.themeColor === c.id
                        ? 'border-slate-900 dark:border-emerald-500 bg-slate-50 dark:bg-slate-800 shadow-2xs ring-2 ring-slate-900/10 dark:ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-750 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${c.class}`} />
                    <span className="truncate text-slate-800 dark:text-slate-200">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Theme Mode (Claro / Modo Dark Negro) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Aspecto Visual (Tema de la Tienda)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, themeMode: 'light' })}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    formData.themeMode !== 'dark'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Modo Claro</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Luminoso</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, themeMode: 'dark' })}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    formData.themeMode === 'dark'
                      ? 'border-emerald-500 bg-slate-950 text-white ring-2 ring-emerald-500/30 shadow-md'
                      : 'border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 border border-slate-800">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-bold ${formData.themeMode === 'dark' ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>Modo Dark Negro</div>
                    <div className={`text-[10px] ${formData.themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'} truncate`}>Obsidiana Puro</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Catalog Layout Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Diseño Predeterminado del Catálogo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'grid-3', label: '3 Columnas' },
                  { id: 'grid-2', label: '2 Columnas' },
                  { id: 'grid-4', label: '4 Columnas' },
                  { id: 'list', label: 'Lista' },
                  { id: 'gallery', label: '🖼️ Galería Minimalista' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, catalogLayout: item.id as StoreSettings['catalogLayout'] })}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      formData.catalogLayout === item.id
                        ? 'border-slate-900 dark:border-emerald-500 bg-slate-900 dark:bg-emerald-600 text-white shadow-2xs'
                        : 'border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/60'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo and Cover Image */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logo de la Tienda
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={formData.storeLogo}
                    onChange={(e) => setFormData({ ...formData, storeLogo: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                  <label className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Banner Portada del Catálogo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                  <label className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Supabase Configuration Section */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Conexión Supabase (PostgreSQL & CDN)</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${supabaseStatus?.connected ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {supabaseStatus?.connected ? 'Conectado' : 'Opcional'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Conecta tu proyecto de Supabase para almacenar imágenes ilimitadas en CDN sin límites diarios de cuotas.
              </p>
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Project URL</label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Anon / Public API Key</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOi..."
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {supabaseStatus?.message}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const cleanUrl = supabaseUrlInput.trim();
                      const cleanKey = supabaseKeyInput.trim();
                      if (!cleanUrl || !cleanKey) {
                        localStorage.removeItem('catalogcraft_supabase_url');
                        localStorage.removeItem('catalogcraft_supabase_key');
                        setSupabaseStatus({ connected: false, message: 'Credenciales borradas.' });
                        return;
                      }
                      setIsSavingSupabase(true);
                      localStorage.setItem('catalogcraft_supabase_url', cleanUrl);
                      localStorage.setItem('catalogcraft_supabase_key', cleanKey);
                      setSupabaseStatus({ connected: true, message: '¡Conectado! Recargando...' });
                      setTimeout(() => window.location.reload(), 800);
                    }}
                    disabled={isSavingSupabase}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isSavingSupabase ? 'Guardando...' : 'Guardar y Conectar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Hard Reset / Limpieza Profunda de Caché */}
            <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-xs font-bold text-rose-950 dark:text-rose-300">Restablecimiento Forzado (Hard Reset)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Antifantasmas
                </span>
              </div>
              <p className="text-[11px] text-rose-700/90 dark:text-rose-300/90 leading-relaxed">
                ¿Ves productos eliminados que reaparecen o cambios que no se reflejan? Esta acción borra todo el almacenamiento local (<code className="bg-rose-100/80 dark:bg-rose-900/40 px-1 py-0.5 rounded font-mono text-[10px]">localStorage</code>, <code className="bg-rose-100/80 dark:bg-rose-900/40 px-1 py-0.5 rounded font-mono text-[10px]">catalogcraft_deleted_pids</code> e IndexedDB) y vuelve a descargar el estado limpio y fresco directamente desde la nube de Firestore / Supabase.
              </p>
              <button
                type="button"
                onClick={async () => {
                  const confirmed = window.confirm(
                    '¿Estás seguro de ejecutar un Hard Reset?\n\nEsto limpiará todo el caché residual del navegador (localStorage, IndexedDB y productos borrados) y descargará el catálogo limpio y actualizado directamente desde la nube.'
                  );
                  if (!confirmed) return;

                  setIsResetting(true);
                  try {
                    if (onHardReset) {
                      await onHardReset();
                    } else {
                      localStorage.clear();
                      await clearAllStoredItems();
                      window.location.reload();
                    }
                  } catch (err) {
                    console.error('Error during hard reset:', err);
                    window.location.reload();
                  } finally {
                    setIsResetting(false);
                  }
                }}
                disabled={isResetting}
                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? 'Limpiando y Sincronizando...' : 'Ejecutar Hard Reset y Recargar'}</span>
              </button>
            </div>

          </form>

        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="settings-form"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  );
};
