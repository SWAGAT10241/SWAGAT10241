import { useEffect, useRef, useState } from 'react';
import { AudioEngine, rumble } from '../game/audio.js';

export default function GameView({ onExit, onTrophy }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [fps, setFps] = useState(0);
  const keysRef = useRef({ left: false, right: false, fire: false });
  const runningRef = useRef(true);

  useEffect(() => {
    runningRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const keys = keysRef.current;

    let scoreVal = 0;
    let bullets = [];
    let enemyBullets = [];
    let fireCd = 0;
    let frames = 0;
    let lastTs = performance.now();
    let raf = 0;

    const ship = { x: 0, y: 0, speed: 8, parry: 0 };
    const boss = { x: 0, y: 120, hp: 5000, maxHp: 5000, angle: 0, fireTimer: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ship.x = canvas.width / 2;
      ship.y = canvas.height - 100;
    };
    resize();

    const doParry = () => {
      if (ship.parry <= 0) {
        ship.parry = 22;
        AudioEngine.parry();
        rumble(120, 0.4, 0.9);
      }
    };

    const onKeyDown = (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
      if (e.code === 'Space') {
        keys.fire = true;
        e.preventDefault();
      }
      if (e.code === 'KeyE') doParry();
      if (e.code === 'Escape') onExit();
    };
    const onKeyUp = (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
      if (e.code === 'Space') keys.fire = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', resize);

    const bind = (id, down, up) => {
      const el = document.getElementById(id);
      if (!el) return () => {};
      const ts = (e) => {
        e.preventDefault();
        down();
      };
      const te = () => up();
      el.addEventListener('touchstart', ts, { passive: false });
      el.addEventListener('touchend', te);
      return () => {
        el.removeEventListener('touchstart', ts);
        el.removeEventListener('touchend', te);
      };
    };
    const offs = [
      bind('mb-left', () => { keys.left = true; }, () => { keys.left = false; }),
      bind('mb-right', () => { keys.right = true; }, () => { keys.right = false; }),
      bind('mb-fire', () => { keys.fire = true; }, () => { keys.fire = false; }),
      bind('mb-parry', doParry, () => {}),
    ];

    const loop = (ts) => {
      if (!runningRef.current) return;
      frames += 1;
      if (ts - lastTs >= 1000) {
        setFps(frames);
        frames = 0;
        lastTs = ts;
      }

      if (keys.left) ship.x -= ship.speed;
      if (keys.right) ship.x += ship.speed;
      ship.x = Math.max(40, Math.min(canvas.width - 40, ship.x));
      if (ship.parry > 0) ship.parry -= 1;

      fireCd -= 1;
      if (keys.fire && fireCd <= 0) {
        fireCd = 6;
        AudioEngine.laser();
        rumble(40, 0.2, 0.2);
        bullets.push({ x: ship.x - 14, y: ship.y - 15 });
        bullets.push({ x: ship.x + 14, y: ship.y - 15 });
      }

      boss.angle += 0.025;
      boss.x = canvas.width / 2 + Math.sin(boss.angle) * (canvas.width * 0.25);
      boss.fireTimer += 1;
      if (boss.fireTimer > 40) {
        boss.fireTimer = 0;
        for (let i = -2; i <= 2; i++) {
          enemyBullets.push({ x: boss.x + i * 25, y: boss.y + 40, vx: i * 1.5, vy: 5 });
        }
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y -= 16;
        if (Math.abs(b.x - boss.x) < 90 && Math.abs(b.y - boss.y) < 50) {
          bullets.splice(i, 1);
          boss.hp -= 90;
          scoreVal += 90;
          setScore(scoreVal);
          AudioEngine.hit();
          if (boss.hp <= 0) {
            onTrophy('Master of the Simulation');
            boss.hp = boss.maxHp;
          }
        } else if (b.y < 50) bullets.splice(i, 1);
      }

      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eb = enemyBullets[i];
        eb.x += eb.vx;
        eb.y += eb.vy;
        if (Math.hypot(eb.x - ship.x, eb.y - ship.y) < 30) {
          enemyBullets.splice(i, 1);
          if (ship.parry > 0) {
            AudioEngine.parry();
            rumble(160, 0.6, 1);
            boss.hp -= 400;
            scoreVal += 500;
            setScore(scoreVal);
          } else {
            rumble(220, 0.85, 0.85);
          }
        } else if (eb.y > canvas.height) enemyBullets.splice(i, 1);
      }

      ctx.fillStyle = '#020716';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(boss.x, boss.y);
      ctx.fillStyle = '#102244';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.lineTo(90, 0);
      ctx.lineTo(120, 25);
      ctx.lineTo(0, 45);
      ctx.lineTo(-120, 25);
      ctx.lineTo(-90, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#00ffcc';
      ctx.beginPath();
      ctx.arc(0, 10, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const bW = Math.min(480, canvas.width - 60);
      const bX = (canvas.width - bW) / 2;
      ctx.strokeStyle = '#0070d1';
      ctx.strokeRect(bX, 58, bW, 10);
      ctx.fillStyle = '#ff2b56';
      ctx.fillRect(bX + 1, 59, (bW - 2) * Math.max(0, boss.hp / boss.maxHp), 8);

      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(14, 12);
      ctx.lineTo(0, 8);
      ctx.lineTo(-14, 12);
      ctx.closePath();
      ctx.fill();
      if (ship.parry > 0) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 34, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      for (const b of bullets) {
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x, b.y - 14);
        ctx.stroke();
      }
      ctx.fillStyle = '#ff3b56';
      for (const eb of enemyBullets) {
        ctx.beginPath();
        ctx.arc(eb.x, eb.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', resize);
      offs.forEach((fn) => fn());
    };
  }, [onExit, onTrophy]);

  return (
    <div className="game-layer">
      <div className="hud">
        <div>
          <strong>STAGE 07</strong>
          {' · '}
          SCORE: {String(score).padStart(7, '0')}
        </div>
        <div style={{ color: '#00ff7f' }}>FPS: {fps || '--'}</div>
        <button type="button" className="exit-btn" onClick={onExit}>
          EXIT
        </button>
      </div>
      <canvas ref={canvasRef} className="game-canvas" />
      <div className="touch-bar">
        <div className="touch-group">
          <button type="button" className="touch-btn" id="mb-left">◀</button>
          <button type="button" className="touch-btn" id="mb-right">▶</button>
        </div>
        <div className="touch-group">
          <button type="button" className="touch-btn danger" id="mb-parry">○</button>
          <button type="button" className="touch-btn" id="mb-fire">✕</button>
        </div>
      </div>
    </div>
  );
}
