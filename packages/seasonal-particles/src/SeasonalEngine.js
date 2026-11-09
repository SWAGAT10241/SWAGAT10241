/**
 * @fileoverview SeasonalParticles Master Engine
 * Hardware-accelerated 60fps Canvas 2D simulation with interactive cursor repulsion,
 * click shockwaves, and 6-season aerodynamic botanical/crystalline physics.
 * Zero external dependencies.
 */

export const SEASONS = Object.freeze({
  AUTO: 'auto',
  WINTER: 'winter',
  SPRING: 'spring',
  SUMMER: 'summer',
  RAIN: 'rain',
  AUTUMN: 'autumn',
  PREWINTER: 'prewinter',
  WAVES: 'waves',
});

export class SeasonalParticles {
  /**
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @param {string | object} options Season name or configuration object
   */
  constructor(canvasWidth, canvasHeight, options = SEASONS.WINTER) {
    this.width = canvasWidth;
    this.height = canvasHeight;

    const config = typeof options === 'string' ? { season: options } : (options || {});
    this.season = config.season || SEASONS.WINTER;
    this.enableCursorRepulsion = config.enableCursorRepulsion !== false;
    this.enableClickShockwave = config.enableClickShockwave !== false;

    this.particles = [];
    this.ripples = [];
    this.shockwaves = [];

    // Aerodynamic Atmospheric Wind
    this.wind = 0;
    this.windTarget = 0;
    this.windTimer = 0;

    // Interactive Cursor State
    this.cursor = {
      x: -1000,
      y: -1000,
      radius: config.cursorRadius || 120,
      strength: config.cursorStrength || 4.5,
      active: false,
    };

    this.initPool();
  }

  setSeason(newSeason) {
    if (this.season === newSeason) return;
    this.season = newSeason;
    this.particles = [];
    this.ripples = [];
    this.shockwaves = [];
    this.initPool();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    for (const p of this.particles) {
      if (p.x > width) p.x = Math.random() * width;
      if (p.y > height) p.y = Math.random() * height;
    }
  }

  onMouseMove(x, y) {
    if (!this.enableCursorRepulsion) return;
    this.cursor.x = x;
    this.cursor.y = y;
    this.cursor.active = true;
  }

  onPointerLeave() {
    this.cursor.active = false;
    this.cursor.x = -1000;
    this.cursor.y = -1000;
  }

