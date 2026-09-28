import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Sparkles,
  Send,
  Link,
  FileText,
  Upload,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { StoreSettings, MRWShippingInfo, SpecialOrderRequest } from '../types/catalog';
import { MRWShippingForm } from './MRWShippingForm';
import { DEFAULT_MRW_INFO, generateSpecialOrderWhatsAppUrl } from '../utils/mrwData';
import { saveSpecialOrderToFirestore } from '../lib/firestoreService';

interface SpecialOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  sellerId?: string;
}

export const SpecialOrderModal: React.FC<SpecialOrderModalProps> = ({
  isOpen,
  onClose,
  settings,
  sellerId = 'chihuahua',
}) => {
  const [productName, setProductName] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // MRW Shipping Info
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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

    if (!productName || productName.trim().length < 3) {
      errors.productName = 'Escribe el nombre o descripción del artículo que buscas.';
    }

    if (!mrwInfo.fullName || mrwInfo.fullName.trim().length < 3) {
      errors.fullName = 'Ingresa el nombre del destinatario.';
    }
    if (!mrwInfo.cedula || mrwInfo.cedula.trim().length < 5) {
      errors.cedula = 'Ingresa la cédula o RIF.';
    }
    if (!mrwInfo.phone || mrwInfo.phone.trim().length < 7) {
      errors.phone = 'Ingresa un teléfono de contacto.';
    }
    if (!mrwInfo.city || mrwInfo.city.trim().length < 2) {
      errors.city = 'Ingresa la ciudad.';
    }
    if (!mrwInfo.agencyOrAddress || mrwInfo.agencyOrAddress.trim().length < 4) {
      errors.agencyOrAddress = 'Ingresa la agencia MRW o dirección de entrega.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      alert('Por favor completa los campos obligatorios marcados en rojo.');
      return;
    }

    const specialRequest: SpecialOrderRequest = {
      productName: productName.trim(),
      specifications: specifications.trim(),
      referenceUrlOrImage: referenceUrl.trim(),
      shippingInfo: mrwInfo,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Save to Firestore in background
    try {
      saveSpecialOrderToFirestore(sellerId, specialRequest).catch(() => {});
    } catch {}

    // Launch WhatsApp
    const waUrl = generateSpecialOrderWhatsAppUrl(settings, specialRequest);
    window.open(waUrl, '_blank');

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print overflow-y-auto">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                  Encargar Artículo Especial
                </h2>
                <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                  <span>Por Encargo</span>
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium">
                ¿No está en la tienda? ¡Te lo conseguimos y enviamos por MRW!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSendRequest} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">¡Solicitud Enviada a WhatsApp!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Abrimos tu WhatsApp con todos los detalles de tu encargo especial y los datos para tu envío por MRW.
              </p>
            </div>
          ) : (
            <>
              {/* Step 1: Article Details */}
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                      1
                    </span>
                    <span>Detalles del Artículo que Buscas</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">Encargo Personalizado</span>
                </div>

                {/* Article Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ¿Qué artículo o producto deseas encargar? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Calzado Nike Air Max Dn - Negras Talla 41"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-xl text-xs outline-none transition-all ${
                      formErrors.productName
                        ? 'border-red-500 ring-2 ring-red-100'
                        : 'border-slate-300 focus:border-emerald-500'
                    }`}
                  />
                  {formErrors.productName && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.productName}</p>
                  )}
                </div>

                {/* Specs */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Especificaciones (Talla, Color, Marca, Modelo)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Talla 38 / Color Beige / Edición limitada"
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Reference Link */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">
                    Enlace de Referencia / Foto (URL opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={referenceUrl}
                      onChange={(e) => setReferenceUrl(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                    <Link className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Step 2: MRW Shipping Info */}
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                    2
                  </span>
                  <span>Datos de Envío por MRW (Nivel Nacional)</span>
                </div>

                <MRWShippingForm
                  shippingInfo={mrwInfo}
                  onChange={(updated) => setMrwInfo(updated)}
                  errors={formErrors}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 fill-white" />
                  <span>Solicitar Encargo por WhatsApp</span>
                </button>
              </div>
            </>
          )}

        </form>
      </div>
    </div>
  );
};
