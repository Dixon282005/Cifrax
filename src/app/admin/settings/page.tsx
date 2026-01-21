"use client";

import { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Save, 
  AlertTriangle 
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- FUNCIÓN 1: EXPORTAR (BACKUP) ---
  const handleExportData = () => {
    setIsLoading(true);
    try {
      // 1. Recolectamos todo lo que empiece por "cifrax_"
      const dataToExport: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cifrax_')) {
          const value = localStorage.getItem(key);
          if (value) {
            dataToExport[key] = JSON.parse(value);
          }
        }
      }

      // 2. Creamos un archivo JSON virtual
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `cifrax_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode); // Requerido para firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      toast.success("Copia de seguridad descargada correctamente");
    } catch (error) {
      toast.error("Error al exportar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Validamos que parezca un backup nuestro
        const keys = Object.keys(json);
        const hasCifraxData = keys.some(k => k.startsWith('cifrax_'));

        if (!hasCifraxData) {
          toast.error("El archivo no parece ser un backup válido de Cifrax");
          return;
        }

        keys.forEach(key => {
          localStorage.setItem(key, JSON.stringify(json[key]));
        });

        toast.success("Datos restaurados. La página se recargará...");
        setTimeout(() => window.location.reload(), 1500);

      } catch (error) {
        toast.error("Error al leer el archivo JSON");
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cifrax_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(k => localStorage.removeItem(k));
    
    setShowResetDialog(false);
    toast.success("Sistema restablecido de fábrica");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Configuración del Sistema</h2>
        <p className="text-slate-400">Gestiona los datos y el mantenimiento de la plataforma.</p>
      </div>

      {/* SECCIÓN 1: DATOS */}
      <Card className="bg-card border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Save className="h-5 w-5 text-cyan-500" />
            Gestión de Datos
          </CardTitle>
          <CardDescription className="text-slate-400">
            Exporta una copia de seguridad o restaura datos desde otro dispositivo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Exportar */}
            <div className="flex-1 space-y-2">
              <Label className="text-slate-200">Exportar Base de Datos</Label>
              <p className="text-xs text-slate-500 mb-2">Descarga un archivo JSON con todos los usuarios y combinaciones.</p>
              <Button 
                variant="outline" 
                className="w-full border-slate-700 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                onClick={handleExportData}
                disabled={isLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                {isLoading ? "Procesando..." : "Descargar Backup"}
              </Button>
            </div>

            <Separator orientation="vertical" className="hidden sm:block h-auto bg-slate-800" />

            {/* Importar */}
            <div className="flex-1 space-y-2">
              <Label className="text-slate-200">Restaurar Datos</Label>
              <p className="text-xs text-slate-500 mb-2">Sube un archivo JSON previamente exportado para recuperar datos.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json" 
                onChange={handleFileChange}
              />
              <Button 
                variant="outline" 
                className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={handleImportClick}
              >
                <Upload className="mr-2 h-4 w-4" />
                Subir Archivo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 2: ZONA DE PELIGRO */}
      <Card className="bg-red-950/10 border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Zona de Peligro
          </CardTitle>
          <CardDescription className="text-red-400/60">
            Acciones irreversibles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-900/30 rounded-lg bg-red-950/20">
            <div className="space-y-1">
              <p className="font-medium text-red-400">Restablecimiento de Fábrica</p>
              <p className="text-sm text-red-400/70">Elimina todos los usuarios, grupos y combinaciones de este navegador.</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => setShowResetDialog(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Borrar Todo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DIÁLOGO DE CONFIRMACIÓN */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-red-500" />
              ¿Estás absolutamente seguro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acción eliminará <strong className="text-red-400">permanentemente</strong> todos los datos almacenados localmente de Cifrax. 
              Tendrás que registrar usuarios nuevos desde cero.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={handleFactoryReset}
            >
              Sí, reiniciar sistema
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}