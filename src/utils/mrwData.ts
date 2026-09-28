import { MRWShippingInfo, SpecialOrderRequest, StoreSettings } from '../types/catalog';

export const VENEZUELA_STATES = [
  'Distrito Capital (Caracas)',
  'Anzoátegui',
  'Aragua',
  'Barinas',
  'Bolívar',
  'Carabobo',
  'Cojedes',
  'Falcón',
  'Guárico',
  'Lara',
  'Mérida',
  'Miranda',
  'Monagas',
  'Nueva Esparta (Margarita)',
  'Portuguesa',
  'Sucre',
  'Táchira',
  'Trujillo',
  'La Guaira (Vargas)',
  'Yaracuy',
  'Zulia',
  'Apure',
  'Amazonas',
  'Delta Amacuro',
];

export const HOME_DELIVERY_LOCATIONS = [
  {
    id: 'zaraza',
    city: 'Zaraza',
    municipality: 'Pedro Zaraza',
    state: 'Guárico',
    displayName: 'Toda Zaraza',
    shortName: 'Zaraza',
    description: 'Municipio Pedro Zaraza • Entrega a domicilio local',
  },
  {
    id: 'valle-de-la-pascua',
    city: 'Valle de la Pascua',
    municipality: 'Leonardo Infante',
    state: 'Guárico',
    displayName: 'Toda Valle de la Pascua',
    shortName: 'Valle de la Pascua',
    description: 'Municipio Leonardo Infante • Entrega a domicilio local',
  },
] as const;

export const isHomeDeliveryLocation = (
  city?: string,
  municipality?: string,
  state?: string
): boolean => {
  const c = (city || '').toLowerCase();
  const m = (municipality || '').toLowerCase();
  const s = (state || '').toLowerCase();

  if (s && !s.includes('guárico') && !s.includes('guarico')) {
    return false;
  }

  const isZaraza = c.includes('zaraza') || m.includes('zaraza');
  const isPascua = c.includes('pascua') || m.includes('infante');

  return isZaraza || isPascua;
};

export const DEFAULT_MRW_INFO: MRWShippingInfo = {
  fullName: '',
  cedula: '',
  phone: '',
  state: 'Distrito Capital (Caracas)',
  municipality: 'Libertador',
  city: 'Caracas (Libertador)',
  shippingType: 'agencia',
  agencyOrAddress: '',
  notes: '',
};

/**
  * Formats MRW Shipping information into clean WhatsApp text block
  */
export const formatMRWShippingMessage = (shipping: MRWShippingInfo): string => {
  if (!shipping || !shipping.fullName) return '';

  const isHomeDelivery = shipping.shippingType === 'domicilio';
  const shippingTypeLabel = isHomeDelivery
    ? '🚚 Entrega Directa a Domicilio (Exclusivo Zaraza / Valle de la Pascua)'
    : '🏬 Retiro en Oficina/Agencia MRW';

  let msg = `\n🚚 *DATOS PARA ENVÍO NACIONAL (MRW VENEZUELA):*\n`;
  msg += `👤 *Destinatario:* ${shipping.fullName.trim()}\n`;
  if (shipping.cedula) msg += `🆔 *Cédula/RIF:* ${shipping.cedula.trim()}\n`;
  if (shipping.phone) msg += `📞 *Teléfono:* ${shipping.phone.trim()}\n`;
  const locationParts = [shipping.state];
  if (shipping.municipality) locationParts.push(`Mnpio. ${shipping.municipality.trim()}`);
  if (shipping.city) locationParts.push(shipping.city.trim());
  msg += `📍 *Ubicación:* ${locationParts.join(' - ')}\n`;
  msg += `📦 *Modalidad:* ${shippingTypeLabel}\n`;
  msg += `🏢 *${isHomeDelivery ? 'Dirección Exacta de Entrega' : 'Agencia / Dirección'}:* ${shipping.agencyOrAddress.trim()}\n`;

  if (shipping.notes && shipping.notes.trim()) {
    msg += `📝 *Observaciones:* ${shipping.notes.trim()}\n`;
  }

  return msg;
};

/**
  * Generates WhatsApp message for a Special Custom Order Request
  */
export const generateSpecialOrderWhatsAppUrl = (
  storeSettings: StoreSettings,
  request: SpecialOrderRequest
): string => {
  const cleanPhone = (storeSettings.whatsappNumber || '573000000000').replace(/[^0-9]/g, '');
  const storeName = storeSettings.storeName || 'Tienda';
  const currencySymbol = storeSettings.currencySymbol || '$';

  let msg = `✨ *SOLICITUD DE ENCARGO ESPECIAL* ✨\n`;
  msg += `Hola *${storeName}*, me gustaría encargar un artículo que no se encuentra en el catálogo:\n\n`;
  msg += `📦 *PRODUCTO QUE BUSCO:*\n`;
  msg += `📌 *Descripción:* ${request.productName.trim()}\n`;

  if (request.specifications && request.specifications.trim()) {
    msg += `📏 *Talla / Color / Especificaciones:* ${request.specifications.trim()}\n`;
  }

  if (request.estimatedBudget && request.estimatedBudget.trim()) {
    msg += `💵 *Presupuesto Estimado:* ${currencySymbol}${request.estimatedBudget.trim()}\n`;
  }

  if (request.referenceUrlOrImage && request.referenceUrlOrImage.trim()) {
    msg += `🔗 *Foto / Enlace de Referencia:* ${request.referenceUrlOrImage.trim()}\n`;
  }

  msg += formatMRWShippingMessage(request.shippingInfo);

  msg += `\n¿Podrían indicarme si pueden conseguirlo y cuál sería el costo/tiempo de entrega? ¡Quedo atento! 🙏`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
};
