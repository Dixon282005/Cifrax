import { Plus, FolderPlus, Shuffle } from 'lucide-react';
import { Button } from '../../../components/shared/Button';

interface ActionButtonsProps {
  onNewCombination: () => void;
  onNewGroup: () => void;
  onGenerateRandom: () => void;
}

export function ActionButtons({ onNewCombination, onNewGroup, onGenerateRandom }: ActionButtonsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
        <Button
          onClick={onNewCombination}
          variant="primary"
          icon={<Plus className="size-5" />}
        >
          Nueva Combinación
        </Button>
        <Button
          onClick={onNewGroup}
          variant="secondary"
          icon={<FolderPlus className="size-5" />}
        >
          Nuevo Grupo
        </Button>
        <Button
          onClick={onGenerateRandom}
          variant="secondary"
          className="bg-violet-500 hover:bg-violet-600"
          icon={<Shuffle className="size-5" />}
        >
          Generar Aleatoria
        </Button>
      </div>
    </div>
  );
}
