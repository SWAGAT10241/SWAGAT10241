/**
 * @fileoverview Enhanced Hero Game Card for Void Breaker
 */
import React from 'react';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';
import { ENV } from '../../config/env.js';
import { formatScore } from '../../utils/formatters.js';

const HIGHLIGHTS = [
  'Cursor & Mouse Reticle Tracking',
  'Canvas 60FPS Render Pipeline',
  'Real-Time Web Audio Synthesizer',
  'Phase-Shift Shield Deflection (Parry)',
  'DualSense Vibration & Haptics',
  'Unified Touch, Keys & Mouse Controls',
];

export function HeroCard({ onPlay, onOpenLeaderboard, highScore }) {
  const previewImgUrl = `${ENV.BASE_URL}gameplay-demo.gif`;

  return (
    <article className="hero-game-card">
      <div className="hero-game-preview">
        <img
          src={previewImgUrl}
          alt="Cyber-Pulse: Void Breaker Arcade Preview"
          loading="eager"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'preview-fallback';
            fallback.innerText = 'CYBER-PULSE // VOID BREAKER';
            e.currentTarget.parentElement?.appendChild(fallback);
          }}
        />
        <div className="preview-overlay-info">
          <span>HIGH SCORE: {formatScore(highScore)}</span>
        </div>
      </div>

      <div className="hero-game-info">
        <div className="hero-meta">
          <Badge variant="primary">PLAYSTATION® 5 PRO ENHANCED</Badge>
          <h1 className="game-title">CYBER-PULSE: VOID BREAKER</h1>
          <p className="game-description">
            Command the cybernetic Interceptor against the colossal Omega Dreadnought in
            Stage 07. Harness phase-deflection shields to reflect enemy ordnance, trigger
            procedural Web Audio harmonics, and dominate the simulation rankings.
          </p>
        </div>

        <div className="features-grid">
          {HIGHLIGHTS.map((feat) => (
            <div key={feat} className="feature-item">
              <span className="feature-bullet">▸</span> {feat}
            </div>
          ))}
        </div>

        <div className="hero-actions">
          <Button variant="primary" size="lg" onClick={onPlay}>
            ▶ LAUNCH SIMULATION
          </Button>
          <Button variant="secondary" size="lg" onClick={onOpenLeaderboard}>
            🏆 VIEW LEADERBOARD
          </Button>
        </div>
      </div>
    </article>
  );
}

