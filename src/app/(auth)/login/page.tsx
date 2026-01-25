import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { Logo } from "@/components/shared/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-md">
        {/* Botón de volver (UI de la página) */}
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>

        {/* Logo (Opcional: puedes ponerlo aquí o dentro del AuthForm) */}
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        {/* EL COMPONENTE INTELIGENTE QUE CONECTA CON SUPABASE */}
        {/* Aquí es donde ocurre la magia real */}
        <AuthForm mode="login" />
        
      </div>
    </div>
  );
}