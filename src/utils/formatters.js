/**
 * @fileoverview Data formatting helpers
 */

/**
 * Formats a score with zero-padding and thousands separator
 * @param {number} score
 * @param {number} [length=7]
 * @returns {string}
 */
export function formatScore(score = 0, length = 7) {
  const safeScore = Math.max(0, Math.floor(score));
  return safeScore.toLocaleString('en-US').padStart(length, '0');
}

/**
 * Formats seconds into mm:ss display
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatTime(totalSeconds = 0) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

