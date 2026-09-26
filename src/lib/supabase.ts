import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Catalog, StoreSettings } from '../types/catalog';
import { rehydrateProduct } from './firestoreService';

const DEFAULT_SUPABASE_URL = 'https://dihwmebijaxeulmrjmrh.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaHdtZWJpamF4ZXVsbXJqbXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzODE4MzQsImV4cCI6MjEwNTk1NzgzNH0.3vSp8L1WMTEZ_l7Hc3eFmi1YyxIKxqf0UU71x5O7rNU';

export function getSupabaseConfig(): { url: string; key: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  if (envUrl && envKey) return { url: envUrl, key: envKey };
  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('catalogcraft_supabase_url') || '';
    const localKey = localStorage.getItem('catalogcraft_supabase_key') || '';
    if (localUrl && localKey) return { url: localUrl, key: localKey };
  }
  return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_ANON_KEY };
}

const config = getSupabaseConfig();

export const isSupabaseConfigured = Boolean(
  config.url &&
  config.key &&
  config.url.startsWith('https://') &&
  config.key.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Uploads a Base64 or Blob product image directly to Supabase Storage (CDN).
 * Eliminates the 1MB database document limit forever.
 */
export async function uploadBase64ImageToSupabase(
  base64Data: string,
  fileNamePrefix = 'prod'
): Promise<string> {
  if (!supabase || !base64Data || !base64Data.startsWith('data:')) {
    return base64Data; // Return as-is if not base64 or Supabase not yet configured
  }

  try {
    const parts = base64Data.split(';base64,');
    if (parts.length < 2) return base64Data;
    const contentType = parts[0].replace('data:', '') || 'image/jpeg';
    const raw = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    const blob = new Blob([uInt8Array], { type: contentType });

    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const filePath = `${fileNamePrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, blob, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError);
      return base64Data;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl || base64Data;
  } catch (err) {
    console.warn('Failed to upload image to Supabase:', err);
    return base64Data;
  }
}

/**
 * Fetch Catalogs from Supabase PostgreSQL
 */
export async function fetchCatalogsFromSupabase(sellerId: string): Promise<Catalog[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('catalogs')
      .select('*')
      .eq('seller_id', sellerId);

    if (error || !data || data.length === 0) return null;

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description || '',
      createdAt: d.created_at,
      updatedAt: d.updated_at,
      products: Array.isArray(d.products)
        ? d.products.map(rehydrateProduct)
        : [],
    }));
  } catch (err) {
    console.warn('Error fetching catalogs from Supabase:', err);
    return null;
  }
}

/**
 * Save Catalogs to Supabase PostgreSQL (Supports unlimited catalog and product sizes)
 */
export async function saveCatalogsToSupabase(
  sellerId: string,
  catalogs: Catalog[]
): Promise<boolean> {
  if (!supabase || !catalogs || catalogs.length === 0) return false;

  try {
    const records = catalogs.map((cat) => ({
      id: cat.id,
      seller_id: sellerId,
      title: cat.title,
      description: cat.description || '',
      products: (cat.products || []).map(rehydrateProduct),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('catalogs')
      .upsert(records, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase catalogs upsert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error saving catalogs to Supabase:', err);
    return false;
  }
}

/**
 * Fetch Store Settings from Supabase
 */
export async function fetchSettingsFromSupabase(sellerId: string): Promise<StoreSettings | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('seller_id', sellerId)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      storeName: data.store_name || 'Team Chihuahua',
      storeTagline: data.store_tagline || '',
      storeLogo: data.store_logo || '',
      coverImage: data.cover_image || '',
      whatsappNumber: data.whatsapp_number || '+584142947512',
      instagramHandle: data.instagram_handle || '',
      currencySymbol: data.currency_symbol || '$',
      themeColor: data.theme_color || 'emerald',
      catalogLayout: data.catalog_layout || 'grid-3',
      cartAnnouncement: data.cart_announcement || '',
    };
  } catch (err) {
    console.warn('Error fetching settings from Supabase:', err);
    return null;
  }
}

/**
 * Save Store Settings to Supabase
 */
export async function saveSettingsToSupabase(
  sellerId: string,
  settings: StoreSettings
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('store_settings').upsert(
      {
        id: 'settings_principal',
        seller_id: sellerId,
        store_name: settings.storeName,
        store_tagline: settings.storeTagline,
        store_logo: settings.storeLogo,
        cover_image: settings.coverImage,
        whatsapp_number: settings.whatsappNumber,
        instagram_handle: settings.instagramHandle,
        currency_symbol: settings.currencySymbol,
        theme_color: settings.themeColor,
        catalog_layout: settings.catalogLayout,
        cart_announcement: settings.cartAnnouncement,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    return !error;
  } catch (err) {
    console.warn('Error saving settings to Supabase:', err);
    return false;
  }
}

/**
 * Subscribe to Supabase Realtime changes
 */
export function subscribeToSupabaseCatalogs(
  sellerId: string,
  onData: (catalogs: Catalog[]) => void
): () => void {
  if (!supabase) return () => {};

  // Initial fetch
  fetchCatalogsFromSupabase(sellerId).then((cats) => {
    if (cats && cats.length > 0) {
      onData(cats);
    }
  });

  // Realtime channel
  const channel = supabase
    .channel(`public:catalogs:${sellerId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'catalogs',
        filter: `seller_id=eq.${sellerId}`,
      },
      async () => {
        const fresh = await fetchCatalogsFromSupabase(sellerId);
        if (fresh && fresh.length > 0) {
          onData(fresh);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
