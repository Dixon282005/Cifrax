"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Mail, KeyRound, Loader2 } from 'lucide-react';
import { Button } from '@/components/shared/Button'; 
import { handleAuth } from '../actions/Auth'; // El Cerebro (Server Action)

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      // 1. LLAMADA AL SERVIDOR
      const result = await handleAuth(formData, mode);

      if (result.success) {
        // Caso 1: Registro que requiere confirmación de email (si configuraste eso en Supabase)
        if (mode === 'register' && !result.user) {
           alert(result.message || "¡Cuenta creada! Revisa tu correo.");
           setLoading(false);
           return;
        }

        // Caso 2: Login exitoso o Registro directo
        // Redirigimos según el rol que nos devolvió el servidor
        const ruta = result.role === 'admin' ? '/admin/dashboard' : '/dashboard';
        
        // Refrescamos para asegurar que el router vea las nuevas cookies
        router.refresh(); 
        router.push(ruta);
      } else {
        // 2. AQUÍ CAPTURAMOS EL ERROR DE DUPLICADO
        // El servidor nos dijo: { success: false, error: "Este correo ya está registrado..." }
        setError(result.error as string);
        setLoading(false);
      }
    } catch (err) {
      // Error inesperado (ej. fallo de red)
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-white text-3xl font-bold mb-2">
          {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p className="text-slate-400 text-sm">
          {mode === 'login' 
            ? 'Bienvenido de nuevo a Cifrax' 
            : 'Únete a la plataforma para gestionar tus combinaciones'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campo Email */}
        <div>
          <label className="block text-slate-300 mb-2 text-sm font-medium">Correo Electrónico</label>
          <div className="relative">
            <Mail className="size-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              placeholder="ejemplo@cifrax.com"
              required
            />
          </div>
        </div>

        {/* Campo Password */}
        <div>
          <label className="block text-slate-300 mb-2 text-sm font-medium">Contraseña</label>
          <div className="relative">
            <KeyRound className="size-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
            />
          </div>
        </div>

        {/* Mensaje de Error (ROJO) */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm flex items-center justify-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* Botón de Acción */}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin size-4" />
              <span>Procesando...</span>
            </div>
          ) : (
            mode === 'login' ? 'Entrar' : 'Registrarse'
          )}
        </Button>
      </form>

      {/* Toggle entre Login/Registro */}
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push(mode === 'login' ? '/register' : '/login')}
          className="text-slate-400 hover:text-cyan-400 transition-colors text-sm underline-offset-4 hover:underline"
        >
          {mode === 'login' 
            ? '¿No tienes cuenta? Regístrate gratis' 
            : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}