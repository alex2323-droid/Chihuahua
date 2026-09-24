import React, { useState } from 'react';
import { LogIn, Key, User, AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { loginSeller, signInCustomer, registerCustomer } from '../lib/firestoreService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string, role: 'seller' | 'customer') => void;
  allowClose?: boolean;
  isInline?: boolean;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess, allowClose = true, isInline = false }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Por favor ingresa un usuario y una contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        if (cleanUser === 'Chihuahua' && cleanPass === '1306') {
          const res = await loginSeller(cleanUser, cleanPass);
          onLoginSuccess(res.username, 'seller');
        } else {
          const res = await signInCustomer(cleanUser, cleanPass);
          onLoginSuccess(res.username, 'customer');
        }
      } else {
        // Registration mode (only for customers)
        if (cleanUser.toLowerCase() === 'chihuahua') {
          throw new Error('El usuario "Chihuahua" está reservado para el administrador.');
        }
        const res = await registerCustomer(cleanUser, cleanPass);
        onLoginSuccess(res.username, 'customer');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className={`bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden ${isInline ? 'shadow-none border-0 p-0' : ''}`}>
      
      {/* Top Decorative Header */}
      {!isInline && <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />}

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            {mode === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900">
              {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
            </h2>
            <p className="text-xs text-slate-500">
              {mode === 'login' ? 'Ingresa a tu cuenta de Chihuahua Store' : 'Crea tu cuenta de cliente en segundos'}
            </p>
          </div>
        </div>
        {allowClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mb-5 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
        <p className="text-slate-600 text-[11px] leading-relaxed">
          {mode === 'login' ? (
            <span>👋 Bienvenido de vuelta. Inicia sesión para ver catálogos y realizar pedidos.</span>
          ) : (
            <span>✨ Al registrarte, tus datos de entrega y carritos se guardarán en la nube para automatizar tus compras.</span>
          )}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
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
              placeholder="Ingresa tu usuario..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Contraseña / Clave
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Ingresa tu clave...'}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-bold text-sm rounded-xl shadow-md bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{mode === 'login' ? 'Ingresar a mi Cuenta' : 'Registrarme e Ingresar'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Switch mode trigger (like real e-commerce sites) */}
      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
          }}
          className="text-xs text-slate-500 hover:text-emerald-600 transition-colors font-medium"
        >
          {mode === 'login' ? (
            <>
              ¿No tienes cuenta de cliente? <span className="font-bold text-emerald-600 underline">Regístrate aquí</span>
            </>
          ) : (
            <>
              ¿Ya tienes una cuenta? <span className="font-bold text-emerald-600 underline">Inicia Sesión</span>
            </>
          )}
        </button>
      </div>

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
