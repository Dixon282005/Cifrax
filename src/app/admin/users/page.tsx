"use client";

import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Search, 
  UserX, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";
import { getLocalAdminData, deleteLocalUser } from "@/features/admin/services/localDataService";
import { toast } from "sonner";

// Interfaz actualizada
interface UserData {
  email: string;
  combinationsCount: number;
  lastActive: string | null;
  firstActive: string | null; // Fecha de creación simulada
}

// Tipos para el ordenamiento
type SortKey = 'email' | 'combinationsCount' | 'firstActive';
type SortOrder = 'asc' | 'desc';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Estados para el ordenamiento
  const [sortKey, setSortKey] = useState<SortKey>('firstActive');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const loadUsers = () => {
    const data = getLocalAdminData();
    setUsers(data.userList as UserData[]);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Función para manejar el clic en los encabezados
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Si ya está ordenado por esta columna, invertimos el orden
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es una columna nueva, ordenamos ascendente por defecto
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Lógica combinada: Filtrar Y Ordenar
  const processedUsers = users
    .filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'combinationsCount':
          comparison = a.combinationsCount - b.combinationsCount;
          break;
        case 'firstActive':
          // Manejo seguro de fechas nulas
          const dateA = a.firstActive ? new Date(a.firstActive).getTime() : 0;
          const dateB = b.firstActive ? new Date(b.firstActive).getTime() : 0;
          comparison = dateA - dateB;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      const success = deleteLocalUser(userToDelete);
      if (success) {
        toast.success(`Usuario eliminado correctamente`);
        loadUsers();
      } else {
        toast.error("Error al eliminar");
      }
      setUserToDelete(null);
    }
  };

  // Componente auxiliar para el icono de ordenamiento
  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-2 h-4 w-4 text-slate-600" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4 text-cyan-500" />
      : <ArrowDown className="ml-2 h-4 w-4 text-cyan-500" />;
  };

  // Función auxiliar para formatear fechas
  const formatDate = (isoString: string | null) => {
    if (!isoString) return "Sin actividad";
    return new Date(isoString).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Gestión de Usuarios</h2>
          <p className="text-slate-400">
            {users.length} usuarios registrados. Ordenado por: 
            <span className="text-cyan-400 ml-1 font-medium">
              {sortKey === 'email' ? 'Nombre' : sortKey === 'combinationsCount' ? 'Cantidad' : 'Fecha Creación'}
            </span>
          </p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar usuario..."
            className="pl-8 bg-slate-900/50 border-slate-800 text-slate-200 focus-visible:ring-cyan-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/50">
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('email')}
                  className="hover:text-cyan-400 hover:bg-transparent pl-0 font-bold text-slate-300"
                >
                  Usuario <SortIcon column="email" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('combinationsCount')}
                  className="hover:text-cyan-400 hover:bg-transparent font-bold text-slate-300"
                >
                  Combinaciones <SortIcon column="combinationsCount" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('firstActive')}
                  className="hover:text-cyan-400 hover:bg-transparent font-bold text-slate-300"
                >
                  Fecha Creación <SortIcon column="firstActive" />
                </Button>
              </TableHead>
              <TableHead className="text-right text-slate-400">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            ) : (
              processedUsers.map((user) => (
                <TableRow key={user.email} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <TableCell className="font-medium text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-cyan-500 text-xs font-bold">
                        {user.email.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span>{user.email}</span>
                        {/* Mostramos también la última vez que entró como dato extra */}
                        <span className="text-xs text-slate-500">Última vez: {formatDate(user.lastActive)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      user.combinationsCount > 0 
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {user.combinationsCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {formatDate(user.firstActive)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => setUserToDelete(user.email)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acción no se puede deshacer. Se borrarán todos los datos asociados a este usuario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white border-slate-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}