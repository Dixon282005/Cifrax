import { useState } from 'react';
import { Save, X, Shuffle } from 'lucide-react';
import { Group } from '../../groups/types';
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
  const [newPairs, setNewPairs] = useState<[number, number, number]>(
    initialPairs || [0, 0, 0]
  );

  const updatePair = (valueIndex: number, value: string) => {
    const num = parseInt(value) || 0;
    const clampedNum = Math.max(0, Math.min(99, num));
    const newPairsCopy = [...newPairs] as [number, number, number];
    newPairsCopy[valueIndex] = clampedNum;
    setNewPairs(newPairsCopy);
  };

  const generateRandomCombination = () => {
    const randomPairs: [number, number, number] = [
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100)
    ];
    setNewPairs(randomPairs);
  };

  const handleSubmit = () => {
    if (!newName.trim()) {
      alert('Por favor ingresa un nombre para la combinación');
      return;
    }
    onSave(newName, newPairs, newGroup, newNotes);
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
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
          >
            <option value="">Sin grupo</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
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
          {[0, 1, 2].map((valueIndex) => (
            <div key={valueIndex}>
              <label className="block text-slate-400 text-xs sm:text-sm mb-2">
                Número {valueIndex + 1}
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={newPairs[valueIndex]}
                onChange={(e) => updatePair(valueIndex, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-white text-center focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
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
