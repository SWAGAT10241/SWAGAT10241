/**
 * @fileoverview In-Game Heads-Up Display (HUD)
 */
import React from 'react';
import { useGame } from '../../hooks/useGame.js';
import { formatScore } from '../../utils/formatters.js';

export function GameHUD({ onExit }) {
  const { score, fps, playerHp } = useGame();

  const healthPercent = Math.max(0, Math.min(100, (playerHp.current / playerHp.max) * 100));

  return (
    <div className="game-hud-bar">
      <div className="hud-left">
        <button
          type="button"
          className="hud-exit-btn"
          onClick={onExit}
          title="Abort Simulation"
        >
          ✕ ABORT
        </button>
        <div className="hud-stage-info">
          <span className="stage-title">STAGE 07 // VOID PROTOCOL</span>
          <div className="shield-bar-wrapper" title="Interceptor Hull Integrity">
            <span className="shield-label">HULL:</span>
            <div className="shield-bar-track">
              <div
                className="shield-bar-fill"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hud-right">
        <div className="hud-score">
          SCORE: <span className="score-value">{formatScore(score)}</span>
        </div>
        <div className="hud-fps" title="Render Refresh Rate">
          FPS: {fps}
        </div>
      </div>
    </div>
  );
}

