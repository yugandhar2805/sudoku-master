
import React from 'react';
import { Clock, Star } from 'lucide-react';

interface TopBarProps {
  time: string;
  difficulty: string;
}

const TopBar: React.FC<TopBarProps> = ({ time, difficulty }) => {
  return (
    <div className="flex justify-between items-center mb-6 px-2">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        Sudoku Master
      </h1>
      
      <div className="flex items-center gap-4 text-sm md:text-base">
        <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="font-mono text-blue-700">{time}</span>
        </div>
        
        <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-lg">
          <Star className="w-4 h-4 text-purple-600" />
          <span className="text-purple-700 font-medium">{difficulty}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
