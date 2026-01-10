import { Lock, Folder, Search, Zap, Eye, Database } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'Almacenamiento Seguro',
    description: 'Guarda tus combinaciones de 3 pares de números con total seguridad y privacidad.'
  },
  {
    icon: Folder,
    title: 'Grupos Organizados',
    description: 'Crea grupos personalizados con colores para organizar tus combinaciones por categorías.'
  },
  {
    icon: Search,
    title: 'Búsqueda Rápida',
    description: 'Encuentra cualquier combinación al instante con nuestro sistema de búsqueda y filtros avanzados.'
  },
  {
    icon: Zap,
    title: 'Generador Aleatorio',
    description: 'Genera combinaciones aleatorias de forma instantánea cuando las necesites.'
  },
  {
    icon: Eye,
    title: 'Interfaz Intuitiva',
    description: 'Diseño moderno y fácil de usar que te permite gestionar todo desde un solo lugar.'
  },
  {
    icon: Database,
    title: 'Notas Adjuntas',
    description: 'Añade notas y detalles adicionales a cada combinación para mayor contexto.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-3xl sm:text-4xl text-center mb-12 sm:mb-16">
          Características Principales
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sm:p-8 hover:border-cyan-500/50 transition-colors"
              >
                <div className="size-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="size-6 text-cyan-400" />
                </div>
                <h3 className="text-white text-lg sm:text-xl mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
