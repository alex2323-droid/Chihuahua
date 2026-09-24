import React from 'react';
import { Product, StoreSettings, Catalog } from '../types/catalog';

interface PrintableCatalogProps {
  catalog: Catalog;
  settings: StoreSettings;
}

export const PrintableCatalog: React.FC<PrintableCatalogProps> = ({
  catalog,
  settings,
}) => {
  return (
    <div className="hidden print:block p-6 max-w-5xl mx-auto bg-white text-slate-900">
      
      {/* Store Header in Print */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b-2 border-slate-900">
        <div className="flex items-center gap-4">
          {settings.storeLogo && (
            <img
              src={settings.storeLogo}
              alt={settings.storeName}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200"
            />
          )}
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              {settings.storeName}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              {settings.storeTagline || catalog.title}
            </p>
          </div>
        </div>

        <div className="text-right text-xs text-slate-700 font-mono space-y-0.5">
          {settings.whatsappNumber && (
            <p className="font-bold text-slate-900">
              WhatsApp: {settings.whatsappNumber}
            </p>
          )}
          {settings.instagramHandle && (
            <p className="text-slate-600">IG: {settings.instagramHandle}</p>
          )}
          <p className="text-[10px] text-slate-400">
            Fecha: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>

      {/* Catalog Title */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
          {catalog.title}
        </h2>
        {catalog.description && (
          <p className="text-xs text-slate-600 mt-1">{catalog.description}</p>
        )}
      </div>

      {/* Products Grid */}
      <div className="print-catalog-grid">
        {catalog.products.map((product) => (
          <div key={product.id} className="print-card flex flex-col justify-between">
            <div>
              <div className="w-full aspect-4/3 bg-slate-50 overflow-hidden mb-2 rounded-lg border border-slate-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                {product.category} · {product.brand}
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-tight mb-1">
                {product.title}
              </h3>

              <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed mb-2">
                {product.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono">
              <span className="text-sm font-extrabold text-slate-900">
                {product.currency}
                {product.price.toFixed(2)}
              </span>
              {product.badge && (
                <span className="text-[9px] font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded uppercase">
                  {product.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          ¿Te interesa algún producto? Haz tu pedido directamente a nuestro WhatsApp{' '}
          {settings.whatsappNumber}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          Precios y disponibilidad sujetos a confirmación.
        </p>
      </div>

    </div>
  );
};
