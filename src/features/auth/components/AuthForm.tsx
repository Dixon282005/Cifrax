"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Ojo: next/navigation, no next/router
import { Mail, KeyRound, Loader2 } from 'lucide-react';
import { Button } from '@/components/shared/Button'; // Tu botón reutilizable
// AQUÍ IMPORTAMOS EL CEREBRO (EL ACTION)
import { handleAuth } from '../actions/Auth'; 

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

    // LLAMAMOS AL ACTION (EL CEREBRO)
    const result = await handleAuth(formData, mode);

    if (result.success) {
      if (mode === 'register' && !result.user) {
         alert("¡Cuenta creada! Revisa tu correo.");
         setLoading(false);
      } else {
         // Si es login, redirigimos
         const ruta = result.role === 'admin' ? '/admin/dashboard' : '/dashboard';
         router.push(ruta);
         router.refresh(); 
      }
    } else {
      setError(result.error as string);
      setLoading(false);
    }
  };

  // --- AQUÍ EMPIEZA TU DISEÑO VISUAL ---
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-white text-3xl font-bold mb-2">
          {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p className="text-slate-400">
          {mode === 'login' ? 'Bienvenido a Cifrax' : 'Únete a la plataforma'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-300 mb-2">Correo</label>
          <div className="relative">
            <Mail className="size-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="tu@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-2">Contraseña</label>
          <div className="relative">
            <KeyRound className="size-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? <Loader2 className="animate-spin size-4 mx-auto" /> : (mode === 'login' ? 'Entrar' : 'Registrarse')}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push(mode === 'login' ? '/register' : '/login')}
          className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
        >
          {mode === 'login' 
            ? '¿No tienes cuenta? Regístrate' 
            : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}