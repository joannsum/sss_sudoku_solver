# Sudoku Solver Supreme

An AI-powered Sudoku solver that implements constraint satisfaction techniques and provides insightful analysis of puzzle difficulty.

## Features

- **Intelligent Solving Algorithm**: Uses AI techniques like backtracking, MRV, LCV, and forward checking
- **Interactive Grid**: Enter your own puzzles or use provided examples
- **Step Visualization**: Watch the solving process step by step
- **Difficulty Analysis**: Get insights into puzzle complexity through multiple metrics
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## AI Techniques Implemented

This solver treats Sudoku as a constraint satisfaction problem (CSP) and implements several advanced techniques:

1. **Backtracking Search**: Systematically tries different values for cells and backtracks when constraints are violated
2. **Minimum Remaining Values (MRV)**: Always selects the most constrained cell first
3. **Least Constraining Value (LCV)**: Orders values to maintain maximum flexibility in the remaining grid
4. **Forward Checking**: Maintains arc consistency during the search process
5. **Difficulty Estimation**: Analyzes puzzle complexity using:
   - Empty cell count
   - Backtracking steps needed
   - Average branching factor
   - Constraint propagation efficiency
   - Information entropy of the initial grid

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # App layout
│   └── globals.css        # Global styles
├── components/
│   ├── SudokuSolverSupreme.tsx  # Main component
│   ├── SudokuGrid.tsx           # Grid display
│   ├── ControlPanel.tsx         # User controls
│   ├── StatusMessage.tsx        # Error/success messages
│   ├── StatsDisplay.tsx         # Solution statistics
│   └── TechnicalExplanation.tsx # AI technique info
└── lib/
    ├── sudokuSolver.ts          # Core solving algorithm
    ├── difficultyAnalyzer.ts    # Difficulty metrics
    └── examplePuzzles.ts        # Sample puzzles
```

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/joannsum/sss_sudoku_solver
   cd sudoku-solver-supreme
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Enter a Puzzle**: Click on cells to input numbers (1-9) or use one of the provided examples
2. **Solve**: Click the "Solve" button to find a solution
3. **Visualize**: Toggle "Visualize Steps" to watch the algorithm work through the puzzle
4. **Reset**: Clear the board to start over
5. **Examples**: Load preset puzzles of varying difficulty

## Technical Details

### Solving Algorithm

The core solving algorithm uses backtracking search with intelligent variable and value selection:

```typescript
// Pseudocode for the main solving algorithm
function solveWithBacktracking(grid) {
  // Find most constrained cell (MRV heuristic)
  const cell = findMostConstrainedCell(grid);
  
  if (!cell) return { solved: true, grid: grid }; // No empty cells left
  
  // Get legal values for this cell
  let values = getLegalValues(grid, cell.row, cell.col);
  
  // Order values by least constraining (LCV heuristic)
  values = orderValuesByLCV(grid, cell.row, cell.col, values);
  
  // Try each value
  for (const value of values) {
    // Forward checking
    if (forwardCheck(grid, cell.row, cell.col, value)) {
      const newGrid = applyValue(grid, cell.row, cell.col, value);
      const result = solveWithBacktracking(newGrid);
      
      if (result.solved) return result;
      // Otherwise, backtrack
    }
  }
  
  return { solved: false, grid: grid };
}
```

### Difficulty Estimation

The difficulty analyzer considers multiple factors:

- **Initial Empty Cells**: More empty cells generally means harder puzzles
- **Backtracking**: Amount of backtracking required indicates complexity
- **Branching Factor**: Average number of choices at decision points
- **Constraint Propagation**: How effectively constraints reduce possibilities
- **Information Entropy**: Uncertainty/complexity in the initial grid

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and Tailwind CSS
- Inspired by AI constraint satisfaction techniques 
- For CPSC 481