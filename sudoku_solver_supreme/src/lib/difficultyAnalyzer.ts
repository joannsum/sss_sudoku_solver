// Constants
const GRID_SIZE = 9;
const EMPTY_CELL = 0;

// Calculate difficulty score based on various metrics
export const calculateDifficultyScore = (
  originalGrid: number[][], 
  path: any[], 
  backtrackCount: number
) => {
  // Count initial empty cells
  let emptyCount = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (originalGrid[i][j] === EMPTY_CELL) {
        emptyCount++;
      }
    }
  }
  
  // Calculate average branching factor
  const uniqueDecisionPoints = new Set(path.map(step => `${step.row},${step.col}`)).size;
  const branchingFactor = path.length / (uniqueDecisionPoints || 1);
  
  // Calculate average constraint propagation
  let totalConstraintPropagation = 0;
  path.forEach((step, index) => {
    if (index > 0) {
      const prevStep = path[index - 1];
      const changedCells = countDifferences(prevStep.grid, step.grid);
      totalConstraintPropagation += changedCells;
    }
  });
  const avgConstraintPropagation = totalConstraintPropagation / (path.length || 1);
  
  // Analyze the entropy (information content) of the initial grid
  const initialEntropy = calculateGridEntropy(originalGrid);
  
  // Difficulty formula (customized weights)
  const difficultyScore = (
    (emptyCount * 0.4) + 
    (backtrackCount * 0.3) + 
    (branchingFactor * 15) +
    ((10 - avgConstraintPropagation) * 2) +
    (initialEntropy * 0.5)
  );
  
  // Categorize difficulty
  let difficultyText = '';
  if (difficultyScore < 40) difficultyText = 'Easy';
  else if (difficultyScore < 70) difficultyText = 'Medium';
  else if (difficultyScore < 100) difficultyText = 'Hard';
  else difficultyText = 'Expert';
  
  return { 
    score: Math.round(difficultyScore), 
    text: difficultyText,
    details: {
      emptyCount,
      backtrackCount,
      branchingFactor,
      avgConstraintPropagation,
      initialEntropy
    }
  };
};

// Helper to count differences between two grids
const countDifferences = (grid1: number[][], grid2: number[][]) => {
  let count = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid1[i][j] !== grid2[i][j]) {
        count++;
      }
    }
  }
  return count;
};

// Calculate the information entropy of the grid
// Higher entropy = more uncertainty/complexity
const calculateGridEntropy = (grid: number[][]) => {
  // Count possibilities for each empty cell
  let totalPossibilities = 0;
  let emptyCells = 0;
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === EMPTY_CELL) {
        emptyCells++;
        
        // Count legal values for this cell
        let possibilitiesCount = 0;
        for (let val = 1; val <= GRID_SIZE; val++) {
          if (isValidPlacement(grid, row, col, val)) {
            possibilitiesCount++;
          }
        }
        totalPossibilities += possibilitiesCount;
      }
    }
  }
  
  // Average possibilities per empty cell
  return emptyCells > 0 ? totalPossibilities / emptyCells : 0;
};

// Helper to check if a placement is valid
const isValidPlacement = (grid: number[][], row: number, col: number, value: number): boolean => {
  // Check row
  for (let i = 0; i < GRID_SIZE; i++) {
    if (grid[row][i] === value) return false;
  }

  // Check column
  for (let i = 0; i < GRID_SIZE; i++) {
    if (grid[i][col] === value) return false;
  }

  // Check 3x3 box
  const boxSize = 3;
  const boxRow = Math.floor(row / boxSize) * boxSize;
  const boxCol = Math.floor(col / boxSize) * boxSize;
  for (let i = 0; i < boxSize; i++) {
    for (let j = 0; j < boxSize; j++) {
      if (grid[boxRow + i][boxCol + j] === value) return false;
    }
  }

  return true;
};