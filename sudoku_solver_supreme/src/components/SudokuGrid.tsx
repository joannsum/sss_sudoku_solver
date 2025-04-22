import React from 'react';
import { GRID_SIZE, EMPTY_CELL } from './SudokuSolverSupreme';

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
  // Render a cell
  const renderCell = (row: number, col: number) => {
    const value = board[row][col];
    const isOriginal = originalBoard[row][col] !== EMPTY_CELL;
    const isHighlighted = solutionPath.length > 0 && 
                         currentPathIndex > 0 && 
                         currentPathIndex <= solutionPath.length &&
                         solutionPath[currentPathIndex - 1].row === row &&
                         solutionPath[currentPathIndex - 1].col === col;
    
    // Determine cell styles
    const cellBorderClass = getBorderStyles(row, col);
    const cellColorClass = getCellColorClass(row, col, isOriginal, isHighlighted);
    
    return (
      <input
        key={`cell-${row}-${col}`}
        type="text"
        maxLength={1}
        value={value === 0 ? '' : value.toString()}
        onChange={(e) => handleCellChange(row, col, e.target.value)}
        className={`w-full h-full text-center font-bold text-lg ${cellBorderClass} ${cellColorClass} focus:outline-none transition-colors duration-200`}
        readOnly={isOriginal || solving || solved}
      />
    );
  };
  
  // Helper function to get cell border styles
  const getBorderStyles = (row: number, col: number) => {
    let borderClass = "border border-gray-300";
    
    if (row % 3 === 0) borderClass += " border-t-2 border-t-gray-800";
    if (row === 8) borderClass += " border-b-2 border-b-gray-800";
    if (col % 3 === 0) borderClass += " border-l-2 border-l-gray-800";
    if (col === 8) borderClass += " border-r-2 border-r-gray-800";
    
    return borderClass;
  };
  
  // Helper function to get cell color class
  const getCellColorClass = (row: number, col: number, isOriginal: boolean, isHighlighted: boolean) => {
    if (isHighlighted) {
      return "bg-green-200 text-green-800";
    } else if (isOriginal) {
      return "bg-gray-100 text-gray-800";
    } else if (board[row][col] !== EMPTY_CELL) {
      return "bg-white text-blue-600";
    }
    return "bg-white text-gray-800";
  };

  return (
    <div className="grid grid-cols-9 w-full max-w-md mb-8 border-2 border-gray-800">
      {Array(GRID_SIZE).fill(0).map((_, row) => (
        Array(GRID_SIZE).fill(0).map((_, col) => (
          <div key={`${row}-${col}`} className="aspect-square">
            {renderCell(row, col)}
          </div>
        ))
      ))}
    </div>
  );
};

export default SudokuGrid;