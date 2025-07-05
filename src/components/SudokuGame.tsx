
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import TopBar from './TopBar';
import SudokuGrid from './SudokuGrid';
import NumberPad from './NumberPad';
import GameControls from './GameControls';

type SudokuGrid = (number | null)[][];

interface GameMove {
  row: number;
  col: number;
  previousValue: number | null;
  newValue: number | null;
}

const SudokuGame = () => {
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [initialGrid, setInitialGrid] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [moves, setMoves] = useState<GameMove[]>([]);
  const [difficulty] = useState('Medium');

  // Generate a sample Sudoku puzzle
  const generatePuzzle = (): { puzzle: SudokuGrid, solution: SudokuGrid } => {
    // This is a simplified puzzle generator - in a real app, you'd want a proper algorithm
    const puzzle: SudokuGrid = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9]
    ];

    const solution: SudokuGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    return { puzzle, solution };
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isComplete]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize game
  useEffect(() => {
    const { puzzle } = generatePuzzle();
    setGrid(puzzle.map(row => [...row]));
    setInitialGrid(puzzle.map(row => [...row]));
    setIsComplete(false);
    setSelectedCell(null);
    setMoves([]);
    setTime(0);
    setIsActive(true);
  }, []);

  // Validation functions
  const isValidMove = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if ((i !== row || j !== col) && grid[i][j] === num) return false;
      }
    }

    return true;
  };

  // Check if puzzle is complete
  const checkWin = (currentGrid: SudokuGrid): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentGrid[row][col] === null) return false;
      }
    }
    return true;
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] !== null || isComplete) return;
    setSelectedCell({ row, col });
  };

  // Handle number input
  const handleNumberInput = (number: number) => {
    if (!selectedCell || isComplete) return;
    
    const { row, col } = selectedCell;
    
    if (!isValidMove(grid, row, col, number)) {
      toast({
        title: "Invalid Move",
        description: "This number conflicts with existing numbers in the row, column, or box.",
        variant: "destructive",
      });
      return;
    }

    const newGrid = grid.map(row => [...row]);
    const previousValue = newGrid[row][col];
    newGrid[row][col] = number;
    
    // Add move to history
    setMoves(prev => [...prev, { row, col, previousValue, newValue: number }]);
    
    setGrid(newGrid);

    // Check for win
    if (checkWin(newGrid)) {
      setIsComplete(true);
      setIsActive(false);
      toast({
        title: "🎉 Congratulations!",
        description: `You've completed the Sudoku puzzle in ${formatTime(time)}!`,
      });
    }
  };

  // Handle undo
  const handleUndo = () => {
    if (moves.length === 0) return;
    
    const lastMove = moves[moves.length - 1];
    const newGrid = grid.map(row => [...row]);
    newGrid[lastMove.row][lastMove.col] = lastMove.previousValue;
    
    setGrid(newGrid);
    setMoves(prev => prev.slice(0, -1));
    setIsComplete(false);
    if (!isActive) setIsActive(true);
  };

  // Handle erase
  const handleErase = () => {
    if (!selectedCell || isComplete) return;
    
    const { row, col } = selectedCell;
    const newGrid = grid.map(row => [...row]);
    const previousValue = newGrid[row][col];
    newGrid[row][col] = null;
    
    // Add move to history
    setMoves(prev => [...prev, { row, col, previousValue, newValue: null }]);
    
    setGrid(newGrid);
  };

  // Handle hint (simplified)
  const handleHint = () => {
    if (!selectedCell || isComplete) return;
    
    toast({
      title: "Hint",
      description: "Try checking if this number appears elsewhere in the same row, column, or 3x3 box!",
    });
  };

  // Handle restart
  const handleRestart = () => {
    const { puzzle } = generatePuzzle();
    setGrid(puzzle.map(row => [...row]));
    setInitialGrid(puzzle.map(row => [...row]));
    setIsComplete(false);
    setSelectedCell(null);
    setMoves([]);
    setTime(0);
    setIsActive(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <TopBar time={formatTime(time)} difficulty={difficulty} />
        
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            {isComplete && (
              <div className="text-center mb-4">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-4 py-2">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Puzzle Complete!
                  <Sparkles className="w-5 h-5 ml-2" />
                </Badge>
              </div>
            )}
            
            <div className="flex flex-col items-center space-y-6">
              <SudokuGrid
                grid={grid}
                initialGrid={initialGrid}
                selectedCell={selectedCell}
                onCellClick={handleCellClick}
                isComplete={isComplete}
              />
              
              <NumberPad
                onNumberSelect={handleNumberInput}
                selectedCell={selectedCell}
                isComplete={isComplete}
              />
              
              <GameControls
                onUndo={handleUndo}
                onErase={handleErase}
                onHint={handleHint}
                onRestart={handleRestart}
                selectedCell={selectedCell}
                isComplete={isComplete}
                canUndo={moves.length > 0}
              />
            </div>
            
            <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-6">
              <p className="font-medium mb-1">How to play:</p>
              <p>Fill the 9×9 grid so each row, column, and 3×3 box contains digits 1-9 without repetition!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SudokuGame;
