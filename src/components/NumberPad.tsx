
import React from 'react';

interface NumberPadProps {
  onNumberSelect: (number: number) => void;
  selectedCell: {row: number, col: number} | null;
  isComplete: boolean;
}

const NumberPad: React.FC<NumberPadProps> = ({ onNumberSelect, selectedCell, isComplete }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Number Pad</h3>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(number => (
          <button
            key={number}
            onClick={() => onNumberSelect(number)}
            disabled={!selectedCell || isComplete}
            className="
              w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-gray-300 rounded-lg
              font-bold text-lg text-gray-700 hover:bg-blue-50 hover:border-blue-400
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
              hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
            "
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberPad;
