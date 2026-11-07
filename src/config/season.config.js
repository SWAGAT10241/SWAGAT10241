/**
 * @fileoverview Seasonal Themes & Particle Configuration
 */

export const SEASONS = Object.freeze({
  AUTO: 'auto',
  WINTER: 'winter',
  AUTUMN: 'autumn',
  RAIN: 'rain',
  SPRING: 'spring',
  SUMMER: 'summer',
  WAVES: 'waves',
});

export const SEASON_PRESETS = Object.freeze({
  [SEASONS.WINTER]: {
    id: SEASONS.WINTER,
    label: 'Winter Frost',
    icon: '❄️',
    description: 'Drifting snowflakes, crystalline frost, and glacial blue light ribbons',
    tag: 'Snow Fall',
    waveColors: [
      'rgba(0, 180, 255, 0.2)',
      'rgba(140, 220, 255, 0.25)',
      'rgba(200, 240, 255, 0.3)',
      'rgba(240, 250, 255, 0.35)',
    ],
  },
  [SEASONS.AUTUMN]: {
    id: SEASONS.AUTUMN,
    label: 'Autumn Foliage',
    icon: '🍂',
    description: 'Tumbling golden amber and crimson leaves drifting on autumn breezes',
    tag: 'Leaf Fall',
    waveColors: [
      'rgba(255, 87, 34, 0.18)',
      'rgba(255, 152, 0, 0.22)',
      'rgba(255, 193, 7, 0.26)',
      'rgba(255, 112, 67, 0.3)',
    ],
  },
  [SEASONS.RAIN]: {
    id: SEASONS.RAIN,
    label: 'Neon Rainfall',
    icon: '🌧️',
    description: 'Fast cybernetic rain downpours with water surface ripple splashes',
    tag: 'Water Drops',
    waveColors: [
      'rgba(0, 119, 182, 0.22)',
      'rgba(0, 150, 199, 0.25)',
      'rgba(0, 180, 216, 0.28)',
      'rgba(72, 202, 228, 0.32)',
    ],
  },
  [SEASONS.SPRING]: {
    id: SEASONS.SPRING,
    label: 'Spring Sakura',
    icon: '🌸',
    description: 'Gracefully swaying cherry blossom sakura petals in twilight air',
    tag: 'Petal Fall',
    waveColors: [
      'rgba(255, 112, 166, 0.2)',
      'rgba(247, 37, 133, 0.22)',
      'rgba(181, 23, 158, 0.25)',
      'rgba(114, 9, 183, 0.28)',
    ],
  },
  [SEASONS.SUMMER]: {
    id: SEASONS.SUMMER,
    label: 'Cyber Summer',
    icon: '☀️',
    description: 'Warm solar ambient glow with floating bioluminescent fireflies',
    tag: 'Fireflies',
    waveColors: [
      'rgba(255, 183, 3, 0.18)',
      'rgba(251, 133, 0, 0.22)',
      'rgba(0, 114, 206, 0.25)',
      'rgba(33, 158, 188, 0.28)',
    ],
  },
  [SEASONS.WAVES]: {
    id: SEASONS.WAVES,
    label: 'PlayStation Classic',
    icon: '🌊',
    description: 'Pure iconic PlayStation OS dynamic light ribbons without weather',
    tag: 'Classic Waves',
    waveColors: [
      'rgba(0, 110, 255, 0.15)',
      'rgba(0, 145, 255, 0.22)',
      'rgba(0, 180, 255, 0.28)',
      'rgba(0, 220, 255, 0.35)',
    ],
  },
});

/**
 * Resolves the active season ID based on user preference or real-world calendar
 * @param {string} preference 'auto' | 'winter' | 'autumn' | 'rain' | 'spring' | 'summer' | 'waves'
 * @returns {string} Effective season ID
 */
export function resolveActiveSeason(preference = SEASONS.AUTO) {
  if (preference && preference !== SEASONS.AUTO && SEASON_PRESETS[preference]) {
    return preference;
  }

  // Auto-detect based on current calendar month (0 = January, 11 = December)
  const currentMonth = new Date().getMonth();

  if (currentMonth === 11 || currentMonth === 0 || currentMonth === 1) {
    return SEASONS.WINTER;
  }
  if (currentMonth >= 2 && currentMonth <= 4) {
    return SEASONS.SPRING;
  }
  if (currentMonth >= 5 && currentMonth <= 7) {
    return SEASONS.SUMMER;
  }
  // September (8), October (9), November (10)
  return SEASONS.AUTUMN;
}
