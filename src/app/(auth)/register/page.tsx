'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/shared/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Simulación de autenticación (esto se reemplazará con Supabase)
    localStorage.setItem('cifrax_user', email);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <Logo size="md" />
          </div>

          <h2 className="text-white text-3xl text-center mb-2">
            Crear Cuenta
          </h2>
          <p className="text-slate-400 text-center mb-8">
            Comienza a guardar tus combinaciones
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="size-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <KeyRound className="size-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <KeyRound className="size-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth>
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
