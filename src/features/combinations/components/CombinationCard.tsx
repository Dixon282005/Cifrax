import { Trash2 } from 'lucide-react';
import { Combination, Group } from '../../../types/database'; // Usando globales de la DB

interface CombinationCardProps {
  combination: Combination;
  group?: Group;
  onDelete: (id: number) => void; // Cambiado a number porque en la DB es bigint
}

export function CombinationCard({ combination, group, onDelete }: CombinationCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 hover:border-cyan-500/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          {/* Cambiado: .name -> .titulo */}
          <h3 className="text-white text-lg sm:text-xl mb-1 truncate">{combination.titulo}</h3>
          
          {group && (
            <div className="flex items-center gap-2 mb-2">
              <div className={`size-2 ${group.color} rounded-full`} />
              {/* Cambiado: .name -> .nombre */}
              <span className="text-slate-400 text-xs sm:text-sm truncate">{group.nombre}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => onDelete(combination.id)}
          className="text-slate-500 hover:text-red-400 transition-colors ml-2 flex-shrink-0 p-1 hover:bg-red-500/10 rounded-lg"
        >
          <Trash2 className="size-5" />
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-4">
        <div className="flex gap-2 justify-center">
          {/* Cambiado: .pairs -> .numeros */}
          {combination.numeros.map((num, numIndex) => (
            <div
              key={numIndex}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 sm:px-4 py-3 sm:py-4 text-cyan-400 text-center text-xl sm:text-2xl max-w-[80px]"
            >
              {num.toString().padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>

      {/* Cambiado: .notes -> .notas */}
      {combination.notas && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 mb-4">
          <p className="text-slate-400 text-xs sm:text-sm break-words italic">
            "{combination.notas}"
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-slate-500 text-xs sm:text-sm pt-3 border-t border-slate-800 gap-1">
        {/* Cambiado: .createdAt -> .created_at */}
        <span>Creada: {new Date(combination.created_at).toLocaleDateString('es-ES')}</span>
        <span>
          {new Date(combination.created_at).toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}