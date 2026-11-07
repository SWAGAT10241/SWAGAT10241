/**
 * @fileoverview High-Performance Canvas 2D Seasonal Weather & Particle Simulation
 * Pure ES6 simulation engine supporting Snowfall, Falling Autumn Leaves, Raindrops & Ripples,
 * Sakura Petals, and Cyber Fireflies.
 */
import { SEASONS } from '../../config/season.config.js';

export class SeasonalParticles {
  constructor(canvasWidth, canvasHeight, season = SEASONS.WINTER) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.season = season;
    this.particles = [];
    this.ripples = [];
    this.wind = 0;
    this.windTarget = 0;
    this.windTimer = 0;

    this.initPool();
  }

  setSeason(newSeason) {
    if (this.season === newSeason) return;
    this.season = newSeason;
    this.particles = [];
    this.ripples = [];
    this.initPool();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    // Re-seed particle positions within new dimensions
    for (const p of this.particles) {
      if (p.x > width) p.x = Math.random() * width;
      if (p.y > height) p.y = Math.random() * height;
    }
  }

  initPool() {
    this.particles = [];
    this.ripples = [];

    switch (this.season) {
      case SEASONS.WINTER:
        this.createSnowPool(80);
        break;
      case SEASONS.AUTUMN:
        this.createAutumnPool(42);
        break;
      case SEASONS.RAIN:
        this.createRainPool(90);
        break;
      case SEASONS.SPRING:
        this.createSakuraPool(48);
        break;
      case SEASONS.SUMMER:
        this.createSummerPool(40);
        break;
      case SEASONS.WAVES:
      default:
        // No weather particles in waves mode
        break;
    }
  }

  /* ==========================================================================
     1. WINTER: Snowfall Simulation
     ========================================================================== */
  createSnowPool(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.8 + 1,
        speedY: Math.random() * 1.5 + 0.8,
        speedX: Math.random() * 0.6 - 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.015,
        alpha: Math.random() * 0.5 + 0.4,
        isCrystal: Math.random() > 0.85, // 15% crystal snowflakes
      });
    }
  }

  updateSnow() {
    this.windTimer++;
    if (this.windTimer > 180) {
      this.windTarget = (Math.random() - 0.45) * 1.2;
      this.windTimer = 0;
    }
    this.wind += (this.windTarget - this.wind) * 0.02;

    for (const p of this.particles) {
      p.wobble += p.wobbleSpeed;
      p.y += p.speedY;
      p.x += Math.sin(p.wobble) * 0.8 + this.wind;

      if (p.y > this.height + 10) {
        p.y = -10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      else if (p.x > this.width + 10) p.x = -10;
    }
  }

  drawSnow(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;

      if (p.isCrystal && p.radius > 2) {
        // Draw 6-point crystal snowflake
        ctx.strokeStyle = '#e0f4ff';
        ctx.lineWidth = 1.2;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.wobble);
        for (let branch = 0; branch < 3; branch++) {
          ctx.beginPath();
          ctx.moveTo(-p.radius * 2, 0);
          ctx.lineTo(p.radius * 2, 0);
          ctx.stroke();
          ctx.rotate(Math.PI / 3);
        }
      } else {
        // Soft round snowflake with ice-blue halo
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  /* ==========================================================================
     2. AUTUMN: Falling Leaves Simulation
     ========================================================================== */
  createAutumnPool(count) {
    const leafPalettes = [
      '#d84315', // Deep Maple Crimson
      '#ff8f00', // Amber Gold
      '#ef6c00', // Burnt Orange
      '#c25920', // Rust Scarlet
      '#8d6e63', // Warm Bark Brown
      '#ffd54f', // Radiant Autumn Yellow
    ];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 10 + 10,
        speedY: Math.random() * 1.6 + 1.0,
        speedX: Math.random() * 1.2 + 0.6,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.04,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: Math.random() * 0.04 + 0.02,
        color: leafPalettes[Math.floor(Math.random() * leafPalettes.length)],
        alpha: Math.random() * 0.4 + 0.6,
        type: Math.random() > 0.5 ? 'maple' : 'oak',
      });
    }
  }

  updateAutumn() {
    this.windTimer++;
    if (this.windTimer > 150) {
      this.windTarget = Math.random() * 1.5 + 0.5; // Natural left-to-right autumn wind
      this.windTimer = 0;
    }
    this.wind += (this.windTarget - this.wind) * 0.03;

    for (const p of this.particles) {
      p.angle += p.angularSpeed;
      p.tilt += p.tiltSpeed;
      p.y += p.speedY + Math.sin(p.tilt) * 0.4;
      p.x += Math.sin(p.angle) * 1.2 + this.wind;

      if (p.y > this.height + 25) {
        p.y = -25;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width + 30) p.x = -30;
    }
  }

  drawAutumn(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      // 3D tumbling effect via horizontal scale
      ctx.scale(Math.cos(p.tilt), 1);

      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;

      if (p.type === 'maple') {
        // Pointed maple leaf path
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size * 0.7, -p.size * 0.3, p.size * 0.9, 0);
        ctx.quadraticCurveTo(p.size * 0.6, p.size * 0.4, 0, p.size * 0.8);
        ctx.quadraticCurveTo(-p.size * 0.6, p.size * 0.4, -p.size * 0.9, 0);
        ctx.quadraticCurveTo(-p.size * 0.7, -p.size * 0.3, 0, -p.size);
        ctx.closePath();
        ctx.fill();

        // Leaf stem vein
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.8);
        ctx.lineTo(0, p.size * 0.9);
        ctx.stroke();
      } else {
        // Rounded oak leaf path
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.75);
        ctx.lineTo(0, p.size * 0.8);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  /* ==========================================================================
     3. RAIN: Water Droplets & Splash Ripples Simulation
     ========================================================================== */
  createRainPool(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * (this.width + 100),
        y: Math.random() * this.height,
        length: Math.random() * 16 + 14,
        speedY: Math.random() * 8 + 14,
        speedX: -2.2, // Realistic slant
        alpha: Math.random() * 0.4 + 0.3,
        thickness: Math.random() > 0.8 ? 1.6 : 1.0,
      });
    }
  }

  createSplash(x, y) {
    if (this.ripples.length > 25) return;
    this.ripples.push({
      x,
      y,
      radius: 2,
      maxRadius: Math.random() * 16 + 10,
      alpha: 0.6,
      decay: 0.03,
    });
  }

  updateRain() {
    for (const p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      // When hitting bottom 40px or ground level, chance of splash ripple
      if (p.y > this.height - 35) {
        if (Math.random() > 0.65) {
          this.createSplash(p.x, this.height - Math.random() * 25);
        }
      }

      if (p.y > this.height + 20) {
        p.y = -20;
        p.x = Math.random() * (this.width + 150);
      }
    }

    // Update ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += 1.2;
      r.alpha -= r.decay;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }
  }

  drawRain(ctx) {
    // Draw raindrops
    ctx.strokeStyle = '#00f0ff';
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.lineWidth = p.thickness;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.speedX * 1.5, p.y + p.length);
      ctx.stroke();
      ctx.restore();
    }

    // Draw ripples
    for (const r of this.ripples) {
      ctx.save();
      ctx.globalAlpha = r.alpha;
      ctx.strokeStyle = '#48cae4';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // Oval ripple perspective
      ctx.ellipse(r.x, r.y, r.radius * 1.8, r.radius * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ==========================================================================
     4. SPRING: Sakura Blossom Petals Simulation
     ========================================================================== */
  createSakuraPool(count) {
    const sakuraColors = ['#ffccd5', '#ffb7c5', '#ffaec9', '#ff9ebb', '#f72585'];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 6 + 7,
        speedY: Math.random() * 1.2 + 0.8,
        speedX: Math.random() * 0.8 + 0.4,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: Math.random() * 0.03 + 0.015,
        color: sakuraColors[Math.floor(Math.random() * sakuraColors.length)],
        alpha: Math.random() * 0.4 + 0.5,
      });
    }
  }

  updateSakura() {
    for (const p of this.particles) {
      p.angle += p.angularSpeed;
      p.flip += p.flipSpeed;
      p.y += p.speedY;
      p.x += Math.sin(p.flip) * 1.4 + p.speedX;

      if (p.y > this.height + 15) {
        p.y = -15;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width + 20) p.x = -20;
    }
  }

  drawSakura(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(Math.cos(p.flip), 1);

      ctx.fillStyle = p.color;
      ctx.shadowColor = '#ff70a6';
      ctx.shadowBlur = 5;

      // Heart-notched sakura petal shape
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.8, p.size * 0.7, p.size * 0.3, 0, p.size * 0.9);
      ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.3, -p.size * 0.6, -p.size * 0.8, 0, -p.size);
      ctx.fill();

      ctx.restore();
    }
  }

  /* ==========================================================================
     5. SUMMER: Cyber Fireflies & Solar Dust Simulation
     ========================================================================== */
  createSummerPool(count) {
    const glowColors = ['#ffe066', '#00f0ff', '#70e000', '#ffd166', '#4cc9f0'];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.2 + 1.4,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.2, // Gentle upward tendency
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        color: glowColors[Math.floor(Math.random() * glowColors.length)],
        baseAlpha: Math.random() * 0.4 + 0.5,
      });
    }
  }

  updateSummer() {
    for (const p of this.particles) {
      p.pulse += p.pulseSpeed;
      p.x += p.vx + Math.sin(p.pulse) * 0.5;
      p.y += p.vy + Math.cos(p.pulse) * 0.3;

      if (p.x < -10) p.x = this.width + 10;
      else if (p.x > this.width + 10) p.x = -10;

      if (p.y < -10) p.y = this.height + 10;
      else if (p.y > this.height + 10) p.y = -10;
    }
  }

  drawSummer(ctx) {
    for (const p of this.particles) {
      const currentAlpha = Math.max(0.1, p.baseAlpha + Math.sin(p.pulse) * 0.3);
      ctx.save();
      ctx.globalAlpha = currentAlpha;

      // Radial glowing firefly core
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer soft aura
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = currentAlpha * 0.25;
      ctx.fill();

      ctx.restore();
    }
  }

  /* ==========================================================================
     Master Update & Render
     ========================================================================== */
  update() {
    switch (this.season) {
      case SEASONS.WINTER:
        this.updateSnow();
        break;
      case SEASONS.AUTUMN:
        this.updateAutumn();
        break;
      case SEASONS.RAIN:
        this.updateRain();
        break;
      case SEASONS.SPRING:
        this.updateSakura();
        break;
      case SEASONS.SUMMER:
        this.updateSummer();
        break;
      case SEASONS.WAVES:
      default:
        break;
    }
  }

  draw(ctx) {
    switch (this.season) {
      case SEASONS.WINTER:
        this.drawSnow(ctx);
        break;
      case SEASONS.AUTUMN:
        this.drawAutumn(ctx);
        break;
      case SEASONS.RAIN:
        this.drawRain(ctx);
        break;
      case SEASONS.SPRING:
        this.drawSakura(ctx);
        break;
      case SEASONS.SUMMER:
        this.drawSummer(ctx);
        break;
      case SEASONS.WAVES:
      default:
        break;
    }
  }
}