  onClick(x, y) {
    if (!this.enableClickShockwave) return;
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: 160,
      speed: 6.5,
      strength: 7.0,
      alpha: 0.65,
    });
  }

  initPool() {
    this.particles = [];
    this.ripples = [];
    this.shockwaves = [];

    switch (this.season) {
      case SEASONS.WINTER:
        this.createSnowPool(75);
        break;
      case SEASONS.AUTUMN:
        this.createAutumnPool(42);
        break;
      case SEASONS.RAIN:
        this.createRainPool(90);
        break;
      case SEASONS.SPRING:
        this.createSakuraPool(46);
        break;
      case SEASONS.SUMMER:
        this.createSummerPool(38);
        break;
      case SEASONS.PREWINTER:
        this.createPrewinterPool(46);
        break;
      case SEASONS.WAVES:
      default:
        break;
    }
  }

  /* ==========================================================================
     Physics: Interactive Repulsion & Shockwave Dispersion
     ========================================================================== */
  applyInteractiveForces(p) {
    // 1. Mouse Cursor Repulsion
    if (this.cursor.active) {
      const dx = p.x - this.cursor.x;
      const dy = p.y - this.cursor.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.cursor.radius && dist > 1) {
        const force = (1 - dist / this.cursor.radius) * this.cursor.strength;
        const normX = dx / dist;
        const normY = dy / dist;

        p.vx = (p.vx || 0) + normX * force;
        p.vy = (p.vy || 0) + normY * force;
      }
    }

    // 2. Click Shockwave Repulsion
    for (const sw of this.shockwaves) {
      const dx = p.x - sw.x;
      const dy = p.y - sw.y;
      const dist = Math.hypot(dx, dy);
      const ringDist = Math.abs(dist - sw.radius);

      if (ringDist < 30 && dist > 1) {
        const force = (1 - ringDist / 30) * sw.strength * (1 - sw.radius / sw.maxRadius);
        p.vx = (p.vx || 0) + (dx / dist) * force;
        p.vy = (p.vy || 0) + (dy / dist) * force;
      }
    }

    // Velocity decay (damping friction to avoid runaway acceleration)
    if (p.vx !== undefined) {
      p.x += p.vx;
      p.vx *= 0.91;
    }
    if (p.vy !== undefined) {
      p.y += p.vy;
      p.vy *= 0.91;
    }
  }

  updateShockwaves() {
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.alpha = (1 - sw.radius / sw.maxRadius) * 0.6;
      if (sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  /* ==========================================================================
     1. WINTER: Dendritic Fractal Snowflakes
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
        alpha: Math.random() * 0.5 + 0.45,
        isCrystal: Math.random() > 0.82,
        vx: 0,
        vy: 0,
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
      p.x += Math.sin(p.wobble) * 0.7 + this.wind + p.speedX;

      this.applyInteractiveForces(p);

      if (p.y > this.height + 15) {
        p.y = -15;
        p.x = Math.random() * this.width;
      }
      if (p.x < -20) p.x = this.width + 20;
      else if (p.x > this.width + 20) p.x = -20;
    }
  }

  drawSnow(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);

      if (p.isCrystal && p.radius > 2) {
        ctx.strokeStyle = '#e0f4ff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 1.3;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.rotate(p.wobble);

        const armLen = p.radius * 3.5;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();

        for (let b = 0; b < 6; b++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -armLen);
          ctx.moveTo(0, -armLen * 0.45);
          ctx.lineTo(-armLen * 0.3, -armLen * 0.65);
          ctx.moveTo(0, -armLen * 0.45);
          ctx.lineTo(armLen * 0.3, -armLen * 0.65);
          ctx.moveTo(0, -armLen * 0.75);
          ctx.lineTo(-armLen * 0.25, -armLen * 0.95);
          ctx.moveTo(0, -armLen * 0.75);
          ctx.lineTo(armLen * 0.25, -armLen * 0.95);
          ctx.stroke();

          ctx.rotate(Math.PI / 3);
        }
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  /* ==========================================================================
     2. AUTUMN: Botanical Sugar Maple & Oak Leaves with 3D Tumbling
     ========================================================================== */
  createAutumnPool(count) {
    const leafPalettes = [
      '#d84315', '#ff8f00', '#ef6c00', '#c25920', '#ffd54f', '#b45309',
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
        vx: 0,
        vy: 0,
      });
    }
  }

  updateAutumn() {
    this.windTimer++;
    if (this.windTimer > 150) {
      this.windTarget = Math.random() * 1.5 + 0.5;
      this.windTimer = 0;
    }
    this.wind += (this.windTarget - this.wind) * 0.03;

    for (const p of this.particles) {
      p.angle += p.angularSpeed;
      p.tilt += p.tiltSpeed;
      p.y += p.speedY + Math.sin(p.tilt) * 0.4;
      p.x += Math.sin(p.angle) * 1.2 + this.wind;

      this.applyInteractiveForces(p);

      if (p.y > this.height + 25) {
        p.y = -25;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width + 30) p.x = -30;
      if (p.x < -30) p.x = this.width + 30;
    }
  }

  drawAutumn(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(Math.cos(p.tilt), 1);

      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 5;

      const s = p.size;
      if (p.type === 'maple') {
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.1, -s * 0.8, s * 0.3, -s * 0.7, s * 0.35, -s * 0.65);
        ctx.bezierCurveTo(s * 0.45, -s * 0.5, s * 0.75, -s * 0.35, s * 0.8, -s * 0.2);
        ctx.bezierCurveTo(s * 0.7, -s * 0.05, s * 0.85, s * 0.15, s * 0.75, s * 0.3);
        ctx.bezierCurveTo(s * 0.55, s * 0.25, s * 0.5, s * 0.45, s * 0.4, s * 0.6);
        ctx.bezierCurveTo(s * 0.25, s * 0.5, s * 0.15, s * 0.65, 0, s * 0.75);
        ctx.bezierCurveTo(-s * 0.15, s * 0.65, -s * 0.25, s * 0.5, -s * 0.4, s * 0.6);
        ctx.bezierCurveTo(-s * 0.5, s * 0.45, -s * 0.55, s * 0.25, -s * 0.75, s * 0.3);
        ctx.bezierCurveTo(-s * 0.85, s * 0.15, -s * 0.7, -s * 0.05, -s * 0.8, -s * 0.2);
        ctx.bezierCurveTo(-s * 0.75, -s * 0.35, -s * 0.45, -s * 0.5, -s * 0.35, -s * 0.65);
        ctx.bezierCurveTo(-s * 0.3, -s * 0.7, -s * 0.1, -s * 0.8, 0, -s);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.95);
        ctx.lineTo(0, -s * 0.75);
        ctx.moveTo(0, s * 0.2);
        ctx.lineTo(s * 0.55, -s * 0.15);
        ctx.moveTo(0, s * 0.2);
        ctx.lineTo(-s * 0.55, -s * 0.15);
        ctx.moveTo(0, s * 0.4);
        ctx.lineTo(s * 0.3, s * 0.4);
        ctx.moveTo(0, s * 0.4);
        ctx.lineTo(-s * 0.3, s * 0.4);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.25, -s * 0.9, s * 0.45, -s * 0.75, s * 0.4, -s * 0.6);
        ctx.bezierCurveTo(s * 0.6, -s * 0.5, s * 0.6, -s * 0.25, s * 0.45, -s * 0.15);
        ctx.bezierCurveTo(s * 0.65, -s * 0.05, s * 0.65, s * 0.25, s * 0.45, s * 0.35);
        ctx.bezierCurveTo(s * 0.55, s * 0.45, s * 0.45, s * 0.65, s * 0.25, s * 0.75);
        ctx.lineTo(0, s * 0.85);
        ctx.lineTo(-s * 0.25, s * 0.75);
        ctx.bezierCurveTo(-s * 0.45, s * 0.65, -s * 0.55, s * 0.45, -s * 0.45, s * 0.35);
        ctx.bezierCurveTo(-s * 0.65, s * 0.25, -s * 0.65, -s * 0.05, -s * 0.45, -s * 0.15);
        ctx.bezierCurveTo(-s * 0.6, -s * 0.25, -s * 0.6, -s * 0.5, -s * 0.4, -s * 0.6);
        ctx.bezierCurveTo(-s * 0.45, -s * 0.75, -s * 0.25, -s * 0.9, 0, -s);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.95);
        ctx.lineTo(0, -s * 0.8);
        ctx.moveTo(0, -s * 0.35);
        ctx.lineTo(s * 0.35, -s * 0.45);
        ctx.moveTo(0, -s * 0.15);
        ctx.lineTo(-s * 0.35, -s * 0.25);
        ctx.moveTo(0, s * 0.1);
        ctx.lineTo(s * 0.35, 0);
        ctx.moveTo(0, s * 0.3);
        ctx.lineTo(-s * 0.35, s * 0.2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  /* ==========================================================================
     3. RAIN: Water Droplets & Surface Splash Ripples
     ========================================================================== */
  createRainPool(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * (this.width + 100),
        y: Math.random() * this.height,
        length: Math.random() * 16 + 14,
        speedY: Math.random() * 8 + 14,
        speedX: -2.2,
        alpha: Math.random() * 0.4 + 0.3,
        thickness: Math.random() > 0.8 ? 1.6 : 1.0,
        vx: 0,
        vy: 0,
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
      alpha: 0.7,
      speed: Math.random() * 0.6 + 0.5,
    });
  }

  updateRain() {
    for (const p of this.particles) {
      p.y += p.speedY;
      p.x += p.speedX;

      this.applyInteractiveForces(p);

      if (p.y > this.height) {
        if (Math.random() > 0.65) {
          this.createSplash(p.x, this.height - Math.random() * 30);
        }
        p.y = -p.length;
        p.x = Math.random() * (this.width + 100);
      }
    }

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed;
      r.alpha -= 0.025;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }
  }

  drawRain(ctx) {
    ctx.strokeStyle = '#00f0ff';
    ctx.lineCap = 'round';

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

    for (const r of this.ripples) {
      ctx.save();
      ctx.globalAlpha = r.alpha;
      ctx.strokeStyle = '#90e0ef';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ==========================================================================
     4. SPRING: Cherry Blossom Sakura Petals
     ========================================================================== */
  createSakuraPool(count) {
    const sakuraColors = ['#ffb3c6', '#ff70a6', '#ffccd5', '#ff4d6d', '#ffaec9'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 6 + 6,
        speedY: Math.random() * 1.2 + 0.7,
        speedX: Math.random() * 0.8 + 0.4,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.035,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: Math.random() * 0.03 + 0.015,
        color: sakuraColors[Math.floor(Math.random() * sakuraColors.length)],
        alpha: Math.random() * 0.35 + 0.55,
        vx: 0,
        vy: 0,
      });
    }
  }

  updateSakura() {
    this.windTimer++;
    if (this.windTimer > 160) {
      this.windTarget = Math.random() * 1.2 + 0.3;
      this.windTimer = 0;
    }
    this.wind += (this.windTarget - this.wind) * 0.025;

    for (const p of this.particles) {
      p.angle += p.angularSpeed;
      p.tilt += p.tiltSpeed;
      p.y += p.speedY + Math.sin(p.tilt) * 0.3;
      p.x += Math.sin(p.angle) * 1.0 + this.wind;

      this.applyInteractiveForces(p);

      if (p.y > this.height + 20) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width + 25) p.x = -25;
      if (p.x < -25) p.x = this.width + 25;
    }
  }

  drawSakura(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(Math.cos(p.tilt), 1);

      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(255, 112, 166, 0.45)';
      ctx.shadowBlur = 6;

      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.6, -s * 0.8, s * 0.9, -s * 0.3, s * 0.7, s * 0.4);
      ctx.bezierCurveTo(s * 0.5, s * 0.8, s * 0.2, s, 0, s * 1.15);
      ctx.bezierCurveTo(-s * 0.2, s, -s * 0.5, s * 0.8, -s * 0.7, s * 0.4);
      ctx.bezierCurveTo(-s * 0.9, -s * 0.3, -s * 0.6, -s * 0.8, 0, -s);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  /* ==========================================================================
     5. SUMMER: Bioluminescent Solar Fireflies
     ========================================================================== */
  createSummerPool(count) {
    const fireflyGlows = ['#fde047', '#facc15', '#fbbf24', '#00f0ff', '#70e000'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.2 + 1.6,
        baseAlpha: Math.random() * 0.4 + 0.4,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        speedY: -(Math.random() * 0.7 + 0.3),
        speedX: (Math.random() - 0.5) * 0.5,
        color: fireflyGlows[Math.floor(Math.random() * fireflyGlows.length)],
        vx: 0,
        vy: 0,
      });
    }
  }

  updateSummer() {
    for (const p of this.particles) {
      p.pulsePhase += p.pulseSpeed;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.pulsePhase) * 0.6;

      this.applyInteractiveForces(p);

      if (p.y < -20) {
        p.y = this.height + 20;
        p.x = Math.random() * this.width;
      }
      if (p.x < -20) p.x = this.width + 20;
      else if (p.x > this.width + 20) p.x = -20;
    }
  }

  drawSummer(ctx) {
    for (const p of this.particles) {
      const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.35;
      if (currentAlpha <= 0.05) continue;

      ctx.save();
      ctx.translate(p.x, p.y);

      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = Math.min(1, currentAlpha * 1.2);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, p.radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = currentAlpha * 0.3;
      ctx.fill();

      ctx.restore();
    }
  }

  /* ==========================================================================
     6. PRE-WINTER: Frosted Botanical Amber Leaves & Twilight Aurora Stars
     ========================================================================== */
  createPrewinterPool(count) {
    const frostedPalettes = [
      '#f59e0b', '#d97706', '#b45309', '#ea580c', '#38bdf8', '#00f0ff',
    ];

    for (let i = 0; i < count; i++) {
      const isStar = Math.random() > 0.6;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: isStar ? Math.random() * 3 + 2 : Math.random() * 8 + 8,
        speedY: isStar ? Math.random() * 0.9 + 0.4 : Math.random() * 1.4 + 0.8,
        speedX: Math.random() * 0.8 - 0.4,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: Math.random() * 0.03 + 0.015,
        color: frostedPalettes[Math.floor(Math.random() * frostedPalettes.length)],
        alpha: Math.random() * 0.4 + 0.5,
        isStar,
        vx: 0,
        vy: 0,
      });
    }
  }

  updatePrewinter() {
    this.windTimer++;
    if (this.windTimer > 180) {
      this.windTarget = (Math.random() - 0.4) * 1.0;
      this.windTimer = 0;
    }
    this.wind += (this.windTarget - this.wind) * 0.02;

    for (const p of this.particles) {
      p.angle += p.angularSpeed;
      p.tilt += p.tiltSpeed;
      p.y += p.speedY + Math.sin(p.tilt) * 0.3;
      p.x += Math.sin(p.angle) * 0.8 + this.wind;

      this.applyInteractiveForces(p);

      if (p.y > this.height + 25) {
        p.y = -25;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width + 30) p.x = -30;
      if (p.x < -30) p.x = this.width + 30;
    }
  }

  drawPrewinter(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);

      if (p.isStar) {
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.75)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for (let j = 0; j < 8; j++) {
          ctx.rotate(Math.PI / 4);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(p.size * 0.28, p.size * 0.28);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.rotate(p.angle);
        ctx.scale(Math.cos(p.tilt), 1);
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 5;

        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.1, -s * 0.8, s * 0.3, -s * 0.7, s * 0.35, -s * 0.65);
        ctx.bezierCurveTo(s * 0.45, -s * 0.5, s * 0.75, -s * 0.35, s * 0.8, -s * 0.2);
        ctx.bezierCurveTo(s * 0.7, -s * 0.05, s * 0.85, s * 0.15, s * 0.75, s * 0.3);
        ctx.bezierCurveTo(s * 0.55, s * 0.25, s * 0.5, s * 0.45, s * 0.4, s * 0.6);
        ctx.bezierCurveTo(s * 0.25, s * 0.5, s * 0.15, s * 0.65, 0, s * 0.75);
        ctx.bezierCurveTo(-s * 0.15, s * 0.65, -s * 0.25, s * 0.5, -s * 0.4, s * 0.6);
        ctx.bezierCurveTo(-s * 0.5, s * 0.45, -s * 0.55, s * 0.25, -s * 0.75, s * 0.3);
        ctx.bezierCurveTo(-s * 0.85, s * 0.15, -s * 0.7, -s * 0.05, -s * 0.8, -s * 0.2);
        ctx.bezierCurveTo(-s * 0.75, -s * 0.35, -s * 0.45, -s * 0.5, -s * 0.35, -s * 0.65);
        ctx.bezierCurveTo(-s * 0.3, -s * 0.7, -s * 0.1, -s * 0.8, 0, -s);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.95);
        ctx.lineTo(0, -s * 0.75);
        ctx.moveTo(0, s * 0.2);
        ctx.lineTo(s * 0.55, -s * 0.15);
        ctx.moveTo(0, s * 0.2);
        ctx.lineTo(-s * 0.55, -s * 0.15);
        ctx.moveTo(0, s * 0.4);
        ctx.lineTo(s * 0.3, s * 0.4);
        ctx.moveTo(0, s * 0.4);
        ctx.lineTo(-s * 0.3, s * 0.4);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  /* ==========================================================================
     Master Update & Render
     ========================================================================== */
  update() {
    this.updateShockwaves();

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
      case SEASONS.PREWINTER:
        this.updatePrewinter();
        break;
      case SEASONS.WAVES:
      default:
        break;
    }
  }

  draw(ctx) {
    // 1. Draw Shockwave Rings
    for (const sw of this.shockwaves) {
      ctx.save();
      ctx.globalAlpha = sw.alpha;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Draw Seasonal Particles
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
      case SEASONS.PREWINTER:
        this.drawPrewinter(ctx);
        break;
      case SEASONS.WAVES:
      default:
        break;
    }
  }
}

export function createSeasonalParticles(canvasWidth, canvasHeight, options) {
  return new SeasonalParticles(canvasWidth, canvasHeight, options);
}
