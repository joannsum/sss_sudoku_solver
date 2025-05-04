import testDataset from './sudokuTestDataset.json';
import { runTests, analyzeResults } from './test';

const results = runTests(testDataset);
analyzeResults(results);

console.log(JSON.stringify(results, null, 2));