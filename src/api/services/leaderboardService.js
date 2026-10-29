/**
 * @fileoverview Leaderboard API Service
 * Manages player rankings and high-score submissions with offline resilience.
 */
import { apiClient } from '../client.js';
import { API_ENDPOINTS } from '../endpoints.js';
import { ENV } from '../../config/env.js';
import { storage } from '../../utils/storage.js';
import { logger } from '../../utils/logger.js';

const STORAGE_KEY_LEADERBOARD = 'swagat_cyberpulse_leaderboard';

const DEFAULT_LEADERBOARD = [
  { rank: 1, pilot: 'SWAGAT10241', score: 124500, date: '2026-10-28', status: 'Online' },
  { rank: 2, pilot: 'GHOST_RUNNER', score: 98400, date: '2026-10-27', status: 'Offline' },
  { rank: 3, pilot: 'NEO_VANGUARD', score: 76200, date: '2026-10-26', status: 'Offline' },
  { rank: 4, pilot: 'CYBER_VALKYRIE', score: 54100, date: '2026-10-25', status: 'Offline' },
  { rank: 5, pilot: 'ZERO_COLD', score: 32000, date: '2026-10-24', status: 'Offline' },
];

export const leaderboardService = {
  /**
   * Retrieves high-score leaderboard records
   * @returns {Promise<Array<{rank: number, pilot: string, score: number, date: string, status: string}>>}
   */
  async getScores() {
    if (ENV.ENABLE_MOCK_API) {
      const stored = storage.get(STORAGE_KEY_LEADERBOARD, null);
      if (!stored) {
        storage.set(STORAGE_KEY_LEADERBOARD, DEFAULT_LEADERBOARD);
        return DEFAULT_LEADERBOARD;
      }
      return stored;
    }

    try {
      const response = await apiClient.get(API_ENDPOINTS.LEADERBOARD.GET_SCORES);
      return response.data || [];
    } catch (err) {
      logger.warn('Remote leaderboard unavailable, falling back to local storage cache', err);
      return storage.get(STORAGE_KEY_LEADERBOARD, DEFAULT_LEADERBOARD);
    }
  },

  /**
   * Submits a new player score
   * @param {string} pilot
   * @param {number} score
   * @returns {Promise<{success: boolean, rank: number}>}
   */
  async submitScore(pilot = 'SWAGAT10241', score = 0) {
    if (score <= 0) {
      return { success: false, rank: -1 };
    }

    const currentScores = await this.getScores();
    const newEntry = {
      pilot,
      score,
      date: new Date().toISOString().split('T')[0],
      status: 'Online',
    };

    const updated = [...currentScores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    storage.set(STORAGE_KEY_LEADERBOARD, updated);

    if (!ENV.ENABLE_MOCK_API) {
      try {
        await apiClient.post(API_ENDPOINTS.LEADERBOARD.SUBMIT_SCORE, { pilot, score });
      } catch (err) {
        logger.warn('Score submission to remote failed, preserved in local storage cache', err);
      }
    }

    const myRank = updated.findIndex((e) => e.pilot === pilot && e.score === score) + 1;
    return { success: true, rank: myRank };
  },
};

