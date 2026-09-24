import React from 'react';
import {
  ShoppingBag,
  PlusCircle,
  Settings,
  Printer,
  Sparkles,
  Share2,
  ListPlus,
  Eye,
  Store,
  UserCheck,
  LogIn,
  LogOut,
  CloudCheck,
  ShieldCheck,
} from 'lucide-react';
import { StoreSettings, Catalog } from '../types/catalog';

interface HeaderProps {
  settings: StoreSettings;
  catalogs: Catalog[];
  activeCatalogId: string;
  onSelectCatalog: (id: string) => void;
  onCreateCatalog: () => void;
  onOpenExtractor: () => void;
  onOpenSettings: () => void;
  onPrint: () => void;
  onToggleCustomerMode: () => void;
  isCustomerMode: boolean;
  cartCount: number;
  onOpenCart: () => void;
  currentSellerName: string | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  isSyncing?: boolean;
  userRole?: 'seller' | 'customer' | null;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  catalogs,
  activeCatalogId,
  onSelectCatalog,
  onCreateCatalog,
  onOpenExtractor,
  onOpenSettings,
  onPrint,
  onToggleCustomerMode,
  isCustomerMode,
  cartCount,
  onOpenCart,
  currentSellerName,
  onOpenLogin,
  onLogout,
  isSyncing,
  userRole = 'seller',
}) => {
  const isActualSeller = userRole === 'seller' && currentSellerName === 'Chihuahua';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark & Cloud Sync Status */}
          <div className="flex items-center gap-3 shrink-0">
            {settings.storeLogo && settings.storeLogo.trim() !== '' ? (
              <img
                src={settings.storeLogo}
                alt={settings.storeName}
                className="w-9 h-9 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                {settings.storeName.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <a href="#" className="font-display font-bold text-sm sm:text-lg text-slate-900 tracking-tight leading-none">
                  {settings.storeName}
                </a>
                
                {/* Auto-save cloud status badge */}
                {isActualSeller && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200" title="Todos tus cambios se guardan automáticamente en tu cuenta">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden xs:inline sm:inline">Autoguardado</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block mt-0.5 truncate max-w-[140px] sm:max-w-none">
                {currentSellerName ? (isActualSeller ? 'Administrador: Chihuahua' : `Cliente: ${currentSellerName}`) : 'Catálogo Oficial de Productos'}
              </span>
            </div>
          </div>

          {/* Zone 2: Catalog Switcher & Mode Toggle */}
          {isActualSeller && (
            <div className="hidden md:flex items-center gap-2">
              {!isCustomerMode && (
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  {catalogs.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCatalog(cat.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                        cat.id === activeCatalogId
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat.title} ({cat.products.length})
                    </button>
                  ))}
                  <button
                    onClick={onCreateCatalog}
                    className="px-2 py-1.5 text-slate-500 hover:text-slate-900 transition-colors rounded-lg text-xs flex items-center gap-1"
                    title="Nuevo Catálogo"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Mode Switcher */}
              <button
                onClick={onToggleCustomerMode}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border ${
                  isCustomerMode
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isCustomerMode ? (
                  <>
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Modo Tienda Interactiva</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Vista Previa Cliente</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Zone 3: Seller Account & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Account Button */}
            {currentSellerName ? (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={onOpenLogin}
                  className="px-2.5 py-1 text-xs font-bold text-slate-800 flex items-center gap-1.5 hover:bg-white rounded-lg transition-colors"
                  title="Cambiar de cuenta o Iniciar sesión"
                >
                  {userRole === 'seller' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                  )}
                  <span>{currentSellerName} {userRole === 'seller' ? '(Vendedor)' : '(Cliente)'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Ingresar</span>
              </button>
            )}

            {isCustomerMode ? (
              <button
                onClick={onOpenCart}
                className="relative px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ver Pedido</span>
                {cartCount > 0 && (
                  <span className="bg-white text-emerald-700 font-bold px-1.5 py-0.2 text-[10px] rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenExtractor}
                  className="hidden sm:flex px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Pegar URL Producto</span>
                </button>

                <button
                  onClick={onPrint}
                  className="hidden md:flex px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all items-center gap-1.5"
                  title="Exportar como PDF para imprimir"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={onOpenSettings}
                  className="hidden sm:block p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Configuración de la Tienda"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
