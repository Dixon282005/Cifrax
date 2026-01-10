import { useState, useEffect } from 'react';
import { Group } from '../types';

export function useGroups(userEmail: string) {
  const [groups, setGroups] = useState<Group[]>([]);

  // Cargar grupos del localStorage
  useEffect(() => {
    const storedGroups = localStorage.getItem(`cifrax_groups_${userEmail}`);
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    }
  }, [userEmail]);

  // Guardar grupos
  const saveGroups = (newGroups: Group[]) => {
    setGroups(newGroups);
    localStorage.setItem(`cifrax_groups_${userEmail}`, JSON.stringify(newGroups));
  };

  const addGroup = (name: string, color: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      color
    };
    saveGroups([...groups, newGroup]);
  };

  const deleteGroup = (groupId: string) => {
    if (confirm('¿Estás seguro de eliminar este grupo? Las combinaciones no se eliminarán.')) {
      saveGroups(groups.filter(g => g.id !== groupId));
      return true;
    }
    return false;
  };

  const getGroupById = (groupId?: string) => {
    return groups.find(g => g.id === groupId);
  };

  return {
    groups,
    addGroup,
    deleteGroup,
    getGroupById
  };
}
