import { describe, it, expect } from 'vitest';
import {
  MRW_AGENCIES_DATABASE,
  getMRWMunicipalitiesForState,
  getMRWCitiesForState,
  getMRWAgenciesByStateAndCity,
  searchMRWAgencies,
  calculateDistanceKm,
  getClosestMRWAgencies,
} from '../data/mrwAgenciesData';
import {
  formatMRWShippingMessage,
  generateSpecialOrderWhatsAppUrl,
  DEFAULT_MRW_INFO,
  HOME_DELIVERY_LOCATIONS,
  isHomeDeliveryLocation,
} from './mrwData';
import { MRWShippingInfo, SpecialOrderRequest, StoreSettings } from '../types/catalog';

describe('MRW Venezuela Agencies Database & Helpers', () => {
  it('loads 250 official MRW agencies from Venezuela', () => {
    expect(MRW_AGENCIES_DATABASE.length).toBe(250);
  });

  it('correctly separates Tucupido and Zaraza into their distinct municipalities and cities', () => {
    // Guárico municipalities
    const guaricoMuns = getMRWMunicipalitiesForState('Guárico');
    expect(guaricoMuns).toContain('Pedro Zaraza');
    expect(guaricoMuns).toContain('José Félix Ribas');
    expect(guaricoMuns).toContain('Leonardo Infante');
    expect(guaricoMuns).toContain('Juan Germán Roscio');

    // Zaraza belongs to Municipio Pedro Zaraza
    const zarazaAgencies = getMRWAgenciesByStateAndCity('Guárico', 'Zaraza', 'Pedro Zaraza');
    expect(zarazaAgencies.length).toBe(1);
    expect(zarazaAgencies[0].code).toBe('#1203000');
    expect(zarazaAgencies[0].name).toContain('Zaraza');
    expect(zarazaAgencies[0].municipality).toBe('Pedro Zaraza');
    expect(zarazaAgencies[0].city).toBe('Zaraza');

    // Tucupido belongs to Municipio José Félix Ribas
    const tucupidoAgencies = getMRWAgenciesByStateAndCity('Guárico', 'Tucupido', 'José Félix Ribas');
    expect(tucupidoAgencies.length).toBe(1);
    expect(tucupidoAgencies[0].code).toBe('#1204000');
    expect(tucupidoAgencies[0].name).toContain('Tucupido');
    expect(tucupidoAgencies[0].municipality).toBe('José Félix Ribas');
    expect(tucupidoAgencies[0].city).toBe('Tucupido');

    // Cities for José Félix Ribas should NOT include Zaraza
    const ribasCities = getMRWCitiesForState('Guárico', 'José Félix Ribas');
    expect(ribasCities).toEqual(['Tucupido']);

    // Cities for Pedro Zaraza should NOT include Tucupido
    const zarazaCities = getMRWCitiesForState('Guárico', 'Pedro Zaraza');
    expect(zarazaCities).toEqual(['Zaraza']);
  });

  it('validates that home delivery is only allowed in Zaraza and Valle de la Pascua', () => {
    expect(HOME_DELIVERY_LOCATIONS.length).toBe(2);
    expect(HOME_DELIVERY_LOCATIONS.map((l) => l.city)).toContain('Zaraza');
    expect(HOME_DELIVERY_LOCATIONS.map((l) => l.city)).toContain('Valle de la Pascua');

    // Zaraza check
    expect(isHomeDeliveryLocation('Zaraza', 'Pedro Zaraza', 'Guárico')).toBe(true);
    expect(isHomeDeliveryLocation('Zaraza', '', 'Guárico')).toBe(true);

    // Valle de la Pascua check
    expect(isHomeDeliveryLocation('Valle de la Pascua', 'Leonardo Infante', 'Guárico')).toBe(true);
    expect(isHomeDeliveryLocation('Valle de la Pascua', '', 'Guárico')).toBe(true);

    // Other cities should return false for home delivery
    expect(isHomeDeliveryLocation('Tucupido', 'José Félix Ribas', 'Guárico')).toBe(false);
    expect(isHomeDeliveryLocation('San Juan de los Morros', 'Juan Germán Roscio', 'Guárico')).toBe(false);
    expect(isHomeDeliveryLocation('Valencia', 'Valencia', 'Carabobo')).toBe(false);
    expect(isHomeDeliveryLocation('Caracas', 'Libertador', 'Distrito Capital (Caracas)')).toBe(false);
  });

  it('calculates geographic distance between two coordinates accurately', () => {
    // Caracas to Valencia approx 120-130 km
    const dist = calculateDistanceKm(10.5058, -66.9144, 10.1978, -68.0053);
    expect(dist).toBeGreaterThan(110);
    expect(dist).toBeLessThan(140);
  });

  it('finds closest agencies based on GPS coordinates', () => {
    // Coordinates near Caracas Chacao (10.4913, -66.8581)
    const closest = getClosestMRWAgencies(10.4913, -66.8581, 5);
    expect(closest.length).toBe(5);
    expect(closest[0].distanceKm).toBeLessThan(5);
    expect(closest[0].state).toContain('Distrito Capital');
  });

  it('correctly lists cities for a given state with MRW branches', () => {
    const caraboboCities = getMRWCitiesForState('Carabobo');
    expect(caraboboCities).toContain('Valencia');
    expect(caraboboCities).toContain('Naguanagua');
    expect(caraboboCities).toContain('San Diego');
    expect(caraboboCities).toContain('Puerto Cabello');
    expect(caraboboCities.length).toBeGreaterThan(5);

    const dcCities = getMRWCitiesForState('Distrito Capital (Caracas)');
    expect(dcCities.length).toBeGreaterThan(3);
  });

  it('filters agencies by state and city', () => {
    const valenciaAgencies = getMRWAgenciesByStateAndCity('Carabobo', 'Valencia');
    expect(valenciaAgencies.length).toBeGreaterThanOrEqual(10);
    expect(valenciaAgencies[0].state).toBe('Carabobo');
    expect(valenciaAgencies[0].code).toMatch(/^#?\d+/);

    const naguanaguaAgencies = getMRWAgenciesByStateAndCity('Carabobo', 'Naguanagua');
    expect(naguanaguaAgencies.length).toBeGreaterThanOrEqual(1);
    expect(naguanaguaAgencies[0].name.toLowerCase()).toContain('naguanagua');
  });

  it('searches agencies across text query, code, or address', () => {
    const searchCode = searchMRWAgencies('0800000');
    expect(searchCode.length).toBeGreaterThanOrEqual(1);
    expect(searchCode[0].name.toLowerCase()).toContain('valencia');

    const searchSambil = searchMRWAgencies('Sambil');
    expect(searchSambil.length).toBeGreaterThanOrEqual(1);
  });

  it('formats MRW shipping message block accurately for WhatsApp', () => {
    const info: MRWShippingInfo = {
      fullName: 'Carlos Mendoza',
      cedula: 'V-19876543',
      phone: '04141234567',
      state: 'Carabobo',
      city: 'Valencia',
      shippingType: 'agencia',
      agencyOrAddress: '#0800000 - MRW Valencia Centro (Av. Miranda Local 118-31)',
      notes: 'Llamar al llegar',
    };

    const formatted = formatMRWShippingMessage(info);
    expect(formatted).toContain('Carlos Mendoza');
    expect(formatted).toContain('V-19876543');
    expect(formatted).toContain('04141234567');
    expect(formatted).toContain('Carabobo');
    expect(formatted).toContain('#0800000 - MRW Valencia Centro');
    expect(formatted).toContain('Retiro en Oficina/Agencia MRW');
    expect(formatted).toContain('Llamar al llegar');
  });

  it('generates WhatsApp URL for special custom requests with MRW data', () => {
    const settings: StoreSettings = {
      storeName: 'Chihuahua Store',
      storeTagline: 'Tu tienda favorita',
      storeLogo: '',
      coverImage: '',
      whatsappNumber: '584141234567',
      instagramHandle: 'chihuahuastore',
      currencySymbol: '$',
      themeColor: 'emerald',
      catalogLayout: 'grid-3',
    };

    const request: SpecialOrderRequest = {
      productName: 'Chaqueta de Cuero Vintage',
      specifications: 'Talla L, Color Marrón',
      estimatedBudget: '85',
      referenceUrlOrImage: 'https://ejemplo.com/foto.jpg',
      shippingInfo: {
        fullName: 'Ana Gómez',
        cedula: 'V-20123456',
        phone: '04249876543',
        state: 'Distrito Capital (Caracas)',
        city: 'Caracas - Chacao',
        shippingType: 'agencia',
        agencyOrAddress: '#0105000 - MRW Chacao (Calle El Muñeco)',
      },
    };

    const url = generateSpecialOrderWhatsAppUrl(settings, request);
    expect(url).toContain('https://wa.me/584141234567?text=');
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('SOLICITUD DE ENCARGO ESPECIAL');
    expect(decoded).toContain('Chaqueta de Cuero Vintage');
    expect(decoded).toContain('Ana Gómez');
    expect(decoded).toContain('#0105000 - MRW Chacao');
  });
});
