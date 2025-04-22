import React from 'react';
import { Award } from 'lucide-react';

interface StatsDisplayProps {
  stats: {
    backtrackCount: number;
    timeElapsed: number;
    difficultyScore: number;
  };
  solutionPath: any[];
  currentPathIndex: number;
  difficultyText: string;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  solutionPath,
  currentPathIndex,
  difficultyText
}) => {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 max-w-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <Award className="h-5 w-5 text-amber-500" />
        Solution Statistics
      </h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-600">Time to solve:</div>
        <div className="font-medium text-gray-800">{stats.timeElapsed}s</div>
        
        <div className="text-gray-600">Backtracking steps:</div>
        <div className="font-medium text-gray-800">{stats.backtrackCount}</div>
        
        <div className="text-gray-600">Solution path length:</div>
        <div className="font-medium text-gray-800">{solutionPath.length}</div>
        
        <div className="text-gray-600">Current step:</div>
        <div className="font-medium text-gray-800">{currentPathIndex} / {solutionPath.length}</div>
        
        <div className="text-gray-600">Difficulty score:</div>
        <div className="font-medium text-gray-800">{stats.difficultyScore}</div>
        
        <div className="text-gray-600">Difficulty level:</div>
        <div className="font-medium text-gray-800">
          <span 
            className={`px-2 py-0.5 rounded ${
              difficultyText === 'Easy' ? 'bg-green-100 text-green-800' :
              difficultyText === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              difficultyText === 'Hard' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}
          >
            {difficultyText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;