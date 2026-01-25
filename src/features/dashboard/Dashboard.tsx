"use client";

import { useState, useMemo } from 'react';
// Asegúrate de que estas rutas sean correctas según tu estructura de carpetas
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { ActionButtons } from './components/ActionButtons';

// Componentes de otras Features
import { GroupForm } from '../groups/components/GroupForm';
import { GroupList } from '../groups/components/GroupList';
import { CombinationForm } from '../combinations/components/CombinationForm';
import { CombinationFilters } from '../combinations/components/CombinationFilters';
import { CombinationsList } from '../combinations/components/CombinationsList';
import { SortBy } from '../combinations/types';

// Acciones del Servidor (Backend)
import { createGroup, deleteGroup } from '../groups/actions/groups';
import { signOutAction } from '@/features/auth/actions/Auth';

interface DashboardProps {
  userEmail: string;
  initialGroups: any[]; // Recibimos los grupos de la DB
}

export function Dashboard({ userEmail, initialGroups }: DashboardProps) {
  // --- ESTADOS UI ---
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [randomPairs, setRandomPairs] = useState<[number, number, number] | undefined>();

  // --- ESTADOS DE COMBINACIONES (LOCAL POR AHORA) ---
  const [combinations, setCombinations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // --- LÓGICA DE GRUPOS (CONECTADA AL BACKEND) ---
  
  const handleAddGroup = async (name: string, color: string) => {
    const result = await createGroup(name, color);
    if (result.success) {
      setIsAddingGroup(false);
      // La página se recargará sola mostrando el nuevo grupo
    } else {
      alert("Error: " + result.error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (confirm("¿Estás seguro de eliminar este grupo?")) {
      await deleteGroup(Number(groupId));
      // También limpiamos las combinaciones locales asociadas (opcional)
      setCombinations(prev => prev.map(c => 
        c.group === groupId ? { ...c, group: undefined } : c
      ));
    }
  };

  // --- LÓGICA DE COMBINACIONES (LOCAL) ---

  const handleAddCombination = (
    name: string,
    pairs: [number, number, number],
    group: string,
    notes: string
  ) => {
    const newCombo = {
      id: Date.now().toString(), // ID temporal
      name,
      pairs,
      group,
      notes,
      createdAt: new Date().toISOString()
    };
    setCombinations([newCombo, ...combinations]);
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

  // --- FILTROS Y BÚSQUEDA (Reemplaza al hook useCombinations) ---
  
  const filteredCombinations = useMemo(() => {
    return combinations
      .filter(combo => {
        const matchesSearch = combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            combo.pairs.join(' ').includes(searchTerm);
        const matchesGroup = filterGroup === 'all' || combo.group === filterGroup;
        return matchesSearch && matchesGroup;
      })
      .sort((a, b) => {
        if (sortBy === 'date' || sortBy === 'date-desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [combinations, searchTerm, filterGroup, sortBy]);

  // --- ESTADÍSTICAS ---
  
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

        {/* Formulario de Grupos (CONECTADO) */}
        {isAddingGroup && (
          <GroupForm
            onSave={handleAddGroup}
            onCancel={() => setIsAddingGroup(false)}
          />
        )}

        {/* Formulario de Combinaciones (LOCAL) */}
        {isAddingNew && (
          <CombinationForm
            groups={initialGroups} // Usamos los grupos reales de la DB
            onSave={handleAddCombination}
            onCancel={handleCancelForm}
            initialPairs={randomPairs}
          />
        )}

        {/* Lista de Grupos (CONECTADO) */}
        <GroupList
          groups={initialGroups} // Usamos los grupos reales de la DB
          combinationCounts={combinationCounts}
          onDeleteGroup={handleDeleteGroup}
        />

        {/* Filtros */}
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
            combinations={filteredCombinations}
            groups={initialGroups}
            onDelete={(id) => {
                // Borrado local temporal
                setCombinations(prev => prev.filter(c => c.id !== id));
            }}
            // Helper para encontrar el grupo por ID
            getGroupById={(id) => initialGroups.find(g => String(g.id) === String(id))}
            totalCombinations={combinations.length}
          />
        </div>
      </main>
    </div>
  );
}