import { X } from 'lucide-react';
import { Group } from '@/types/database';

interface GroupListProps {
  groups: Group[];
  combinationCounts: Record<string, number>;
  // CAMBIO: Ahora acepta number porque así viene de la DB
  onDeleteGroup: (groupId: number) => void; 
}

export function GroupList({ groups, combinationCounts, onDeleteGroup }: GroupListProps) {
  if (groups.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
      <h3 className="text-white text-base sm:text-lg mb-4">Grupos Creados</h3>
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 group hover:border-slate-600 transition-colors text-sm sm:text-base"
          >
            <div className={`size-3 ${group.color} rounded-full`} />
            <span className="text-slate-300">{group.nombre}</span>
            <span className="text-slate-500 text-xs sm:text-sm">
              ({combinationCounts[String(group.id)] || 0}) 
              {/* Usamos String() aquí porque las llaves de los objetos siempre son strings */}
            </span>
            <button
              // PASAMOS EL ID DIRECTO SIN toString()
              onClick={() => onDeleteGroup(group.id)} 
              className="ml-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}