import axios from 'axios';

export interface EmployerLeaderboard {
  employerId: string;
  employerName: string;
  jobCount: number;
  rank: number;
  avatar: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const LeaderboardService = {
  /**
   * Gets top employers by number of job postings
   * @param limit number of records to return
   * @returns Promise with leaderboard data
   */
  getTopEmployers: async (limit: number = 10): Promise<EmployerLeaderboard[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leaderboard/employers?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top employers:', error);
      throw error;
    }
  },

  /**
   * Gets employer's position in the ranking
   * @param employerId employer ID
   * @returns Promise with ranking position
   */
  getEmployerRank: async (employerId: string): Promise<number | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leaderboard/employers/${employerId}/rank`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employer rank:', error);
      return null;
    }
  }
};
