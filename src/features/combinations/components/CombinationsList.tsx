import { Lock } from 'lucide-react';
// IMPORTANTE: Usamos los tipos globales
import { Combination, Group } from '@/types/database';
import { CombinationCard } from './CombinationCard';

interface CombinationsListProps {
  combinations: Combination[];
  groups: Group[];
  // El ID es number en la DB
  onDelete: (id: number) => void;
  // El group_id es number, pero permitimos string por flexibilidad con el buscador
  getGroupById: (groupId: number | string) => Group | undefined;
  totalCombinations: number;
}

export function CombinationsList({
  combinations,
  groups,
  onDelete,
  getGroupById,
  totalCombinations
}: CombinationsListProps) {
  
  // Si no hay resultados (filtro o vacío total)
  if (combinations.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-12 text-center">
        <Lock className="size-12 sm:size-16 text-slate-700 mx-auto mb-4" />
        <p className="text-slate-400 text-base sm:text-lg mb-2">
          {totalCombinations === 0 
            ? 'No tienes combinaciones guardadas aún' 
            : 'No se encontraron combinaciones con los filtros aplicados'}
        </p>
        <p className="text-slate-500 text-sm sm:text-base">
          {totalCombinations === 0 
            ? 'Haz clic en "Nueva Combinación" para comenzar'
            : 'Intenta ajustar tus filtros de búsqueda'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {combinations.map((combination) => {
        // CORRECCIÓN: Usamos 'group_id' en lugar de 'group'
        // Si group_id es null, pasamos undefined o un valor dummy, pero validamos antes
        const group = combination.group_id 
          ? getGroupById(combination.group_id) 
          : undefined;

        return (
          <CombinationCard
            key={combination.id}
            combination={combination}
            group={group}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}