"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Database, CreditCard, Activity } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { fetchAdminData } from "@/features/admin/actions/admin_actions";
import { AdminStats } from "@/features/admin/services/localDataService";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAdminData();
      setStats(data);
    };
    load();
  }, []);

  if (!stats) return <div className="text-white">Cargando datos...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-slate-400">Datos en tiempo real del sistema (Supabase Cloud).</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Usuarios Activos", val: stats.totalUsers, sub: "Con combinaciones", icon: Users },
          { title: "Combinaciones", val: stats.totalCombinations, sub: "Total global", icon: Database },
          { title: "Promedio", val: stats.totalUsers > 0 ? (stats.totalCombinations / stats.totalUsers).toFixed(1) : 0, sub: "Combinaciones por usuario", icon: CreditCard },
          { title: "Estado Sistema", val: "Online", sub: "Supabase Conectado", icon: Activity },
        ].map((item, i) => (
          <Card key={i} className="bg-card border-slate-800/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{item.val}</div>
              <p className="text-xs text-slate-500">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card border-slate-800/60">
          <CardHeader>
            <CardTitle className="text-white">Actividad Semanal</CardTitle>
            <CardDescription className="text-slate-400">Creación de combinaciones por día</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stats.chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="total" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-card border-slate-800/60">
          <CardHeader>
            <CardTitle className="text-white">Usuarios Top</CardTitle>
            <CardDescription className="text-slate-400">Mayor actividad reciente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats.userList.length === 0 ? (
                <p className="text-sm text-slate-500">No hay datos suficientes.</p>
              ) : (
                stats.recentActivity.map((user, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                       <span className="text-xs font-medium text-cyan-500">
                         {user.email.substring(0, 2).toUpperCase()}
                       </span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-200">{user.email}</p>
                      <p className="text-xs text-slate-500">
                        {user.combinationsCount} combinaciones
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}