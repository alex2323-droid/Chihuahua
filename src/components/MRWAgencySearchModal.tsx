import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  Building2,
  MapPin,
  ExternalLink,
  Check,
  Navigation,
  Compass,
  Loader2,
  AlertTriangle,
  Globe,
  Share2,
} from 'lucide-react';
import {
  MRWAgency,
  MRW_AGENCIES_DATABASE,
  OFFICIAL_MRW_URL,
  searchMRWAgencies,
  getMRWAgenciesByStateAndCity,
  getMRWMunicipalitiesForState,
  getClosestMRWAgencies,
  MRWAgencyWithDistance,
} from '../data/mrwAgenciesData';
import { VENEZUELA_STATES } from '../utils/mrwData';

interface MRWAgencySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedState?: string;
  selectedMunicipality?: string;
  selectedCity?: string;
  onSelectAgency: (agency: MRWAgency) => void;
}

export const MRWAgencySearchModal: React.FC<MRWAgencySearchModalProps> = ({
  isOpen,
  onClose,
  selectedState = '',
  selectedMunicipality = '',
  selectedCity = '',
  onSelectAgency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState(selectedState || 'Distrito Capital (Caracas)');
  const [municipalityFilter, setMunicipalityFilter] = useState(selectedMunicipality || '');
  const [selectedAgencyCode, setSelectedAgencyCode] = useState<string>('');
  const [activeAgency, setActiveAgency] = useState<MRWAgency | null>(null);

  // Geolocation state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Sync state & municipality filter when prop changes
  useEffect(() => {
    if (selectedState) {
      setStateFilter(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedMunicipality) {
      setMunicipalityFilter(selectedMunicipality);
    }
  }, [selectedMunicipality]);

  // Municipalities in current selected state
  const municipalitiesInState = useMemo(() => {
    if (!stateFilter) return [];
    return getMRWMunicipalitiesForState(stateFilter);
  }, [stateFilter]);

  // Agencies in current selected state and municipality
  const agenciesInState = useMemo(() => {
    if (!stateFilter) return [];
    return getMRWAgenciesByStateAndCity(stateFilter, undefined, municipalityFilter || undefined);
  }, [stateFilter, municipalityFilter]);

  // Closest agencies if GPS is available
  const closestAgencies = useMemo<MRWAgencyWithDistance[]>(() => {
    if (!userLocation) return [];
    return getClosestMRWAgencies(userLocation.lat, userLocation.lng, 15);
  }, [userLocation]);

  // Filtered agencies based on search query
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return agenciesInState;
    return searchMRWAgencies(searchTerm, stateFilter, municipalityFilter || undefined);
  }, [searchTerm, stateFilter, municipalityFilter, agenciesInState]);

  // Set active agency if selected from state dropdown or closest
  useEffect(() => {
    if (selectedAgencyCode) {
      const found = MRW_AGENCIES_DATABASE.find((a) => a.code === selectedAgencyCode);
      if (found) setActiveAgency(found);
    } else if (agenciesInState.length > 0 && !activeAgency) {
      setActiveAgency(agenciesInState[0]);
    }
  }, [selectedAgencyCode, agenciesInState]);

  // Geolocation trigger
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          setLocationError('Permiso de ubicación denegado. Puedes buscar tu estado manualmente.');
        } else {
          setLocationError('No se pudo determinar tu ubicación exacta.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header - MRW Official Styling */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-[#e30613] to-red-700 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-red-600 font-black text-base flex items-center justify-center shadow-md shrink-0 tracking-tighter">
              MRW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                  Localizador de Agencias MRW
                </h2>
                <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white border border-white/30 hidden xs:inline">
                  mrwve.com
                </span>
              </div>
              <p className="text-xs text-red-100">
                250 agencias en Venezuela • Búsqueda por Estado, Código y Proximidad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={OFFICIAL_MRW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-xl border border-white/20 transition-colors"
              title="Abrir página oficial de MRW"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>mrwve.com</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official-Style Control Selectors Section */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-4 shrink-0">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Selector de Estado */}
            <div>
              <label className="block text-xs font-extrabold text-red-700 mb-1.5 flex items-center gap-1">
                <span>📍 1. Estado</span>
              </label>
              <select
                value={stateFilter}
                onChange={(e) => {
                  setStateFilter(e.target.value);
                  setMunicipalityFilter('');
                  setSelectedAgencyCode('');
                  setSearchTerm('');
                }}
                className="w-full px-2.5 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-red-600 transition-colors shadow-2xs"
              >
                {VENEZUELA_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Selector de Municipio */}
            <div>
              <label className="block text-xs font-extrabold text-red-700 mb-1.5 flex items-center justify-between">
                <span>🏛️ 2. Municipio</span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  ({municipalitiesInState.length})
                </span>
              </label>
              <select
                value={municipalityFilter}
                onChange={(e) => {
                  setMunicipalityFilter(e.target.value);
                  setSelectedAgencyCode('');
                }}
                className="w-full px-2.5 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-red-600 transition-colors shadow-2xs"
              >
                <option value="">Todos los Municipios</option>
                {municipalitiesInState.map((mun) => {
                  const count = getMRWAgenciesByStateAndCity(stateFilter, undefined, mun).length;
                  return (
                    <option key={mun} value={mun}>
                      Mnpio. {mun} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 3. Selector de Agencias */}
            <div>
              <label className="block text-xs font-extrabold text-red-700 mb-1.5 flex items-center justify-between">
                <span>🏢 3. Agencia MRW</span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  ({agenciesInState.length})
                </span>
              </label>
              <select
                value={activeAgency ? activeAgency.code : selectedAgencyCode}
                onChange={(e) => {
                  setSelectedAgencyCode(e.target.value);
                  const found = MRW_AGENCIES_DATABASE.find((a) => a.code === e.target.value);
                  if (found) setActiveAgency(found);
                }}
                className="w-full px-2.5 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-red-600 transition-colors shadow-2xs"
              >
                <option value="" disabled>
                  Seleccione una Agencia
                </option>
                {agenciesInState.map((ag) => (
                  <option key={ag.code} value={ag.code}>
                    {ag.code} - {ag.name.replace(/^MRW\s+/i, '')} ({ag.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Agencias Más Cercanas (GPS / Ubicación) */}
          <div className="pt-2 border-t border-slate-200/80">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <label className="text-xs font-extrabold text-red-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-red-600" />
                <span>Agencias más cercanas</span>
              </label>

              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="text-[11px] font-bold text-red-700 hover:text-red-800 bg-red-100/80 hover:bg-red-200/80 px-2.5 py-1 rounded-lg border border-red-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Detectando GPS...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5" />
                    <span>📍 Detectar Mi Ubicación</span>
                  </>
                )}
              </button>
            </div>

            {locationError && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{locationError}</span>
              </p>
            )}

            {userLocation ? (
              <select
                onChange={(e) => {
                  const found = MRW_AGENCIES_DATABASE.find((a) => a.code === e.target.value);
                  if (found) {
                    setActiveAgency(found);
                    setStateFilter(found.state);
                    setSelectedAgencyCode(found.code);
                  }
                }}
                className="w-full px-3 py-2 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-xs font-bold text-emerald-950 outline-none shadow-2xs"
              >
                <option value="">
                  🎯 Seleccione una Agencia Cercana ({closestAgencies.length} encontradas)
                </option>
                {closestAgencies.map((ag) => (
                  <option key={ag.code} value={ag.code}>
                    {ag.code} - {ag.name.replace(/^MRW\s+/i, '')} ({ag.distanceKm.toFixed(2)} km) • {ag.city}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white p-2 rounded-xl border border-slate-200">
                <span>Presiona "Detectar Mi Ubicación" para ordenar agencias por distancia en kilómetros.</span>
              </div>
            )}
          </div>

          {/* Quick Search Input */}
          <div className="relative pt-1">
            <input
              type="text"
              placeholder="O busca por código (#0101000), nombre, calle o sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-red-500 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 mt-0.5" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Selected Agency Showcase Card */}
        {activeAgency && (
          <div className="p-4 bg-red-50/60 border-b border-red-200 shrink-0 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black font-mono bg-red-600 text-white px-2 py-0.5 rounded-md shadow-2xs">
                    {activeAgency.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-red-600" />
                    <span>{activeAgency.name}</span>
                  </h3>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>{activeAgency.address}</span>
                </p>

                <div className="flex items-center gap-2.5 text-[11px] text-slate-600 font-semibold pt-0.5 flex-wrap">
                  <span className="bg-red-100/70 text-red-900 px-2 py-0.5 rounded-md font-bold">
                    📍 {activeAgency.state}
                  </span>
                  <span className="bg-slate-200/80 text-slate-800 px-2 py-0.5 rounded-md">
                    🏛️ Mnpio. {activeAgency.municipality}
                  </span>
                  <span className="bg-slate-200/80 text-slate-800 px-2 py-0.5 rounded-md">
                    🏙️ {activeAgency.city}
                  </span>
                  {activeAgency.lat && activeAgency.lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${activeAgency.lat},${activeAgency.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 hover:text-red-800 underline flex items-center gap-0.5 font-bold ml-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Ver en Google Maps</span>
                    </a>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectAgency(activeAgency);
                  onClose();
                }}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Usar esta Agencia</span>
              </button>
            </div>
          </div>
        )}

        {/* Directory List of Agencies in State / Search Results */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2 flex-1 max-h-64">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1 pb-1">
            <span>
              {searchResults.length} {searchResults.length === 1 ? 'Agencia disponible' : 'Agencias disponibles'}
            </span>
            <span className="text-[10px] text-slate-400">Toca cualquier sucursal para seleccionarla</span>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-8 text-center space-y-1">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No se encontraron agencias</p>
              <p className="text-[11px] text-slate-500">Prueba cambiando el estado o el término de búsqueda.</p>
            </div>
          ) : (
            searchResults.map((agency) => {
              const isSelected = activeAgency?.code === agency.code;
              return (
                <div
                  key={agency.code}
                  onClick={() => setActiveAgency(agency)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 text-left ${
                    isSelected
                      ? 'border-red-600 bg-red-50/80 ring-1 ring-red-500/20 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-red-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                        {agency.code}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">
                        {agency.name.replace(/^MRW\s+/i, '')}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{agency.address}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      🏛️ Mnpio. {agency.municipality} • 🏙️ {agency.city} • 📍 {agency.state}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAgency(agency);
                      onClose();
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    Seleccionar
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>💡 Sincronizado con el sistema de rastreo y envíos de MRW Venezuela</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold px-2 py-1"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
