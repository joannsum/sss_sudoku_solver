import React from 'react';

interface StatusMessageProps {
  error: string | null;
  solved: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ error, solved }) => {
  if (error) {
    return (
      <div className="flex items-center text-neon-pink">
        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="font-mono">ERROR_DETECTED: {error}</span>
      </div>
    );
  }
  
  if (solved) {
    return (
      <div className="flex items-center text-cyber-yellow">
        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-mono">SUCCESS: MATRIX_SOLUTION FOUND [100%]</span>
      </div>
    );
  }
  
  return null;
};

export default StatusMessage;