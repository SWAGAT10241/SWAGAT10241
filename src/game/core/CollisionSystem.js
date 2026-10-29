/**
 * @fileoverview Collision Detection & Physics System
 */
import { GAME_CONFIG } from '../../config/game.config.js';

export class CollisionSystem {
  /**
   * Check laser hit against Boss Dreadnought
   * @param {import('../entities/Projectile.js').PlayerLaser} laser
   * @param {import('../entities/BossDreadnought.js').BossDreadnought} boss
   */
  static checkLaserBoss(laser, boss) {
    const halfWidth = GAME_CONFIG.BOSS.HITBOX_WIDTH / 2;
    const halfHeight = GAME_CONFIG.BOSS.HITBOX_HEIGHT / 2;
    return (
      Math.abs(laser.x - boss.x) < halfWidth &&
      Math.abs(laser.y - boss.y) < halfHeight
    );
  }

  /**
   * Check enemy bullet hit against Player Ship
   * @param {import('../entities/Projectile.js').EnemyBullet} bullet
   * @param {import('../entities/PlayerShip.js').PlayerShip} ship
   */
  static checkBulletShip(bullet, ship) {
    const dist = Math.hypot(bullet.x - ship.x, bullet.y - ship.y);
    return dist < 32;
  }
}

