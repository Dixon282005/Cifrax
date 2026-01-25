"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// 1. OBTENER (Mapeamos de tu BD a la UI)
export async function getCombinations() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data } = await supabase
    .from('combinaciones') // Tu tabla exacta
    .select('*')
    .order('created_at', { ascending: false });

  if (!data) return [];

  // Transformamos los nombres de la BD (español) a tu Frontend (inglés)
  return data.map((c) => ({
    id: c.id.toString(),
    name: c.titulo,           // BD: titulo -> UI: name
    pairs: c.numeros,         // BD: numeros ([1,2,3]) -> UI: pairs
    group: c.group_id?.toString(), // BD: group_id -> UI: group
    notes: c.notas,           // BD: notas -> UI: notes
    createdAt: c.created_at
  }));
}




// 2. CREAR (CON VALIDACIÓN DE NOMBRE DUPLICADO)
export async function createCombination(payload: {
  name: string,
  pairs: number[],
  groupId?: string,
  notes?: string
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  // --- PASO 1: VALIDAR DUPLICADOS ---
  // Buscamos si ya existe una combinación con ESE nombre y ESTE usuario
  const { data: existing } = await supabase
    .from('combinaciones')
    .select('id')
    .eq('user_id', user.id) // Importante: Que sea del mismo usuario
    .eq('titulo', payload.name) // Chequeamos el nombre exacto
    .single(); // Solo necesitamos saber si hay UNO

  // Si 'existing' no es nulo, significa que ya existe
  if (existing) {
    return { 
      success: false, 
      error: `Ya tienes una combinación llamada "${payload.name}". Por favor usa otro nombre.` 
    };
  }

  // --- PASO 2: SI NO EXISTE, GUARDAMOS ---
  const { error } = await supabase.from('combinaciones').insert({
    user_id: user.id,
    titulo: payload.name,
    numeros: payload.pairs,
    group_id: payload.groupId === 'all' ? null : Number(payload.groupId),
    notas: payload.notes
  });

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/dashboard');
  return { success: true };
}



// 3. BORRAR
export async function deleteCombinationAction(id: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { error } = await supabase.from('combinaciones').delete().eq('id', id);
  
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/dashboard');
  return { success: true };
}

// ... imports y funciones anteriores (get, create, delete) ...

// 4. ACTUALIZAR (UPDATE)
export async function updateCombination(payload: {
  id: string,
  name: string,
  pairs: number[],
  groupId?: string,
  notes?: string
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  // Opcional: Validar duplicados si cambió el nombre (similar al create)
  // Por ahora haremos el update directo para no complicar.

  const { error } = await supabase
    .from('combinaciones')
    .update({
      titulo: payload.name,
      numeros: payload.pairs,
      group_id: payload.groupId === 'all' ? null : Number(payload.groupId),
      notas: payload.notes
    })
    .eq('id', payload.id)       // Buscamos por ID
    .eq('user_id', user.id);    // Seguridad extra: que sea suya

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}