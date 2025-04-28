import React from 'react';

interface StatsDisplayProps {
  stats: {
    backtrackCount: number;
    timeElapsed: number;
    difficultyScore: number;
  };
  solutionPath: any[];
  currentPathIndex: number;
  difficultyText: string;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  solutionPath,
  currentPathIndex,
  difficultyText
}) => {
  const getDifficultyColor = () => {
    const { difficultyScore } = stats;
    if (difficultyScore < 30) return 'text-neon-blue';
    if (difficultyScore < 60) return 'text-neon-purple';
    return 'text-neon-pink';
  };

  return (
    <div className="w-full">
      <h3 className="text-lg text-neon-blue mb-3 uppercase">SYSTEM_METRICS:</h3>
      <div className="cyber-stats">
        <div className="stat-card">
          <h4 className="text-sm uppercase mb-1">SOLUTION_TIME</h4>
          <div className="stat-value">{stats.timeElapsed.toFixed(2)}s</div>
        </div>

        <div className="stat-card">
          <h4 className="text-sm uppercase mb-1">BACKTRACK_COUNT</h4>
          <div className="stat-value">{stats.backtrackCount}</div>
        </div>

        <div className="stat-card">
          <h4 className="text-sm uppercase mb-1">DIFFICULTY_RATING</h4>
          <div className={`stat-value ${getDifficultyColor()}`}>
            {stats.difficultyScore.toFixed(1)}
          </div>
          <div className="text-xs mt-1 uppercase">{difficultyText}</div>
        </div>

        {solutionPath.length > 0 && (
          <div className="stat-card">
            <h4 className="text-sm uppercase mb-1">SOLVER_PROGRESS</h4>
            <div className="stat-value">
              {currentPathIndex}/{solutionPath.length}
            </div>
            <div className="w-full bg-grid-border rounded-full h-2 mt-2">
              <div
                className="bg-neon-purple h-2 rounded-full"
                style={{
                  width: `${Math.round((currentPathIndex / solutionPath.length) * 100)}%`,
                  boxShadow: '0 0 8px var(--neon-purple)'
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsDisplay;