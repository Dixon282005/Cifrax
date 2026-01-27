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
    pairs: number[], 
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
    id: string | number, 
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
    const updatedCombinations = combinations.map(c => 
      String(c.group_id) === groupId ? { ...c, group_id: null } : c
    );
    setCombinations(updatedCombinations);
  };

  // --- LÓGICA DE FILTRADO INTELIGENTE (Tokenizada) ---
  // Esta es la parte que cambia para soportar búsquedas como "72 15"
  const filteredCombinations = useMemo(() => {
    return combinations
      .filter(c => {
        const rawTerm = searchTerm.toLowerCase().trim();
        
        // 1. Filtro de Grupo (Siempre se aplica primero para optimizar)
        const matchesGroup = filterGroup === 'all' || String(c.group_id) === filterGroup;
        if (!matchesGroup) return false;

        // Si no hay búsqueda de texto, devolvemos true (solo filtramos por grupo)
        if (!rawTerm) return true;

        // 2. TOKENIZACIÓN: Dividimos lo que escribe la profe por espacios
        // Ejemplo: "caja 72" se convierte en ["caja", "72"]
        const tokens = rawTerm.split(/\s+/).filter(t => t.length > 0);

        // 3. Lógica AND: CADA palabra/número escrito debe coincidir
        return tokens.every(token => {
          // A. ¿Está en el Texto (Título o Notas)?
          const inText = 
            (c.titulo || '').toLowerCase().includes(token) ||
            (c.notas || '').toLowerCase().includes(token);
          
          // B. ¿Está en los Números?
          const inNumbers = c.numeros?.some(num => {
            const strNum = String(num);
            const paddedNum = strNum.padStart(2, '0'); // Para encontrar "05" si escribe "05"
            return strNum.includes(token) || paddedNum.includes(token);
          });

          // Si el token está en el texto O en los números, pasa esta prueba
          return inText || inNumbers;
        });
      })
      .sort((a, b) => {
        // Ordenamiento
        if (sortBy === 'date' || sortBy === 'date-desc') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } 
        else if (sortBy === 'date-asc') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        else {
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