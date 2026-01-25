"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper para crear cliente (mismo que en Auth)
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

  const { data } = await supabase
    .from('grupos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return data || [];
}

// --- CREAR GRUPO ---
export async function createGroup(name: string, color: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const { error } = await supabase.from('grupos').insert({
    nombre: name,
    color: color,
    user_id: user.id
  });

  if (error) return { success: false, error: error.message };
  
  // ¡Truco de Magia! Esto recarga los datos en la pantalla automáticamente
  revalidatePath('/dashboard'); 
  return { success: true };
}

// --- BORRAR GRUPO ---
export async function deleteGroup(groupId: number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('grupos')
    .delete()
    .eq('id', groupId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}