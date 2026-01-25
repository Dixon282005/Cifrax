import { createClient } from '@supabase/supabase-js';

// Nota: Usamos variables de entorno SIN 'NEXT_PUBLIC' para que solo funcionen en el servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Este cliente tiene permisos de SUPER ADMINISTRADOR. Úsalo con cuidado.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});