import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { GROUP_COLORS } from '@/types/database';
import { Button } from '../../../components/shared/Button';

interface GroupFormProps {
  onSave: (name: string, color: string) => void;
  onCancel: () => void;
}

export function GroupForm({ onSave, onCancel }: GroupFormProps) {
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupColor, setSelectedGroupColor] = useState(GROUP_COLORS[0]);

  const handleSubmit = () => {
    if (!newGroupName.trim()) {
      alert('Por favor ingresa un nombre para el grupo');
      return;
    }
    onSave(newGroupName, selectedGroupColor);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg sm:text-xl">Crear Nuevo Grupo</h3>
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-white"
        >
          <X className="size-5" />
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-slate-300 mb-2 text-sm sm:text-base">
          Nombre del Grupo
        </label>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
          placeholder="Ej: Trabajo, Personal, Importante..."
        />
      </div>

      <div className="mb-6">
        <label className="block text-slate-300 mb-3 text-sm sm:text-base">
          Color del Grupo
        </label>
        <div className="flex flex-wrap gap-2">
          {GROUP_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedGroupColor(color)}
              className={`size-8 sm:size-10 ${color} rounded-lg hover:scale-110 transition-transform ${
                selectedGroupColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSubmit}
          variant="primary"
          icon={<Save className="size-4" />}
        >
          Crear Grupo
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
