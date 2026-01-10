import { Search, Filter } from 'lucide-react';
import { Group } from '../../groups/types';
import { SortBy } from '../types';

interface CombinationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterGroup: string;
  onFilterGroupChange: (value: string) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  groups: Group[];
}

export function CombinationFilters({
  searchTerm,
  onSearchChange,
  filterGroup,
  onFilterGroupChange,
  sortBy,
  onSortByChange,
  groups
}: CombinationFiltersProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-slate-300 mb-2 text-sm sm:text-base">
            Buscar Combinaciones
          </label>
          <div className="relative">
            <Search className="size-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
              placeholder="Buscar por nombre o notas..."
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-2 text-sm sm:text-base">
            Filtrar por Grupo
          </label>
          <div className="relative">
            <Filter className="size-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={filterGroup}
              onChange={(e) => onFilterGroupChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none text-sm sm:text-base"
            >
              <option value="all">Todos los grupos</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
        <span className="text-slate-400 text-sm sm:text-base">Ordenar por:</span>
        <button
          onClick={() => onSortByChange('date')}
          className={`px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
            sortBy === 'date' 
              ? 'bg-cyan-500 text-white' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Fecha
        </button>
        <button
          onClick={() => onSortByChange('name')}
          className={`px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
            sortBy === 'name' 
              ? 'bg-cyan-500 text-white' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Nombre
        </button>
      </div>
    </div>
  );
}
