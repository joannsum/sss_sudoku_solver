import { solveWithBacktracking, isValid } from './sudokuSolver';

// Basic backtracking without heuristics for comparison
function basicBacktracking(grid: number[][]): {
  solved: boolean;
  grid: number[][];
  backtrackCount: number;
  nodesExplored: number;
} {
  let backtrackCount = 0;
  let nodesExplored = 0;
  
  function solve(grid: number[][]): boolean {
    nodesExplored++;
    
    // Find empty cell (row-major order, no MRV)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          // Try values 1-9 (no LCV ordering)
          for (let val = 1; val <= 9; val++) {
            if (isValid(grid, row, col, val)) {
              grid[row][col] = val;
              
              if (solve(grid)) {
                return true;
              }
              
              // Backtrack
              grid[row][col] = 0;
              backtrackCount++;
            }
          }
          return false;
        }
      }
    }
    return true; // No empty cells = solved
  }
  
  const gridCopy = grid.map(row => [...row]);
  const solved = solve(gridCopy);
  
  return {
    solved,
    grid: gridCopy,
    backtrackCount,
    nodesExplored
  };
}

// Test harness
export function runTests(dataset: any) {
  const results = dataset.puzzles.map((puzzle: any) => {
    // Test with basic backtracking
    const basicStart = performance.now();
    const basicResult = basicBacktracking(puzzle.grid);
    const basicEnd = performance.now();
    
    // Test with your CSP algorithm
    const cspStart = performance.now();
    const cspResult = solveWithBacktracking(puzzle.grid);
    const cspEnd = performance.now();
    
    return {
      id: puzzle.id,
      difficulty: puzzle.difficulty,
      givenCount: puzzle.givenCount,
      expectedBacktracks: puzzle.expectedBacktracks,
      basic: {
        time: basicEnd - basicStart,
        backtracks: basicResult.backtrackCount,
        nodes: basicResult.nodesExplored
      },
      csp: {
        time: cspEnd - cspStart,
        backtracks: cspResult.backtrackCount,
        nodes: cspResult.path.length
      },
      improvement: {
        timeReduction: ((basicEnd - basicStart) - (cspEnd - cspStart)) / (basicEnd - basicStart) * 100,
        nodeReduction: (basicResult.nodesExplored - cspResult.path.length) / basicResult.nodesExplored * 100
      }
    };
  });
  
  return results;
}

// Analyze results by difficulty
export function analyzeResults(results: any[]) {
  const byDifficulty = {
    easy: results.filter(r => r.difficulty === 'easy'),
    medium: results.filter(r => r.difficulty === 'medium'),
    hard: results.filter(r => r.difficulty === 'hard')
  };
  
  Object.entries(byDifficulty).forEach(([difficulty, puzzles]) => {
    const avgTimeImprovement = puzzles.reduce((sum, p) => sum + p.improvement.timeReduction, 0) / puzzles.length;
    const avgNodeReduction = puzzles.reduce((sum, p) => sum + p.improvement.nodeReduction, 0) / puzzles.length;
    const avgBacktracks = puzzles.reduce((sum, p) => sum + p.csp.backtracks, 0) / puzzles.length;
    
    console.log(`\n${difficulty.toUpperCase()} Puzzles:`);
    console.log(`Average time improvement: ${avgTimeImprovement.toFixed(1)}%`);
    console.log(`Average node reduction: ${avgNodeReduction.toFixed(1)}%`);
    console.log(`Average backtracks: ${avgBacktracks.toFixed(1)}`);
  });
}