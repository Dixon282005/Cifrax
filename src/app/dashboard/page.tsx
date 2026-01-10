'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/features/dashboard/Dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const email = localStorage.getItem('cifrax_user');
    if (!email) {
      router.push('/login');
    } else {
      setUserEmail(email);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cifrax_user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!userEmail) {
    return null;
  }

  return <Dashboard userEmail={userEmail} onLogout={handleLogout} />;
}
