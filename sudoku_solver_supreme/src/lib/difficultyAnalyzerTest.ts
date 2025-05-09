// difficultyAnalyzerTest.ts
import { calculateDifficultyScore } from './difficultyAnalyzer';
import { solveWithBacktracking } from './sudokuSolver';
import fs from 'fs';

// Define types for our dataset and results
type Difficulty = 'easy' | 'medium' | 'hard';

interface Puzzle {
  id: string;
  difficulty: Difficulty;
  givenCount: number;
  expectedBacktracks: number;
  grid: number[][];
}

interface Dataset {
  puzzles: Puzzle[];
}

interface SolveMetrics {
  solved: boolean;
  path: any[];
  backtracks: number;
}

interface DifficultyMetrics {
  givenCount: number;
  backtrackCount: number;
  searchNodes: number;
  averageCandidates: number;
  requiresGuessing: boolean;
  nakedSinglesCount: number;
  hiddenSinglesCount: number;
  minLocalGivens: number;
  balanceScore: number;
}

interface DifficultyResult {
  score: number;
  text: string;
  details: DifficultyMetrics;
}

interface PuzzleResult {
  id: string;
  expectedDifficulty: Difficulty;
  actualDifficulty: string;
  score: number;
  correct: boolean;
  metrics: DifficultyMetrics;
}

interface DifficultyStats {
  easy: { correct: number; total: number; scores: number[] };
  medium: { correct: number; total: number; scores: number[] };
  hard: { correct: number; total: number; scores: number[] };
  accuracy: number;
}

// Load the test dataset
const loadTestDataset = (): Dataset => {
  try {
    const data = fs.readFileSync('./sudokuTestDataset.json', 'utf8');
    return JSON.parse(data) as Dataset;
  } catch (error) {
    console.error('Error loading test dataset:', error);
    process.exit(1);
  }
};

// Convert the flat grid array to a 2D array if needed
const formatGrid = (grid: number[] | number[][]): number[][] => {
  if (!Array.isArray(grid[0])) {
    const formatted: number[][] = [];
    const flatGrid = grid as number[];
    for (let i = 0; i < 9; i++) {
      formatted.push(flatGrid.slice(i * 9, (i + 1) * 9));
    }
    return formatted;
  }
  return grid as number[][];
};

// Function to solve the puzzle and get metrics using your actual solver
const solvePuzzleAndGetMetrics = (grid: number[][]): SolveMetrics => {
  // Clone the grid to avoid modifying the original
  const gridCopy = grid.map(row => [...row]);
  
  // Use your actual solver
  const result = solveWithBacktracking(gridCopy);
  
  return {
    solved: result.solved,
    path: result.path || [],
    backtracks: result.backtrackCount || 0
  };
};

// Function to analyze puzzle difficulty
const analyzeDataset = (): void => {
  const dataset = loadTestDataset();
  const puzzles = dataset.puzzles || [];
  
  // Statistics counters
  const stats: DifficultyStats = {
    easy: { correct: 0, total: 0, scores: [] },
    medium: { correct: 0, total: 0, scores: [] },
    hard: { correct: 0, total: 0, scores: [] },
    accuracy: 0
  };
  
  // Results for each puzzle
  const results: PuzzleResult[] = [];
  
  console.log("Analyzing difficulty of puzzles...");
  console.log("-".repeat(60));
  
  puzzles.forEach((puzzle: Puzzle) => {
    const grid = formatGrid(puzzle.grid);
    const expectedDifficulty = puzzle.difficulty;
    
    // Get solving metrics
    const solveMetrics = solvePuzzleAndGetMetrics(grid);
    
    // Calculate difficulty score
    const difficultyResult = calculateDifficultyScore(
      grid, 
      solveMetrics.path,
      solveMetrics.backtracks
    ) as DifficultyResult;
    
    // Update statistics
    stats[expectedDifficulty].total++;
    stats[expectedDifficulty].scores.push(difficultyResult.score);
    
    if (difficultyResult.text.toLowerCase() === expectedDifficulty.toLowerCase()) {
      stats[expectedDifficulty].correct++;
    }
    
    // Save detailed result
    results.push({
      id: puzzle.id,
      expectedDifficulty: expectedDifficulty,
      actualDifficulty: difficultyResult.text,
      score: difficultyResult.score,
      correct: difficultyResult.text.toLowerCase() === expectedDifficulty.toLowerCase(),
      metrics: difficultyResult.details
    });
    
    // Log result
    console.log(`Puzzle ${puzzle.id}:`);
    console.log(`  Expected: ${expectedDifficulty}, Calculated: ${difficultyResult.text} (Score: ${difficultyResult.score})`);
    console.log(`  Givens: ${difficultyResult.details.givenCount}, Backtracks: ${solveMetrics.backtracks}`);
    console.log(`  Naked Singles: ${difficultyResult.details.nakedSinglesCount}, Hidden Singles: ${difficultyResult.details.hiddenSinglesCount}`);
    console.log(`  Min Local Givens: ${difficultyResult.details.minLocalGivens}, Balance Score: ${difficultyResult.details.balanceScore.toFixed(2)}`);
    console.log("-".repeat(60));
  });
  
  // Calculate overall accuracy
  const totalCorrect = stats.easy.correct + stats.medium.correct + stats.hard.correct;
  const totalPuzzles = puzzles.length;
  stats.accuracy = (totalCorrect / totalPuzzles) * 100;
  
  // Calculate average scores per difficulty
  const avgScores = {
    easy: stats.easy.scores.reduce((sum, score) => sum + score, 0) / stats.easy.total || 0,
    medium: stats.medium.scores.reduce((sum, score) => sum + score, 0) / stats.medium.total || 0,
    hard: stats.hard.scores.reduce((sum, score) => sum + score, 0) / stats.hard.total || 0,
  };
  
  // Print summary
  console.log("\nDifficulty Analysis Summary");
  console.log("=".repeat(60));
  console.log(`Total Puzzles Analyzed: ${totalPuzzles}`);
  console.log(`Overall Accuracy: ${stats.accuracy.toFixed(2)}%`);
  console.log("\nAccuracy by Difficulty Level:");
  console.log(`  Easy:   ${((stats.easy.correct / stats.easy.total) * 100).toFixed(2)}% (${stats.easy.correct}/${stats.easy.total})`);
  console.log(`  Medium: ${((stats.medium.correct / stats.medium.total) * 100).toFixed(2)}% (${stats.medium.correct}/${stats.medium.total})`);
  console.log(`  Hard:   ${((stats.hard.correct / stats.hard.total) * 100).toFixed(2)}% (${stats.hard.correct}/${stats.hard.total})`);
  
  console.log("\nAverage Difficulty Scores:");
  console.log(`  Easy:   ${avgScores.easy.toFixed(2)}`);
  console.log(`  Medium: ${avgScores.medium.toFixed(2)}`);
  console.log(`  Hard:   ${avgScores.hard.toFixed(2)}`);
  
  // Save results to file
  fs.writeFileSync(
    './difficultyAnalysisResults.json', 
    JSON.stringify({ stats, results }, null, 2)
  );
  console.log("\nDetailed results saved to difficultyAnalysisResults.json");
};

// Run the analysis
analyzeDataset();