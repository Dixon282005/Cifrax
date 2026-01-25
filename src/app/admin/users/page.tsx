"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, UserCheck } from "lucide-react";
import { fetchAdminData } from "@/features/admin/actions/admin_actions"; 
import { UserData } from "@/features/admin/services/localDataService"; 

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminData();
        setUsers(data.userList);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Gestión de Usuarios</h2>
          <p className="text-slate-400">
            Usuarios registrados en Supabase Auth ({users.length})
          </p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar por correo..."
            className="pl-8 bg-slate-900/50 border-slate-800 text-slate-200 focus-visible:ring-cyan-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-card border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white text-lg">Directorio de Usuarios</CardTitle>
          <CardDescription className="text-slate-400">
            Lista completa de cuentas con acceso a la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-900/50">
                <TableHead className="text-slate-400">Usuario</TableHead>
                <TableHead className="text-slate-400">Estado</TableHead>
                <TableHead className="text-slate-400">Combinaciones</TableHead>
                <TableHead className="text-slate-400">Fecha Registro</TableHead>
                <TableHead className="text-slate-400 text-right">Última Actividad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    Cargando usuarios desde la nube...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow key={index} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-700">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-slate-800 text-cyan-500 text-xs font-bold">
                            {user.email.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-slate-200 font-medium text-sm">{user.email}</span>
                          <span className="text-xs text-slate-500">Rol: Usuario Estándar</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 flex w-fit items-center gap-1">
                        <UserCheck className="h-3 w-3" />
                        Activo
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-slate-300 font-mono text-sm pl-4">
                        {user.combinationsCount}
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-400 text-sm">
                      {/* --- AQUÍ ESTÁ LA CORRECCIÓN --- */}
                      {user.firstActive 
                        ? new Date(user.firstActive).toLocaleDateString() 
                        : "Desconocido"}
                    </TableCell>

                    <TableCell className="text-right text-slate-400 text-sm">
                      {user.lastActive 
                        ? new Date(user.lastActive).toLocaleDateString() 
                        : <span className="text-slate-600 italic">Sin actividad</span>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}