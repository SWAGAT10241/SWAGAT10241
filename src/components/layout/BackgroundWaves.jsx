/**
 * @fileoverview Ambient Dynamic PlayStation Wave Canvas & Seasonal Weather
 * Renders procedural light ribbons alongside interactive seasonal particles
 * (Winter Snow, Autumn Leaves, Rain Water Drops & Ripples, Sakura Petals, Summer Fireflies).
 */
import React, { useEffect, useRef } from 'react';
import { useGame } from '../../hooks/useGame.js';
import { SeasonalParticles } from '../../game/effects/SeasonalParticles.js';
import { SEASON_PRESETS, SEASONS } from '../../config/season.config.js';

export function BackgroundWaves() {
  const canvasRef = useRef(null);
  const particleEngineRef = useRef(null);
  const { activeSeason } = useGame();
  const seasonRef = useRef(activeSeason);

  // Update ref and particle engine whenever active season changes
  useEffect(() => {
    seasonRef.current = activeSeason;
    if (particleEngineRef.current) {
      particleEngineRef.current.setSeason(activeSeason);
    }
  }, [activeSeason]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    let rafId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particleEngineRef.current) {
        particleEngineRef.current.resize(canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const particles = new SeasonalParticles(canvas.width, canvas.height, seasonRef.current);
    particleEngineRef.current = particles;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.015;

      const currentSeason = seasonRef.current;
      const currentPreset = SEASON_PRESETS[currentSeason] || SEASON_PRESETS[SEASONS.WINTER];
      const colors = currentPreset.waveColors;

      // 1. Draw PlayStation Ambient Light Ribbons
      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();
        const freq = 0.0025 + layer * 0.001;
        const amp = 32 + layer * 14;
        const offset = canvas.height * 0.66 + layer * 28;

        for (let x = 0; x <= canvas.width; x += 16) {
          const y = offset + Math.sin(x * freq + step + layer * 1.45) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = colors[layer] || colors[0];
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // 2. Update and Draw Seasonal Particles (Snow, Autumn Leaves, Rain Water Drops)
      particles.update();
      particles.draw(ctx);

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />;
}
