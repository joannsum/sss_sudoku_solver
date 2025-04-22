import React from 'react';
import { Info } from 'lucide-react';

const TechnicalExplanation: React.FC = () => {
  return (
    <div className="max-w-2xl bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <Info className="h-5 w-5 text-blue-500" />
        How It Works
      </h3>
      <div className="text-sm text-gray-600 space-y-2">
        <p>
          This solver implements Sudoku as a constraint satisfaction problem using:
        </p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li><span className="font-medium text-gray-700">Backtracking Search</span> - Systematic search through possible assignments</li>
          <li><span className="font-medium text-gray-700">MRV Heuristic</span> - Always selects the most constrained cell first</li>
          <li><span className="font-medium text-gray-700">LCV Heuristic</span> - Orders values to maintain maximum flexibility</li>
          <li><span className="font-medium text-gray-700">Forward Checking</span> - Maintains arc consistency during search</li>
          <li><span className="font-medium text-gray-700">Difficulty Estimation</span> - Analyzes solving complexity through multiple metrics</li>
        </ul>
      </div>
    </div>
  );
};

export default TechnicalExplanation;