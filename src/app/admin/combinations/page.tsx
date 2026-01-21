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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Search, 
  ShieldAlert, 
  EyeOff, 
  FileText 
} from "lucide-react";
import { 
  getAllGlobalCombinations, 
  deleteCombinationAsAdmin, 
  AdminCombination 
} from "@/features/admin/services/localDataService";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AdminCombinationsPage() {
  const [data, setData] = useState<AdminCombination[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetToDelete, setTargetToDelete] = useState<{email: string, id: string} | null>(null);

  const loadData = () => {
    const combinations = getAllGlobalCombinations();
    setData(combinations);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = () => {
    if (targetToDelete) {
      const success = deleteCombinationAsAdmin(targetToDelete.email, targetToDelete.id);
      if (success) {
        toast.success("Combinación eliminada por administración");
        loadData();
      } else {
        toast.error("No se pudo eliminar");
      }
      setTargetToDelete(null);
    }
  };

  const filteredData = data.filter(item => 
    item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.group && item.group.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Auditoría de Combinaciones</h2>
          <p className="text-slate-400 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-cyan-500" />
            Modo Privacidad Activo: Los valores numéricos están ocultos.
          </p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar por usuario, nombre o grupo..."
            className="pl-8 bg-slate-900/50 border-slate-800 text-slate-200 focus-visible:ring-cyan-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-900/50">
              <TableHead className="text-slate-400">Usuario</TableHead>
              <TableHead className="text-slate-400">Nombre / Grupo</TableHead>
              <TableHead className="text-center text-slate-400">Valores</TableHead>
              <TableHead className="text-slate-400">Fecha</TableHead>
              <TableHead className="text-right text-slate-400">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  No hay registros de combinaciones.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id + item.userEmail} className="border-slate-800 hover:bg-slate-800/30">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-medium">{item.userEmail}</span>
                      <span className="text-xs text-slate-500 truncate max-w-[150px]">ID: {item.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-300">{item.name}</span>
                      {item.group && (
                        <Badge variant="outline" className="w-fit text-xs border-slate-700 text-cyan-400 bg-cyan-950/20">
                          {item.group}
                        </Badge>
                      )}
                      {item.notes && (
                         <TooltipProvider>
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <div className="flex items-center gap-1 text-xs text-slate-500 cursor-help">
                                 <FileText className="h-3 w-3" />
                                 Ver nota
                               </div>
                             </TooltipTrigger>
                             <TooltipContent className="bg-slate-900 border-slate-700 text-slate-300">
                               <p>{item.notes}</p>
                             </TooltipContent>
                           </Tooltip>
                         </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* AQUÍ ESTÁ LA MAGIA DE LA PRIVACIDAD */}
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-500 font-mono text-sm">
                      <EyeOff className="h-3 w-3" />
                      <span>** - ** - **</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-400 text-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-xs text-slate-600">
                        {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => setTargetToDelete({email: item.userEmail, id: item.id})}
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

      <AlertDialog open={!!targetToDelete} onOpenChange={() => setTargetToDelete(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Eliminar Combinación</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              ¿Estás seguro de eliminar este registro del usuario <span className="text-cyan-400">{targetToDelete?.email}</span>?
              <br/><br/>
              Esta acción es útil para moderar contenido inapropiado en nombres o notas, pero es irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white border-slate-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}