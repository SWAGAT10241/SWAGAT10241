/**
 * @fileoverview Decoupled 2D Game Loop Engine
 * Independent of React DOM, cleanly emitting game state changes via callbacks.
 */
import { PlayerShip } from '../entities/PlayerShip.js';
import { BossDreadnought } from '../entities/BossDreadnought.js';
import { PlayerLaser, EnemyBullet } from '../entities/Projectile.js';
import { ParticleSystem } from './ParticleSystem.js';
import { CollisionSystem } from './CollisionSystem.js';
import { audioEngine } from '../audio/AudioEngine.js';
import { triggerHaptics } from '../audio/haptics.js';
import { GAME_CONFIG } from '../../config/game.config.js';
import { logger } from '../../utils/logger.js';

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) {
      throw new Error('Failed to acquire 2D Canvas rendering context');
    }

    this.ship = new PlayerShip(this.canvas.width, this.canvas.height);
    this.boss = new BossDreadnought(this.canvas.width);
    this.particles = new ParticleSystem();

    this.lasers = [];
    this.enemyBullets = [];
    this.score = 0;
    this.isRunning = false;
    this.rafId = 0;
    this.currentCursor = { x: null, y: null, active: false };

    // Performance metrics
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;
    this.fpsTimer = performance.now();

    // Event hooks
    this.callbacks = {
      onScoreChange: null,
      onBossHpChange: null,
      onPlayerHpChange: null,
      onFpsChange: null,
      onTrophy: null,
      onGameOver: null,
    };

    this.loop = this.loop.bind(this);
  }

  setCallbacks(cbs) {
    this.callbacks = { ...this.callbacks, ...cbs };
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ship.clampBounds(width);
  }

  start() {
    this.isRunning = true;
    this.score = 0;
    this.lasers = [];
    this.enemyBullets = [];
    this.particles.clear();

    this.ship.reset(this.canvas.width, this.canvas.height);
    this.boss.reset(this.canvas.width);

    audioEngine.bootChime();
    this.emitEvent('onScoreChange', this.score);
    this.emitEvent('onBossHpChange', { current: this.boss.hp, max: this.boss.maxHp });
    this.emitEvent('onPlayerHpChange', { current: this.ship.hp, max: this.ship.maxHp });

    this.lastFrameTime = performance.now();
    this.fpsTimer = performance.now();
    this.frameCount = 0;

    this.rafId = requestAnimationFrame(this.loop);
    logger.info('GameEngine started successfully');
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    logger.info('GameEngine stopped');
  }

  emitEvent(name, payload) {
    if (typeof this.callbacks[name] === 'function') {
      try {
        this.callbacks[name](payload);
      } catch (err) {
        logger.error(`Error in GameEngine callback "${name}":`, err);
      }
    }
  }

  triggerParry() {
    if (!this.isRunning) return;
    if (this.ship.triggerParry()) {
      audioEngine.parry();
      triggerHaptics(120, 0.4, 0.9);
      this.particles.emit(this.ship.x, this.ship.y, 16, '#00ffff');
    }
  }

  update(inputKeys, cursor = null) {
    this.currentCursor = cursor;

    // Cursor Movement Control
    if (cursor && cursor.active && typeof cursor.x === 'number') {
      this.ship.trackTargetX(cursor.x);
    }

    // Keyboard / Gamepad Movement
    if (inputKeys.left) this.ship.moveLeft();
    if (inputKeys.right) this.ship.moveRight();
    this.ship.clampBounds(this.canvas.width);
    this.ship.update();

    // Player Shooting
    if (inputKeys.fire && this.ship.fireCooldown <= 0) {
      this.ship.fireCooldown = GAME_CONFIG.PLAYER.FIRE_COOLDOWN_FRAMES;
      audioEngine.laser();
      triggerHaptics(50, 0.2, 0.2);

      this.lasers.push(new PlayerLaser(this.ship.x - 14, this.ship.y - 15));
      this.lasers.push(new PlayerLaser(this.ship.x + 14, this.ship.y - 15));
    }

    // Boss Updating & Spawning Attacks
    this.boss.update(this.canvas.width);
    if (this.boss.shouldFire()) {
      for (let i = -2; i <= 2; i++) {
        const vx = i * GAME_CONFIG.WEAPONS.ENEMY_BULLET_SPEED_X_SPREAD;
        const vy = GAME_CONFIG.WEAPONS.ENEMY_BULLET_SPEED_Y;
        this.enemyBullets.push(new EnemyBullet(this.boss.x + i * 25, this.boss.y + 40, vx, vy));
      }
    }

    // Update Lasers & Check Collisions with Boss
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];
      laser.update();

      if (CollisionSystem.checkLaserBoss(laser, this.boss)) {
        this.lasers.splice(i, 1);
        this.boss.hp = Math.max(0, this.boss.hp - GAME_CONFIG.WEAPONS.PLAYER_LASER_DAMAGE);
        this.score += GAME_CONFIG.SCORING.HIT_BOSS_POINTS;

        audioEngine.hit();
        this.particles.emit(laser.x, laser.y, 6, '#00ffcc');
        this.emitEvent('onScoreChange', this.score);
        this.emitEvent('onBossHpChange', { current: this.boss.hp, max: this.boss.maxHp });

        if (this.boss.hp <= 0) {
          this.score += GAME_CONFIG.SCORING.BOSS_DEFEAT_POINTS;
          this.emitEvent('onScoreChange', this.score);
          this.emitEvent('onTrophy', GAME_CONFIG.ACHIEVEMENTS.BOSS_DEFEATED.title);
          this.particles.emit(this.boss.x, this.boss.y, 45, '#ffd700');
          this.boss.reset(this.canvas.width);
          this.emitEvent('onBossHpChange', { current: this.boss.hp, max: this.boss.maxHp });
        }
      } else if (laser.dead) {
        this.lasers.splice(i, 1);
      }
    }

    // Update Enemy Bullets & Check Collisions with Ship
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = this.enemyBullets[i];
      bullet.update(this.canvas.height);

      if (CollisionSystem.checkBulletShip(bullet, this.ship)) {
        this.enemyBullets.splice(i, 1);

        if (this.ship.parryTimer > 0) {
          // Successfully parried
          audioEngine.parry();
          triggerHaptics(180, 0.6, 1.0);
          this.particles.emit(bullet.x, bullet.y, 20, '#00ffff');

          this.boss.hp = Math.max(0, this.boss.hp - GAME_CONFIG.WEAPONS.PARRY_RETURN_DAMAGE);
          this.score += GAME_CONFIG.SCORING.PARRY_REFLECT_POINTS;

          this.emitEvent('onScoreChange', this.score);
          this.emitEvent('onBossHpChange', { current: this.boss.hp, max: this.boss.maxHp });
          this.emitEvent('onTrophy', GAME_CONFIG.ACHIEVEMENTS.FIRST_PARRY.title);
        } else {
          // Player hit
          triggerHaptics(250, 0.9, 0.9);
          this.ship.hp = Math.max(0, this.ship.hp - 10);
          this.particles.emit(this.ship.x, this.ship.y, 14, '#ff3b56');
          this.emitEvent('onPlayerHpChange', { current: this.ship.hp, max: this.ship.maxHp });

          if (this.ship.hp <= 0) {
            this.emitEvent('onGameOver', { score: this.score, victory: false });
            this.stop();
            return;
          }
        }
      } else if (bullet.dead) {
        this.enemyBullets.splice(i, 1);
      }
    }

    // Particles update
    this.particles.update();
  }

  render() {
    // Clear Background
    this.ctx.fillStyle = GAME_CONFIG.CANVAS.CLEAR_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Boss
    this.boss.draw(this.ctx, this.canvas.width);

    // Draw Ship
    this.ship.draw(this.ctx);

    // Draw Lasers
    for (const laser of this.lasers) {
      laser.draw(this.ctx);
    }

    // Draw Enemy Bullets
    for (const bullet of this.enemyBullets) {
      bullet.draw(this.ctx);
    }

    // Draw Particles
    this.particles.draw(this.ctx);

    // Draw In-Game Crosshair Reticle for Cursor
    if (this.currentCursor && this.currentCursor.active && typeof this.currentCursor.x === 'number') {
      this.drawCrosshair(this.currentCursor.x, this.currentCursor.y);
    }
  }

  drawCrosshair(x, y) {
    this.ctx.save();
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 1.5;
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.shadowBlur = 8;

    // Reticle circle
    this.ctx.beginPath();
    this.ctx.arc(x, y, 14, 0, Math.PI * 2);
    this.ctx.stroke();

    // 4 crosshair ticks
    this.ctx.beginPath();
    this.ctx.moveTo(x - 20, y);
    this.ctx.lineTo(x - 14, y);
    this.ctx.moveTo(x + 14, y);
    this.ctx.lineTo(x + 20, y);
    this.ctx.moveTo(x, y - 20);
    this.ctx.lineTo(x, y - 14);
    this.ctx.moveTo(x, y + 14);
    this.ctx.lineTo(x, y + 20);
    this.ctx.stroke();

    // Center lock dot
    this.ctx.fillStyle = '#00ffff';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  calculateFps(now) {
    this.frameCount++;
    if (now - this.fpsTimer >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.fpsTimer));
      this.frameCount = 0;
      this.fpsTimer = now;
      this.emitEvent('onFpsChange', this.fps);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    this.calculateFps(timestamp);
    this.render();

    this.rafId = requestAnimationFrame(this.loop);
  }
}

