import React, { useState } from 'react';
import { LogIn, Key, User, Check, ShieldCheck, AlertCircle, Loader2, Users } from 'lucide-react';
import { loginSeller, loginCustomer } from '../lib/firestoreService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string, role: 'seller' | 'customer') => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'seller' | 'customer'>('seller');
  const [username, setUsername] = useState('Chihuahua');
  const [password, setPassword] = useState('1306');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTabChange = (tab: 'seller' | 'customer') => {
    setActiveTab(tab);
    setError(null);
    if (tab === 'seller') {
      setUsername('Chihuahua');
      setPassword('1306');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa un usuario y una contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'seller') {
        const res = await loginSeller(username, password);
        onLoginSuccess(res.username, 'seller');
      } else {
        const res = await loginCustomer(username, password);
        onLoginSuccess(res.username, 'customer');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const setPreconfiguredCredentials = () => {
    setUsername('Chihuahua');
    setPassword('1306');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Top Decorative Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900">Iniciar Sesión</h2>
              <p className="text-xs text-slate-500">Elige tu tipo de cuenta para ingresar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Unified Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => handleTabChange('seller')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'seller'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Vendedor / Tienda</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('customer')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'customer'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Cliente</span>
          </button>
        </div>

        {/* Quick fill preset card for Chihuahua / 1306 (Only on Seller Tab) */}
        {activeTab === 'seller' && (
          <div className="mb-5 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Cuenta Vendedor:</span>{' '}
                <span className="font-mono bg-white/80 px-1.5 py-0.5 rounded border border-emerald-200">
                  Chihuahua
                </span>{' '}
                / pass:{' '}
                <span className="font-mono bg-white/80 px-1.5 py-0.5 rounded border border-emerald-200">
                  1306
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={setPreconfiguredCredentials}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-all whitespace-nowrap"
            >
              Usar
            </button>
          </div>
        )}

        {activeTab === 'customer' && (
          <div className="mb-5 p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-2xl">
            <div className="text-[11px] text-sky-900 leading-relaxed">
              💡 <span className="font-bold">¿Eres cliente?</span> Escribe un usuario y contraseña para crear tu cuenta al instante. Guardaremos tu nombre, teléfono y dirección de entrega para que no tengas que escribirlos de nuevo en ningún dispositivo.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nombre de Usuario
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activeTab === 'seller' ? 'Ej. Chihuahua' : 'Tu nombre o usuario'}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                activeTab === 'seller' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-sky-600 hover:bg-sky-500'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Ingresando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{activeTab === 'seller' ? 'Ingresar como Vendedor' : 'Ingresar como Cliente'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-[10px] text-slate-400">
          {activeTab === 'seller' 
            ? 'Tus catálogos y productos se sincronizan en la nube automáticamente.'
            : 'Tus datos de entrega se guardan seguros en tu cuenta.'}
        </p>

      </div>
    </div>
  );
}
