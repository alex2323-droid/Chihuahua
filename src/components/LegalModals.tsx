import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Cookie,
  RotateCcw,
  Building2,
  CheckCircle2,
  X,
  ExternalLink,
  Scale,
  Lock,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { StoreSettings } from '../types/catalog';

export type LegalTab = 'privacy' | 'terms' | 'cookies' | 'refunds' | 'business';

interface LegalModalsProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
  settings: StoreSettings;
  onOpenCookiePreferences?: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
  settings,
  onOpenCookiePreferences,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Handle ESC key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const storeName = settings.storeName || 'Team Chihuahua';
  const cleanPhone = settings.whatsappNumber || '+58 414-924-7532';

  const tabs = [
    { id: 'privacy' as LegalTab, label: 'Privacidad', icon: Shield },
    { id: 'terms' as LegalTab, label: 'Términos de Uso', icon: FileText },
    { id: 'cookies' as LegalTab, label: 'Cookies', icon: Cookie },
    { id: 'refunds' as LegalTab, label: 'Reembolsos', icon: RotateCcw },
    { id: 'business' as LegalTab, label: 'Datos del Negocio', icon: Building2 },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 no-print"
    >
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="font-display font-bold text-base sm:text-lg text-slate-900">
                Centro Legal, Privacidad y Transparencia
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {storeName} • Cumplimiento Normativo y Protección al Consumidor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal legal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white overflow-x-auto px-4 sm:px-6 scrollbar-none gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap focus:outline-none focus:text-emerald-700 ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3>Política de Privacidad y Protección de Datos Personales</h3>
              </div>
              <p className="text-slate-500 text-xs">
                Última actualización: {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </p>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  1. Principio de Minimización de Datos ("Solo datos necesarios")
                </h4>
                <p>
                  En <strong>{storeName}</strong> aplicamos el principio estricto de minimización de datos. Solo solicitamos los datos indispensables para procesar pedidos por WhatsApp (nombre de contacto y dirección de envío o notas voluntarias). <strong>No almacenamos contraseñas bancarias, ni números de tarjetas de crédito en nuestro servidor.</strong>
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">2. Finalidad del Tratamiento</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  <li>Gestionar y dar seguimiento a los pedidos solicitados a través de WhatsApp.</li>
                  <li>Recordar las preferencias de tu carrito de compras localmente en tu dispositivo.</li>
                  <li>Garantizar la seguridad, integridad y funcionamiento técnico del catálogo digital.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">3. Integraciones de Terceros</h4>
                <p>
                  Para brindar el servicio empleamos únicamente proveedores técnicos reconocidos:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  <li><strong>WhatsApp / Meta:</strong> Canal directo y cifrado de extremo a extremo para la confirmación de pedidos.</li>
                  <li><strong>Google Cloud & Firebase:</strong> Almacenamiento seguro en la nube para la sincronización de inventario.</li>
                  <li><strong>Supabase & Redis:</strong> Caché de alto rendimiento para acelerar la carga del catálogo.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">4. Tus Derechos (ARCO / GDPR)</h4>
                <p>
                  Tienes derecho en todo momento a acceder, rectificar, limitar o solicitar la eliminación total de tus datos de contacto comunicándote a nuestro WhatsApp oficial: <strong>{cleanPhone}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3>Términos y Condiciones de Uso</h3>
              </div>
              <p className="text-slate-500 text-xs">
                Vigentes para todos los usuarios y compradores de la plataforma {storeName}.
              </p>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">1. Naturaleza del Catálogo Digital</h4>
                <p>
                  Este sitio web es una vitrina y catálogo interactivo digital operado por <strong>{storeName}</strong>. Los pedidos se completan directamente mediante el canal verificado de WhatsApp del vendedor.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">2. Precios, Moneda y Disponibilidad</h4>
                <p>
                  Todos los precios mostrados están expresados en la moneda oficial configurada ({settings.currencySymbol || '$'}) y se mantienen actualizados en tiempo real. La confirmación final de existencias, colores o tallas se realiza al enviar el pedido por WhatsApp.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">3. Veracidad Comercial y Transparencia</h4>
                <p>
                  Nos comprometemos con la honestidad comercial: <strong>no utilizamos reseñas falsas, testimonios inventados ni publicidad engañosa</strong>. Las especificaciones, medidas y fotografías corresponden a los productos reales.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">4. Propiedad Intelectual y Derechos de Autor</h4>
                <p>
                  Todos los logotipos, nombres comerciales, diseños de catálogo y materiales gráficos pertenecen a <strong>{storeName}</strong> o a sus respectivos titulares con derechos de uso concedidos. Queda prohibida la copia no autorizada con fines comerciales.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">5. Leyes Locales Aplicables</h4>
                <p>
                  Estos términos se rigen conforme a las leyes de comercio electrónico y normativas de protección al consumidor aplicables en la jurisdicción del comercio.
                </p>
              </div>
            </div>
          )}

          {/* COOKIE POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <Cookie className="w-5 h-5 text-emerald-600" />
                <h3>Política y Consentimiento de Cookies</h3>
              </div>
              <p className="text-slate-500 text-xs">
                Información transparente sobre el uso de tecnologías de almacenamiento local en tu navegador.
              </p>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 text-emerald-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                    Consentimiento Activo
                  </span>
                  {onOpenCookiePreferences && (
                    <button
                      onClick={onOpenCookiePreferences}
                      className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900"
                    >
                      Configurar Mis Preferencias
                    </button>
                  )}
                </div>
                <p className="text-xs text-emerald-800/90">
                  Respetamos tu privacidad. Puedes aceptar o rechazar cookies no esenciales en cualquier momento.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">1. ¿Qué son y qué utilizamos?</h4>
                <p>
                  Utilizamos almacenamiento local (LocalStorage e IndexedDB) exclusivamente para:
                </p>
                <div className="space-y-2 pl-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <strong className="text-slate-900 block">🟢 Cookies Técnicas y Esenciales (Obligatorias):</strong>
                    Mantienen tu carrito de compras activo, recuerdan tu sesión segura y cargan instantáneamente las fotos del catálogo.
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <strong className="text-slate-900 block">🔵 Cookies de Rendimiento y Analítica (Opcionales):</strong>
                    Nos permiten saber qué productos son más populares para mejorar el catálogo, sin recopilar datos personales identificables.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">2. Control y Eliminación</h4>
                <p>
                  Puedes limpiar el almacenamiento de tu navegador en cualquier momento desde los ajustes de tu explorador web o mediante nuestro panel de preferencias de cookies.
                </p>
              </div>
            </div>
          )}

          {/* REFUND POLICY */}
          {activeTab === 'refunds' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <RotateCcw className="w-5 h-5 text-emerald-600" />
                <h3>Política de Devoluciones, Cambios y Garantía</h3>
              </div>
              <p className="text-slate-500 text-xs">
                Garantizamos tu tranquilidad y satisfacción en cada compra.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Garantía por Defecto
                  </div>
                  <p className="text-xs text-slate-600">
                    Si un artículo presenta algún defecto de fábrica o daño en transporte, se realiza cambio inmediato o reembolso sin costo adicional.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Cambio de Talla o Modelo
                  </div>
                  <p className="text-xs text-slate-600">
                    Sujeto a disponibilidad en inventario. El producto debe estar nuevo, sin uso y con sus etiquetas originales.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">¿Cómo solicitar una devolución o cambio?</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
                  <li>Escribe a nuestro WhatsApp de atención: <strong>{cleanPhone}</strong>.</li>
                  <li>Envía una foto o video breve del artículo y tu número de pedido o recibo.</li>
                  <li>Nuestro equipo te coordinará la entrega del reemplazo o la devolución del monto acordado.</li>
                </ol>
              </div>
            </div>
          )}

          {/* BUSINESS INFO & IDENTITY */}
          {activeTab === 'business' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h3>Identificación del Negocio y Contacto Oficial</h3>
              </div>
              <p className="text-slate-500 text-xs">
                Información oficial del establecimiento comercial conforme a las normativas de transparencia y protección al consumidor.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Nombre Comercial:</span>
                    <span className="font-bold text-slate-900 text-sm">{storeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Canal Oficial de WhatsApp:</span>
                    <span className="font-bold text-emerald-700 text-sm">{cleanPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Horario de Atención:</span>
                    <span className="font-medium text-slate-800">Lunes a Sábado: 8:00 AM - 8:00 PM</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Soporte y Reclamaciones:</span>
                    <span className="font-medium text-slate-800">Directo vía WhatsApp</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-200/80 rounded-2xl text-blue-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Seguridad y Accesibilidad Web (WCAG 2.1 AA)
                </div>
                <p className="text-blue-800/90 leading-relaxed">
                  Este sitio web cuenta con diseño accesible, navegación completa por teclado, textos alternativos descriptivos en imágenes y alto contraste de color para garantizar la inclusión y la mejor experiencia de usuario.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>© {currentYear} {storeName}. Todos los derechos reservados.</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Entendido y Aceptar
          </button>
        </div>

      </div>
    </div>
  );
};
