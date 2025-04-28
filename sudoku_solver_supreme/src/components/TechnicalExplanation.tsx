import React from 'react';
import { Info } from 'lucide-react';

const TechnicalExplanation: React.FC = () => {
  return (
    <div className="cyber-panel max-w-2xl p-5 mb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue opacity-70"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-neon-pink opacity-70"></div>
      <div className="absolute bottom-0 right-0 w-full h-1 bg-neon-pink opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1 h-full bg-neon-blue opacity-70"></div>
      
      <h3 className="text-lg font-bold text-neon-blue mb-4 flex items-center gap-2 uppercase tracking-wider">
        <Info className="h-5 w-5" />
        SYS::ALGORITHM_SPECS
      </h3>
      
      <div className="text-sm text-foreground space-y-3">
        <p className="border-l-2 border-neon-purple pl-3 py-1">
          This matrix solver implements Sudoku as a constraint satisfaction problem using advanced algorithmic approaches:
        </p>
        
        <ul className="space-y-2 pl-2">
          <li className="flex items-start gap-2">
            <span className="text-cyber-yellow">[01]</span>
            <span className="font-bold text-neon-blue">Backtracking Search</span>
            <span className="text-foreground opacity-90">- Systematic search through possible assignments</span>
          </li>
          
          <li className="flex items-start gap-2">
            <span className="text-cyber-yellow">[02]</span>
            <span className="font-bold text-neon-blue">MRV Heuristic</span>
            <span className="text-foreground opacity-90">- Always selects the most constrained cell first</span>
          </li>
          
          <li className="flex items-start gap-2">
            <span className="text-cyber-yellow">[03]</span>
            <span className="font-bold text-neon-blue">LCV Heuristic</span>
            <span className="text-foreground opacity-90">- Orders values to maintain maximum flexibility</span>
          </li>
          
          <li className="flex items-start gap-2">
            <span className="text-cyber-yellow">[04]</span>
            <span className="font-bold text-neon-blue">Forward Checking</span>
            <span className="text-foreground opacity-90">- Maintains arc consistency during search</span>
          </li>
          
          <li className="flex items-start gap-2">
            <span className="text-cyber-yellow">[05]</span>
            <span className="font-bold text-neon-blue">Difficulty Estimation</span>
            <span className="text-foreground opacity-90">- Analyzes solving complexity through multiple metrics</span>
          </li>
        </ul>
      </div>
      
      {/* Circuit-like decoration at bottom */}
      <div className="mt-4 pt-2 border-t border-grid-border flex">
        <div className="h-1 w-1/3 bg-neon-blue opacity-50 mr-1"></div>
        <div className="h-1 w-1/6 bg-neon-pink opacity-50 mr-1"></div>
        <div className="h-1 w-1/12 bg-cyber-yellow opacity-50 mr-1"></div>
      </div>
    </div>
  );
};

export default TechnicalExplanation;