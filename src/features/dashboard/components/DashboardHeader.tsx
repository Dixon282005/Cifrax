import { LogOut } from 'lucide-react';
import { Logo } from '../../../components/shared/Logo';

interface DashboardHeaderProps {
  userEmail: string;
  onLogout: () => void;
}

export function DashboardHeader({ userEmail, onLogout }: DashboardHeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo size="md" />
          
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm sm:text-base hidden sm:inline">{userEmail}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-sm sm:text-base"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
