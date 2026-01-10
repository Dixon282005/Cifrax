import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../../components/shared/Button';

export function HeroSection() {
  return (
    <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight">
          Guarda tus combinaciones de forma{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            segura
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
          Cifrax es la plataforma perfecta para almacenar y gestionar tus combinaciones numéricas de manera organizada y accesible.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Link href="/register">
            <Button
              variant="primary"
              size="lg"
              icon={<ChevronRight className="size-5" />}
            >
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
