import Link from 'next/link';
import { Logo } from '../../../components/shared/Logo';
import { Button } from '../../../components/shared/Button';

export function LandingNavbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo size="md" />
          
          <div className="flex gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-slate-300 hover:text-white transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
