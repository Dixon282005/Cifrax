import { useState, useEffect, useMemo } from 'react';
// IMPORTANTE: Importamos desde tu archivo global (Database)
import { Combination } from '@/types/database'; 
import { createCombination, deleteCombinationAction, updateCombination } from '../actions/combinations';

export type SortBy = 'date' | 'name' | 'date-asc' | 'date-desc';

export function useCombinations(initialData: Combination[]) {
  // Estado local
  const [combinations, setCombinations] = useState<Combination[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // Sincronizar data del servidor
  useEffect(() => {
    setCombinations(initialData);
  }, [initialData]);

  // --- ACCIÓN: AGREGAR (CREATE) ---
  const addCombination = async (
    name: string,
    pairs: number[], // Cambiado a number[] para ser flexible
    group: string,
    notes: string
  ) => {
    const result = await createCombination({ 
      name, 
      pairs, 
      groupId: group, 
      notes 
    });

    if (!result.success) {
      alert("Error al guardar: " + result.error);
    }
  };

  // --- ACCIÓN: EDITAR (UPDATE) ---
  const editCombination = async (
    id: string | number, // Aceptamos ambos para seguridad
    name: string,
    pairs: number[],
    group: string,
    notes: string
  ) => {
    const result = await updateCombination({
      id: id,
      name,
      pairs,
      groupId: group,
      notes
    });

    if (!result.success) {
      alert("Error al editar: " + result.error);
    }
  };

  // --- ACCIÓN: ELIMINAR (DELETE) ---
  const deleteCombination = async (id: string | number) => {
    if (confirm('¿Estás seguro de eliminar esta combinación?')) {
      const result = await deleteCombinationAction(id);
      if (!result.success) {
        alert("Error al eliminar: " + result.error);
      }
    }
  };

  // --- ACCIÓN: REMOVER GRUPO (Visual) ---
  const removeGroupFromCombinations = (groupId: string) => {
    // Comparamos String vs String para evitar errores de tipo
    const updatedCombinations = combinations.map(c => 
      String(c.group_id) === groupId ? { ...c, group_id: null } : c
    );
    setCombinations(updatedCombinations);
  };

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO (CORREGIDA) ---
  const filteredCombinations = useMemo(() => {
    return combinations
      .filter(c => {
        // 1. Filtro por Texto: Usamos c.titulo y c.notas
        const matchesSearch = 
          (c.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.notas || '').toLowerCase().includes(searchTerm.toLowerCase());

        // 2. Filtro por Grupo: Usamos c.group_id
        const matchesGroup = filterGroup === 'all' || String(c.group_id) === filterGroup;

        return matchesSearch && matchesGroup;
      })
      .sort((a, b) => {
        // 3. Ordenamiento: Usamos created_at y titulo
        if (sortBy === 'date' || sortBy === 'date-desc') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } 
        else if (sortBy === 'date-asc') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        else {
          // Orden por Nombre (titulo)
          return (a.titulo || '').localeCompare(b.titulo || '');
        }
      });
  }, [combinations, searchTerm, filterGroup, sortBy]);

  return {
    combinations,
    filteredCombinations,
    addCombination,
    editCombination,
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