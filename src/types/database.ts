export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// --- MODELOS DE LA BASE DE DATOS (Lo que devuelve Supabase) ---

export interface Group {
  id: number;
  created_at: string;
  user_id: string;
  nombre: string;
  color: string;
}

export interface Combination {
  id: number;
  created_at: string;
  user_id: string;
  group_id: number | null; // Puede ser null si el grupo se borró
  titulo: string;
  numeros: number[];       // Array de enteros [1, 2, 3]
  notas: string | null;
}

// --- TIPOS PARA INSERTAR (Lo que mandas desde el formulario) ---
// Omitimos id y created_at porque la DB los crea sola.
// Omitimos user_id porque lo sacamos de la sesión en el backend.

export interface GroupInsert {
  nombre: string;
  color: string;
}

export interface CombinationInsert {
  titulo: string;
  numeros: number[];
  group_id?: number | null;
  notas?: string | null;
}

// --- DEFINICIÓN MAESTRA PARA SUPABASE ---
// Esto permite que al hacer supabase.from('grupos') sepa qué devolver.

export interface Database {
  public: {
    Tables: {
      grupos: {
        Row: Group
        Insert: GroupInsert & { user_id: string } // En el insert real sí va el user_id
        Update: Partial<GroupInsert>
      }
      combinaciones: {
        Row: Combination
        Insert: CombinationInsert & { user_id: string }
        Update: Partial<CombinationInsert>
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          role: 'admin' | 'user'
        }
        Insert: {
          id: string
          email?: string | null
          role?: 'admin' | 'user'
        }
        Update: {
          role?: 'admin' | 'user'
        }
      }
    }
  }
}