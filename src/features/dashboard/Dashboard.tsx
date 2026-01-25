

"use client";

import { useState } from 'react';
// Importamos los tipos
import { Group } from '@/features/groups/types';
import { Combination } from '@/features/combinations/types';

// Componentes UI
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { ActionButtons } from './components/ActionButtons';

// Componentes de otras Features

// Componentes de Features
import { GroupForm } from '../groups/components/GroupForm';
import { GroupList } from '../groups/components/GroupList';
import { CombinationForm } from '../combinations/components/CombinationForm';
import { CombinationFilters } from '../combinations/components/CombinationFilters';
import { CombinationsList } from '../combinations/components/CombinationsList';

// Acciones y Hooks
import { createGroup, deleteGroup } from '../groups/actions/groups';
import { signOutAction } from '@/features/auth/actions/Auth';
import { useCombinations } from '@/features/combinations/hooks/useCombinations'; // <--- EL NUEVO HOOK

interface DashboardProps {
  userEmail: string;
  initialGroups: Group[];        // Tipado fuerte
  initialCombinations: Combination[]; // Tipado fuerte
}

export function Dashboard({ userEmail, initialGroups, initialCombinations }: DashboardProps) {
  // --- ESTADOS UI (Ventanas modales, etc) ---
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [randomPairs, setRandomPairs] = useState<[number, number, number] | undefined>();

  // --- HOOK PRINCIPAL DE COMBINACIONES (El cerebro conectado a Supabase) ---
  const {
    combinations,         // Data cruda (para stats)
    filteredCombinations, // Data filtrada (para la lista)
    addCombination,       // Función que guarda en BD
    deleteCombination,    // Función que borra en BD
    // editCombination,   // (Descomenta si tu lista tiene botón de editar)
    searchTerm, setSearchTerm,
    filterGroup, setFilterGroup,
    sortBy, setSortBy
  } = useCombinations(initialCombinations);

  // --- LÓGICA DE GRUPOS ---
  const handleAddGroup = async (name: string, color: string) => {
    const result = await createGroup(name, color);
    if (result.success) {
      setIsAddingGroup(false);
      // Next.js recargará la data automáticamente gracias a revalidatePath
    } else {
      alert("Error: " + result.error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (confirm("¿Estás seguro de eliminar este grupo?")) {
      await deleteGroup(Number(groupId));
      // No necesitamos limpiar combinaciones locales manualmente, 
      // la base de datos y el revalidatePath se encargan.
    }
  };

  // --- LÓGICA DE COMBINACIONES (Ahora usa el Hook) ---

  const handleSaveCombination = async (
    name: string,
    pairs: [number, number, number],
    group: string,
    notes: string
  ) => {
    // 1. Llamamos al hook (que llama al server action)
    await addCombination(name, pairs, group, notes);
    
    // 2. Cerramos el formulario y limpiamos
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

  const handleCancelForm = () => {
    setIsAddingNew(false);
    setRandomPairs(undefined);
  };

  // --- ESTADÍSTICAS ---
  // Calculamos usando la data real "combinations" que viene del hook
  const combinationCounts = combinations.reduce((acc, c) => {
    if (c.group) acc[c.group] = (acc[c.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lastCreatedDate = combinations.length > 0
    ? new Date(Math.max(...combinations.map(c => new Date(c.createdAt).getTime()))).toLocaleDateString('es-ES')
    : null;

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader 
        userEmail={userEmail} 
        onLogout={async () => await signOutAction()} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-white text-3xl sm:text-4xl mb-2">Dashboard</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Gestiona tus combinaciones y grupos de forma organizada
          </p>
        </div>

        {/* Action Buttons */}
        <ActionButtons
          onNewCombination={() => setIsAddingNew(true)}
          onNewGroup={() => setIsAddingGroup(true)}
          onGenerateRandom={handleGenerateRandom}
        />

        {/* Formulario de Grupos */}
        {isAddingGroup && (
          <GroupForm
            onSave={handleAddGroup}
            onCancel={() => setIsAddingGroup(false)}
          />
        )}

        {/* Formulario de Combinaciones */}
        {isAddingNew && (
          <CombinationForm
            groups={initialGroups}
            onSave={handleSaveCombination} // <--- Usamos la nueva función conectada
            onCancel={handleCancelForm}
            initialPairs={randomPairs}
          />
        )}

        {/* Lista de Grupos */}
        <GroupList
          groups={initialGroups}
          combinationCounts={combinationCounts}
          onDeleteGroup={handleDeleteGroup}
        />

        {/* Filtros (Conectados al Hook) */}
        <CombinationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterGroup={filterGroup}
          onFilterGroupChange={setFilterGroup}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          groups={initialGroups}
        />

        {/* Stats */}
        <DashboardStats
          totalCombinations={combinations.length}
          totalGroups={initialGroups.length}
          filteredCount={filteredCombinations.length}
          lastCreatedDate={lastCreatedDate}
        />

        {/* Lista de Combinaciones */}
        <div className="mt-8">
          <h2 className="text-white text-xl sm:text-2xl mb-4">
            Combinaciones Guardadas ({filteredCombinations.length})
          </h2>
          
          <CombinationsList
            combinations={filteredCombinations} // <--- Data filtrada del hook
            groups={initialGroups}
            onDelete={deleteCombination} // <--- Acción del servidor
            // Helper para encontrar el grupo por ID (para mostrar el color)
            getGroupById={(id) => initialGroups.find(g => String(g.id) === String(id))}
            totalCombinations={combinations.length}
          />
        </div>
      </main>
    </div>
  );
}