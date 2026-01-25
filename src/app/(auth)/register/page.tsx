import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/features/auth/components/AuthForm"; // El componente que conecta con Supabase
import { Logo } from "@/components/shared/Logo";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-md">
        {/* Botón de volver al inicio */}
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>

        {/* Logo centrado */}
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        {/* AQUÍ ESTÁ LA CLAVE: Llamamos al form en modo registro */}
        {/* Esto cambiará el título automáticamente y usará supabase.signUp */}
        <AuthForm mode="register" />
        
      </div>
    </div>
  );
}