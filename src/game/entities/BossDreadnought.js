/**
 * @fileoverview Omega Dreadnought Boss Entity
 */
import { GAME_CONFIG } from '../../config/game.config.js';

export class BossDreadnought {
  constructor(canvasWidth) {
    this.x = canvasWidth / 2;
    this.y = 120;
    this.hp = GAME_CONFIG.BOSS.INITIAL_HP;
    this.maxHp = GAME_CONFIG.BOSS.MAX_HP;
    this.angle = 0;
    this.fireTimer = 0;
  }

  reset(canvasWidth) {
    this.x = canvasWidth / 2;
    this.y = 120;
    this.hp = this.maxHp;
    this.angle = 0;
    this.fireTimer = 0;
  }

  update(canvasWidth) {
    this.angle += GAME_CONFIG.BOSS.SPEED_MULTIPLIER;
    this.x = canvasWidth / 2 + Math.sin(this.angle) * (canvasWidth * 0.28);
    this.fireTimer++;
  }

  shouldFire() {
    if (this.fireTimer >= GAME_CONFIG.BOSS.FIRE_INTERVAL_FRAMES) {
      this.fireTimer = 0;
      return true;
    }
    return false;
  }

  draw(ctx, canvasWidth) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Dreadnought Main Chassis
    ctx.fillStyle = GAME_CONFIG.BOSS.COLOR;
    ctx.strokeStyle = GAME_CONFIG.BOSS.BORDER_COLOR;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(95, 0);
    ctx.lineTo(130, 26);
    ctx.lineTo(0, 48);
    ctx.lineTo(-130, 26);
    ctx.lineTo(-95, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing Core
    ctx.fillStyle = GAME_CONFIG.BOSS.CORE_COLOR;
    ctx.shadowColor = GAME_CONFIG.BOSS.CORE_COLOR;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 10, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();

    // Boss Boss HP Bar
    this.drawHealthBar(ctx, canvasWidth);
  }

  drawHealthBar(ctx, canvasWidth) {
    const barWidth = Math.min(540, canvasWidth - 60);
    const barX = (canvasWidth - barWidth) / 2;
    const barY = 62;

    // Track Border
    ctx.strokeStyle = '#0070d1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(barX, barY, barWidth, 10);

    // Fill Track Background
    ctx.fillStyle = 'rgba(2, 8, 22, 0.7)';
    ctx.fillRect(barX, barY, barWidth, 10);

    // Filled Health Bar
    const healthPercent = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = GAME_CONFIG.BOSS.HP_BAR_COLOR;
    ctx.fillRect(barX + 1, barY + 1, (barWidth - 2) * healthPercent, 8);
  }
}

