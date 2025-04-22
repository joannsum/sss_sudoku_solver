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

// Backtracking search with MRV, LCV, and forward checking
export const solveWithBacktracking = (grid: number[][], path: any[] = [], backtrackCount = 0) => {
  // Find the most constrained cell (MRV)
  const mrvCell = findMostConstrainedCell(grid);
  if (!mrvCell) {
    // No empty cells left - we've solved it!
    return { 
      grid: grid, 
      solved: true, 
      path: path,
      backtrackCount: backtrackCount
    };
  }

  const { row, col } = mrvCell;
  
  // Get legal values for this cell
  let legalValues = getLegalValues(grid, row, col);
  
  // Order by least constraining value
  legalValues = orderValuesByLCV(grid, row, col, legalValues);

  // Try each value
  for (const value of legalValues) {
    // Check if this value leads to consistency
    if (forwardCheck(grid, row, col, value)) {
      // Apply the value
      const newGrid = grid.map(row => [...row]);
      newGrid[row][col] = value;
      
      // Add to solution path
      path.push({ row, col, value, grid: newGrid });
      
      // Recursive call
      const result = solveWithBacktracking(newGrid, path, backtrackCount);
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
      }
    }
  }

  return mrvCell;
};

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

// Order values by least constraining value heuristic
const orderValuesByLCV = (grid: number[][], row: number, col: number, legalValues: number[]): number[] => {
  // Count how many possibilities each value eliminates
  const valueScores = legalValues.map(value => {
    let eliminationCount = 0;

    // Try this value and see how many possibilities it eliminates in related cells
    const testGrid = grid.map(row => [...row]);
    testGrid[row][col] = value;

    // Check row, column, and box for eliminated possibilities
    for (let i = 0; i < GRID_SIZE; i++) {
      // Check row
      if (testGrid[row][i] === EMPTY_CELL) {
        eliminationCount += getLegalValues(grid, row, i).length - getLegalValues(testGrid, row, i).length;
      }
      
      // Check column
      if (testGrid[i][col] === EMPTY_CELL) {
        eliminationCount += getLegalValues(grid, i, col).length - getLegalValues(testGrid, i, col).length;
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        const r = boxRow + i;
        const c = boxCol + j;
        if (testGrid[r][c] === EMPTY_CELL) {
          eliminationCount += getLegalValues(grid, r, c).length - getLegalValues(testGrid, r, c).length;
        }
      }
    }

    return { value, eliminationCount };
  });

  // Sort by elimination count (ascending - least constraining first)
  valueScores.sort((a, b) => a.eliminationCount - b.eliminationCount);
  return valueScores.map(item => item.value);
};

// Forward checking to maintain arc consistency
const forwardCheck = (grid: number[][], row: number, col: number, value: number): boolean => {
  // Apply the value
  const newGrid = grid.map(row => [...row]);
  newGrid[row][col] = value;

  // Check all related cells for any with no legal values
  for (let i = 0; i < GRID_SIZE; i++) {
    // Check row
    if (newGrid[row][i] === EMPTY_CELL && getLegalValues(newGrid, row, i).length === 0) {
      return false;
    }
    
    // Check column
    if (newGrid[i][col] === EMPTY_CELL && getLegalValues(newGrid, i, col).length === 0) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      const r = boxRow + i;
      const c = boxCol + j;
      if (newGrid[r][c] === EMPTY_CELL && getLegalValues(newGrid, r, c).length === 0) {
        return false;
      }
    }
  }

  return true;

};