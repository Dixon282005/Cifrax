const steps = [
  {
    number: 1,
    title: 'Regístrate',
    description: 'Crea tu cuenta gratuita en menos de un minuto'
  },
  {
    number: 2,
    title: 'Guarda Combinaciones',
    description: 'Añade tus combinaciones de 3 pares de números con nombres descriptivos'
  },
  {
    number: 3,
    title: 'Organiza y Accede',
    description: 'Usa grupos y filtros para mantener todo organizado y accesible'
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-3xl sm:text-4xl text-center mb-4">
          ¿Cómo funciona?
        </h2>
        <p className="text-slate-400 text-center mb-12 sm:mb-16 max-w-2xl mx-auto text-sm sm:text-base">
          Comienza a usar Cifrax en solo 3 simples pasos
        </p>

        <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="size-16 sm:size-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl sm:text-3xl">{step.number}</span>
              </div>
              <h3 className="text-white text-xl sm:text-2xl mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm sm:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
