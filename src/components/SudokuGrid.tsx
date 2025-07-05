
import React from 'react';

interface SudokuGridProps {
  grid: (number | null)[][];
  initialGrid: (number | null)[][];
  selectedCell: {row: number, col: number} | null;
  onCellClick: (row: number, col: number) => void;
  isComplete: boolean;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  grid,
  initialGrid,
  selectedCell,
  onCellClick,
  isComplete
}) => {
  const getCellClassName = (row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isInitial = initialGrid[row][col] !== null;
    const isComplete = grid[row][col] !== null;
    
    let className = `
      w-8 h-8 md:w-10 md:h-10 border border-gray-300 flex items-center justify-center
      text-sm md:text-base font-semibold cursor-pointer transition-all duration-200
      hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400
    `;
    
    // Add thick borders for 3x3 sections
    if (row % 3 === 0 && row !== 0) className += ' border-t-2 border-t-gray-600';
    if (col % 3 === 0 && col !== 0) className += ' border-l-2 border-l-gray-600';
    if (row === 8) className += ' border-b-2 border-b-gray-600';
    if (col === 8) className += ' border-r-2 border-r-gray-600';
    if (row === 0) className += ' border-t-2 border-t-gray-600';
    if (col === 0) className += ' border-l-2 border-l-gray-600';
    
    if (isSelected) {
      className += ' bg-blue-100 border-blue-500 ring-2 ring-blue-400 scale-105';
    } else if (isInitial) {
      className += ' bg-gray-100 text-gray-800 font-bold';
    } else if (isComplete) {
      className += ' bg-green-50 text-green-700 animate-scale-in';
    } else {
      className += ' bg-white text-blue-600';
    }
    
    return className;
  };

  return (
    <div className="grid grid-cols-9 gap-0 border-2 border-gray-600 rounded-lg overflow-hidden bg-white shadow-lg mx-auto w-fit">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onCellClick(rowIndex, colIndex)}
            disabled={initialGrid[rowIndex][colIndex] !== null || isComplete}
            className={getCellClassName(rowIndex, colIndex)}
          >
            {cell || ''}
          </button>
        ))
      )}
    </div>
  );
};

export default SudokuGrid;
