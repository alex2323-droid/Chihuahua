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
  onAddProduct: () => void;
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
  onAddProduct,
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Wordmark & Cloud Sync Status */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            {settings.storeLogo && settings.storeLogo.trim() !== '' ? (
              <img
                src={settings.storeLogo}
                alt={settings.storeName}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
                {settings.storeName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <a href="#" className="font-display font-extrabold text-xs sm:text-base md:text-lg text-slate-900 tracking-tight leading-none truncate max-w-[85px] xs:max-w-[120px] sm:max-w-[180px]">
                  {settings.storeName}
                </a>
                
                {/* Auto-save cloud status badge */}
                {isActualSeller && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 shrink-0" title="Todos tus cambios se guardan automáticamente">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-600 hidden xs:inline" />
                    <span className="hidden sm:inline">Autoguardado</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5 truncate max-w-[95px] xs:max-w-[130px] sm:max-w-none">
                {currentSellerName ? (isActualSeller ? 'Admin: Chihuahua' : `${currentSellerName}`) : 'Catálogo Oficial'}
              </span>
            </div>
          </div>

          {/* Zone 2: Catalog Switcher & Mode Toggle (Tablet/Desktop) */}
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

          {/* Zone 3: Seller/Client Account & Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Account Button */}
            {currentSellerName ? (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={onOpenLogin}
                  className="px-1.5 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1 hover:bg-white rounded-lg transition-colors max-w-[85px] xs:max-w-[130px] sm:max-w-[180px] truncate"
                  title="Cambiar de cuenta o Iniciar sesión"
                >
                  {userRole === 'seller' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  )}
                  <span className="truncate max-w-[45px] xs:max-w-[75px] sm:max-w-none">
                    {currentSellerName}
                  </span>
                  <span className="hidden sm:inline text-[10px] text-slate-500 font-normal ml-0.5">
                    {userRole === 'seller' ? '(Vendedor)' : ''}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] sm:text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Ingresar</span>
              </button>
            )}

            {isCustomerMode ? (
              <button
                onClick={onOpenCart}
                className="relative px-2 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] sm:text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 sm:gap-2 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden xs:inline">Ver Pedido</span>
                <span className="xs:hidden">Pedido</span>
                {cartCount > 0 && (
                  <span className="bg-white text-emerald-700 font-extrabold px-1.5 py-0.5 text-[9px] sm:text-[10px] rounded-full shrink-0">
                    {cartCount}
                  </span>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={onAddProduct}
                  className="hidden sm:flex px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Agregar Producto</span>
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
