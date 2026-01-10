interface DashboardStatsProps {
  totalCombinations: number;
  totalGroups: number;
  filteredCount: number;
  lastCreatedDate: string | null;
}

export function DashboardStats({
  totalCombinations,
  totalGroups,
  filteredCount,
  lastCreatedDate
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
        <div className="text-slate-400 text-xs sm:text-sm mb-1">Total Combinaciones</div>
        <div className="text-white text-2xl sm:text-3xl">{totalCombinations}</div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
        <div className="text-slate-400 text-xs sm:text-sm mb-1">Total Grupos</div>
        <div className="text-white text-2xl sm:text-3xl">{totalGroups}</div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
        <div className="text-slate-400 text-xs sm:text-sm mb-1">Resultados</div>
        <div className="text-white text-2xl sm:text-3xl">{filteredCount}</div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
        <div className="text-slate-400 text-xs sm:text-sm mb-1">Última Creada</div>
        <div className="text-white text-xs sm:text-sm">
          {lastCreatedDate || 'N/A'}
        </div>
      </div>
    </div>
  );
}
