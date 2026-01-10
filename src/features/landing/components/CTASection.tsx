import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../../components/shared/Button';

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-slate-900/50">
      <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8 sm:p-12">
        <h2 className="text-white text-3xl sm:text-4xl mb-4">
          ¿Listo para comenzar?
        </h2>
        <p className="text-slate-400 text-base sm:text-lg mb-8">
          Únete a Cifrax y comienza a gestionar tus combinaciones hoy mismo.
        </p>
        <Link href="/register">
          <Button
            variant="primary"
            size="lg"
            icon={<ChevronRight className="size-5" />}
          >
            Crear Cuenta Gratis
          </Button>
        </Link>
      </div>
    </section>
  );
}
