/**
 * @fileoverview Player Profile & Achievements API Service
 */
import { storage } from '../../utils/storage.js';

const STORAGE_KEY_PROFILE = 'swagat_cyberpulse_profile';

const DEFAULT_PROFILE = {
  username: 'SWAGAT10241',
  level: 99,
  title: 'Simulation Vanguard',
  trophies: {
    platinum: 1,
    gold: 14,
    silver: 28,
    bronze: 52,
  },
  unlockedTrophies: ['combat_online'],
};

export const profileService = {
  /**
   * Fetches the current player profile
   * @returns {Promise<typeof DEFAULT_PROFILE>}
   */
  async getProfile() {
    const cached = storage.get(STORAGE_KEY_PROFILE, DEFAULT_PROFILE);
    return cached;
  },

  /**
   * Unlocks an achievement / trophy for the player
   * @param {string} trophyId
   * @returns {Promise<boolean>} True if newly unlocked
   */
  async unlockTrophy(trophyId) {
    const profile = await this.getProfile();
    if (!profile.unlockedTrophies.includes(trophyId)) {
      profile.unlockedTrophies.push(trophyId);
      profile.trophies.gold += 1;
      storage.set(STORAGE_KEY_PROFILE, profile);
      return true;
    }
    return false;
  },
};

