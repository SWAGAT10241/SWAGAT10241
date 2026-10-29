/**
 * @fileoverview Safe LocalStorage Wrapper with Error Handling & Fallback
 */
import { logger } from './logger.js';

export const storage = {
  /**
   * @template T
   * @param {string} key
   * @param {T} defaultValue
   * @returns {T}
   */
  get(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      logger.warn(`Failed to read from localStorage key "${key}":`, err);
      return defaultValue;
    }
  },

  /**
   * @param {string} key
   * @param {any} value
   * @returns {boolean}
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      logger.error(`Failed to write to localStorage key "${key}":`, err);
      return false;
    }
  },

  /**
   * @param {string} key
   * @returns {boolean}
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      logger.error(`Failed to remove localStorage key "${key}":`, err);
      return false;
    }
  },
};

