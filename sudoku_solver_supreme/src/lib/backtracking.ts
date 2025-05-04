const GRID_SIZE = 9;
const BOX_SIZE = 3;
const EMPTY_CELL = 0;

// Check if a value is valid in a position
export const isValid = (grid: number[][], row: number, col: number, value: number): boolean => {
  // Check row
  for (let i = 0; i < GRID_SIZE; i++) {
    if (grid[row][i] === value) return false;
  }

  // Check column
  for (let i = 0; i < GRID_SIZE; i++) {
    if (grid[i][col] === value) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[boxRow + i][boxCol + j] === value) return false;
    }
  }

  return true;
};

interface SolveResult {
  grid: number[][];
  solved: boolean;
  path: any[];
  backtrackCount: number;
}

// Basic backtracking without heuristics
export const solveWithBasicBacktracking = (
  grid: number[][], 
  path: any[] = [], 
  backtrackCount = 0
): SolveResult => {
  
  // Find empty cell (simple left-to-right, top-to-bottom scan)
  let emptyCell = null;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === EMPTY_CELL) {
        emptyCell = { row, col };
        break;
      }
    }
    if (emptyCell) break;
  }

  if (!emptyCell) {
    // No empty cells left = solved it!
    return { 
      grid: grid, 
      solved: true, 
      path: path,
      backtrackCount: backtrackCount
    };
  }

  const { row, col } = emptyCell;
  
  // Try values 1-9 in order (no heuristic ordering)
  for (let value = 1; value <= GRID_SIZE; value++) {
    if (isValid(grid, row, col, value)) {
      // Apply the value
      const newGrid = grid.map(row => [...row]);
      newGrid[row][col] = value;
      
      // Add to solution path
      path.push({ row, col, value, grid: newGrid });
      
      // Recursive call
      const result = solveWithBasicBacktracking(newGrid, path, backtrackCount);
      if (result.solved) {
        return result;
      }
      
      // Backtrack: remove the last step
      path.pop();
      backtrackCount++;
    }
  }

  // No solution found in this branch
  return { grid, solved: false, path, backtrackCount };
};