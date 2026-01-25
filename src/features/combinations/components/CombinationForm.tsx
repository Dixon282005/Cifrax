import { useState } from 'react';
import { Save, X, Shuffle } from 'lucide-react';
// CORRECCIÓN 1: Usamos el tipo global para que reconozca 'nombre'
import { Group } from '@/types/database';
import { Button } from '../../../components/shared/Button';

interface CombinationFormProps {
  groups: Group[];
  onSave: (name: string, pairs: [number, number, number], group: string, notes: string) => void;
  onCancel: () => void;
  initialPairs?: [number, number, number];
}

export function CombinationForm({ groups, onSave, onCancel, initialPairs }: CombinationFormProps) {
  const [newName, setNewName] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newGroup, setNewGroup] = useState('');
  
  // Usamos strings internamente para permitir borrar el campo sin que se ponga un 0 automático molesto
  const [pairInputs, setPairInputs] = useState<[string, string, string]>(
    initialPairs ? [String(initialPairs[0]), String(initialPairs[1]), String(initialPairs[2])] : ['0', '0', '0']
  );

  const updatePair = (index: number, value: string) => {
    // Permitir solo números y vacío
    if (!/^\d*$/.test(value)) return;
    
    // Limitar a 2 caracteres
    if (value.length > 2) return;

    const newInputs = [...pairInputs] as [string, string, string];
    newInputs[index] = value;
    setPairInputs(newInputs);
  };

  const generateRandomCombination = () => {
    const randomPairs: [string, string, string] = [
      Math.floor(Math.random() * 100).toString(),
      Math.floor(Math.random() * 100).toString(),
      Math.floor(Math.random() * 100).toString()
    ];
    setPairInputs(randomPairs);
  };

  const handleSubmit = () => {
    if (!newName.trim()) {
      alert('Por favor ingresa un nombre para la combinación');
      return;
    }

    // Convertimos los strings a números al guardar
    const finalPairs: [number, number, number] = [
      parseInt(pairInputs[0]) || 0,
      parseInt(pairInputs[1]) || 0,
      parseInt(pairInputs[2]) || 0
    ];

    onSave(newName, finalPairs, newGroup, newNotes);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg sm:text-xl">Agregar Nueva Combinación</h3>
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-white"
        >
          <X className="size-5" />
        </button>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-slate-300 mb-2 text-sm sm:text-base">
            Nombre de la Combinación *
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
            placeholder="Ej: Caja Fuerte Principal"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2 text-sm sm:text-base">
            Grupo (Opcional)
          </label>
          <select
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base appearance-none"
          >
            <option value="">Sin grupo</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {/* CORRECCIÓN CRÍTICA: Cambiado .name por .nombre */}
                {group.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-slate-300 mb-2 text-sm sm:text-base">
          Notas (Opcional)
        </label>
        <textarea
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none text-sm sm:text-base"
          placeholder="Añade notas o información adicional..."
          rows={2}
        />
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <label className="block text-slate-300 text-sm sm:text-base">
            3 Números (00-99)
          </label>
          <button
            onClick={generateRandomCombination}
            className="flex items-center gap-2 px-3 py-1 bg-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-colors text-sm"
          >
            <Shuffle className="size-4" />
            Generar Aleatoria
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <label className="block text-slate-400 text-xs sm:text-sm mb-2">
                Número {index + 1}
              </label>
              <input
                type="text" 
                inputMode="numeric"
                value={pairInputs[index]}
                onChange={(e) => updatePair(index, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-white text-center focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base font-mono text-lg"
                placeholder="00"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSubmit}
          variant="primary"
          icon={<Save className="size-4" />}
        >
          Guardar Combinación
        </Button>
        <Button
          onClick={onCancel}
          variant="ghost"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}