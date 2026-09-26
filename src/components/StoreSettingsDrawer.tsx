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
} from 'lucide-react';
import { StoreSettings } from '../types/catalog';
import { compressImageBase64 } from '../utils/imageUtils';
import { redisClient } from '../lib/firestoreService';
import { getSupabaseConfig, isSupabaseConfigured } from '../lib/supabase';

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
  const [redisStatus, setRedisStatus] = useState<{ enabled: boolean; message: string } | null>(null);
  
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

  useEffect(() => {
    if (isOpen) {
      redisClient
        .ping()
        .then(() => {
          setRedisStatus({
            enabled: true,
            message: 'Upstash Redis está activo y reduciendo lecturas de Firestore.',
          });
        })
        .catch(() => {
          setRedisStatus({
            enabled: false,
            message: 'No se pudo conectar directamente con Upstash Redis.',
          });
        });
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

            {/* Supabase Configuration Section */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Conexión Supabase (PostgreSQL & CDN)</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${supabaseStatus?.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                  {supabaseStatus?.connected ? 'Conectado' : 'Opcional'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Conecta tu proyecto de Supabase para almacenar imágenes ilimitadas en CDN sin límites diarios de cuotas.
              </p>
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Project URL</label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Anon / Public API Key</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOi..."
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
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

            {/* Upstash Redis Cache Status Banner */}
            {redisStatus && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  redisStatus.enabled
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <Zap className={`w-4 h-4 shrink-0 mt-0.5 ${redisStatus.enabled ? 'text-emerald-600' : 'text-amber-600'}`} />
                <div>
                  <span className="font-bold block mb-0.5">
                    {redisStatus.enabled ? 'Aceleración de Caché Upstash Redis Activa' : 'Caché Upstash Redis Inactivo'}
                  </span>
                  <p className="text-[11px] leading-relaxed opacity-90">{redisStatus.message}</p>
                </div>
              </div>
            )}

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
