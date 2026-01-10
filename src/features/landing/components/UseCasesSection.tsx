import { Lock, Shield, Database, Folder } from 'lucide-react';

const useCases = [
  {
    icon: Lock,
    title: 'Cajas Fuertes',
    description: 'Guarda las combinaciones de tus cajas fuertes personales o de trabajo de forma segura.'
  },
  {
    icon: Shield,
    title: 'Candados y Cerraduras',
    description: 'Organiza todas las combinaciones de candados, armarios y cerraduras numéricas.'
  },
  {
    icon: Database,
    title: 'Códigos de Acceso',
    description: 'Mantén un registro de códigos de acceso a edificios, áreas restringidas y más.'
  },
  {
    icon: Folder,
    title: 'Organización Personal',
    description: 'Cualquier sistema que use combinaciones numéricas, todo en un solo lugar.'
  }
];

export function UseCasesSection() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-3xl sm:text-4xl text-center mb-12 sm:mb-16">
          Casos de Uso
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {useCases.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <div
                key={useCase.title}
                className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="size-10 sm:size-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="size-5 sm:size-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg sm:text-xl mb-2">{useCase.title}</h3>
                    <p className="text-slate-400 text-sm sm:text-base">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
