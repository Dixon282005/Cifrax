import { useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { ActionButtons } from './components/ActionButtons';
import { GroupForm } from '../groups/components/GroupForm';
import { GroupList } from '../groups/components/GroupList';
import { CombinationForm } from '../combinations/components/CombinationForm';
import { CombinationFilters } from '../combinations/components/CombinationFilters';
import { CombinationsList } from '../combinations/components/CombinationsList';
import { useGroups } from '../groups/hooks/useGroups';
import { useCombinations } from '../combinations/hooks/useCombinations';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [randomPairs, setRandomPairs] = useState<[number, number, number] | undefined>();

  // Groups hook
  const { groups, addGroup, deleteGroup, getGroupById } = useGroups(userEmail);

  // Combinations hook
  const {
    combinations,
    filteredCombinations,
    addCombination,
    deleteCombination,
    removeGroupFromCombinations,
    searchTerm,
    setSearchTerm,
    filterGroup,
    setFilterGroup,
    sortBy,
    setSortBy
  } = useCombinations(userEmail);

  // Handlers
  const handleAddGroup = (name: string, color: string) => {
    addGroup(name, color);
    setIsAddingGroup(false);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (deleteGroup(groupId)) {
      removeGroupFromCombinations(groupId);
    }
  };

  const handleAddCombination = (
    name: string,
    pairs: [number, number, number],
    group: string,
    notes: string
  ) => {
    addCombination(name, pairs, group, notes);
    setIsAddingNew(false);
    setRandomPairs(undefined);
  };

  const handleGenerateRandom = () => {
    const randomPairs: [number, number, number] = [
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100)
    ];
    setRandomPairs(randomPairs);
    setIsAddingNew(true);
  };

  const handleCancelForm = () => {
    setIsAddingNew(false);
    setRandomPairs(undefined);
  };

  // Calculate stats
  const combinationCounts = combinations.reduce((acc, c) => {
    if (c.group) {
      acc[c.group] = (acc[c.group] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const lastCreatedDate = combinations.length > 0
    ? new Date(Math.max(...combinations.map(c => new Date(c.createdAt).getTime()))).toLocaleDateString('es-ES')
    : null;

  return (
    <div className="min-h-screen">
      <DashboardHeader userEmail={userEmail} onLogout={onLogout} />

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

        {/* Add New Group Form */}
        {isAddingGroup && (
          <GroupForm
            onSave={handleAddGroup}
            onCancel={() => setIsAddingGroup(false)}
          />
        )}

        {/* Add New Combination Form */}
        {isAddingNew && (
          <CombinationForm
            groups={groups}
            onSave={handleAddCombination}
            onCancel={handleCancelForm}
            initialPairs={randomPairs}
          />
        )}

        {/* Groups List */}
        <GroupList
          groups={groups}
          combinationCounts={combinationCounts}
          onDeleteGroup={handleDeleteGroup}
        />

        {/* Filters and Search */}
        <CombinationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterGroup={filterGroup}
          onFilterGroupChange={setFilterGroup}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          groups={groups}
        />

        {/* Stats */}
        <DashboardStats
          totalCombinations={combinations.length}
          totalGroups={groups.length}
          filteredCount={filteredCombinations.length}
          lastCreatedDate={lastCreatedDate}
        />

        {/* Combinations List */}
        <div>
          <h2 className="text-white text-xl sm:text-2xl mb-4">
            Combinaciones Guardadas ({filteredCombinations.length})
          </h2>
          
          <CombinationsList
            combinations={filteredCombinations}
            groups={groups}
            onDelete={deleteCombination}
            getGroupById={getGroupById}
            totalCombinations={combinations.length}
          />
        </div>
      </main>
    </div>
  );
}
