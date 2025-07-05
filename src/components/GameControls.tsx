
import React from 'react';
import { RotateCcw, Eraser, Lightbulb, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onUndo: () => void;
  onErase: () => void;
  onHint: () => void;
  onRestart: () => void;
  selectedCell: {row: number, col: number} | null;
  isComplete: boolean;
  canUndo: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onUndo,
  onErase,
  onHint,
  onRestart,
  selectedCell,
  isComplete,
  canUndo
}) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        <Button
          onClick={onUndo}
          disabled={!canUndo || isComplete}
          variant="outline"
          className="flex items-center gap-2 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
        >
          <Undo className="w-4 h-4" />
          Undo
        </Button>
        
        <Button
          onClick={onErase}
          disabled={!selectedCell || isComplete}
          variant="outline"
          className="flex items-center gap-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        >
          <Eraser className="w-4 h-4" />
          Erase
        </Button>
        
        <Button
          onClick={onHint}
          disabled={!selectedCell || isComplete}
          variant="outline"
          className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        >
          <Lightbulb className="w-4 h-4" />
          Hint
        </Button>
        
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex items-center gap-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
        >
          <RotateCcw className="w-4 h-4" />
          Restart
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
