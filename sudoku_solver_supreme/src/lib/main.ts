////Uncomment to test MRV+LCV+forward tracking heursitics compared to basic backtracking: 

// import testDataset from './sudokuTestDataset.json';
// import { runTests, analyzeResults } from './test';

// const results = runTests(testDataset);
// analyzeResults(results);

// console.log(JSON.stringify(results, null, 2));

//Tests optimized MRV heuristic + backtracking against basic bactracking 
import testDataset from './sudokuTestDataset.json';
import { runTests, analyzeResults } from './testMRV';

// Run the tests using the MRV-only solver
const results = runTests(testDataset);
analyzeResults(results);

// Output detailed results to console 
//(can be redirected to a file)
console.log("DETAILED RESULTS");
console.log("===============\n");
console.log(JSON.stringify(results, null, 2));