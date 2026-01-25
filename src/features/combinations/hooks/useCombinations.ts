import { useState, useEffect } from 'react';
import { Combination, SortBy } from '../types';
import { createCombination, deleteCombinationAction, updateCombination } from '../actions/combinations';

// Recibe la data inicial del Servidor (Actions)
export function useCombinations(initialData: Combination[]) {
  // Estado local para manejar la UI
  const [combinations, setCombinations] = useState<Combination[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // EFECTO: Sincronizar cuando el servidor actualice la data
  // Si Next.js hace un revalidatePath, initialData cambia y esto actualiza tu lista automáticamente
  useEffect(() => {
    setCombinations(initialData);
  }, [initialData]);

  // --- ACCIÓN: AGREGAR (CREATE) ---
  const addCombination = async (
    name: string,
    pairs: [number, number, number],
    group: string,
    notes: string
  ) => {
    // Llamada al Backend
    const result = await createCombination({ 
      name, 
      pairs, 
      groupId: group, 
      notes 
    });

    if (!result.success) {
      alert("Error al guardar: " + result.error);
    }
    // No hacemos setCombinations manual, esperamos que Next.js refresque 'initialData'
  };

  // --- ACCIÓN: EDITAR (UPDATE) - ¡NUEVO! ---
  const editCombination = async (
    id: string,
    name: string,
    pairs: [number, number, number],
    group: string,
    notes: string
  ) => {
    const result = await updateCombination({
      id,
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
  const deleteCombination = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta combinación?')) {
      const result = await deleteCombinationAction(id);
      if (!result.success) {
        alert("Error al eliminar: " + result.error);
      }
    }
  };

  // --- ACCIÓN: REMOVER GRUPO (Visual por ahora) ---
  const removeGroupFromCombinations = (groupId: string) => {
    const updatedCombinations = combinations.map(c => 
      c.group === groupId ? { ...c, group: undefined } : c
    );
    setCombinations(updatedCombinations);
  };

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  const filteredCombinations = combinations
    .filter(c => {
      // 1. Filtro por Texto (Nombre o Notas)
      const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase())) || 
        false;

      // 2. Filtro por Grupo
      const matchesGroup = filterGroup === 'all' || c.group === filterGroup;

      return matchesSearch && matchesGroup;
    })
    .sort((a, b) => {
      // 3. Ordenamiento
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  // Retornamos todo, INCLUYENDO editCombination
  return {
    combinations,
    filteredCombinations,
    addCombination,
    editCombination, // <--- ¡Importante!
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