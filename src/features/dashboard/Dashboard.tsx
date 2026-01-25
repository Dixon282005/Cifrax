"use client";

import { useState } from 'react';
// IMPORTANTE: Usamos los tipos globales de la DB
import { Group, Combination } from '@/types/database';

// Componentes UI
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { ActionButtons } from './components/ActionButtons';

// Componentes de Features
import { GroupForm } from '../groups/components/GroupForm';
import { GroupList } from '../groups/components/GroupList';
import { CombinationForm } from '../combinations/components/CombinationForm';
import { CombinationFilters } from '../combinations/components/CombinationFilters';
import { CombinationsList } from '../combinations/components/CombinationsList';

// Acciones y Hooks
import { signOutAction } from '@/features/auth/actions/Auth';
import { useCombinations } from '@/features/combinations/hooks/useCombinations';
import { useGroups } from '@/features/groups/hooks/useGroups';

interface DashboardProps {
  userEmail: string;
  initialGroups: Group[];
  initialCombinations: Combination[];
}

export function Dashboard({ userEmail, initialGroups, initialCombinations }: DashboardProps) {
  // --- ESTADOS UI ---
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [randomPairs, setRandomPairs] = useState<[number, number, number] | undefined>();

  // --- HOOK DE GRUPOS ---
  const { 
    groups, 
    addGroup, 
    removeGroup 
  } = useGroups(initialGroups);

  // --- HOOK DE COMBINACIONES ---
  const {
    combinations,
    filteredCombinations,
    addCombination,
    deleteCombination,
    searchTerm, setSearchTerm,
    filterGroup, setFilterGroup,
    sortBy, setSortBy
  } = useCombinations(initialCombinations);

  // --- MANEJADORES (Handlers) ---
  const handleSaveGroup = async (name: string, color: string) => {
    const result = await addGroup(name, color);
    if (result?.success) setIsAddingGroup(false);
  };

  const handleSaveCombination = async (name: string, pairs: [number, number, number], group: string, notes: string) => {
    // CORRECCIÓN: 'group' viene como string del <select>.
    // Si tu hook espera el ID exacto, aquí aseguramos que se pase tal cual.
    // Si el valor es 'all' o vacío, pasamos string vacío o null según requiera tu lógica.
    await addCombination(name, pairs, group, notes);
    
    setIsAddingNew(false);
    setRandomPairs(undefined);
  };

  const handleGenerateRandom = () => {
    setRandomPairs([
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100)
    ]);
    setIsAddingNew(true);
  };

  // --- ESTADÍSTICAS (Ajustadas a tipos en Español) ---
  const combinationCounts = combinations.reduce((acc, c) => {
    // Verificamos que group_id exista (no sea null/undefined)
    if (c.group_id != null) { 
      const key = String(c.group_id); // Convertimos a string para usarlo como índice
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const lastCreatedDate = combinations.length > 0
    ? new Date(Math.max(...combinations.map(c => new Date(c.created_at).getTime()))).toLocaleDateString('es-ES')
    : null;

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader 
        userEmail={userEmail} 
        onLogout={async () => await signOutAction()} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-white text-3xl sm:text-4xl mb-2">Dashboard</h1>
          <p className="text-slate-400 text-sm sm:text-base">Gestión profesional de Cifrax</p>
        </div>

        <ActionButtons
          onNewCombination={() => setIsAddingNew(true)}
          onNewGroup={() => setIsAddingGroup(true)}
          onGenerateRandom={handleGenerateRandom}
        />

        {isAddingGroup && (
          <GroupForm onSave={handleSaveGroup} onCancel={() => setIsAddingGroup(false)} />
        )}

        {isAddingNew && (
          <CombinationForm
            groups={groups}
            onSave={handleSaveCombination}
            onCancel={() => setIsAddingNew(false)}
            initialPairs={randomPairs}
          />
        )}

        {/* Lista de Grupos */}
        <GroupList
          groups={groups} 
          combinationCounts={combinationCounts}
          // ADAPTADOR DE SEGURIDAD:
          // Si removeGroup espera string y el ID es number (o viceversa), esto lo arregla.
          onDeleteGroup={(id) => removeGroup(id.toString())} 
        />

        <CombinationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterGroup={filterGroup}
          onFilterGroupChange={setFilterGroup}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          groups={groups}
        />

        <DashboardStats
          totalCombinations={combinations.length}
          totalGroups={groups.length}
          filteredCount={filteredCombinations.length}
          lastCreatedDate={lastCreatedDate}
        />

        <div className="mt-8">
          <h2 className="text-white text-xl sm:text-2xl mb-4">
            Combinaciones ({filteredCombinations.length})
          </h2>
          
          <CombinationsList
            combinations={filteredCombinations}
            groups={groups}
            // ADAPTADOR DE SEGURIDAD PARA DELETE:
            onDelete={(id) => deleteCombination(id.toString())}
            
            // Búsqueda segura comparando Strings para evitar errores de tipo number vs string
            getGroupById={(id) => groups.find(g => String(g.id) === String(id))}
            totalCombinations={combinations.length}
          />
        </div>
      </main>
    </div>
  );
}