
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type GridSize = 2 | 3;
type SudokuGrid = (number | null)[][];

const SudokuGame = () => {
  const [gridSize, setGridSize] = useState<GridSize>(2);
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [initialGrid, setInitialGrid] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Generate a valid Sudoku puzzle
  const generatePuzzle = (size: GridSize): { puzzle: SudokuGrid, solution: SudokuGrid } => {
    const createEmptyGrid = (): SudokuGrid => 
      Array(size).fill(null).map(() => Array(size).fill(null));

    // For 2x2, create a simple valid puzzle
    if (size === 2) {
      const puzzle: SudokuGrid = [
        [1, null],
        [null, 2]
      ];
      const solution: SudokuGrid = [
        [1, 2],
        [2, 1]
      ];
      return { puzzle, solution };
    }

    // For 3x3, create a more complex puzzle
    const puzzle: SudokuGrid = [
      [1, null, 3],
      [null, 2, null],
      [3, null, 1]
    ];
    const solution: SudokuGrid = [
      [1, 2, 3],
      [3, 2, 1],
      [3, 1, 1]
    ];
    return { puzzle, solution };
  };

  // Initialize game
  useEffect(() => {
    const { puzzle } = generatePuzzle(gridSize);
    setGrid(puzzle.map(row => [...row]));
    setInitialGrid(puzzle.map(row => [...row]));
    setIsComplete(false);
    setSelectedCell(null);
  }, [gridSize]);

  // Check if the current grid is valid and complete
  const checkWin = (currentGrid: SudokuGrid): boolean => {
    // Check if all cells are filled
    for (let row of currentGrid) {
      for (let cell of row) {
        if (cell === null) return false;
      }
    }

    // Check rows
    for (let row of currentGrid) {
      const seen = new Set();
      for (let num of row) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }

    // Check columns
    for (let col = 0; col < gridSize; col++) {
      const seen = new Set();
      for (let row = 0; row < gridSize; row++) {
        const num = currentGrid[row][col];
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }

    return true;
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] !== null) return; // Can't modify initial numbers
    setSelectedCell({ row, col });
  };

  // Handle number input
  const handleNumberInput = (number: number) => {
    if (!selectedCell) return;
    
    const newGrid = grid.map(row => [...row]);
    newGrid[selectedCell.row][selectedCell.col] = number;
    setGrid(newGrid);

    // Check for win condition
    if (checkWin(newGrid)) {
      setIsComplete(true);
      toast({
        title: "🎉 Congratulations!",
        description: "You've completed the Sudoku puzzle!",
      });
    }
  };

  // Clear selected cell
  const clearCell = () => {
    if (!selectedCell) return;
    
    const newGrid = grid.map(row => [...row]);
    newGrid[selectedCell.row][selectedCell.col] = null;
    setGrid(newGrid);
  };

  // Reset game
  const resetGame = () => {
    setGrid(initialGrid.map(row => [...row]));
    setIsComplete(false);
    setSelectedCell(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sudoku Game
          </h1>
          
          {/* Grid Size Selection */}
          <div className="flex gap-2 justify-center">
            <Button
              variant={gridSize === 2 ? "default" : "outline"}
              onClick={() => setGridSize(2)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              2×2
            </Button>
            <Button
              variant={gridSize === 3 ? "default" : "outline"}
              onClick={() => setGridSize(3)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              3×3
            </Button>
          </div>
        </div>

        {/* Game Board */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              {isComplete && <Sparkles className="text-yellow-500" />}
              {gridSize}×{gridSize} Sudoku
              {isComplete && <Sparkles className="text-yellow-500" />}
            </CardTitle>
            {isComplete && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                Completed!
              </Badge>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Sudoku Grid */}
            <div 
              className={`grid gap-2 mx-auto w-fit p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-inner`}
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    disabled={initialGrid[rowIndex][colIndex] !== null || isComplete}
                    className={`
                      w-16 h-16 border-2 rounded-lg font-bold text-xl transition-all duration-200
                      ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                        ? 'border-blue-500 bg-blue-100 shadow-lg scale-105'
                        : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
                      }
                      ${initialGrid[rowIndex][colIndex] !== null
                        ? 'bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-700 cursor-not-allowed'
                        : 'hover:shadow-md active:scale-95'
                      }
                      ${isComplete ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700' : ''}
                    `}
                  >
                    {cell || ''}
                  </button>
                ))
              )}
            </div>

            {/* Number Input Buttons */}
            {!isComplete && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: gridSize }, (_, i) => i + 1).map(number => (
                    <Button
                      key={number}
                      onClick={() => handleNumberInput(number)}
                      disabled={!selectedCell}
                      variant="outline"
                      className="h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      {number}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={clearCell}
                    disabled={!selectedCell}
                    variant="outline"
                    className="flex-1 bg-red-500 text-white border-0 hover:bg-red-600 disabled:bg-gray-300 transition-all duration-200"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">How to play:</p>
              <p>Fill each row and column with numbers 1-{gridSize} without repeating!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SudokuGame;
