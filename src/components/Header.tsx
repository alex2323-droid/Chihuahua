import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ShoppingBag,
  PlusCircle,
  Settings,
  Printer,
  Sparkles,
  ListPlus,
  Eye,
  Store,
  UserCheck,
  LogIn,
  LogOut,
  CloudCheck,
  ShieldCheck,
  Package,
  Moon,
  Sun,
  ChevronRight,
  FolderTree,
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
  onToggleThemeMode?: () => void;
  isCustomerMode: boolean;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSpecialOrder?: () => void;
  onOpenProfile?: () => void;
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
  onToggleThemeMode,
  isCustomerMode,
  cartCount,
  onOpenCart,
  onOpenSpecialOrder,
  onOpenProfile,
  currentSellerName,
  onOpenLogin,
  onLogout,
  userRole = 'seller',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isActualSeller = userRole === 'seller' && currentSellerName?.toLowerCase() === 'chihuahua';
  const isDark = settings.themeMode === 'dark';

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <header
      ref={menuRef}
      className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs no-print transition-colors duration-200 relative ${
        isDark
          ? 'bg-slate-950/95 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-200/80 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Wordmark & Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 shrink">
            {settings.storeLogo && settings.storeLogo.trim() !== '' ? (
              <img
                src={settings.storeLogo}
                alt={settings.storeName}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border shrink-0 ${
                  isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-100'
                }`}
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base sm:text-lg shrink-0 shadow-xs">
                {settings.storeName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <a
                  href="#"
                  className={`font-display font-extrabold text-sm sm:text-base md:text-lg tracking-tight leading-none truncate max-w-[110px] xs:max-w-[160px] sm:max-w-[220px] ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {settings.storeName}
                </a>
                
                {/* Auto-save cloud status badge */}
                {isActualSeller && (
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${
                      isDark
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    }`}
                    title="Todos tus cambios se guardan automáticamente"
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <CloudCheck className="w-3 h-3 text-emerald-500 hidden xs:inline" />
                    <span className="hidden sm:inline">Guardado</span>
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium block mt-0.5 truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {currentSellerName ? (isActualSeller ? 'Admin: Chihuahua' : `${currentSellerName}`) : 'Catálogo Digital Oficial'}
              </span>
            </div>
          </div>

          {/* Zone 2: Fast Action Badges & 3-Line Hamburger Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Quick Dark/Light Theme Toggle */}
            <button
              onClick={onToggleThemeMode}
              className={`p-2 sm:p-2.5 rounded-xl transition-colors border flex items-center justify-center shrink-0 cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Dark Negro'}
              aria-label="Alternar tema de la tienda"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Direct Quick Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="Abrir Carrito de Compras"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline font-bold">Carrito</span>
              {cartCount > 0 && (
                <span className="bg-white text-emerald-800 font-extrabold px-1.5 py-0.5 text-[10px] rounded-full shrink-0">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Prominent 3-Line Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all border flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isMenuOpen
                  ? isDark
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                  : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white'
                    : 'bg-slate-100 border-slate-200/90 text-slate-800 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={isMenuOpen ? 'Cerrar Menú' : 'Abrir Menú de Opciones (3 líneas)'}
              aria-label="Menú principal de opciones"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
              <span className="text-xs font-bold hidden sm:inline">
                {isMenuOpen ? 'Cerrar' : 'Menú'}
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* Expanded Menu Drawer / Dropdown Panel */}
      {isMenuOpen && (
        <div
          className={`absolute top-full inset-x-0 border-b shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden ${
            isDark
              ? 'bg-slate-950/98 border-slate-800 text-slate-100'
              : 'bg-white/98 border-slate-200/90 text-slate-900'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Column 1: User Account & Primary Actions */}
              <div className="space-y-3">
                <div className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cuenta y Sesión</span>
                </div>

                {currentSellerName ? (
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                        userRole === 'seller' ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white'
                      }`}>
                        {userRole === 'seller' ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {currentSellerName}
                        </div>
                        <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {userRole === 'seller' ? 'Vendedor Autorizado' : 'Cliente Registrado'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMenuAction(onOpenLogin)}
                        className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                          isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-white text-slate-700'
                        }`}
                        title="Cambiar de cuenta"
                      >
                        <LogIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMenuAction(onLogout)}
                        className="p-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Cerrar sesión"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleMenuAction(onOpenLogin)}
                    className="w-full p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <LogIn className="w-4 h-4" />
                      <span>Iniciar Sesión / Identificarse</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-80" />
                  </button>
                )}

                {/* Direct Client Tools */}
                <div className="space-y-1.5 pt-1">
                  {onOpenProfile && (
                    <button
                      onClick={() => handleMenuAction(onOpenProfile)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isDark
                          ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-200'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Mi Perfil y Agencia MRW</div>
                          <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Datos de envío y dirección
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {onOpenSpecialOrder && (
                    <button
                      onClick={() => handleMenuAction(onOpenSpecialOrder)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isDark
                          ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-200'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Encargar Pedido Especial</div>
                          <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Pide artículos fuera de catálogo
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Column 2: Catalogs & Store Management */}
              <div className="space-y-3">
                <div className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <FolderTree className="w-3.5 h-3.5 text-purple-500" />
                  <span>Catálogos Disponibles</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {catalogs.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleMenuAction(() => onSelectCatalog(cat.id))}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        cat.id === activeCatalogId
                          ? isDark
                            ? 'bg-purple-950/60 border-purple-800 text-purple-200 font-bold'
                            : 'bg-purple-50 border-purple-200 text-purple-900 font-bold'
                          : isDark
                            ? 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Sparkles className={`w-3.5 h-3.5 shrink-0 ${cat.id === activeCatalogId ? 'text-purple-500' : 'text-slate-400'}`} />
                        <span className="truncate">{cat.title}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold shrink-0 ${
                        cat.id === activeCatalogId
                          ? 'bg-purple-600 text-white'
                          : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cat.products.length}
                      </span>
                    </button>
                  ))}

                  {isActualSeller && (
                    <button
                      onClick={() => handleMenuAction(onCreateCatalog)}
                      className={`w-full p-2.5 rounded-xl border border-dashed text-left flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                        isDark
                          ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                          : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <ListPlus className="w-4 h-4 text-emerald-500" />
                      <span>+ Crear Nuevo Catálogo</span>
                    </button>
                  )}
                </div>

                {/* Seller Actions */}
                {isActualSeller && (
                  <div className="pt-1">
                    <button
                      onClick={() => handleMenuAction(onAddProduct)}
                      className="w-full p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        <span>+ Agregar Producto al Catálogo</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-80" />
                    </button>
                  </div>
                )}
              </div>

              {/* Column 3: Tools, PDF, View Switcher & Theme */}
              <div className="space-y-3">
                <div className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <Settings className="w-3.5 h-3.5 text-blue-500" />
                  <span>Herramientas y Preferencias</span>
                </div>

                <div className="space-y-1.5">
                  {/* Mode Switcher */}
                  <button
                    onClick={() => handleMenuAction(onToggleCustomerMode)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isCustomerMode
                        ? isDark
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : isDark
                          ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-200'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        {isCustomerMode ? <Store className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold">
                          {isCustomerMode ? 'Modo Tienda Interactiva' : 'Vista Previa Cliente'}
                        </div>
                        <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {isCustomerMode ? 'Vista enfocada en pedidos' : 'Vista con controles de vendedor'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-800 text-slate-200">
                      Cambiar
                    </span>
                  </button>

                  {/* PDF Export */}
                  <button
                    onClick={() => handleMenuAction(onPrint)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isDark
                        ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                        <Printer className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Exportar Catálogo en PDF</div>
                        <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Imprime o descarga el catálogo
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Store Settings (Only for seller) */}
                  {isActualSeller && (
                    <button
                      onClick={() => handleMenuAction(onOpenSettings)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isDark
                          ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-200'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center shrink-0">
                          <Settings className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Configuración de la Tienda</div>
                          <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Logos, WhatsApp, Envíos y Moneda
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {/* Dark Mode Fast Switch in Menu */}
                  <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isDark ? 'bg-amber-400/10 text-amber-400' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold">
                          {isDark ? 'Modo Dark Negro' : 'Modo Claro'}
                        </div>
                        <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {isDark ? 'Obsidiana activo' : 'Luminoso activo'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onToggleThemeMode}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isDark
                          ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-xs'
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                      }`}
                    >
                      {isDark ? 'Activar Claro' : 'Activar Dark'}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </header>
  );
};
