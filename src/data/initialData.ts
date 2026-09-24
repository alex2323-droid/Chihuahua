import { StoreSettings, Catalog } from '../types/catalog';

import heroBannerImg from '../assets/images/hero_store_banner_1790201141798.jpg';
import sneakersImg from '../assets/images/product_demo_sneakers_1790201152701.jpg';
import watchImg from '../assets/images/product_demo_watch_1790201162642.jpg';

export const initialStoreSettings: StoreSettings = {
  storeName: 'Team Chihuahua',
  storeTagline: 'Tu tienda de encargos',
  storeLogo: '/logo_chihuahua.jpg',
  coverImage: heroBannerImg,
  whatsappNumber: '+525512345678',
  instagramHandle: '@boutique.tendencias',
  currencySymbol: '$',
  themeColor: 'emerald',
  catalogLayout: 'grid-3',
  cartAnnouncement: '✨ ¡Por compras mayores a $50, el envío a domicilio es completamente gratis! 🚚💨',
};

export const initialCatalogs: Catalog[] = [
  {
    id: 'cat_principal',
    title: 'Catálogo Principal',
    description: 'Catálogo oficial de productos.',
    createdAt: new Date().toISOString(),
    products: [],
  },
];
