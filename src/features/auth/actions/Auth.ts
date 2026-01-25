"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- FUNCIÓN HELPER INTERNA ---
// CORRECCIÓN: Ahora es 'async' para poder esperar a las cookies
const createClient = async () => {
  // 1. AWAIT AQUÍ: Esperamos a que Next.js nos dé las cookies
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignoramos el error si se llama desde un Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {}
        },
      },
    }
  );
};

// --- ACCIÓN PRINCIPAL ---
export async function handleAuth(formData: FormData, mode: 'login' | 'register') {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) return { success: false, error: "Campos obligatorios" };
  if (password.length < 8) return { success: false, error: "Mínimo 8 caracteres" };

  // 2. AWAIT AQUÍ TAMBIÉN: Como createClient ahora es async, debemos esperarla
  const supabase = await createClient();

  let authResult;

  if (mode === 'login') {
    authResult = await supabase.auth.signInWithPassword({ email, password });
  } else {
    authResult = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      }
    });
  }

  if (authResult.error) return { success: false, error: authResult.error.message };

  const user = authResult.data.user;
  if (!user) return { success: true, message: "Verifica tu correo" };

  const role = user.app_metadata?.role || 'user';

  return { success: true, role, user };
}

// --- ACCIÓN DE SALIR ---
export async function signOutAction() {
  // 3. AWAIT AQUÍ TAMBIÉN
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}