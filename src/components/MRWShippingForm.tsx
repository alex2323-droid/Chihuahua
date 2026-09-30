import React, { useState, useMemo, useEffect } from 'react';
import {
  User,
  Phone,
  MapPin,
  Truck,
  Building2,
  CreditCard,
  AlertCircle,
  Info,
  Search,
  ExternalLink,
  CheckCircle2,
  Navigation,
  Compass,
  Loader2,
  Edit3,
  Globe,
} from 'lucide-react';
import { MRWShippingInfo } from '../types/catalog';
import { VENEZUELA_STATES, HOME_DELIVERY_LOCATIONS, isHomeDeliveryLocation } from '../utils/mrwData';
import { MRWAgencySearchModal } from './MRWAgencySearchModal';
import {
  MRWAgency,
  OFFICIAL_MRW_URL,
  getMRWMunicipalitiesForState,
  getMRWCitiesForState,
  getMRWAgenciesByStateAndCity,
  getClosestMRWAgencies,
} from '../data/mrwAgenciesData';

interface MRWShippingFormProps {
  shippingInfo: MRWShippingInfo;
  onChange: (updated: MRWShippingInfo) => void;
  errors?: Record<string, string>;
}

export const MRWShippingForm: React.FC<MRWShippingFormProps> = ({
  shippingInfo,
  onChange,
  errors = {},
}) => {
  const [isAgencySearchOpen, setIsAgencySearchOpen] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const saveToStorage = (data: MRWShippingInfo) => {
    try {
      localStorage.setItem('catalogcraft_mrw_shipping_data', JSON.stringify(data));
    } catch {}
  };

  const handleChange = (field: keyof MRWShippingInfo, value: any) => {
    const updated = { ...shippingInfo, [field]: value };
    onChange(updated);
    saveToStorage(updated);
  };

  // Available municipalities in the currently selected state
  const availableMunicipalities = useMemo(() => {
    return getMRWMunicipalitiesForState(shippingInfo.state);
  }, [shippingInfo.state]);

  // Available cities in the currently selected state and municipality
  const availableCities = useMemo(() => {
    return getMRWCitiesForState(shippingInfo.state, shippingInfo.municipality);
  }, [shippingInfo.state, shippingInfo.municipality]);

  // Available MRW agencies in the currently selected state, municipality and city
  const availableAgencies = useMemo(() => {
    if (!shippingInfo.state) return [];
    return getMRWAgenciesByStateAndCity(shippingInfo.state, shippingInfo.city, shippingInfo.municipality);
  }, [shippingInfo.state, shippingInfo.city, shippingInfo.municipality]);

  // If agency is selected from the list, find matching agency object
  const currentAgency = useMemo(() => {
    if (!shippingInfo.agencyOrAddress) return null;
    return (
      availableAgencies.find(
        (a) =>
          shippingInfo.agencyOrAddress.includes(a.code) ||
          shippingInfo.agencyOrAddress.toLowerCase().includes(a.name.toLowerCase())
      ) || null
    );
  }, [availableAgencies, shippingInfo.agencyOrAddress]);

  // Automatically adjust municipality & city when state changes
  const handleStateChange = (newState: string) => {
    const municipalities = getMRWMunicipalitiesForState(newState);
    const newMun = municipalities.length > 0 ? municipalities[0] : '';
    const cities = getMRWCitiesForState(newState, newMun);
    const newCity = cities.length > 0 ? cities[0] : '';
    const agencies = getMRWAgenciesByStateAndCity(newState, newCity, newMun);
    const firstAgency = agencies.length > 0 ? agencies[0] : null;

    const updated: MRWShippingInfo = {
      ...shippingInfo,
      state: newState,
      municipality: newMun,
      city: newCity,
      agencyOrAddress:
        shippingInfo.shippingType === 'agencia' && firstAgency
          ? `${firstAgency.code} - ${firstAgency.name} (${firstAgency.address})`
          : shippingInfo.shippingType === 'agencia'
          ? ''
          : shippingInfo.agencyOrAddress,
    };
    onChange(updated);
    saveToStorage(updated);
  };

  // When municipality changes, update municipality, city, and select first available agency
  const handleMunicipalityChange = (newMun: string) => {
    const cities = getMRWCitiesForState(shippingInfo.state, newMun);
    const newCity = cities.length > 0 ? cities[0] : '';
    const agencies = getMRWAgenciesByStateAndCity(shippingInfo.state, newCity, newMun);
    const firstAgency = agencies.length > 0 ? agencies[0] : null;

    const updated: MRWShippingInfo = {
      ...shippingInfo,
      municipality: newMun,
      city: newCity,
      agencyOrAddress:
        shippingInfo.shippingType === 'agencia' && firstAgency
          ? `${firstAgency.code} - ${firstAgency.name} (${firstAgency.address})`
          : shippingInfo.agencyOrAddress,
    };
    onChange(updated);
    saveToStorage(updated);
  };

  // When city changes, update city and auto-select first available agency in that city
  const handleCityChange = (newCity: string) => {
    const agencies = getMRWAgenciesByStateAndCity(shippingInfo.state, newCity, shippingInfo.municipality);
    const firstAgency = agencies.length > 0 ? agencies[0] : null;

    const updated: MRWShippingInfo = {
      ...shippingInfo,
      city: newCity,
      agencyOrAddress:
        shippingInfo.shippingType === 'agencia' && firstAgency
          ? `${firstAgency.code} - ${firstAgency.name} (${firstAgency.address})`
          : shippingInfo.agencyOrAddress,
    };
    onChange(updated);
    saveToStorage(updated);
  };

  // When customer selects an agency from dropdown
  const handleAgencySelect = (agencyCode: string) => {
    const found = availableAgencies.find((a) => a.code === agencyCode);
    if (found) {
      const updated: MRWShippingInfo = {
        ...shippingInfo,
        municipality: found.municipality || shippingInfo.municipality,
        city: found.city || shippingInfo.city,
        agencyOrAddress: `${found.code} - ${found.name} (${found.address})`,
      };
      onChange(updated);
      saveToStorage(updated);
      setIsManualInput(false);
    }
  };

  // When agency is picked from modal
  const handleModalAgencySelect = (agency: MRWAgency) => {
    const updated: MRWShippingInfo = {
      ...shippingInfo,
      state: agency.state,
      municipality: agency.municipality,
      city: agency.city,
      agencyOrAddress: `${agency.code} - ${agency.name} (${agency.address})`,
    };
    onChange(updated);
    saveToStorage(updated);
    setIsManualInput(false);
  };

  // Auto-detect closest agency using GPS
  const handleFindClosestAgency = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });

        const closest = getClosestMRWAgencies(lat, lng, 1);
        if (closest && closest.length > 0) {
          const nearest = closest[0];
          const updated: MRWShippingInfo = {
            ...shippingInfo,
            shippingType: 'agencia',
            state: nearest.state,
            municipality: nearest.municipality,
            city: nearest.city,
            agencyOrAddress: `${nearest.code} - ${nearest.name} (${nearest.address})`,
          };
          onChange(updated);
          saveToStorage(updated);
          setIsManualInput(false);
        }
      },
      () => {
        setIsLocating(false);
        setIsAgencySearchOpen(true);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Ensure default city is set if empty and in agency mode
  useEffect(() => {
    if (shippingInfo.shippingType === 'agencia' && availableCities.length > 0 && !shippingInfo.city) {
      handleCityChange(availableCities[0]);
    }
  }, [shippingInfo.state, shippingInfo.shippingType]);

  // Ensure that in home delivery mode, agency codes or leftover agency strings are cleared
  useEffect(() => {
    if (
      shippingInfo.shippingType === 'domicilio' &&
      shippingInfo.agencyOrAddress &&
      (shippingInfo.agencyOrAddress.startsWith('#') || shippingInfo.agencyOrAddress.includes('MRW '))
    ) {
      const updated = { ...shippingInfo, agencyOrAddress: '' };
      onChange(updated);
      saveToStorage(updated);
    }
  }, [shippingInfo.shippingType, shippingInfo.agencyOrAddress]);

  return (
    <div className="space-y-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-600 text-white font-black text-[10px] flex items-center justify-center shadow-2xs shrink-0 tracking-tighter">
            MRW
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Datos para Envío Nacional MRW
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">250 agencias oficiales sincronizadas a nivel nacional</p>
          </div>
        </div>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200/60 dark:border-red-900/60">
          MRW Venezuela
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Nombre y Apellido Destinatario <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ej: María Alejandra Pérez"
              value={shippingInfo.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-colors ${
                errors.fullName ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700 focus:border-red-500'
              }`}
            />
            <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          {errors.fullName && (
            <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Cédula / RIF */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Cédula de Identidad / RIF <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ej: V-18.492.512"
              value={shippingInfo.cedula}
              onChange={(e) => handleChange('cedula', e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-colors font-mono ${
                errors.cedula ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700 focus:border-red-500'
              }`}
            />
            <CreditCard className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          {errors.cedula && (
            <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.cedula}</span>
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Teléfono de Contacto MRW <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              placeholder="Ej: 0414-1234567"
              value={shippingInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-colors font-mono ${
                errors.phone ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700 focus:border-red-500'
              }`}
            />
            <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          {errors.phone && (
            <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* Shipping Type */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Modalidad de Envío por MRW
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                handleChange('shippingType', 'agencia');
                setIsManualInput(false);
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                shippingInfo.shippingType === 'agencia'
                  ? 'border-red-600 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-bold ring-2 ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <span className="block text-xs font-bold">Agencia MRW</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-normal">Retiro nacional (250 agencias)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                const currentIsHome = isHomeDeliveryLocation(shippingInfo.city, shippingInfo.municipality, shippingInfo.state);
                const targetLoc = currentIsHome && shippingInfo.city.toLowerCase().includes('pascua')
                  ? HOME_DELIVERY_LOCATIONS[1]
                  : HOME_DELIVERY_LOCATIONS[0];

                const isPreviousAgencyText =
                  shippingInfo.agencyOrAddress?.startsWith('#') ||
                  shippingInfo.agencyOrAddress?.includes('MRW ');

                const updated: MRWShippingInfo = {
                  ...shippingInfo,
                  shippingType: 'domicilio',
                  state: targetLoc.state,
                  municipality: targetLoc.municipality,
                  city: targetLoc.city,
                  agencyOrAddress: isPreviousAgencyText ? '' : (shippingInfo.shippingType === 'domicilio' ? shippingInfo.agencyOrAddress : ''),
                };
                onChange(updated);
                saveToStorage(updated);
                setIsManualInput(true);
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                shippingInfo.shippingType === 'domicilio'
                  ? 'border-red-600 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-bold ring-2 ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Truck className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="block text-xs font-bold">A Domicilio</span>
                  <span className="text-[9px] font-black bg-red-600 text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    Exclusivo
                  </span>
                </div>
                <span className="text-[10px] text-red-700 dark:text-red-300 block font-semibold">Toda Zaraza y Valle de la Pascua</span>
              </div>
            </button>
          </div>
        </div>

        {/* Home Delivery Restricted Zones Selector (Only Zaraza & Valle de la Pascua) */}
        {shippingInfo.shippingType === 'domicilio' && (
          <div className="sm:col-span-2 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Zona de Entrega a Domicilio Autorizada</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/50 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/60">
                Estado Guárico
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HOME_DELIVERY_LOCATIONS.map((loc) => {
                const isSelected =
                  shippingInfo.city.toLowerCase().includes(loc.shortName.toLowerCase()) ||
                  (loc.id === 'zaraza' && shippingInfo.municipality?.toLowerCase().includes('zaraza')) ||
                  (loc.id === 'valle-de-la-pascua' && shippingInfo.municipality?.toLowerCase().includes('infante'));

                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      const updated: MRWShippingInfo = {
                        ...shippingInfo,
                        state: loc.state,
                        municipality: loc.municipality,
                        city: loc.city,
                      };
                      onChange(updated);
                      saveToStorage(updated);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start justify-between gap-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-50/90 dark:bg-red-950/50 ring-2 ring-red-500/20 shadow-2xs text-red-950 dark:text-red-200 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{loc.displayName}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-normal mt-0.5">
                        {loc.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-2.5 bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Importante:</strong> Los envíos a domicilio son <strong>únicamente en toda Zaraza y toda Valle de la Pascua</strong>. Para el resto del país, selecciona <strong>Agencia MRW</strong> para retirar en cualquiera de las 250 sucursales.
              </span>
            </div>
          </div>
        )}

        {/* Geographic Selectors for Agency Pickups */}
        {shippingInfo.shippingType === 'agencia' && (
          <>
            {/* State */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Estado (Venezuela) <span className="text-red-500">*</span>
              </label>
              <select
                value={shippingInfo.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-red-500 font-medium cursor-pointer"
              >
                {VENEZUELA_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Municipality */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Municipio <span className="text-red-500">*</span>
                </label>
                {availableMunicipalities.length > 0 && (
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold">
                    {availableMunicipalities.length} {availableMunicipalities.length === 1 ? 'municipio' : 'municipios'}
                  </span>
                )}
              </div>
              {availableMunicipalities.length > 0 ? (
                <select
                  value={shippingInfo.municipality || ''}
                  onChange={(e) => handleMunicipalityChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-red-500 font-medium cursor-pointer"
                >
                  {availableMunicipalities.map((mun) => {
                    const count = getMRWAgenciesByStateAndCity(shippingInfo.state, undefined, mun).length;
                    return (
                      <option key={mun} value={mun}>
                        {mun} ({count} {count === 1 ? 'agencia' : 'agencias'})
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Municipio..."
                  value={shippingInfo.municipality || ''}
                  onChange={(e) => handleChange('municipality', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-red-500 font-medium"
                />
              )}
            </div>

            {/* City / Población with Agency Count */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Ciudad / Población <span className="text-red-500">*</span>
                </label>
                {availableCities.length > 0 && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    {availableCities.length} {availableCities.length === 1 ? 'ciudad' : 'ciudades'} con MRW en este municipio
                  </span>
                )}
              </div>

              {availableCities.length > 0 ? (
                <select
                  value={shippingInfo.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className={`w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none transition-colors font-medium cursor-pointer ${
                    errors.city ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700 focus:border-red-500'
                  }`}
                >
                  {availableCities.map((ct) => {
                    const count = getMRWAgenciesByStateAndCity(shippingInfo.state, ct, shippingInfo.municipality).length;
                    return (
                      <option key={ct} value={ct}>
                        {ct} ({count} {count === 1 ? 'agencia' : 'agencias'})
                      </option>
                    );
                  })}
                </select>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej: Tucupido, Zaraza, Valencia, Caracas..."
                    value={shippingInfo.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={`w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none transition-colors ${
                      errors.city ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700 focus:border-red-500'
                    }`}
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              )}

              {errors.city && (
                <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.city}</span>
                </p>
              )}
            </div>
          </>
        )}

        {/* Agency Selection Block (When shippingType === 'agencia') */}
        {shippingInfo.shippingType === 'agencia' && (
          <div className="sm:col-span-2 space-y-2 pt-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>
                  Agencias MRW en {shippingInfo.city || shippingInfo.state} ({availableAgencies.length})
                </span>
                <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-1.5">
                {/* Proximity / Nearest Agency Trigger */}
                <button
                  type="button"
                  onClick={handleFindClosestAgency}
                  disabled={isLocating}
                  className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  title="Detectar con GPS la agencia de MRW más cercana a ti"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-emerald-700 dark:text-emerald-400" />
                      <span>Buscando...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                      <span>📍 Más Cercana</span>
                    </>
                  )}
                </button>

                {/* General Search Modal */}
                <button
                  type="button"
                  onClick={() => setIsAgencySearchOpen(true)}
                  className="text-[10px] font-extrabold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/50 hover:bg-red-200 dark:hover:bg-red-900/60 px-2 py-0.5 rounded-lg border border-red-200 dark:border-red-900/60 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Abrir buscador completo de las 250 agencias oficiales de Venezuela"
                >
                  <Search className="w-3 h-3 text-red-600 dark:text-red-400" />
                  <span>Buscador Oficial</span>
                </button>

                <a
                  href={OFFICIAL_MRW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-0.5"
                  title="Consultar directorio oficial en mrwve.com"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden xs:inline">mrwve.com</span>
                </a>
              </div>
            </div>

            {/* Quick Agency Dropdown for the Selected City */}
            {availableAgencies.length > 0 && !isManualInput ? (
              <div className="space-y-2">
                <select
                  value={currentAgency ? currentAgency.code : ''}
                  onChange={(e) => handleAgencySelect(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-red-300 dark:border-red-900/60 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-500 cursor-pointer"
                >
                  <option value="" disabled>
                    -- Selecciona la agencia MRW en {shippingInfo.city} --
                  </option>
                  {availableAgencies.map((agency) => (
                    <option key={agency.code} value={agency.code}>
                      {agency.code} - {agency.name.replace(/^MRW\s+/i, '')}
                    </option>
                  ))}
                </select>

                {/* Selected Agency Preview Card */}
                {currentAgency ? (
                  <div className="p-3 bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xl space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-black bg-red-600 text-white px-1.5 py-0.5 rounded">
                          {currentAgency.code}
                        </span>
                        <span className="text-xs font-bold text-red-950 dark:text-red-200">{currentAgency.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Agencia Seleccionada</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>{currentAgency.address}</span>
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] flex-wrap gap-2">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        📍 {currentAgency.state} • 🏛️ Mnpio. {currentAgency.municipality} • 🏙️ {currentAgency.city}
                      </span>
                      <div className="flex items-center gap-2">
                        {currentAgency.lat && currentAgency.lng && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${currentAgency.lat},${currentAgency.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-700 dark:text-red-400 hover:underline flex items-center gap-0.5 font-bold"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Ver mapa</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsManualInput(true)}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar texto</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Por favor selecciona tu agencia en la lista superior para completar el pedido.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <textarea
                  rows={2}
                  placeholder="Ej: #0800000 - MRW Valencia Centro (Av. Miranda Local 118-31)"
                  value={shippingInfo.agencyOrAddress}
                  onChange={(e) => handleChange('agencyOrAddress', e.target.value)}
                  className={`w-full p-2 bg-white dark:bg-slate-900 border rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none transition-colors ${
                    errors.agencyOrAddress
                      ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30'
                      : 'border-slate-300 dark:border-slate-700 focus:border-red-500'
                  }`}
                />
                {availableAgencies.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsManualInput(false);
                      if (availableAgencies.length > 0) {
                        handleAgencySelect(availableAgencies[0].code);
                      }
                    }}
                    className="text-[10px] text-red-600 dark:text-red-400 hover:underline font-bold cursor-pointer"
                  >
                    ← Volver a la lista de agencias de {shippingInfo.city}
                  </button>
                )}
              </div>
            )}

            {errors.agencyOrAddress && (
              <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.agencyOrAddress}</span>
              </p>
            )}
          </div>
        )}

        {/* Delivery Address (When shippingType === 'domicilio') */}
        {shippingInfo.shippingType === 'domicilio' && (
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Dirección Exacta de Entrega a Domicilio <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Sector Centro, Calle Bolívar cruce con Ayacucho, Casa #14, Punto de ref: Frente a la plaza / bodegón..."
              value={shippingInfo.agencyOrAddress}
              onChange={(e) => handleChange('agencyOrAddress', e.target.value)}
              className={`w-full p-2 bg-white dark:bg-slate-900 border rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none transition-colors ${
                errors.agencyOrAddress
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30'
                  : 'border-slate-300 dark:border-slate-700 focus:border-red-500'
              }`}
            />
            {errors.agencyOrAddress && (
              <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.agencyOrAddress}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Interactive Agency Search Directory Modal */}
      <MRWAgencySearchModal
        isOpen={isAgencySearchOpen}
        onClose={() => setIsAgencySearchOpen(false)}
        selectedState={shippingInfo.state}
        selectedMunicipality={shippingInfo.municipality}
        selectedCity={shippingInfo.city}
        onSelectAgency={handleModalAgencySelect}
      />

      <div className="flex items-start gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
        <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
        <span>
          Datos verificados con el directorio oficial de <strong>MRW Venezuela</strong> (mrwve.com). Se enviarán en formato de guía para procesar tu envío de inmediato.
        </span>
      </div>
    </div>
  );
};
