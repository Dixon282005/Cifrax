"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }); } catch (error) {}
        },
      },
    }
  );
}

// --- OBTENER GRUPOS ---
export async function getGroups() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('grupos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error al obtener grupos:", error.message);
    return [];
  }

  return data || [];
}

// --- CREAR GRUPO ---
export async function createGroup(name: string, color: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "No autorizado" };

  // Limpiamos los datos antes de enviar
  const cleanName = name.trim();
  if (!cleanName) return { success: false, error: "El nombre es obligatorio" };

  const { error } = await supabase.from('grupos').insert({
    nombre: cleanName,
    color: color,
    user_id: user.id
  });

  if (error) {
    console.error("Error al crear grupo:", error.message);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/dashboard'); 
  return { success: true };
}

// --- BORRAR GRUPO ---
export async function deleteGroup(groupId: number | string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "No autorizado" };

  // Convertimos a número por si viene como string
  const idToDelete = typeof groupId === 'string' ? parseInt(groupId, 10) : groupId;

  const { error } = await supabase
    .from('grupos')
    .delete()
    .eq('id', idToDelete)
    .eq('user_id', user.id); // Seguridad extra: que sea su propio grupo

  if (error) {
    console.error("Error al borrar grupo:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}