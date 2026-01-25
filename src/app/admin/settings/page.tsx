"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Database, LogOut, Server, Activity, Lock } from "lucide-react";
import { toast } from "sonner";
import { getSystemHealth } from "@/features/admin/actions/admin_actions";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");
  const [health, setHealth] = useState<{isConnected: boolean, latency: number} | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  useEffect(() => {
    // 1. Recuperar email del admin
    const email = localStorage.getItem('cifrax_user') || "Admin";
    setAdminEmail(email);
    // 2. Probar conexión
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setLoadingHealth(true);
    try {
      const status = await getSystemHealth();
      setHealth(status);
      if (status.isConnected) toast.success("Sistema conectado a Supabase");
    } catch (e) {
      toast.error("Error conectando al servidor");
    } finally {
      setLoadingHealth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cifrax_user');
    localStorage.removeItem('cifrax_role');
    toast.info("Sesión cerrada");
    router.push('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Configuración</h2>
        <p className="text-slate-400">Estado del sistema en la nube.</p>
      </div>

      {/* CREDENCIALES */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-500" />
            <CardTitle className="text-white">Credencial Activa</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={adminEmail} disabled className="bg-slate-950/50 border-slate-700 text-slate-400" />
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">Super Admin</Badge>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex gap-3">
            <Lock className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-200/80">
              La contraseña se gestiona vía variables de entorno (<code>.env</code>).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ESTADO BASE DE DATOS */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-white">Conexión Supabase</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-white font-medium">Base de Datos PostgreSQL</p>
                <p className="text-xs text-slate-500">Nube</p>
              </div>
            </div>
            
            <div className="text-right">
              {health ? (
                <>
                  <div className={`text-sm font-medium ${health.isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                    {health.isConnected ? '● Operativo' : '● Error'}
                  </div>
                  <p className="text-xs text-slate-500">{health.latency}ms latencia</p>
                </>
              ) : (
                <Badge variant="secondary">Verificando...</Badge>
              )}
            </div>
          </div>

          <Button variant="outline" onClick={checkConnection} disabled={loadingHealth} className="w-full border-slate-700 hover:bg-slate-800 text-slate-300">
            <Activity className={`mr-2 h-4 w-4 ${loadingHealth ? 'animate-spin' : ''}`} />
            {loadingHealth ? 'Comprobando...' : 'Probar Conexión'}
          </Button>
        </CardContent>
      </Card>

      <Separator className="bg-slate-800" />

      <div className="flex justify-end pt-4">
        <Button variant="destructive" onClick={handleLogout} className="bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}