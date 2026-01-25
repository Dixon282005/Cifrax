"use server";

import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- 1. ACCIÓN PRINCIPAL: LOGIN Y REGISTRO ---
export async function handleAuth(formData: FormData, mode: 'login' | 'register') {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // A. VALIDACIÓN DE INPUTS
  if (!email || !password) {
    return { success: false, error: "Todos los campos son obligatorios." };
  }

  if (password.length < 8) {
    return { success: false, error: "La contraseña debe tener al menos 8 caracteres." };
  }

  // Usamos cookies para la sesión en el servidor
  const supabase = createServerClient({ cookies });

  let authResult;

  // B. AUTENTICACIÓN
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

  if (authResult.error) {
    return { success: false, error: authResult.error.message };
  }

  const user = authResult.data.user;

  // Si es registro y requiere confirmar email, user puede venir incompleto
  if (!user) {
    return { success: true, message: "Revisa tu correo para confirmar." };
  }

  // C. LECTURA DE ROL (METADATOS)
  // Aquí está la clave: Leemos 'app_metadata' que es donde Supabase guarda permisos de sistema.
  // Por defecto, cualquier usuario nuevo tendrá esto vacío, así que asignamos 'user'.
  
  const role = user.app_metadata?.role || 'user';

  return { 
    success: true, 
    role: role, // Retorna 'admin' o 'user' según lo que tenga grabado en Supabase
    user: user 
  };
}

// --- 2. ACCIÓN DE CERRAR SESIÓN ---
export async function signOutAction() {
  const supabase = createServerActionClient({ cookies });
  
  await supabase.auth.signOut();
  
  // Redirige al login después de salir
  redirect("/login");
}