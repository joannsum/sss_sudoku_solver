import React from 'react';
import { GRID_SIZE, BOX_SIZE, EMPTY_CELL } from './SudokuSolverSupreme';

interface SudokuGridProps {
  board: number[][];
  originalBoard: number[][];
  solutionPath: any[];
  currentPathIndex: number;
  handleCellChange: (row: number, col: number, value: string) => void;
  solving: boolean;
  solved: boolean;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  board,
  originalBoard,
  solutionPath,
  currentPathIndex,
  handleCellChange,
  solving,
  solved
}) => {
  const getClassForCell = (row: number, col: number, value: number) => {
    let cellClass = "sudoku-cell w-10 h-10 text-center text-lg font-bold flex items-center justify-center";
    
    // Highlight original cells
    if (originalBoard[row][col] !== EMPTY_CELL) {
      cellClass += " original";
    } 
    // Highlight solved cells
    else if (value !== EMPTY_CELL && (solved || currentPathIndex > 0)) {
      cellClass += " solved";
    }
    
    // Highlight current cell being considered in animation
    if (currentPathIndex > 0 && solutionPath.length > 0 && currentPathIndex - 1 < solutionPath.length) {
      const currentStep = solutionPath[currentPathIndex - 1];
      if (currentStep && currentStep.row === row && currentStep.col === col) {
        cellClass += " highlight";
      }
    }
    
    return cellClass;
  };

  return (
    <div className="sudoku-container relative p-1 rounded">
      <div className="sudoku-grid grid grid-cols-3 gap-2 bg-grid-border p-2 rounded">
        {Array.from({ length: BOX_SIZE }).map((_, boxRow) => (
          Array.from({ length: BOX_SIZE }).map((_, boxCol) => (
            <div 
              key={`box-${boxRow}-${boxCol}`} 
              className="box-grid grid grid-cols-3 gap-1 bg-grid-background p-1 border border-neon-blue"
            >
              {Array.from({ length: BOX_SIZE }).map((_, cellRow) => (
                Array.from({ length: BOX_SIZE }).map((_, cellCol) => {
                  const row = boxRow * BOX_SIZE + cellRow;
                  const col = boxCol * BOX_SIZE + cellCol;
                  const cell = board[row][col];
                  
                  return (
                    <input
                      key={`cell-${row}-${col}`}
                      type="text"
                      value={cell === EMPTY_CELL ? '' : cell.toString()}
                      onChange={(e) => handleCellChange(row, col, e.target.value)}
                      className={getClassForCell(row, col, cell)}
                      maxLength={1}
                      disabled={solving || solved || originalBoard[row][col] !== EMPTY_CELL}
                      aria-label={`Cell R${row + 1}C${col + 1}`}
                    />
                  );
                })
              ))}
            </div>
          ))
        ))}
      </div>
      
      {/* Loading overlay for visualization */}
      {solving && (
        <div className="absolute inset-0 flex items-center justify-center bg-grid-background bg-opacity-80 z-10">
          <div className="flex flex-col items-center">
            <div className="cyber-spinner mb-4"></div>
            <div className="loading-text text-xl">SOLVING_MATRIX</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudokuGrid;