import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductEditorModal } from './components/ProductEditorModal';
import { StoreSettingsDrawer } from './components/StoreSettingsDrawer';
import { WhatsAppCartDrawer } from './components/WhatsAppCartDrawer';
import { PrintableCatalog } from './components/PrintableCatalog';
import { LoginModal } from './components/LoginModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { initialStoreSettings, initialCatalogs } from './data/initialData';
import { Product, StoreSettings, Catalog, CartItem } from './types/catalog';
import { isLogoUrl, optimizeProductImageSize } from './utils/imageUtils';
import { generateProductSku, generateSubCode } from './utils/codeUtils';
import { getStoredItem, setStoredItem } from './lib/indexedDbStorage';
import {
  loginSeller,
  logoutSeller,
  subscribeToAuth,
  saveStoreSettingsToFirestore,
  saveCatalogToFirestore,
  saveAllCatalogsToFirestore,
  syncCatalogNowToFirestore,
  subscribeToSellerCatalogs,
  subscribeToStoreSettings,
  loginCustomer,
  saveCustomerProfileToFirestore,
  loadCustomerProfileFromFirestore,
  getAllSellersFromFirestore,
  getPrimarySellerIdFromFirestore,
  rehydrateCatalog,
  rehydrateProduct,
  CustomerProfile,
} from './lib/firestoreService';
import { User } from 'firebase/auth';
import {
  isSupabaseConfigured,
  saveCatalogsToSupabase,
  saveSettingsToSupabase,
  fetchSettingsFromSupabase,
  subscribeToSupabaseCatalogs,
} from './lib/supabase';
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
  LogIn,
  RefreshCw,
  ChevronDown,
  Loader2,
} from 'lucide-react';

// Deleted product ID tracking helpers
const getDeletedProductIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem('catalogcraft_deleted_pids');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {}
  return new Set();
};

const addDeletedProductId = (id: string) => {
  const current = getDeletedProductIds();
  current.add(id);
  try {
    localStorage.setItem('catalogcraft_deleted_pids', JSON.stringify(Array.from(current)));
  } catch {}
};

// Helper to safely merge local state with cloud state so all products remain synchronized across all devices
const mergeLocalAndCloudCatalogs = (localCats: Catalog[], cloudCats: Catalog[]): Catalog[] => {
  const safeCloud = (cloudCats || []).map(rehydrateCatalog);
  const safeLocal = (localCats || []).map(rehydrateCatalog);
  if (!safeCloud || safeCloud.length === 0) return safeLocal;
  if (!safeLocal || safeLocal.length === 0) return safeCloud;

  const mergedMap = new Map<string, Catalog>();

  // Start with authoritative cloud catalogs
  safeCloud.forEach((cCat) => {
    mergedMap.set(cCat.id, { ...cCat, products: (cCat.products || []).map(rehydrateProduct) });
  });

  // Merge any local-only unsaved catalogs or unsaved products into cloud state
  safeLocal.forEach((lCat) => {
    const existing = mergedMap.get(lCat.id);
    if (!existing) {
      mergedMap.set(lCat.id, { ...lCat, products: (lCat.products || []).map(rehydrateProduct) });
    } else {
      const cloudProductsMap = new Map<string, Product>();
      existing.products.forEach((p) => cloudProductsMap.set(p.id, p));

      const finalProducts: Product[] = [...existing.products];

      // Add local products not yet in cloud
      (lCat.products || []).forEach((lProd) => {
        if (!cloudProductsMap.has(lProd.id)) {
          finalProducts.push(rehydrateProduct(lProd));
        }
      });

      mergedMap.set(lCat.id, {
        ...existing,
        title: lCat.title || existing.title,
        description: lCat.description || existing.description,
        products: finalProducts,
      });
    }
  });

  return Array.from(mergedMap.values());
};

