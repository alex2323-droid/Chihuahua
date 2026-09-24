import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { UrlExtractorBar } from './components/UrlExtractorBar';
import { ProductCard } from './components/ProductCard';
import { ProductEditorModal } from './components/ProductEditorModal';
import { StoreSettingsDrawer } from './components/StoreSettingsDrawer';
import { WhatsAppCartDrawer } from './components/WhatsAppCartDrawer';
import { PrintableCatalog } from './components/PrintableCatalog';
import { LoginModal } from './components/LoginModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { initialStoreSettings, initialCatalogs } from './data/initialData';
import { Product, StoreSettings, Catalog, CartItem } from './types/catalog';
import { isLogoUrl } from './utils/imageUtils';
import {
  loginSeller,
  logoutSeller,
  subscribeToAuth,
  saveStoreSettingsToFirestore,
  saveCatalogToFirestore,
  subscribeToSellerCatalogs,
  subscribeToStoreSettings,
} from './lib/firestoreService';
import { User } from 'firebase/auth';
import {
  Sparkles,
  Plus,
  Search,
  LayoutGrid,
  Grid3X3,
  List,
  Columns4,
  Printer,
  Share2,
  SlidersHorizontal,
  PlusCircle,
  MessageCircle,
  Store,
  Check,
  Camera,
  Cloud,
  CheckCircle2,
  ShieldCheck,
  Eye,
  ListPlus,
  Settings,
  ShoppingBag,
} from 'lucide-react';

