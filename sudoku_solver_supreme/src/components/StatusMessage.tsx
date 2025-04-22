import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface StatusMessageProps {
  error: string | null;
  solved: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ error, solved }) => {
  if (error) {
    return (
      <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-md flex items-start gap-2 max-w-lg">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }
  
  if (solved) {
    return (
      <div className="mb-6 p-3 bg-green-100 text-green-800 rounded-md flex items-start gap-2 max-w-lg">
        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <span>Puzzle solved successfully!</span>
      </div>
    );
  }
  
  return null;
};

export default StatusMessage;