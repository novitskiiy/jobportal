import React from 'react';
import { EmployerLeaderboard } from '../../Services/LeaderboardService';

interface LeaderboardCardProps {
  employer: EmployerLeaderboard;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ employer }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center space-x-4">
        {/* Rank Badge */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getRankColor(employer.rank)}`}>
          {getRankIcon(employer.rank)}
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={employer.avatar}
            alt={employer.employerName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/avatar.png';
            }}
          />
        </div>

        {/* Employer Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {employer.employerName}
          </h3>
          <div className="flex items-center mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {employer.jobCount} {employer.jobCount === 1 ? 'job' : 'jobs'} posted
            </span>
          </div>
        </div>

        {/* Job Count */}
        <div className="flex-shrink-0 text-right">
          <div className="text-2xl font-bold text-blue-600">
            {employer.jobCount}
          </div>
          <div className="text-xs text-gray-500">
            active jobs
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
