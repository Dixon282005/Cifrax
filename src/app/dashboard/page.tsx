import { redirect } from 'next/navigation';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Dashboard } from '@/features/dashboard/Dashboard';
import { getGroups } from '@/features/groups/actions/groups';
import { getCombinations } from '@/features/combinations/actions/combinations'; // <--- 1. IMPORTAR ESTO

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { get(name: string) { return cookieStore.get(name)?.value; } }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // --- CARGA DE DATOS REALES EN PARALELO ---
  // 2. Traemos grupos y combinaciones al mismo tiempo
  const [groupsData, combinationsData] = await Promise.all([
    getGroups(),
    getCombinations()
  ]);

  return (
    <Dashboard 
      userEmail={user.email || ''} 
      initialGroups={groupsData}
      initialCombinations={combinationsData} // <--- 3. PASAR LA DATA REAL
    />
  );
}