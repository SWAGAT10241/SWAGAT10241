/**
 * @fileoverview Player Interceptor Vessel Entity
 */
import { GAME_CONFIG } from '../../config/game.config.js';

export class PlayerShip {
  constructor(canvasWidth, canvasHeight) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight - 110;
    this.speed = GAME_CONFIG.PLAYER.INITIAL_SPEED;
    this.parryTimer = 0;
    this.fireCooldown = 0;
    this.hp = GAME_CONFIG.PLAYER.MAX_HEALTH;
    this.maxHp = GAME_CONFIG.PLAYER.MAX_HEALTH;
  }

  reset(canvasWidth, canvasHeight) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight - 110;
    this.parryTimer = 0;
    this.fireCooldown = 0;
    this.hp = this.maxHp;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveRight() {
    this.x += this.speed;
  }

  /**
   * Smoothly track towards cursor / pointer target X coordinate
   * @param {number} targetX Target coordinate
   * @param {number} [smoothing=0.22] Interpolation factor
   */
  trackTargetX(targetX, smoothing = 0.22) {
    const dx = targetX - this.x;
    if (Math.abs(dx) > 1) {
      const step = dx * smoothing;
      const maxSpeed = this.speed * 2.2;
      this.x += Math.max(-maxSpeed, Math.min(maxSpeed, step));
    }
  }

  clampBounds(canvasWidth) {
    const margin = 35;
    this.x = Math.max(margin, Math.min(canvasWidth - margin, this.x));
  }

  triggerParry() {
    if (this.parryTimer <= 0) {
      this.parryTimer = GAME_CONFIG.PLAYER.PARRY_DURATION_FRAMES;
      return true;
    }
    return false;
  }

  update() {
    if (this.parryTimer > 0) {
      this.parryTimer--;
    }
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Thruster glow
    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-6, 12);
    ctx.lineTo(0, 24 + Math.random() * 8);
    ctx.lineTo(6, 12);
    ctx.closePath();
    ctx.fill();

    // Ship Hull
    ctx.fillStyle = GAME_CONFIG.PLAYER.COLOR;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(16, 14);
    ctx.lineTo(0, 8);
    ctx.lineTo(-16, 14);
    ctx.closePath();
    ctx.fill();

    // Parry Energy Barrier
    if (this.parryTimer > 0) {
      const alpha = this.parryTimer / GAME_CONFIG.PLAYER.PARRY_DURATION_FRAMES;
      ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
      ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.25})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}

