import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Trash2,
  Send,
  Plus,
  Minus,
  X,
  MessageCircle,
  Megaphone,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { CartItem, StoreSettings } from '../types/catalog';
import { calculateCartTotal, getWhatsAppOrderUrl } from '../utils/cartUtils';

interface WhatsAppCartDrawerProps {
  cart: CartItem[];
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  clientProfile?: any;
  onUpdateClientProfile?: (profile: { username: string; address: string }) => void;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'refunds') => void;
}

export const WhatsAppCartDrawer: React.FC<WhatsAppCartDrawerProps> = ({
  cart,
  settings,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  clientProfile = null,
  onUpdateClientProfile,
  onOpenLegal,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  React.useEffect(() => {
    if (clientProfile) {
      setCustomerName(clientProfile.username || '');
      setNotes(clientProfile.address || '');
    }
  }, [clientProfile]);

  // Handle ESC key to close
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

  const handleNameChange = (val: string) => {
    setCustomerName(val);
    if (onUpdateClientProfile) {
      onUpdateClientProfile({ username: val, address: notes });
    }
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    if (onUpdateClientProfile) {
      onUpdateClientProfile({ username: customerName, address: val });
    }
  };

  const totalAmount = calculateCartTotal(cart);

  const getItemKey = (item: CartItem) => {
    let key = item.product.id;
    if (item.selectedSize) key += `_${item.selectedSize}`;
    if (item.selectedImageCode) key += `_${item.selectedImageCode}`;
    return key;
  };

  const handleSendWhatsApp = () => {
    if (cart.length === 0) return;
    if (!acceptedTerms) {
      alert('Por favor acepta los Términos y la Política de Privacidad para continuar.');
      return;
    }

    const whatsappUrl = getWhatsAppOrderUrl({
      cart,
      settings,
      customerName,
      notes,
    });
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end no-print">
      <div className="bg-white max-w-md w-full h-full shadow-2xl p-6 overflow-y-auto border-l border-slate-100 flex flex-col justify-between animate-in slide-in-from-right duration-250">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="font-display font-bold text-lg text-slate-900">
                Tu Carrito de Compra
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Tu carrito está vacío</p>
              <p className="text-xs text-slate-400 mt-1">
                Haz clic en "Pedir" en cualquier producto para agregarlo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {cart.map((item) => {
                  const key = getItemKey(item);
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80"
                    >
                      {item.product.image && item.product.image.trim() !== '' ? (
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {item.product.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <p className="text-xs text-slate-600 font-mono font-bold">
                            {item.product.currency}
                            {((item.unitPrice ?? item.product.price) * item.quantity).toFixed(2)}
                          </p>
                          {item.product.sku && (
                            <span className="text-[9px] font-bold font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 leading-none shrink-0">
                              {item.product.sku}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[9px] font-extrabold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded border border-purple-200 leading-none shrink-0">
                              Talla: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedImageCode && (
                            <span className="text-[9px] font-extrabold bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded border border-teal-200 leading-none shrink-0 font-mono">
                              Sub-Cód: {item.selectedImageCode}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() =>
                            onUpdateQuantity(key, item.quantity - 1)
                          }
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(key, item.quantity + 1)
                          }
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(key)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Customer Contact Details */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                {settings.cartAnnouncement && settings.cartAnnouncement.trim() !== '' && (
                  <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-2xl text-amber-800 text-[11px] flex items-start gap-2 shadow-2xs animate-pulse" style={{ animationDuration: '4s' }}>
                    <Megaphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="font-semibold whitespace-pre-line leading-relaxed">
                      {settings.cartAnnouncement}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tu Nombre (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: María López"
                    value={customerName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dirección o Notas de Pedido
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Envío a domicilio o retiro en tienda..."
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Legal Consent & Data Minimization ("Solo datos necesarios") */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Privacidad garantizada:</strong> Solo solicitamos datos indispensables para el envío y no compartimos tu información.
                    </span>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 accent-emerald-600 rounded cursor-pointer shrink-0"
                    />
                    <span>
                      He leído y acepto los{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegal && onOpenLegal('terms')}
                        className="font-bold text-emerald-700 underline hover:text-emerald-900"
                      >
                        Términos
                      </button>{' '}
                      y la{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegal && onOpenLegal('privacy')}
                        className="font-bold text-emerald-700 underline hover:text-emerald-900"
                      >
                        Política de Privacidad
                      </button>.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & WhatsApp Order Button */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-slate-600">Total Est.</span>
              <span className="text-lg font-bold text-slate-900">
                {settings.currencySymbol}
                {totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleSendWhatsApp}
              disabled={!acceptedTerms}
              className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                acceptedTerms
                  ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Enviar Pedido por WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
