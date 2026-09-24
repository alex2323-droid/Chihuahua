export interface SizeVariant {
  size: string;
  price: number;
  originalPrice?: number | null;
}

export interface Product {
  id: string;
  sourceUrl?: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number | null;
  currency: string;
  category: string;
  brand: string;
  sizes?: string;
  availableSizes?: string[];
  sizeVariants?: SizeVariant[];
  badge?: string;
  inStock: boolean;
  favicon?: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  storeLogo: string;
  coverImage: string;
  whatsappNumber: string;
  instagramHandle: string;
  currencySymbol: string;
  themeColor: 'emerald' | 'amber' | 'cobalt' | 'rose' | 'dark' | 'violet';
  catalogLayout: 'grid-3' | 'grid-2' | 'grid-4' | 'list' | 'story';
  cartAnnouncement?: string;
}

export interface Catalog {
  id: string;
  title: string;
  description: string;
  products: Product[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  unitPrice?: number;
}
