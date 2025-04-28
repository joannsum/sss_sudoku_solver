import React from 'react';

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
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSolve}
          disabled={solving}
          className="cyber-button"
          aria-label="Solve Puzzle"
        >
          {solving ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-transparent border-t-neon-blue rounded-full animate-spin"></div>
              EXECUTING...
            </span>
          ) : (
            "RUN_SOLVER.EXE"
          )}
        </button>
        
        <button
          onClick={handleReset}
          disabled={solving}
          className="cyber-button pink"
          aria-label="Reset Grid"
        >
          CLEAR_GRID
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-neon-blue flex items-center gap-2">
          <span>VISUALIZE_PROCESS:</span>
          <label className="cyber-toggle">
            <input
              type="checkbox"
              checked={visualizeSteps}
              onChange={(e) => setVisualizeSteps(e.target.checked)}
              disabled={solving}
            />
            <span className="cyber-toggle-slider"></span>
          </label>
        </label>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => loadExample('easy')}
          disabled={solving}
          className="cyber-button yellow"
          aria-label="Load Easy Example"
        >
          LOAD_EASY
        </button>
        <button
          onClick={() => loadExample('medium')}
          disabled={solving}
          className="cyber-button purple"
          aria-label="Load Medium Example"
        >
          LOAD_MEDIUM
        </button>
        <button
          onClick={() => loadExample('hard')}
          disabled={solving}
          className="cyber-button pink"
          aria-label="Load Hard Example"
        >
          LOAD_HARD
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;