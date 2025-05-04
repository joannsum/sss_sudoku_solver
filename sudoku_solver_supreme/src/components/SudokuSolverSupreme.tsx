'use client';
import React, { useState } from 'react';
import SudokuGrid from './SudokuGrid';
import ControlPanel from './ControlPanel';
import StatusMessage from './StatusMessage';
import StatsDisplay from './StatsDisplay';
import TechnicalExplanation from './TechnicalExplanation';
import { solveWithBacktracking } from '../lib/sudokuSolver';
import { solveWithBasicBacktracking } from '../lib/backtracking';
import { calculateDifficultyScore } from '../lib/difficultyAnalyzer';
import { examplePuzzles } from '../lib/examplePuzzles';

// Constants
export const GRID_SIZE = 9;
export const BOX_SIZE = 3;
export const EMPTY_CELL = 0;

// Initial empty board
const emptyBoard = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(EMPTY_CELL));

const SudokuSolverSupreme = () => {
  // States
  const [board, setBoard] = useState(emptyBoard);
  const [originalBoard, setOriginalBoard] = useState(emptyBoard);
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    backtrackCount: 0,
    timeElapsed: 0,
    difficultyScore: 0,
  });
  const [visualizeSteps, setVisualizeSteps] = useState(false);
  const [solutionPath, setSolutionPath] = useState<any[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [difficultyText, setDifficultyText] = useState('');
  
  // New state for algorithm toggle
  const [useOptimizedSolver, setUseOptimizedSolver] = useState(true);

  // Start solving process
  const handleSolve = () => {
    // Validate the board
    if (!validateBoard(board)) {
      return;
    }

    setError(null);
    setSolving(true);
    setSolutionPath([]);
    setCurrentPathIndex(0);
    
    // Start timing
    const startTime = performance.now();
    
    // Make a copy of the board to keep track of original state
    const boardCopy = board.map(row => [...row]);
    setOriginalBoard(boardCopy);
    
    // Solve using selected algorithm
    setTimeout(() => {
      try {
        // Choose solver based on toggle
        const result = useOptimizedSolver 
          ? solveWithBacktracking(boardCopy)
          : solveWithBasicBacktracking(boardCopy);
        
        const endTime = performance.now();
        const timeElapsed = Math.round((endTime - startTime) / 10) / 100;
        
        if (result.solved) {
          const difficulty = calculateDifficultyScore(boardCopy, result.path, result.backtrackCount);
          
          setStats({
            backtrackCount: result.backtrackCount,
            timeElapsed: timeElapsed,
            difficultyScore: difficulty.score
          });
          
          setDifficultyText(difficulty.text);
          setSolutionPath(result.path);
          
          if (visualizeSteps && result.path.length > 0) {
            // Start visualization from the beginning
            setBoard(boardCopy);
            setCurrentPathIndex(0);
            animateSolution(result.path, boardCopy);
          } else {
            // Show final result immediately
            setBoard(result.grid);
            setSolved(true);
            setSolving(false);
          }
        } else {
          setError("No solution exists for this puzzle");
          setSolving(false);
        }
      } catch (err: any) {
        setError(`Error solving puzzle: ${err.message || 'Unknown error'}`);
        setSolving(false);
      }
    }, 100);
  };

  // Validate board for conflicts
  const validateBoard = (board: number[][]) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const value = board[row][col];
        if (value !== EMPTY_CELL) {
          // Temporarily clear this cell to check if this value is valid here
          const tempBoard = board.map(r => [...r]);
          tempBoard[row][col] = EMPTY_CELL;
          
          // Check row
          for (let i = 0; i < GRID_SIZE; i++) {
            if (tempBoard[row][i] === value) {
              setError(`Invalid board: Value ${value} at row ${row + 1}, column ${col + 1} conflicts with another cell in the same row`);
              return false;
            }
          }
          
          // Check column
          for (let i = 0; i < GRID_SIZE; i++) {
            if (tempBoard[i][col] === value) {
              setError(`Invalid board: Value ${value} at row ${row + 1}, column ${col + 1} conflicts with another cell in the same column`);
              return false;
            }
          }
          
          // Check box
          const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
          const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
          for (let i = 0; i < BOX_SIZE; i++) {
            for (let j = 0; j < BOX_SIZE; j++) {
              if (tempBoard[boxRow + i][boxCol + j] === value) {
                setError(`Invalid board: Value ${value} at row ${row + 1}, column ${col + 1} conflicts with another cell in the same 3x3 box`);
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  };

  // Animate the solution path
  const animateSolution = (path: any[], originalBoard: number[][]) => {
    let stepIndex = 0;
    
    const animate = () => {
      if (stepIndex < path.length) {
        setCurrentPathIndex(stepIndex + 1);
        setBoard(path[stepIndex].grid);
        stepIndex++;
        setTimeout(animate, 150);
      } else {
        setSolved(true);
        setSolving(false);
      }
    };
    
    animate();
  };

  // Reset the board
  const handleReset = () => {
    setBoard(emptyBoard);
    setOriginalBoard(emptyBoard);
    setSolved(false);
    setSolving(false);
    setError(null);
    setSolutionPath([]);
    setCurrentPathIndex(0);
    setStats({
      backtrackCount: 0,
      timeElapsed: 0,
      difficultyScore: 0
    });
    setDifficultyText('');
  };

  // Handle cell value change
  const handleCellChange = (row: number, col: number, value: string) => {
    if (solving || solved) return;
    
    // Only allow numbers 1-9 or empty
    const numValue = value === '' ? EMPTY_CELL : parseInt(value);
    if ((numValue >= 1 && numValue <= 9) || numValue === EMPTY_CELL) {
      const newBoard = board.map(row => [...row]);
      newBoard[row][col] = numValue;
      setBoard(newBoard);
    }
  };

  // Load example
  const loadExample = (difficulty: 'easy' | 'medium' | 'hard') => {
    setBoard(examplePuzzles[difficulty]);
    setOriginalBoard(examplePuzzles[difficulty]);
    setSolved(false);
    setSolving(false);
    setError(null);
    setSolutionPath([]);
    setCurrentPathIndex(0);
    setStats({
      backtrackCount: 0,
      timeElapsed: 0,
      difficultyScore: 0
    });
    setDifficultyText('');
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mt-4 mb-2 cyber-title">SSS._SUDOKU_SOLVER_SUPREME</h1>
      <h2 className="text-lg text-neon-pink mb-6">
        <span className="">AI-algorithm powered sudoku solver, visualizer, and difficulty analyzer.</span>
      </h2>
      
      <div className="section-divider"></div>
      
      {/* Control panel with algorithm toggle */}
      <div className="w-full max-w-4xl mb-6 cyber-panel p-4">
        {/* Algorithm toggle */}
        <div className="mb-4 flex items-center justify-center gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useOptimizedSolver}
              onChange={(e) => setUseOptimizedSolver(e.target.checked)}
              className="mr-2"
              disabled={solving}
            />
            <span className={`text-sm ${solving ? 'text-gray-500' : 'text-neon-blue'}`}>
              Use Optimized CSP Algorithm (MRV + LCV + Forward Checking)
            </span>
          </label>
        </div>
        
        {/* Display current algorithm info */}
        <div className="mb-4 text-center">
          <p className="text-sm text-neon-green">
            Current Algorithm: {useOptimizedSolver ? 'CSP with Heuristics' : 'Basic Backtracking'}
          </p>
        </div>
        
        <ControlPanel 
          solving={solving}
          visualizeSteps={visualizeSteps}
          setVisualizeSteps={setVisualizeSteps}
          handleSolve={handleSolve}
          handleReset={handleReset}
          loadExample={loadExample}
        />
      </div>
      
      {/* Status message display */}
      {(error || solved) && (
        <div className={`w-full max-w-4xl mb-4 cyber-panel ${error ? 'error' : 'success'} p-4`}>
          <StatusMessage error={error} solved={solved} />
        </div>
      )}
      
      {(solved || (solutionPath.length > 0 && currentPathIndex > 0)) && (
        <div className="w-full max-w-4xl mb-6 cyber-panel p-4">
          <StatsDisplay 
            stats={stats}
            solutionPath={solutionPath}
            currentPathIndex={currentPathIndex}
            difficultyText={difficultyText}
          />
          
          {/* Show which algorithm was used */}
          <div className="mt-4 text-sm text-neon-pink">
            Solved using: {useOptimizedSolver ? 'CSP with Heuristics' : 'Basic Backtracking'}
          </div>
        </div>
      )}
      
      {/* Sudoku grid */}
      <div className="w-full max-w-4xl mb-6 flex justify-center">
        <SudokuGrid 
          board={board}
          originalBoard={originalBoard}
          solutionPath={solutionPath}
          currentPathIndex={currentPathIndex}
          handleCellChange={handleCellChange}
          solving={solving}
          solved={solved}
        />
      </div>
      
      <div className="section-divider"></div>
      
      {/* Technical explanation */}
      <div className="w-full max-w-4xl cyber-panel p-4 mb-10">
        <TechnicalExplanation />
      </div>
    </div>
  );
};

export default SudokuSolverSupreme;