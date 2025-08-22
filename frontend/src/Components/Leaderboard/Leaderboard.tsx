import React, { useState, useEffect } from 'react';
import { LeaderboardService, EmployerLeaderboard } from '../../Services/LeaderboardService';
import LeaderboardCard from './LeaderboardCard';

const Leaderboard: React.FC = () => {
  const [employers, setEmployers] = useState<EmployerLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState(10);

  useEffect(() => {
    fetchTopEmployers();
  }, []);

  const fetchTopEmployers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await LeaderboardService.getTopEmployers(limit);
      setEmployers(data);
    } catch (err) {
      setError('Failed to load leaderboard data');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏆 Top Employers Leaderboard
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover the most active employers with the highest number of job postings
          </p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {employers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No employers found</h3>
              <p className="text-gray-600">There are no employers with active job postings yet.</p>
            </div>
          ) : (
            employers.map((employer, index) => (
              <div key={employer.employerId} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <LeaderboardCard employer={employer} />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Leaderboard updates automatically based on active job postings</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
