"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper para conectar a Supabase (DRY - Don't Repeat Yourself)
async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );
}

// 1. OBTENER (Mapeamos de tu BD a la UI)
export async function getCombinations() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('combinaciones')
    .select('*')
    .order('created_at', { ascending: false });

  if (!data) return [];

  return data.map((c) => ({
    id: c.id.toString(),
    name: c.titulo,
    pairs: c.numeros,
    group: c.group_id?.toString(),
    notes: c.notas,
    createdAt: c.created_at
  }));
}

// 2. CREAR (CON VALIDACIÓN DE DUPLICADOS Y FIX DE GRUPO)
export async function createCombination(payload: {
  name: string,
  pairs: number[],
  groupId?: string,
  notes?: string
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  // --- VALIDAR DUPLICADOS ---
  const { data: existing } = await supabase
    .from('combinaciones')
    .select('id')
    .eq('user_id', user.id)
    .eq('titulo', payload.name)
    .single();

  if (existing) {
    return { 
      success: false, 
      error: `Ya tienes una combinación llamada "${payload.name}". Por favor usa otro nombre.` 
    };
  }

  // --- FIX DE LLAVE FORÁNEA (CRÍTICO) ---
  // Si es "all", vacío, o no es número, mandamos NULL
  const cleanGroupId = (payload.groupId === 'all' || !payload.groupId || isNaN(Number(payload.groupId))) 
    ? null 
    : Number(payload.groupId);

  const { error } = await supabase.from('combinaciones').insert({
    user_id: user.id,
    titulo: payload.name,
    numeros: payload.pairs,
    group_id: cleanGroupId, // <--- Usamos el valor limpio
    notas: payload.notes
  });

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/dashboard');
  return { success: true };
}

// 3. BORRAR
export async function deleteCombinationAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('combinaciones').delete().eq('id', id);
  
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/dashboard');
  return { success: true };
}

// 4. ACTUALIZAR (UPDATE)
export async function updateCombination(payload: {
  id: string,
  name: string,
  pairs: number[],
  groupId?: string,
  notes?: string
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  // --- FIX DE LLAVE FORÁNEA TAMBIÉN AQUÍ ---
  const cleanGroupId = (payload.groupId === 'all' || !payload.groupId || isNaN(Number(payload.groupId))) 
    ? null 
    : Number(payload.groupId);

  const { error } = await supabase
    .from('combinaciones')
    .update({
      titulo: payload.name,
      numeros: payload.pairs,
      group_id: cleanGroupId, // <--- Usamos el valor limpio
      notas: payload.notes
    })
    .eq('id', payload.id)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}