import React, { useState } from 'react';
import { LogIn, Key, User, AlertCircle, Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { loginSeller, signInCustomer, registerCustomer } from '../lib/firestoreService';
import { StoreSettings } from '../types/catalog';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string, role: 'seller' | 'customer') => void;
  allowClose?: boolean;
  isInline?: boolean;
  settings?: StoreSettings;
}

export function LoginModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  allowClose = true, 
  isInline = false,
  settings
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setError(null);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa tu usuario y contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cleanUser = username.trim();
      const cleanPass = password.trim();

      if (activeTab === 'login') {
        // Log in
        if (cleanUser.toLowerCase() === 'chihuahua') {
          // Seller check
          if (cleanUser !== 'Chihuahua' || cleanPass !== '1306') {
            throw new Error('Contraseña o usuario de Vendedor incorrecto.');
          }
          const res = await loginSeller(cleanUser, cleanPass);
          onLoginSuccess(res.username, 'seller');
        } else {
          // Customer login
          const res = await signInCustomer(cleanUser, cleanPass);
          onLoginSuccess(res.username, 'customer');
        }
      } else {
        // Register new client
        if (cleanUser.toLowerCase() === 'chihuahua') {
          throw new Error('El usuario "Chihuahua" está reservado para el Vendedor.');
        }
        if (cleanPass.length < 6) {
          throw new Error('La contraseña para registro debe tener al menos 6 caracteres.');
        }
        const res = await registerCustomer(cleanUser, cleanPass);
        onLoginSuccess(res.username, 'customer');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className={`bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden ${isInline ? 'shadow-none border-0 p-0' : ''}`}>
      
      {/* Top Decorative Header */}
      {!isInline && <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />}

      {/* Main Brand Logo & Wordmark */}
      <div className="flex flex-col items-center justify-center text-center mt-3 mb-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-md group-hover:bg-emerald-500/20 transition-all duration-300" />
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-emerald-500 ring-4 ring-emerald-100 shadow-lg bg-slate-50 flex items-center justify-center">
            <img 
              src={settings?.storeLogo && settings.storeLogo.trim() !== '' ? settings.storeLogo : "/logo_chihuahua.jpg"} 
              alt={settings?.storeName || "Team Chihuahua"} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "/logo_chihuahua.jpg";
              }}
            />
          </div>
        </div>
        <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-4 tracking-tight">
          {settings?.storeName || "Team Chihuahua"}
        </h1>
        <p className="text-xs text-slate-500 font-bold tracking-wide uppercase mt-1">
          {settings?.storeTagline || "Tu tienda de encargos"}
        </p>
      </div>

      <div className="flex items-center justify-between mb-5 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            {activeTab === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900">
              {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-xs text-slate-500">
              {activeTab === 'login' ? 'Ingresa para ver el catálogo y tus pedidos' : 'Regístrate al instante para guardar tus datos'}
            </p>
          </div>
        </div>
        {allowClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Unified Tab Selector */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-5">
        <button
          type="button"
          onClick={() => handleTabChange('login')}
          className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'login'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Iniciar Sesión</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('register')}
          className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'register'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Registro</span>
        </button>
      </div>

      {activeTab === 'register' && (
        <div className="mb-5 p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
          <div className="text-[11px] text-emerald-800 leading-relaxed">
            ✨ <span className="font-bold">¿Primera vez aquí?</span> Crea una cuenta ingresando un nombre de usuario y contraseña. Guardaremos tu carrito y datos de entrega para que no tengas que volver a escribirlos.
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{error}</span>
            {error.includes('ya está registrado') && (
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className="block mt-1.5 font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                👉 Haz clic aquí para Iniciar Sesión con tu contraseña
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Nombre de Usuario o Correo
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={activeTab === 'register' ? 'Tu nombre o correo electrónico' : 'Escribe tu usuario o correo'}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
              required
              autoCapitalize="none"
              autoCorrect="off"
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
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={activeTab === 'register' ? 'Crea una clave (mínimo 6 caracteres)' : 'Escribe tu contraseña'}
              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 bg-emerald-600 hover:bg-emerald-500`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                {activeTab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-[10px] text-slate-400">
        {activeTab === 'login' 
          ? 'Tus datos de carrito y entregas se cargarán automáticamente al ingresar.'
          : 'La cuenta se creará inmediatamente y se vinculará a tus próximos pedidos.'}
      </p>

    </div>
  );

  if (isInline) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {formContent}
    </div>
  );
}
