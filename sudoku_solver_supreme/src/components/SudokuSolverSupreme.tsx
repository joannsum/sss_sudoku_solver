'use client';

import React, { useState } from 'react';
import SudokuGrid from './SudokuGrid';
import ControlPanel from './ControlPanel';
import StatusMessage from './StatusMessage';
import StatsDisplay from './StatsDisplay';
import TechnicalExplanation from './TechnicalExplanation';
import { solveWithBacktracking } from '../lib/sudokuSolver';
import { calculateDifficultyScore } from '../lib/difficultyAnalyzer';
import { examplePuzzles } from '../lib/examplePuzzles';

// Constants
export const GRID_SIZE = 9;
export const BOX_SIZE = 3;
export const EMPTY_CELL = 0;

// Initial empty board
const emptyBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(EMPTY_CELL));

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
    
    // Solve using our algorithm
    setTimeout(() => {
      try {
        const result = solveWithBacktracking(boardCopy);
        
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
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Sudoku Solver Supreme</h1>
      <h2 className="text-lg text-gray-600 mb-6">AI-Powered Constraint Satisfaction Problem Solver</h2>
      
      <ControlPanel 
        solving={solving}
        visualizeSteps={visualizeSteps}
        setVisualizeSteps={setVisualizeSteps}
        handleSolve={handleSolve}
        handleReset={handleReset}
        loadExample={loadExample}
      />
      
      <StatusMessage error={error} solved={solved} />
      
      {(solved || (solutionPath.length > 0 && currentPathIndex > 0)) && (
        <StatsDisplay 
          stats={stats}
          solutionPath={solutionPath}
          currentPathIndex={currentPathIndex}
          difficultyText={difficultyText}
        />
      )}
      
      <SudokuGrid 
        board={board}
        originalBoard={originalBoard}
        solutionPath={solutionPath}
        currentPathIndex={currentPathIndex}
        handleCellChange={handleCellChange}
        solving={solving}
        solved={solved}
      />
      
      <TechnicalExplanation />
    </div>
  );
};

export default SudokuSolverSupreme;