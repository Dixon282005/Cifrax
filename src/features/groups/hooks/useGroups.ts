import { useState, useEffect } from 'react';
import { Group } from '@/types/database';
import { createGroup, deleteGroup } from '../actions/groups';

export function useGroups(initialData: Group[]) {
  const [groups, setGroups] = useState<Group[]>(initialData);
  const [isPending, setIsPending] = useState(false);

  // Sincronizar cuando el servidor mande nueva data (revalidatePath)
  useEffect(() => {
    setGroups(initialData);
  }, [initialData]);

  // --- AGREGAR GRUPO ---
  const addGroup = async (name: string, color: string) => {
    setIsPending(true);
    const result = await createGroup(name, color);
    
    if (!result.success) {
      alert("Error al crear grupo: " + result.error);
    }
    // No necesitamos actualizar el estado manual porque 
    // revalidatePath hará que initialData cambie
    setIsPending(false);
    return result;
  };

  // --- ELIMINAR GRUPO ---
  const removeGroup = async (id: number | string) => {
    if (confirm("¿Estás seguro de eliminar este grupo?")) {
      setIsPending(true);
      const result = await deleteGroup(id);
      
      if (!result.success) {
        alert("Error al eliminar: " + result.error);
      }
      setIsPending(false);
      return result;
    }
  };

  return {
    groups,
    addGroup,
    removeGroup,
    isPending
  };
}