/**
 * @fileoverview Scalable API Endpoints Dictionary
 */

export const API_ENDPOINTS = Object.freeze({
  LEADERBOARD: {
    GET_SCORES: '/leaderboard',
    SUBMIT_SCORE: '/leaderboard/submit',
  },
  PROFILE: {
    GET_PROFILE: '/profile/me',
    UPDATE_ACHIEVEMENTS: '/profile/achievements',
  },
  TELEMETRY: {
    LOG_EVENT: '/telemetry/events',
  },
});

