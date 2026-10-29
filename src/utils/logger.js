/**
 * @fileoverview Environment-aware Logger Utility
 */
import { ENV } from '../config/env.js';

export const logger = {
  debug(...args) {
    if (ENV.DEBUG_MODE || ENV.IS_DEV) {
      console.debug('[DEBUG]', ...args);
    }
  },
  info(...args) {
    console.info('[INFO]', ...args);
  },
  warn(...args) {
    console.warn('[WARN]', ...args);
  },
  error(...args) {
    console.error('[ERROR]', ...args);
  },
};

