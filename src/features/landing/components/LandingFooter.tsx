import { Logo } from '../../../components/shared/Logo';

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center mb-4">
          <Logo size="sm" />
        </div>
        <p className="text-slate-500 text-sm sm:text-base">
          © 2025 Cifrax. Sistema de gestión de combinaciones.
        </p>
      </div>
    </footer>
  );
}
