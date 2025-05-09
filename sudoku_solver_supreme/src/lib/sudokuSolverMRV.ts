// Constants
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
  nodesExplored: number;
}

// Get all legal values for a cell
const getLegalValues = (grid: number[][], row: number, col: number): number[] => {
  const legalValues = [];
  for (let val = 1; val <= GRID_SIZE; val++) {
    if (isValid(grid, row, col, val)) {
      legalValues.push(val);
    }
  }
  return legalValues;
};

// Find the most constrained cell (MRV heuristic)
const findMostConstrainedCell = (grid: number[][]) => {
  let minPossibilities = GRID_SIZE + 1;
  let mrvCell = null;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === EMPTY_CELL) {
        const possibilities = getLegalValues(grid, row, col).length;
        if (possibilities < minPossibilities) {
          minPossibilities = possibilities;
          mrvCell = { row, col };
        }
        
        // Optimization: if we find a cell with only one possibility,
        // return it immediately as it's the most constrained
        if (possibilities === 1) {
          return { row, col };
        }
      }
    }
  }

  return mrvCell;
};

export const solveWithMRV = (
  grid: number[][], 
  path: any[] = [], 
  backtrackCount = 0,
  nodesExplored = 0
): SolveResult => {
  nodesExplored++;
  
  // Find the most constrained cell (MRV)
  const mrvCell = findMostConstrainedCell(grid);
  if (!mrvCell) {
    // No empty cells left = we've solved it!
    return { 
      grid: grid, 
      solved: true, 
      path: path,
      backtrackCount: backtrackCount,
      nodesExplored: nodesExplored
    };
  }

  const { row, col } = mrvCell;
  
  // Get legal values for this cell
  const legalValues = getLegalValues(grid, row, col);

  // Try each value
  for (const value of legalValues) {
    // Apply the value
    const newGrid = grid.map(row => [...row]);
    newGrid[row][col] = value;
    
    // Add to solution path
    path.push({ row, col, value, grid: newGrid });
    
    // Recursive call
    const result = solveWithMRV(newGrid, path, backtrackCount, nodesExplored);
    if (result.solved) {
      return result;
    }
    
    // Backtrack: remove the last step
    path.pop();
    backtrackCount++;
  }

  // No solution found in this branch
  return { 
    grid, 
    solved: false, 
    path, 
    backtrackCount,
    nodesExplored
  };
};