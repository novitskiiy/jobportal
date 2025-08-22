import axios from 'axios';

export interface EmployerLeaderboard {
  employerId: string;
  employerName: string;
  companyName: string;
  jobCount: number;
  rank: number;
  avatar: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const LeaderboardService = {
  /**
   * Получает топ работодателей по количеству вакансий
   * @param limit количество записей для возврата
   * @returns Promise с данными leaderboard
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
   * Получает позицию работодателя в рейтинге
   * @param employerId ID работодателя
   * @returns Promise с позицией в рейтинге
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
