"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
// Importamos el tipo global para asegurar que devolvemos lo correcto
import { Combination } from "@/types/database";

async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );
}

// 1. OBTENER (AHORA SIN TRADUCCIÓN)
export async function getCombinations(): Promise<Combination[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('combinaciones')
    .select('*')
    .order('created_at', { ascending: false });

  if (!data) return [];

  // CAMBIO CRÍTICO: Devolvemos la data tal cual viene de la DB.
  // Ya no hacemos .map() para cambiar nombres.
  // TypeScript sabrá que esto es Combination[] (con titulo, numeros, etc.)
  return data as Combination[];
}

// 2. CREAR
export async function createCombination(payload: {
  name: string,      // El formulario manda 'name'
  pairs: number[],   // El formulario manda 'pairs'
  groupId?: string | number, // Puede venir como string del select
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
    .eq('titulo', payload.name) // Comparamos con la columna 'titulo'
    .single();

  if (existing) {
    return { 
      success: false, 
      error: `Ya tienes una combinación llamada "${payload.name}". Por favor usa otro nombre.` 
    };
  }

  // --- FIX DE LLAVE FORÁNEA ---
  const cleanGroupId = (payload.groupId === 'all' || !payload.groupId || payload.groupId === "") 
    ? null 
    : Number(payload.groupId);

  const { error } = await supabase.from('combinaciones').insert({
    user_id: user.id,
    titulo: payload.name,    // Mapeamos name -> titulo
    numeros: payload.pairs,  // Mapeamos pairs -> numeros
    group_id: cleanGroupId,
    notas: payload.notes
  });

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/dashboard');
  return { success: true };
}

// 3. BORRAR
// CAMBIO: Aceptamos string o number, pero convertimos a lo seguro
export async function deleteCombinationAction(id: string | number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('combinaciones')
    .delete()
    .eq('id', id); // Supabase maneja la conversión de string a bigint automáticamente
  
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/dashboard');
  return { success: true };
}

// 4. ACTUALIZAR
export async function updateCombination(payload: {
  id: string | number,
  name: string,
  pairs: number[],
  groupId?: string | number,
  notes?: string
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const cleanGroupId = (payload.groupId === 'all' || !payload.groupId || payload.groupId === "") 
    ? null 
    : Number(payload.groupId);

  const { error } = await supabase
    .from('combinaciones')
    .update({
      titulo: payload.name,    // Update a columna 'titulo'
      numeros: payload.pairs,  // Update a columna 'numeros'
      group_id: cleanGroupId,
      notas: payload.notes
    })
    .eq('id', payload.id)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}