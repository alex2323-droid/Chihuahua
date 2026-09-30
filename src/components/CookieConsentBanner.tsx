import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, Settings2, Lock } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenLegal: (tab: 'cookies' | 'privacy') => void;
  isOpenPreferencesExternal?: boolean;
  onClosePreferencesExternal?: () => void;
}

export interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'catalogcraft_cookie_consent_v1';

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenLegal,
  isOpenPreferencesExternal = false,
  onClosePreferencesExternal,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Show banner after short delay for optimal UX
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      } else {
        const parsed = JSON.parse(saved) as CookiePreferences;
        setAnalyticsAllowed(parsed.analytics ?? true);
        setMarketingAllowed(parsed.marketing ?? false);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (isOpenPreferencesExternal) {
      setIsPreferencesOpen(true);
    }
  }, [isOpenPreferencesExternal]);

  const saveConsent = (analytics: boolean, marketing: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
    setIsVisible(false);
    setIsPreferencesOpen(false);
    if (onClosePreferencesExternal) onClosePreferencesExternal();
  };

  const handleAcceptAll = () => {
    setAnalyticsAllowed(true);
    setMarketingAllowed(true);
    saveConsent(true, true);
  };

  const handleAcceptEssentialOnly = () => {
    setAnalyticsAllowed(false);
    setMarketingAllowed(false);
    saveConsent(false, false);
  };

  const handleSavePreferences = () => {
    saveConsent(analyticsAllowed, marketingAllowed);
  };

  return (
    <>
      {/* Cookie Consent Banner */}
      {isVisible && !isPreferencesOpen && (
        <aside
          aria-label="Aviso de cookies y privacidad"
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 animate-in slide-in-from-bottom duration-300 no-print"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Privacidad y Cookies
                </h3>
                <button
                  onClick={handleAcceptEssentialOnly}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
                  aria-label="Cerrar aviso de cookies"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Utilizamos cookies técnicas necesarias para el carrito de compras y la carga ultrarrápida del catálogo. Consulta nuestra{' '}
                <button
                  onClick={() => onOpenLegal('cookies')}
                  className="font-semibold text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
                >
                  Política de Cookies
                </button>{' '}
                y{' '}
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="font-semibold text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
                >
                  Privacidad
                </button>.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2 items-center">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors text-center cursor-pointer"
                >
                  Aceptar Todas
                </button>
                <button
                  onClick={handleAcceptEssentialOnly}
                  className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Solo Necesarias
                </button>
                <button
                  onClick={() => setIsPreferencesOpen(true)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  aria-label="Personalizar cookies"
                  title="Personalizar preferencias"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Modal */}
      {isPreferencesOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 no-print"
        >
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl">
                  <Cookie className="w-5 h-5" />
                </div>
                <h3 id="cookie-preferences-title" className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Preferencias de Privacidad y Cookies
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsPreferencesOpen(false);
                  if (onClosePreferencesExternal) onClosePreferencesExternal();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                aria-label="Cerrar modal de preferencias"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Personaliza qué categorías de almacenamiento local autorizas durante tu navegación en este catálogo.
            </p>

            <div className="space-y-3">
              {/* Essential */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Cookies Técnicas y Esenciales</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                      Siempre activas
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Permiten guardar tu carrito, mantener tu navegación fluida y cargar las fotos de los productos.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="mt-1 accent-emerald-600 cursor-not-allowed"
                />
              </div>

              {/* Analytics */}
              <label className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-3 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Cookies de Rendimiento y Analítica</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Nos ayudan de forma anónima a saber qué productos son los más vistos para mejorar el catálogo.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </label>

              {/* Marketing */}
              <label className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-3 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    <span>Personalización de Ofertas</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Permite recordar tus categorías favoritas para mostrarte promociones relevantes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketingAllowed}
                  onChange={(e) => setMarketingAllowed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </label>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={handleAcceptAll}
                className="py-2 px-3 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer"
              >
                Aceptar Todas
              </button>
              <button
                onClick={handleSavePreferences}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Guardar Preferencias
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
