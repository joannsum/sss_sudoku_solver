import React from 'react';
import { RefreshCw, Play } from 'lucide-react';

interface ControlPanelProps {
  solving: boolean;
  visualizeSteps: boolean;
  setVisualizeSteps: (value: boolean) => void;
  handleSolve: () => void;
  handleReset: () => void;
  loadExample: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  solving,
  visualizeSteps,
  setVisualizeSteps,
  handleSolve,
  handleReset,
  loadExample
}) => {
  return (
    <>
      {/* Main controls */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button 
          onClick={handleSolve}
          disabled={solving}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {solving ? <RefreshCw className="animate-spin h-4 w-4" /> : <Play className="h-4 w-4" />}
          {solving ? 'Solving...' : 'Solve'}
        </button>
        
        <button 
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset
        </button>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md">
          <input
            type="checkbox"
            id="visualize"
            checked={visualizeSteps}
            onChange={(e) => setVisualizeSteps(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="visualize" className="text-sm text-gray-700">Visualize Steps</label>
        </div>
      </div>
      
      {/* Example loaders */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <span className="text-sm text-gray-600 mr-2 flex items-center">Load Example:</span>
        <button 
          onClick={() => loadExample('easy')}
          className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
        >
          Easy
        </button>
        <button 
          onClick={() => loadExample('medium')}
          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
        >
          Medium
        </button>
        <button 
          onClick={() => loadExample('hard')}
          className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
        >
          Hard
        </button>
      </div>
    </>
  );
};

export default ControlPanel;