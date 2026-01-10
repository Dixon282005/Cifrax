import { Monitor, Smartphone } from 'lucide-react';

export function ResponsiveSection() {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-white text-3xl sm:text-4xl mb-4">
          Accede desde cualquier dispositivo
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mb-12 max-w-2xl mx-auto">
          Cifrax está diseñado para funcionar perfectamente en computadoras, tablets y smartphones
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
          <div className="text-center">
            <div className="size-16 sm:size-20 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Monitor className="size-8 sm:size-10 text-cyan-400" />
            </div>
            <p className="text-slate-300 text-sm sm:text-base">Escritorio</p>
          </div>

          <div className="text-center">
            <div className="size-16 sm:size-20 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="size-8 sm:size-10 text-cyan-400" />
            </div>
            <p className="text-slate-300 text-sm sm:text-base">Móvil</p>
          </div>
        </div>
      </div>
    </section>
  );
}
