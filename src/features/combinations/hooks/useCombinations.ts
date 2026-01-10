import { useState, useEffect } from 'react';
import { Combination, SortBy } from '../types';

export function useCombinations(userEmail: string) {
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // Cargar combinaciones del localStorage
  useEffect(() => {
    const storedCombinations = localStorage.getItem(`cifrax_combinations_${userEmail}`);
    if (storedCombinations) {
      setCombinations(JSON.parse(storedCombinations));
    }
  }, [userEmail]);

  // Guardar combinaciones
  const saveCombinations = (newCombinations: Combination[]) => {
    setCombinations(newCombinations);
    localStorage.setItem(`cifrax_combinations_${userEmail}`, JSON.stringify(newCombinations));
  };

  // Agregar combinación
  const addCombination = (
    name: string,
    pairs: [number, number, number],
    group: string,
    notes: string
  ) => {
    const newCombination: Combination = {
      id: Date.now().toString(),
      name,
      pairs,
      createdAt: new Date().toISOString(),
      group: group || undefined,
      notes: notes || undefined
    };
    saveCombinations([...combinations, newCombination]);
  };

  // Eliminar combinación
  const deleteCombination = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta combinación?')) {
      saveCombinations(combinations.filter(c => c.id !== id));
    }
  };

  // Remover grupo de combinaciones
  const removeGroupFromCombinations = (groupId: string) => {
    const updatedCombinations = combinations.map(c => 
      c.group === groupId ? { ...c, group: undefined } : c
    );
    saveCombinations(updatedCombinations);
  };

  // Filtrar y ordenar combinaciones
  const filteredCombinations = combinations
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = filterGroup === 'all' || c.group === filterGroup;
      return matchesSearch && matchesGroup;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  return {
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
  };
}
