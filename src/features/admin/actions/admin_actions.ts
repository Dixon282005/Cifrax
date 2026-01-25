'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";
import { AdminCombination, AdminStats, UserData } from "../services/localDataService";

export async function fetchAdminData(): Promise<AdminStats> {
  const { data: combinaciones } = await supabaseAdmin
    .from('combinaciones')
    .select('*');
    
  const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();

  if (authError || !combinaciones) {
    return { totalUsers: 0, totalCombinations: 0, recentActivity: [], chartData: [], userList: [] };
  }

  const userList: UserData[] = users.map(user => {
    const userCombos = combinaciones.filter(c => c.user_id === user.id);
    const timestamps = userCombos.map(c => new Date(c.created_at).getTime());

    return {
      email: user.email || 'Sin email',
      combinationsCount: userCombos.length,
      lastActive: timestamps.length > 0 
        ? new Date(Math.max(...timestamps)).toISOString() 
        : null,
      firstActive: user.created_at
    };
  }).filter(u => u.combinationsCount > 0);

  const chartDataMap = new Array(7).fill(0);
  const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  
  combinaciones.forEach(c => {
    const date = new Date(c.created_at);
    if (!isNaN(date.getTime())) chartDataMap[date.getDay()]++;
  });

  const chartData = days.map((day, index) => ({ name: day, total: chartDataMap[index] }));

  return {
    totalUsers: userList.length,
    totalCombinations: combinaciones.length,
    recentActivity: userList.sort((a,b) => b.combinationsCount - a.combinationsCount).slice(0, 5),
    chartData,
    userList
  };
}

export async function fetchGlobalCombinations(): Promise<AdminCombination[]> {
  const { data: combinaciones } = await supabaseAdmin
    .from('combinaciones')
    .select(`
      *,
      grupos ( nombre )
    `)
    .order('created_at', { ascending: false });

  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  
  if (!combinaciones || !users) return [];

  const userMap = new Map(users.map(u => [u.id, u.email]));

  return combinaciones.map((item: any) => ({
    id: item.id.toString(),
    name: item.titulo,
    pairs: item.numeros,
    group: item.grupos?.nombre || undefined,
    notes: item.notas,
    createdAt: item.created_at,
    userEmail: userMap.get(item.user_id) || 'Usuario desconocido'
  }));
}

export async function deleteCombinationAction(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('combinaciones')
    .delete()
    .eq('id', id);
  return !error;
}

export async function getSystemHealth() {
  const start = Date.now();
  // Consulta ligera para probar conexión
  const { count, error } = await supabaseAdmin
    .from('combinaciones') // Asegúrate de que esta tabla exista
    .select('*', { count: 'exact', head: true });

  const latency = Date.now() - start;

  return {
    isConnected: !error,
    latency: latency,
    totalRecords: count || 0,
    error: error?.message
  };
}