export default function App() {
  // State initialization with localStorage fallback
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('catalogcraft_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch {}
    }
    return initialStoreSettings;
  });

  const [catalogs, setCatalogs] = useState<Catalog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('catalogcraft_catalogs');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return (parsed as Catalog[]).map(rehydrateCatalog);
          }
        } catch {}
      }
    }
    return [
      {
        id: 'cat_principal',
        title: 'Catálogo Principal',
        description: 'Todos los productos',
        products: [],
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState<boolean>(() => false);
  const [activeCatalogId, setActiveCatalogId] = useState<string>(() => catalogs[0]?.id || 'cat_principal');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCustomerMode, setIsCustomerMode] = useState<boolean>(() => {
    const savedRole = localStorage.getItem('catalogcraft_user_role');
    return savedRole === 'customer';
  });

  // Seller & Customer Auth State
  const [sellerUser, setSellerUser] = useState<User | null>(null);
  const [currentSellerName, setCurrentSellerName] = useState<string | null>(() => {
    return localStorage.getItem('catalogcraft_username') || null;
  });
  const [userRole, setUserRole] = useState<'seller' | 'customer' | null>(() => {
    return (localStorage.getItem('catalogcraft_user_role') as 'seller' | 'customer' | null) || null;
  });

  const [activeViewingSellerUid, setActiveViewingSellerUid] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSeller = params.get('seller') || params.get('store');
      if (urlSeller) {
        localStorage.setItem('catalogcraft_viewing_seller_uid', urlSeller);
        return urlSeller;
      }
    }
    return localStorage.getItem('catalogcraft_viewing_seller_uid') || 'bdy3TcO5IAOpmkQEy8zLGpEkENG3';
  });
  const [allSellers, setAllSellers] = useState<{ sellerId: string; username: string }[]>([]);
  const [clientProfile, setClientProfile] = useState<CustomerProfile | null>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const hasLoadedSettingsFromCloud = useRef(false);
  const hasLoadedCatalogsFromCloud = useRef(false);
  const lastSavedSettingsRef = useRef<string>('');
  const lastSavedCatalogsRef = useRef<string>('');
  const isRemoteCatalogUpdateRef = useRef(false);
  const isRemoteSettingsUpdateRef = useRef(false);
  const saveCatalogTimeoutRef = useRef<any>(null);
  const saveSettingsTimeoutRef = useRef<any>(null);
  
  const sellerUid = sellerUser?.uid;

  // Watchdog: Ensure syncing indicator never stays stuck under any condition
  useEffect(() => {
    if (isSyncing) {
      const timer = setTimeout(() => {
        setIsSyncing(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSyncing]);

  // Modals & Drawers state
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Primary Store Owner UID (Chihuahua)
  const PRIMARY_STORE_UID = 'bdy3TcO5IAOpmkQEy8zLGpEkENG3';

  // Role calculation: ONLY Chihuahua is the seller!
  const isSeller = Boolean(
    sellerUid &&
    userRole === 'seller' &&
    (currentSellerName?.toLowerCase() === 'chihuahua' || sellerUid === PRIMARY_STORE_UID)
  );
  const effectiveCustomerMode = !isSeller || isCustomerMode;

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'grid-3' | 'grid-2' | 'grid-4' | 'list'>('grid-3');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // 0. Ultra-fast initial hydration from IndexedDB for instant 0ms product loading
  useEffect(() => {
    let isMounted = true;
    getStoredItem<Catalog[]>('cached_catalogs_latest').then((cached) => {
      if (!isMounted) return;
      if (cached && Array.isArray(cached) && cached.length > 0) {
        setCatalogs((prev) => {
          const currentCount = prev.reduce((acc, c) => acc + (c.products?.length || 0), 0);
          const cachedCount = cached.reduce((acc, c) => acc + (c.products?.length || 0), 0);
          if (currentCount === 0 || cachedCount >= currentCount) {
            return cached;
          }
          return prev;
        });
        setActiveCatalogId((prev) => {
          if (!prev || !cached.some((c) => c.id === prev)) {
            return cached[0].id;
          }
          return prev;
        });
        setIsLoadingCatalogs(false);
      }
    });

    getStoredItem<StoreSettings>('cached_settings_latest').then((cachedSettings) => {
      if (!isMounted) return;
      if (cachedSettings && cachedSettings.storeName) {
        setSettings((prev) => ({ ...prev, ...cachedSettings }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Fetch available sellers on boot and whenever login state changes
  const refreshSellers = async () => {
    try {
      const sellers = await getAllSellersFromFirestore();
      if (sellers && sellers.length > 0) {
        setAllSellers(sellers);
        if (!isSeller) {
          const chih = sellers.find((s) => s.username.toLowerCase() === 'chihuahua') || sellers[0];
          if (chih && (!activeViewingSellerUid || activeViewingSellerUid === '')) {
            setActiveViewingSellerUid(chih.sellerId);
            localStorage.setItem('catalogcraft_viewing_seller_uid', chih.sellerId);
          }
        }
      } else {
        const primaryId = await getPrimarySellerIdFromFirestore();
        if (primaryId && (!activeViewingSellerUid || activeViewingSellerUid === '') && !isSeller) {
          setActiveViewingSellerUid(primaryId);
          localStorage.setItem('catalogcraft_viewing_seller_uid', primaryId);
        }
      }
    } catch (e) {
      console.warn('Could not refresh sellers:', e);
    }
  };

  useEffect(() => {
    refreshSellers();
  }, [sellerUid]);

  // Load customer profile when logged in as a customer
  useEffect(() => {
    if (sellerUid && userRole === 'customer') {
      loadCustomerProfileFromFirestore(sellerUid).then((profile) => {
        if (profile) {
          setClientProfile(profile);
        }
      });
    } else {
      setClientProfile(null);
    }
  }, [sellerUid, userRole]);

  // Handler to update and save client profile details automatically on changes
  const handleUpdateClientProfile = async (profileUpdate: { username: string; address: string }) => {
    if (sellerUid && userRole === 'customer') {
      const updated = {
        ...clientProfile,
        username: profileUpdate.username,
        address: profileUpdate.address,
      };
      setClientProfile(updated as CustomerProfile);
      await saveCustomerProfileToFirestore(sellerUid, updated);
    }
  };

  const handleSwitchSeller = (uid: string) => {
    setActiveViewingSellerUid(uid);
    localStorage.setItem('catalogcraft_viewing_seller_uid', uid);
  };

  // 1. Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setSellerUser(user);
      if (!user) {
        const savedRole = localStorage.getItem('catalogcraft_user_role');
        const savedName = localStorage.getItem('catalogcraft_username');
        if (savedRole === 'seller' && savedName?.toLowerCase() === 'chihuahua') {
          loginSeller('Chihuahua', '1306').catch(() => {});
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Update activeViewingSellerUid when seller logs in
  useEffect(() => {
    if (sellerUid && userRole === 'seller' && (currentSellerName?.toLowerCase() === 'chihuahua' || sellerUid === PRIMARY_STORE_UID)) {
      setActiveViewingSellerUid(sellerUid);
      localStorage.setItem('catalogcraft_viewing_seller_uid', sellerUid);
    }
  }, [sellerUid, userRole, currentSellerName]);

  // 2. Real-time Firestore synchronization
  useEffect(() => {
    // When logged in as Chihuahua (the seller), bind to Chihuahua's account
    // When customer or visitor, always bind to Chihuahua / primary store account
    const targetUid = isSeller && sellerUid ? sellerUid : PRIMARY_STORE_UID;

    if (!targetUid) return;

    // Reset loaded states first to prevent race condition during switch
    hasLoadedSettingsFromCloud.current = false;
    hasLoadedCatalogsFromCloud.current = false;

    // Subscribe to cloud store settings
    const unsubSettings = subscribeToStoreSettings(targetUid, (cloudSettings) => {
      if (cloudSettings) {
        const cloudStr = JSON.stringify(cloudSettings);
        isRemoteSettingsUpdateRef.current = true;
        setSettings((prev) => {
          if (JSON.stringify(prev) === cloudStr) return prev;
          lastSavedSettingsRef.current = cloudStr;
          return cloudSettings;
        });
        setStoredItem('cached_settings_latest', cloudSettings).catch(() => {});
      }
      hasLoadedSettingsFromCloud.current = true;
    });

    // Subscribe to cloud catalogs
    const unsubCatalogs = subscribeToSellerCatalogs(targetUid, (cloudCatalogs) => {
      setIsLoadingCatalogs(false);
      if (cloudCatalogs && cloudCatalogs.length > 0) {
        isRemoteCatalogUpdateRef.current = true;
        setCatalogs((prev) => {
          const prevProductCount = prev.reduce((sum, c) => sum + (c.products?.length || 0), 0);
          const cloudProductCount = cloudCatalogs.reduce((sum, c) => sum + (c.products?.length || 0), 0);

          // If local has more products than cloud, or if user is seller, preserve local products
          const hasLocalUnsynced = prevProductCount > cloudProductCount || isSeller || userRole === 'seller';

          const targetCatalogs = (!hasLocalUnsynced && prevProductCount === 0)
            ? cloudCatalogs
            : mergeLocalAndCloudCatalogs(prev, cloudCatalogs);

          try {
            localStorage.setItem('catalogcraft_catalogs', JSON.stringify(targetCatalogs));
          } catch {}
          setStoredItem('cached_catalogs_latest', targetCatalogs).catch(() => {});
          setStoredItem(`cached_catalogs_${targetUid}`, targetCatalogs).catch(() => {});

          // If local had unsynced products and we are the seller, trigger immediate cloud sync
          if (hasLocalUnsynced && (isSeller || userRole === 'seller')) {
            const finalCount = targetCatalogs.reduce((sum, c) => sum + (c.products?.length || 0), 0);
            if (finalCount > cloudProductCount) {
              dispatchImmediateCatalogSync(targetCatalogs);
            }
          }

          return targetCatalogs;
        });
        setActiveCatalogId((prev) => {
          if (!prev || !cloudCatalogs.some((c) => c.id === prev)) {
            return cloudCatalogs[0]?.id || 'cat_principal';
          }
          return prev;
        });
      }
      hasLoadedCatalogsFromCloud.current = true;
    }, () => {
      setIsLoadingCatalogs(false);
      hasLoadedCatalogsFromCloud.current = true;
    });

    // Supabase Dual-Sync: fetch/subscribe to Supabase PostgreSQL
    let unsubSupabase = () => {};
    if (isSupabaseConfigured) {
      fetchSettingsFromSupabase(targetUid).then((supaSettings) => {
        if (supaSettings) {
          setSettings((prev) => ({ ...prev, ...supaSettings }));
        }
      });
      unsubSupabase = subscribeToSupabaseCatalogs(targetUid, (supaCats) => {
        if (supaCats && supaCats.length > 0) {
          setCatalogs((prev) => mergeLocalAndCloudCatalogs(prev, supaCats));
          setIsLoadingCatalogs(false);
        }
      });
    }

    return () => {
      unsubSettings();
      unsubCatalogs();
      unsubSupabase();
    };
  }, [activeViewingSellerUid, sellerUid, isSeller]);

  // 3. Auto-save all changes to Firestore on state modification with debouncing
  useEffect(() => {
    const settingsStr = JSON.stringify(settings);
    localStorage.setItem('catalogcraft_settings', settingsStr);
    setStoredItem('cached_settings_latest', settings).catch(() => {});

    // If update arrived from cloud subscription, do not echo back
    if (isRemoteSettingsUpdateRef.current) {
      isRemoteSettingsUpdateRef.current = false;
      lastSavedSettingsRef.current = settingsStr;
      return;
    }

    // Safeguard: Only auto-save if we are the verified seller owner AND data loading has fully completed
    if (isSeller && sellerUid && hasLoadedSettingsFromCloud.current) {
      if (lastSavedSettingsRef.current === settingsStr) return;

      if (saveSettingsTimeoutRef.current) {
        clearTimeout(saveSettingsTimeoutRef.current);
      }

      saveSettingsTimeoutRef.current = setTimeout(async () => {
        lastSavedSettingsRef.current = settingsStr;
        setIsSyncing(true);
        try {
          if (isSupabaseConfigured) {
            saveSettingsToSupabase(sellerUid, settings).catch(() => {});
          }
          await saveStoreSettingsToFirestore(sellerUid, settings);
        } catch (err) {
          console.error('Cloud settings save error:', err);
        } finally {
          setIsSyncing(false);
        }
      }, 1000);
    }

    return () => {
      if (saveSettingsTimeoutRef.current) {
        clearTimeout(saveSettingsTimeoutRef.current);
      }
    };
  }, [settings, sellerUid, isSeller]);

  useEffect(() => {
    const catalogsStr = JSON.stringify(catalogs);
    try {
      localStorage.setItem('catalogcraft_catalogs', catalogsStr);
    } catch {
      // LocalStorage is limited to 5MB, high-res catalogs are safely persisted in Cloud Firestore & IndexedDB
    }

    // Always persist full high-res catalogs in IndexedDB for 0ms startup
    if (catalogs.length > 0) {
      setStoredItem('cached_catalogs_latest', catalogs).catch(() => {});
      if (sellerUid) {
        setStoredItem(`cached_catalogs_${sellerUid}`, catalogs).catch(() => {});
      }
    }

    // If update arrived from cloud subscription, do not echo back
    if (isRemoteCatalogUpdateRef.current) {
      isRemoteCatalogUpdateRef.current = false;
      lastSavedCatalogsRef.current = catalogsStr;
      return;
    }

    // Safeguard: Auto-save to Firestore ONLY after cloud catalogs have loaded and we are the verified seller
    if (isSeller && sellerUid && hasLoadedCatalogsFromCloud.current && catalogs.length > 0) {
      if (lastSavedCatalogsRef.current === catalogsStr) return;

      if (saveCatalogTimeoutRef.current) {
        clearTimeout(saveCatalogTimeoutRef.current);
      }

      // Fast auto-save (400ms) to sync changes to Cloud Firestore and Upstash Redis instantly
      saveCatalogTimeoutRef.current = setTimeout(async () => {
        lastSavedCatalogsRef.current = catalogsStr;
        setIsSyncing(true);
        try {
          if (isSupabaseConfigured) {
            saveCatalogsToSupabase(sellerUid, catalogs).catch(() => {});
          }
          await saveAllCatalogsToFirestore(sellerUid, catalogs, true);
        } catch (err) {
          console.warn('Cloud catalog save error (persisted locally):', err);
        } finally {
          setIsSyncing(false);
        }
      }, 400);
    }

    return () => {
      if (saveCatalogTimeoutRef.current) {
        clearTimeout(saveCatalogTimeoutRef.current);
      }
    };
  }, [catalogs, sellerUid, isSeller]);

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

  // Automatic cleanup & size optimization effect: Downscale and compress only historical massive uncompressed screenshots (> 2.5MB chars)
  useEffect(() => {
    if (catalogs.length === 0 || !hasLoadedCatalogsFromCloud.current) return;

    // Only flag genuine raw uncompressed base64 data URIs (> 2.5 million characters)
    const needsOptimization = catalogs.some((cat) =>
      cat.products.some((p) =>
        (p.image && typeof p.image === 'string' && p.image.startsWith('data:image') && p.image.length > 2500000) ||
        (p.images && Array.isArray(p.images) && p.images.some((img) => typeof img === 'string' && img.startsWith('data:image') && img.length > 2500000)) ||
        (p.imageDetails && Array.isArray(p.imageDetails) && p.imageDetails.some((det) => det && det.url && typeof det.url === 'string' && det.url.startsWith('data:image') && det.url.length > 2500000))
      )
    );

    if (!needsOptimization) return;

    let isMounted = true;
    const runOnetimeOptimization = async () => {
      const optimizedCatalogs = await Promise.all(
        catalogs.map(async (cat) => {
          const optProducts = await Promise.all(
            cat.products.map(async (p) => {
              return await optimizeProductImageSize(p);
            })
          );
          return { ...cat, products: optProducts };
        })
      );

      if (isMounted) {
        setCatalogs(optimizedCatalogs);
      }
    };

    runOnetimeOptimization();
    return () => {
      isMounted = false;
    };
  }, [catalogs, hasLoadedCatalogsFromCloud.current]);

  const activeCatalog =
    catalogs.find((c) => c.id === activeCatalogId) ||
    catalogs.find((c) => c.products && c.products.length > 0) ||
    catalogs[0] || {
      id: 'cat_principal',
      title: 'Catálogo Principal',
      description: 'Todos los productos',
      products: [],
      createdAt: new Date().toISOString(),
    };

  // Synchronous local + cloud sync dispatchers
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  const dispatchImmediateSettingsSync = (nextSettings: StoreSettings) => {
    try {
      localStorage.setItem('catalogcraft_settings', JSON.stringify(nextSettings));
    } catch {}
    setStoredItem('cached_settings_latest', nextSettings).catch(() => {});

    const targetUid = isSeller && sellerUid ? sellerUid : PRIMARY_STORE_UID;
    if (targetUid) {
      if (isSupabaseConfigured) {
        saveSettingsToSupabase(targetUid, nextSettings).catch(() => {});
      }
      setIsSyncing(true);
      saveStoreSettingsToFirestore(targetUid, nextSettings)
        .then(() => {
          lastSavedSettingsRef.current = JSON.stringify(nextSettings);
        })
        .catch((e) => console.warn('Background settings sync warning:', e))
        .finally(() => setIsSyncing(false));
    }
  };

  const dispatchImmediateCatalogSync = (nextCatalogs: Catalog[]) => {
    try {
      localStorage.setItem('catalogcraft_catalogs', JSON.stringify(nextCatalogs));
    } catch {}
    setStoredItem('cached_catalogs_latest', nextCatalogs).catch(() => {});

    const targetUid = isSeller && sellerUid ? sellerUid : PRIMARY_STORE_UID;
    if (targetUid && nextCatalogs.length > 0) {
      if (isSupabaseConfigured) {
        saveCatalogsToSupabase(targetUid, nextCatalogs).catch(() => {});
      }
      setIsSyncing(true);
      saveAllCatalogsToFirestore(targetUid, nextCatalogs, true)
        .then(() => {
          lastSavedCatalogsRef.current = JSON.stringify(nextCatalogs);
        })
        .catch((e) => console.warn('Background catalog sync warning:', e))
        .finally(() => setIsSyncing(false));
    }
  };

  const handleForceSyncToCloud = async () => {
    const targetUid = isSeller && sellerUid ? sellerUid : PRIMARY_STORE_UID;
    setIsSyncing(true);
    try {
      await syncCatalogNowToFirestore(targetUid, catalogs);
      await saveStoreSettingsToFirestore(targetUid, settings);
      setSyncToastMessage('¡Catálogo sincronizado exitosamente con la nube en todos los dispositivos!');
      setTimeout(() => setSyncToastMessage(null), 4000);
    } catch (err: any) {
      setSyncToastMessage('Guardado en almacenamiento local.');
      setTimeout(() => setSyncToastMessage(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Helper to ensure at least one catalog exists and returns valid target
  const ensureCatalogTarget = (catalogsList: Catalog[], targetId?: string): { list: Catalog[]; targetId: string } => {
    if (!catalogsList || catalogsList.length === 0) {
      const defaultId = targetId || 'cat_principal';
      return {
        list: [
          {
            id: defaultId,
            title: 'Catálogo Principal',
            description: 'Todos los productos',
            products: [],
            createdAt: new Date().toISOString(),
          },
        ],
        targetId: defaultId,
      };
    }
    const currentId = targetId && catalogsList.some((c) => c.id === targetId)
      ? targetId
      : catalogsList[0].id;
    return { list: catalogsList, targetId: currentId };
  };

  // Extraction handlers
  const handleProductExtracted = async (product: Product) => {
    const finalImages = product.images && product.images.length > 0
      ? product.images
      : (product.image ? [product.image] : []);

    const imageDetails = finalImages.map((img, i) => {
      const existing = product.imageDetails?.find((d) => d.url === img) || product.imageDetails?.[i];
      return {
        url: img,
        price: existing?.price ?? null,
        code: (existing?.code && existing.code.trim() !== '') ? existing.code.trim().toUpperCase() : generateSubCode(),
      };
    });

    const withSku = {
      ...product,
      sku: product.sku || generateProductSku(),
      images: finalImages,
      imageDetails,
    };
    const optimized = await optimizeProductImageSize(withSku);
    const { list, targetId } = ensureCatalogTarget(catalogs, activeCatalogId);
    setActiveCatalogId(targetId);
    const updated = list.map((cat) =>
      cat.id === targetId
        ? { ...cat, products: [optimized, ...(cat.products || []).filter((p) => p.id !== optimized.id)] }
        : cat
    );
    setCatalogs(updated);
    dispatchImmediateCatalogSync(updated);
  };

  const handleBatchExtracted = async (newProducts: Product[]) => {
    const withSkus = newProducts.map((p) => {
      const finalImages = p.images && p.images.length > 0
        ? p.images
        : (p.image ? [p.image] : []);

      const imageDetails = finalImages.map((img, i) => {
        const existing = p.imageDetails?.find((d) => d.url === img) || p.imageDetails?.[i];
        return {
          url: img,
          price: existing?.price ?? null,
          code: (existing?.code && existing.code.trim() !== '') ? existing.code.trim().toUpperCase() : generateSubCode(),
        };
      });

      return {
        ...p,
        sku: p.sku || generateProductSku(),
        images: finalImages,
        imageDetails,
      };
    });
    const optimized = await Promise.all(withSkus.map((p) => optimizeProductImageSize(p)));
    const { list, targetId } = ensureCatalogTarget(catalogs, activeCatalogId);
    setActiveCatalogId(targetId);
    const newIds = new Set(optimized.map((p) => p.id));
    const updated = list.map((cat) =>
      cat.id === targetId
        ? { ...cat, products: [...optimized, ...(cat.products || []).filter((p) => !newIds.has(p.id))] }
        : cat
    );
    setCatalogs(updated);
    dispatchImmediateCatalogSync(updated);
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
  const handleSaveProduct = async (updatedProduct: Product) => {
    const finalImages = updatedProduct.images && updatedProduct.images.length > 0
      ? updatedProduct.images
      : (updatedProduct.image ? [updatedProduct.image] : []);

    const imageDetails = finalImages.map((img, i) => {
      const existing = updatedProduct.imageDetails?.find((d) => d.url === img) || updatedProduct.imageDetails?.[i];
      return {
        url: img,
        price: existing?.price ?? null,
        code: (existing?.code && existing.code.trim() !== '') ? existing.code.trim().toUpperCase() : generateSubCode(),
      };
    });

    const preparedProduct: Product = {
      ...updatedProduct,
      sku: updatedProduct.sku || generateProductSku(),
      images: finalImages,
      imageDetails,
    };

    const optimized = await optimizeProductImageSize(preparedProduct);
    const { list, targetId } = ensureCatalogTarget(catalogs, activeCatalogId);
    setActiveCatalogId(targetId);
    const updated = list.map((cat) => {
      if (cat.id !== targetId) return cat;
      const exists = cat.products.some((p) => p.id === optimized.id);
      return {
        ...cat,
        products: exists
          ? cat.products.map((p) => (p.id === optimized.id ? optimized : p))
          : [optimized, ...(cat.products || [])],
      };
    });
    setCatalogs(updated);
    dispatchImmediateCatalogSync(updated);
  };

  const handleDeleteProduct = (id: string) => {
    addDeletedProductId(id);
    const updated = catalogs.map((cat) =>
      cat.id === activeCatalogId
        ? { ...cat, products: cat.products.filter((p) => p.id !== id) }
        : cat
    );
    setCatalogs(updated);
    dispatchImmediateCatalogSync(updated);
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

    const updated = [...catalogs, newCat];
    setCatalogs(updated);
    setActiveCatalogId(newCat.id);
    dispatchImmediateCatalogSync(updated);
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    selectedSize?: string,
    customUnitPrice?: number,
    selectedImage?: string,
    selectedImageCode?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedImageCode === selectedImageCode
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedImageCode === selectedImageCode
            ? { ...item, quantity: item.quantity + 1, unitPrice: customUnitPrice ?? item.unitPrice }
            : item
        );
      }
      return [
        ...prev,
        {
          product: {
            ...product,
            // Override the default thumbnail in the cart item if they selected a specific variant image!
            image: selectedImage || product.image,
          },
          quantity: 1,
          selectedSize,
          selectedImage,
          selectedImageCode,
          unitPrice: customUnitPrice,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartKey: string, quantity: number) => {
    const getItemKey = (item: CartItem) => {
      let key = item.product.id;
      if (item.selectedSize) key += `_${item.selectedSize}`;
      if (item.selectedImageCode) key += `_${item.selectedImageCode}`;
      return key;
    };

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
    const getItemKey = (item: CartItem) => {
      let key = item.product.id;
      if (item.selectedSize) key += `_${item.selectedSize}`;
      if (item.selectedImageCode) key += `_${item.selectedImageCode}`;
      return key;
    };
    setCart((prev) => prev.filter((item) => getItemKey(item) !== cartKey));
  };

  // Auth operations
  const handleLogoutSeller = async () => {
    await logoutSeller();
    setSellerUser(null);
    setCurrentSellerName(null);
    setUserRole(null);
    localStorage.removeItem('catalogcraft_user_role');
    localStorage.removeItem('catalogcraft_username');
    setIsCustomerMode(true);
    setActiveViewingSellerUid(PRIMARY_STORE_UID);
    localStorage.setItem('catalogcraft_viewing_seller_uid', PRIMARY_STORE_UID);
  };

  const handleLoginSuccess = (username: string, role: 'seller' | 'customer') => {
    setCurrentSellerName(username);
    setUserRole(role);
    localStorage.setItem('catalogcraft_username', username);
    localStorage.setItem('catalogcraft_user_role', role);
    setActiveViewingSellerUid(PRIMARY_STORE_UID);
    localStorage.setItem('catalogcraft_viewing_seller_uid', PRIMARY_STORE_UID);
    if (role === 'customer') {
      setIsCustomerMode(true);
    } else {
      setIsCustomerMode(false);
    }
  };

  // Filter products strictly deduplicated by product ID
  const rawCatalogProducts = activeCatalog?.products || [];
  const seenCatalogProductIds = new Set<string>();
  const uniqueCatalogProducts = rawCatalogProducts.filter((p) => {
    if (!p || !p.id || seenCatalogProductIds.has(p.id)) return false;
    seenCatalogProductIds.add(p.id);
    return true;
  });

  const categories = ['all', ...Array.from(new Set(uniqueCatalogProducts.map((p) => p.category).filter(Boolean)))];

  const filteredProducts = uniqueCatalogProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      (p.sku && p.sku.toLowerCase().includes(query)) ||
      (p.imageDetails && p.imageDetails.some((d) => d.code && d.code.toLowerCase().includes(query)));
    return matchesCategory && matchesSearch;
  });

  // Performance Pagination / Load More Strategy
  const PRODUCTS_PER_PAGE = 100;
  const [visibleProductsCount, setVisibleProductsCount] = useState<number>(PRODUCTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination when category, search query, or active catalog changes
  useEffect(() => {
    setVisibleProductsCount(PRODUCTS_PER_PAGE);
  }, [selectedCategory, searchQuery, activeCatalogId]);

  // Infinite scroll trigger via IntersectionObserver
  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && visibleProductsCount < filteredProducts.length && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleProductsCount((prev) => Math.min(prev + PRODUCTS_PER_PAGE, filteredProducts.length));
            setIsLoadingMore(false);
          }, 150);
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [visibleProductsCount, filteredProducts.length, isLoadingMore]);

  const handleManualLoadMore = () => {
    setVisibleProductsCount((prev) => Math.min(prev + PRODUCTS_PER_PAGE, filteredProducts.length));
  };

  const handleShowAllProducts = () => {
    setVisibleProductsCount(filteredProducts.length);
  };

  // Sliced products for rendering
  const displayedProducts = filteredProducts.slice(0, visibleProductsCount);
  const hasMoreProducts = visibleProductsCount < filteredProducts.length;

  const handlePrint = () => {
    window.print();
  };

  const copyShareableLink = () => {
    try {
      const url = new URL(window.location.href);
      const target = (isSeller && sellerUid) || activeViewingSellerUid || 'bdy3TcO5IAOpmkQEy8zLGpEkENG3';
      url.searchParams.set('seller', target);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url.toString()).catch(() => {});
      }
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2000);
    } catch {}
  };

  // Grid layout column classes
  const gridLayoutClass = {
    'grid-2': 'grid grid-cols-2 gap-3 sm:gap-6',
    'grid-3': 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6',
    'grid-4': 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5',
    list: 'flex flex-col gap-4',
  }[layoutMode];

  if (!currentSellerName) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Decorative elements */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 animate-pulse" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-md w-full text-center mb-8 z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500 text-slate-950 text-3xl font-display font-extrabold shadow-lg shadow-emerald-500/20 mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
            🐾
          </div>
          <h1 className="font-display font-extrabold text-3xl text-white tracking-tight">
            {settings.storeName || 'Chihuahua Store'}
          </h1>
          <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto">
            Bienvenido al catálogo oficial. Por favor inicia sesión como Cliente o Vendedor para continuar.
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative z-10">
          <LoginModal
            isOpen={true}
            onClose={() => {}}
            onLoginSuccess={(name, role) => {
              handleLoginSuccess(name, role);
            }}
            allowClose={false}
            isInline={true}
          />
        </div>
        
        <div className="mt-8 text-center text-slate-500 text-[11px] z-10">
          © {new Date().getFullYear()} · Catálogos Chihuahua
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        settings={settings}
        catalogs={catalogs}
        activeCatalogId={activeCatalogId}
        onSelectCatalog={setActiveCatalogId}
        onCreateCatalog={handleCreateNewCatalog}
        onAddProduct={() => {
          setEditingProduct(null);
          setIsEditorOpen(true);
        }}
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
        userRole={userRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        
        {/* Mobile Quick Navigation & Mode Switcher Bar */}
        <div className="block md:hidden mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700">Catálogos:</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-2.5 py-1.5 text-xs font-extrabold bg-slate-900 text-white rounded-xl flex items-center gap-1 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{currentSellerName ? 'Mi Cuenta' : 'Ingresar'}</span>
              </button>

              {isSeller && (
                <button
                  onClick={() => setIsCustomerMode(!effectiveCustomerMode)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1 ${
                    effectiveCustomerMode
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {effectiveCustomerMode ? (
                    <>
                      <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Vendedor</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Cliente</span>
                    </>
                  )}
                </button>
              )}
            </div>
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

        {/* Sync Toast Notification */}
        {syncToastMessage && (
          <div className="mb-4 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center justify-between gap-3 text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <span>{syncToastMessage}</span>
            </div>
            <button
              onClick={() => setSyncToastMessage(null)}
              className="px-2.5 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Account Auto-Save Notice Banner */}
        {currentSellerName && !effectiveCustomerMode && (
          <div className="mb-6 p-3.5 bg-emerald-900 text-emerald-100 rounded-2xl shadow-xs border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Sesión activa como Vendedor: {currentSellerName}</span>
                <span className="block text-emerald-300 text-[11px]">
                  Cualquier producto agregado, cambio de precio o ajuste de tienda se sincroniza con la nube para todos los dispositivos.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleForceSyncToCloud}
                disabled={isSyncing}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 text-xs disabled:opacity-50"
                title="Forzar sincronización inmediata con la base de datos de la nube"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Nube'}</span>
              </button>
              <div className="flex items-center gap-1.5 bg-emerald-950 px-2.5 py-1.5 rounded-xl border border-emerald-700/60 font-mono text-[11px] text-emerald-300">
                <Cloud className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>{isSyncing ? 'Guardando...' : 'Nube Activa'}</span>
              </div>
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
                  onClick={() => {
                    setEditingProduct(null);
                    setIsEditorOpen(true);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>+ Agregar Producto Manualmente</span>
                </button>

                <button
                  onClick={handleForceSyncToCloud}
                  disabled={isSyncing}
                  className="px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  title="Sincronizar todos los productos del catálogo con la nube"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sincronizar Nube</span>
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
        {isLoadingCatalogs && (!activeCatalog || activeCatalog.products.length === 0) ? (
          <div className={gridLayoutClass}>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/80 p-4 animate-pulse flex flex-col space-y-3 shadow-xs"
              >
                <div className="w-full aspect-square bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                  <Sparkles className="w-8 h-8 opacity-25" />
                </div>
                <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-slate-100 rounded-md w-1/3" />
                  <div className="h-8 bg-slate-100 rounded-xl w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
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
          <>
            <div className={gridLayoutClass}>
              {displayedProducts.map((product) => (
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

            {/* Pagination / Load More Bar */}
            {filteredProducts.length > PRODUCTS_PER_PAGE && (
              <div className="mt-10 mb-6 flex flex-col items-center justify-center space-y-4">
                {/* Progress Indicator */}
                <div className="w-full max-w-xs text-center">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                    <span>Mostrando {displayedProducts.length} de {filteredProducts.length} productos</span>
                    <span>{Math.round((displayedProducts.length / filteredProducts.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${(displayedProducts.length / filteredProducts.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Actions: Cargar más & Mostrar todos */}
                {hasMoreProducts ? (
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleManualLoadMore}
                      disabled={isLoadingMore}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Cargando productos...</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 text-emerald-400" />
                          <span>Cargar más (+{Math.min(PRODUCTS_PER_PAGE, filteredProducts.length - displayedProducts.length)})</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleShowAllProducts}
                      className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
                    >
                      Mostrar todos ({filteredProducts.length})
                    </button>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200/60">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Has llegado al final del catálogo</span>
                  </div>
                )}

                {/* IntersectionObserver Sentinel for Infinite Scroll */}
                <div ref={loadMoreSentinelRef} className="h-4 w-full pointer-events-none" />
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-slate-600">
            © {new Date().getFullYear()} {settings.storeName} (Cuenta: {currentSellerName || 'General'})
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
        onLoginSuccess={(name, role) => {
          handleLoginSuccess(name, role);
        }}
        settings={settings}
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
        onSave={(newSettings) => {
          setSettings(newSettings);
          dispatchImmediateSettingsSync(newSettings);
        }}
      />

      <WhatsAppCartDrawer
        isOpen={isCartOpen}
        cart={cart}
        settings={settings}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        clientProfile={clientProfile}
        onUpdateClientProfile={handleUpdateClientProfile}
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
