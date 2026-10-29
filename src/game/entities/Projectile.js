/**
 * @fileoverview Projectiles System: Player Lasers and Enemy Ordnance
 */
import { GAME_CONFIG } from '../../config/game.config.js';

export class PlayerLaser {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = GAME_CONFIG.WEAPONS.PLAYER_LASER_SPEED;
    this.dead = false;
  }

  update() {
    this.y -= this.speed;
    if (this.y < 30) {
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.strokeStyle = GAME_CONFIG.WEAPONS.PLAYER_LASER_COLOR;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y - 15);
    ctx.stroke();
  }
}

export class EnemyBullet {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = GAME_CONFIG.WEAPONS.ENEMY_BULLET_RADIUS;
    this.dead = false;
  }

  update(canvasHeight) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y > canvasHeight + 20) {
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.fillStyle = GAME_CONFIG.WEAPONS.ENEMY_BULLET_COLOR;
    ctx.shadowColor = GAME_CONFIG.WEAPONS.ENEMY_BULLET_COLOR;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

