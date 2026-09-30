import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Save,
  CheckCircle2,
  Lock,
  Truck,
  Building2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { MRWShippingInfo, StoreSettings } from '../types/catalog';
import { MRWShippingForm } from './MRWShippingForm';
import { DEFAULT_MRW_INFO } from '../utils/mrwData';
import { saveCustomerProfileToFirestore, CustomerProfile } from '../lib/firestoreService';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientProfile?: CustomerProfile | null;
  onUpdateClientProfile?: (profile: any) => void;
  sellerUid?: string;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  clientProfile = null,
  onUpdateClientProfile,
  sellerUid = 'bdy3TcO5IAOpmkQEy8zLGpEkENG3',
}) => {
  const [mrwInfo, setMrwInfo] = useState<MRWShippingInfo>(() => {
    try {
      const saved = localStorage.getItem('catalogcraft_mrw_shipping_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return { ...DEFAULT_MRW_INFO, ...parsed };
      }
    } catch {}
    return { ...DEFAULT_MRW_INFO };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (clientProfile && clientProfile.username) {
      setMrwInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || clientProfile.username || '',
        phone: prev.phone || clientProfile.whatsapp || '',
        agencyOrAddress: prev.agencyOrAddress || clientProfile.address || '',
      }));
    }
  }, [clientProfile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!mrwInfo.fullName || mrwInfo.fullName.trim().length < 3) {
      errors.fullName = 'Ingresa tu nombre y apellido completos.';
    }
    if (!mrwInfo.cedula || mrwInfo.cedula.trim().length < 5) {
      errors.cedula = 'Ingresa tu cédula de identidad o RIF.';
    }
    if (!mrwInfo.phone || mrwInfo.phone.trim().length < 7) {
      errors.phone = 'Ingresa tu número de teléfono de contacto.';
    }
    if (!mrwInfo.city || mrwInfo.city.trim().length < 2) {
      errors.city = 'Ingresa tu ciudad o municipio.';
    }
    if (!mrwInfo.agencyOrAddress || mrwInfo.agencyOrAddress.trim().length < 4) {
      errors.agencyOrAddress =
        mrwInfo.shippingType === 'agencia'
          ? 'Selecciona o escribe la agencia MRW de destino.'
          : 'Ingresa tu dirección exacta de entrega a domicilio.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      alert('Por favor completa los campos obligatorios antes de guardar.');
      return;
    }

    // Save to localStorage
    try {
      localStorage.setItem('catalogcraft_mrw_shipping_data', JSON.stringify(mrwInfo));
      localStorage.setItem('catalogcraft_username', mrwInfo.fullName);
    } catch {}

    const updatedProfile = {
      username: mrwInfo.fullName,
      whatsapp: mrwInfo.phone,
      address: mrwInfo.agencyOrAddress,
    };

    if (onUpdateClientProfile) {
      onUpdateClientProfile(updatedProfile);
    }

    // Save to Firestore background if connected
    if (sellerUid) {
      try {
        saveCustomerProfileToFirestore(sellerUid, updatedProfile).catch(() => {});
      } catch {}
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 text-white relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 shadow-inner shrink-0">
              <UserCheck className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                  Mi Perfil y Dirección MRW
                </h2>
                <span className="text-[9px] font-extrabold bg-sky-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Autoguardado
                </span>
              </div>
              <p className="text-xs text-sky-100">
                Gestiona tus datos para que tus pedidos y encargos se procesen de inmediato
              </p>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSaveProfile} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {savedSuccess ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">¡Perfil Guardado Exitosamente!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                Tus datos de contacto y dirección MRW han quedado guardados. Todos tus próximos pedidos y encargos usarán esta información automáticamente.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/60 p-3 rounded-2xl text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Dirección Sincronizada:</strong> Cuando hagas una compra en el carrito o solicites un encargo especial, no tendrás que escribir tus datos nuevamente.
                </div>
              </div>

              {/* MRW Form */}
              <MRWShippingForm
                shippingInfo={mrwInfo}
                onChange={(updated) => setMrwInfo(updated)}
                errors={formErrors}
              />

              {/* Privacy note */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Tus datos se almacenan de forma segura para tus guías de envío MRW.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Mi Perfil MRW</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
