/**
 * @fileoverview Central Game Configuration & Constants
 * Contains all gameplay tuning parameters, physics limits, and visuals.
 */

export const GAME_CONFIG = Object.freeze({
  CANVAS: {
    TARGET_FPS: 60,
    CLEAR_COLOR: '#020716',
  },
  PLAYER: {
    INITIAL_SPEED: 8.5,
    MAX_HEALTH: 100,
    PARRY_DURATION_FRAMES: 22,
    FIRE_COOLDOWN_FRAMES: 6,
    HITBOX_RADIUS: 18,
    COLOR: '#00f0ff',
    PARRY_COLOR: '#00ffff',
  },
  BOSS: {
    INITIAL_HP: 5000,
    MAX_HP: 5000,
    FIRE_INTERVAL_FRAMES: 40,
    BASE_WIDTH: 240,
    BASE_HEIGHT: 80,
    HITBOX_WIDTH: 180,
    HITBOX_HEIGHT: 60,
    SPEED_MULTIPLIER: 0.025,
    COLOR: '#102244',
    BORDER_COLOR: '#00f0ff',
    CORE_COLOR: '#00ffcc',
    HP_BAR_COLOR: '#ff2b56',
  },
  WEAPONS: {
    PLAYER_LASER_SPEED: 16,
    PLAYER_LASER_DAMAGE: 90,
    PLAYER_LASER_COLOR: '#00ffff',
    PARRY_RETURN_DAMAGE: 400,
    ENEMY_BULLET_SPEED_Y: 5,
    ENEMY_BULLET_SPEED_X_SPREAD: 1.5,
    ENEMY_BULLET_COLOR: '#ff3b56',
    ENEMY_BULLET_RADIUS: 5,
  },
  SCORING: {
    HIT_BOSS_POINTS: 90,
    PARRY_REFLECT_POINTS: 500,
    BOSS_DEFEAT_POINTS: 5000,
  },
  ACHIEVEMENTS: {
    COMBAT_STARTED: {
      id: 'combat_online',
      title: 'Combat Loop Online',
      desc: 'Engage enemy vessel in active combat zone',
      rarity: 'Common',
    },
    FIRST_PARRY: {
      id: 'shield_master',
      title: 'Phase Deflection Matrix',
      desc: 'Successfully parry incoming enemy ordnance',
      rarity: 'Rare',
    },
    BOSS_DEFEATED: {
      id: 'void_breaker',
      title: 'Master of the Simulation',
      desc: 'Neutralize the Omega Dreadnought in Stage 07',
      rarity: 'Platinum 0.1%',
    },
  },
});