export default function App() {
  // State initialization with localStorage fallback
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('catalogcraft_settings');
    return saved ? JSON.parse(saved) : initialStoreSettings;
  });

  const [catalogs, setCatalogs] = useState<Catalog[]>(() => {
    const saved = localStorage.getItem('catalogcraft_catalogs');
    return saved ? JSON.parse(saved) : initialCatalogs;
  });

  const [activeCatalogId, setActiveCatalogId] = useState<string>(() => catalogs[0]?.id || 'cat_principal');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCustomerMode, setIsCustomerMode] = useState<boolean>(false);

  // Seller Auth State
  const [sellerUser, setSellerUser] = useState<User | null>(null);
  const [currentSellerName, setCurrentSellerName] = useState<string | null>('Chihuahua');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const lastSavedSettingsRef = useRef<string>('');
  const lastSavedCatalogsRef = useRef<string>('');
  const sellerUid = sellerUser?.uid;

  // Modals & Drawers state
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Role calculation: Only 'Chihuahua' account has seller admin privileges
  const isSeller = currentSellerName?.toLowerCase() === 'chihuahua';
  const effectiveCustomerMode = !isSeller || isCustomerMode;

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'grid-3' | 'grid-2' | 'grid-4' | 'list'>('grid-3');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // 1. Boot Auto-Login for Pre-configured Account: Chihuahua / 1306
  useEffect(() => {
    const autoLoginChihuahua = async () => {
      try {
        const res = await loginSeller('Chihuahua', '1306');
        setSellerUser(res.user);
        setCurrentSellerName(res.username);
      } catch (err) {
        console.warn('Auto-login notice:', err);
      }
    };

    const unsubscribe = subscribeToAuth((user) => {
      setSellerUser(user);
      if (!user) {
        // Attempt login for preconfigured Chihuahua seller
        autoLoginChihuahua();
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore synchronization when seller is logged in
  useEffect(() => {
    if (!sellerUid) return;

    // Subscribe to cloud store settings
    const unsubSettings = subscribeToStoreSettings(sellerUid, (cloudSettings) => {
      if (cloudSettings) {
        const cloudStr = JSON.stringify(cloudSettings);
        setSettings((prev) => {
          if (JSON.stringify(prev) === cloudStr) return prev;
          lastSavedSettingsRef.current = cloudStr;
          return cloudSettings;
        });
      }
    });

    // Subscribe to cloud catalogs
    const unsubCatalogs = subscribeToSellerCatalogs(sellerUid, (cloudCatalogs) => {
      if (cloudCatalogs && cloudCatalogs.length > 0) {
        const cloudStr = JSON.stringify(cloudCatalogs);
        setCatalogs((prev) => {
          if (JSON.stringify(prev) === cloudStr) return prev;
          lastSavedCatalogsRef.current = cloudStr;
          return cloudCatalogs;
        });
        setActiveCatalogId((prev) => {
          if (!prev || !cloudCatalogs.some((c) => c.id === prev)) {
            return cloudCatalogs[0].id;
          }
          return prev;
        });
      }
    });

    return () => {
      unsubSettings();
      unsubCatalogs();
    };
  }, [sellerUid]);

  // 3. Auto-save all changes to Firestore on state modification
  useEffect(() => {
    const settingsStr = JSON.stringify(settings);
    localStorage.setItem('catalogcraft_settings', settingsStr);

    if (sellerUid) {
      if (lastSavedSettingsRef.current === settingsStr) return;
      lastSavedSettingsRef.current = settingsStr;

      setIsSyncing(true);
      saveStoreSettingsToFirestore(sellerUid, settings)
        .catch((err) => console.error('Cloud settings save error:', err))
        .finally(() => setIsSyncing(false));
    }
  }, [settings, sellerUid]);

  useEffect(() => {
    const catalogsStr = JSON.stringify(catalogs);
    localStorage.setItem('catalogcraft_catalogs', catalogsStr);

    if (sellerUid) {
      if (lastSavedCatalogsRef.current === catalogsStr) return;
      lastSavedCatalogsRef.current = catalogsStr;

      setIsSyncing(true);
      // Persist all active catalogs to Firestore
      Promise.all(catalogs.map((cat) => saveCatalogToFirestore(sellerUid, cat)))
        .catch((err) => console.error('Cloud catalog save error:', err))
        .finally(() => setIsSyncing(false));
    }
  }, [catalogs, sellerUid]);

  // Automatic cleanup effect: Fix products that had store logos saved previously
  useEffect(() => {
    let isMounted = true;
    const cleanExistingLogos = async () => {
      const hasLogosToClean = catalogs.some((cat) =>
        cat.products.some((p) => isLogoUrl(p.image) && p.sourceUrl)
      );
      if (!hasLogosToClean) return;

      let changed = false;
      const updatedCatalogs = await Promise.all(
        catalogs.map(async (cat) => {
          const cleanProducts = await Promise.all(
            cat.products.map(async (p) => {
              if (isLogoUrl(p.image) && p.sourceUrl) {
                try {
                  const res = await fetch('/api/extract-product', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: p.sourceUrl }),
                  });
                  const data = await res.json();
                  if (data.success && data.product?.image && !isLogoUrl(data.product.image)) {
                    changed = true;
                    return {
                      ...p,
                      image: data.product.image,
                      title: data.product.title || p.title,
                    };
                  }
                } catch {}
              }
              return p;
            })
          );
          return { ...cat, products: cleanProducts };
        })
      );

      if (changed && isMounted) {
        setCatalogs(updatedCatalogs);
      }
    };

    cleanExistingLogos();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCatalog = catalogs.find((c) => c.id === activeCatalogId) || catalogs[0];

  // Extraction handlers
  const handleProductExtracted = (product: Product) => {
    setCatalogs((prevCatalogs) =>
      prevCatalogs.map((cat) =>
        cat.id === activeCatalogId
          ? { ...cat, products: [product, ...cat.products] }
          : cat
      )
    );
  };

  const handleBatchExtracted = (newProducts: Product[]) => {
    setCatalogs((prevCatalogs) =>
      prevCatalogs.map((cat) =>
        cat.id === activeCatalogId
          ? { ...cat, products: [...newProducts, ...cat.products] }
          : cat
      )
    );
  };

  // Re-extract single product photo
  const handleReExtractProduct = async (product: Product) => {
    if (!product.sourceUrl) return;
    try {
      const res = await fetch('/api/extract-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: product.sourceUrl }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        handleSaveProduct({
          ...product,
          image: data.product.image || product.image,
          title: data.product.title || product.title,
          description: data.product.description || product.description,
          price: data.product.price || product.price,
        });
      }
    } catch {}
  };

  // Product CRUD
  const handleSaveProduct = (updatedProduct: Product) => {
    setCatalogs((prevCatalogs) =>
      prevCatalogs.map((cat) => {
        if (cat.id !== activeCatalogId) return cat;

        const exists = cat.products.some((p) => p.id === updatedProduct.id);
        if (exists) {
          return {
            ...cat,
            products: cat.products.map((p) =>
              p.id === updatedProduct.id ? updatedProduct : p
            ),
          };
        } else {
          return {
            ...cat,
            products: [updatedProduct, ...cat.products],
          };
        }
      })
    );
  };

  const handleDeleteProduct = (id: string) => {
    setCatalogs((prevCatalogs) =>
      prevCatalogs.map((cat) =>
        cat.id === activeCatalogId
          ? { ...cat, products: cat.products.filter((p) => p.id !== id) }
          : cat
      )
    );
  };

  // Catalog CRUD
  const handleCreateNewCatalog = () => {
    const title = prompt('Nombre del nuevo catálogo:', 'Colección Novedades');
    if (!title || !title.trim()) return;

    const newCat: Catalog = {
      id: 'cat_' + Date.now(),
      title: title.trim(),
      description: 'Nuevos productos agregados.',
      createdAt: new Date().toISOString(),
      products: [],
    };

    setCatalogs((prev) => [...prev, newCat]);
    setActiveCatalogId(newCat.id);
  };

  // Cart operations
  const handleAddToCart = (product: Product, selectedSize?: string, customUnitPrice?: number) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1, unitPrice: customUnitPrice ?? item.unitPrice }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize, unitPrice: customUnitPrice }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartKey: string, quantity: number) => {
    const getItemKey = (item: CartItem) =>
      item.selectedSize ? `${item.product.id}_${item.selectedSize}` : item.product.id;

    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => getItemKey(item) !== cartKey));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          getItemKey(item) === cartKey ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (cartKey: string) => {
    const getItemKey = (item: CartItem) =>
      item.selectedSize ? `${item.product.id}_${item.selectedSize}` : item.product.id;
    setCart((prev) => prev.filter((item) => getItemKey(item) !== cartKey));
  };

  // Auth operations
  const handleLogoutSeller = async () => {
    await logoutSeller();
    setSellerUser(null);
    setCurrentSellerName(null);
  };

  // Filter products
  const categories = ['all', ...Array.from(new Set(activeCatalog?.products.map((p) => p.category) || []))];

  const filteredProducts = (activeCatalog?.products || []).filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  // Grid layout column classes
  const gridLayoutClass = {
    'grid-2': 'grid grid-cols-2 gap-3 sm:gap-6',
    'grid-3': 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6',
    'grid-4': 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5',
    list: 'flex flex-col gap-4',
  }[layoutMode];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        settings={settings}
        catalogs={catalogs}
        activeCatalogId={activeCatalogId}
        onSelectCatalog={setActiveCatalogId}
        onCreateCatalog={handleCreateNewCatalog}
        onOpenExtractor={() => setIsExtractorOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPrint={handlePrint}
        onToggleCustomerMode={() => setIsCustomerMode(!isCustomerMode)}
        isCustomerMode={effectiveCustomerMode}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentSellerName={currentSellerName}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogoutSeller}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        
        {/* Mobile Quick Navigation & Mode Switcher Bar */}
        <div className="block md:hidden mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Catálogos:</span>
            <button
              onClick={() => setIsCustomerMode(!effectiveCustomerMode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 ${
                effectiveCustomerMode
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {effectiveCustomerMode ? (
                <>
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Modo Tienda</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Vista Cliente</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {catalogs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCatalogId(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  cat.id === activeCatalogId
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.title} ({cat.products.length})
              </button>
            ))}
            {!effectiveCustomerMode && (
              <button
                onClick={handleCreateNewCatalog}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span>+ Nuevo</span>
              </button>
            )}
          </div>

          {!effectiveCustomerMode && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Ajustes de Tienda</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Exportar PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Account Auto-Save Notice Banner */}
        {currentSellerName && !effectiveCustomerMode && (
          <div className="mb-6 p-3.5 bg-emerald-900 text-emerald-100 rounded-2xl shadow-xs border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Sesión activa como Vendedor: {currentSellerName}</span>
                <span className="block text-emerald-300 text-[11px]">
                  Cualquier producto agregado, cambio de precio o ajuste de tienda se guarda automáticamente en tu cuenta.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-700/60 font-mono text-[11px] text-emerald-300">
              <Cloud className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{isSyncing ? 'Guardando en la nube...' : 'Sincronizado'}</span>
            </div>
          </div>
        )}

        {/* Store Banner Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-sm border border-slate-200/80 bg-slate-900 text-white">
          <div className="absolute inset-0">
            {settings.coverImage && settings.coverImage.trim() !== '' && (
              <img
                src={settings.coverImage}
                alt="Store Cover"
                className="w-full h-full object-cover opacity-35"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 border border-white/10 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.storeTagline || 'Catálogo Oficial de Productos'}</span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight text-white mb-2 leading-tight">
              {activeCatalog?.title || settings.storeName}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 mb-6">
              {activeCatalog?.description || 'Haz clic en cualquier producto para abrir la publicación y ver fotos en alta resolución, descripción completa y comprar por WhatsApp.'}
            </p>

            {/* Quick Actions inside Hero */}
            {!effectiveCustomerMode && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsExtractorOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Pegar Enlace de Producto</span>
                </button>

                <button
                  onClick={() => setIsExtractorOpen(true)}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Subir Captura (IA)</span>
                </button>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsEditorOpen(true);
                  }}
                  className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl backdrop-blur-md border border-white/20 transition-colors flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Crear Manualmente</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-md transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Exportar PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar: Search, Category Tabs & Layout Toggles */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap capitalize ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'Todos los productos' : cat}
              </button>
            ))}
          </div>

          {/* Search Input & Grid Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Buscar por nombre o marca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Layout Toggles */}
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs shrink-0">
              <button
                onClick={() => setLayoutMode('grid-2')}
                className={`p-1.5 rounded-lg transition-colors ${
                  layoutMode === 'grid-2' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="2 Columnas"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('grid-3')}
                className={`p-1.5 rounded-lg transition-colors ${
                  layoutMode === 'grid-3' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="3 Columnas"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('grid-4')}
                className={`p-1.5 rounded-lg transition-colors hidden sm:block ${
                  layoutMode === 'grid-4' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="4 Columnas"
              >
                <Columns4 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  layoutMode === 'list' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Vista Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Product Grid Area */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-md mx-auto my-12 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900 mb-1">
              No hay productos para mostrar
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {searchQuery
                ? 'No encontramos coincidencias para tu búsqueda.'
                : 'Empieza pegando la URL de un producto de tu tienda.'}
            </p>
            <button
              onClick={() => setIsExtractorOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pegar URL de Producto</span>
            </button>
          </div>
        ) : (
          <div className={gridLayoutClass}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                settings={settings}
                isCustomerMode={effectiveCustomerMode}
                onEdit={(p) => {
                  setEditingProduct(p);
                  setIsEditorOpen(true);
                }}
                onDelete={handleDeleteProduct}
                onAddToCart={handleAddToCart}
                onReExtract={handleReExtractProduct}
                onViewDetail={(p) => {
                  setSelectedDetailProduct(p);
                  setIsDetailOpen(true);
                }}
                layout={layoutMode}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-slate-600">
            © {new Date().getFullYear()} {settings.storeName} · Generador de Catálogos (Cuenta: {currentSellerName || 'General'})
          </p>
          <div className="text-slate-500">
            <span>WhatsApp: {settings.whatsappNumber}</span>
          </div>
        </div>
      </footer>

      {/* Floating Shopping Cart Button for Customers on Mobile & Desktop */}
      {effectiveCustomerMode && cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 border border-emerald-500/30 no-print group animate-bounce"
          style={{ animationDuration: '4s' }}
          aria-label="Ver carrito de compras"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2.5 -right-2.5 bg-rose-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-600">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <span className="text-xs font-bold pr-1">Ver Pedido</span>
        </button>
      )}

      {/* Modals & Drawers */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(name) => {
          setCurrentSellerName(name);
        }}
      />

      <UrlExtractorBar
        isOpen={isExtractorOpen}
        onClose={() => setIsExtractorOpen(false)}
        onProductExtracted={handleProductExtracted}
        onBatchExtracted={handleBatchExtracted}
      />

      <ProductEditorModal
        isOpen={isEditorOpen}
        product={editingProduct}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      <StoreSettingsDrawer
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={setSettings}
      />

      <WhatsAppCartDrawer
        isOpen={isCartOpen}
        cart={cart}
        settings={settings}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
      />

      <ProductDetailModal
        isOpen={isDetailOpen}
        product={selectedDetailProduct}
        settings={settings}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleAddToCart}
        isCustomerMode={effectiveCustomerMode}
      />

      {/* Hidden Printable Catalog Component */}
      {activeCatalog && (
        <PrintableCatalog catalog={activeCatalog} settings={settings} />
      )}

    </div>
  );
}
