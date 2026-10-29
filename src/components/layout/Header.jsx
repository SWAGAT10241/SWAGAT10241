/**
 * @fileoverview PlayStation Top Navigation Bar Component
 */
import React from 'react';
import { useGame } from '../../hooks/useGame.js';
import { useClock } from '../../hooks/useClock.js';

export function Header() {
  const { audioEnabled, toggleAudio, openModal } = useGame();
  const timeString = useClock();

  return (
    <header className="ps-header">
      <div className="nav-left">
        <div className="ps-brand-logo" aria-label="PlayStation OS">
          PS
        </div>
        <nav className="nav-tabs" aria-label="Console Navigation">
          <button type="button" className="nav-tab active">
            GAMES
          </button>
          <button
            type="button"
            className="nav-tab"
            onClick={() => openModal('LEADERBOARD')}
          >
            LEADERBOARD
          </button>
          <button
            type="button"
            className="nav-tab"
            onClick={toggleAudio}
            title={audioEnabled ? 'Mute Procedural Audio' : 'Unmute Procedural Audio'}
          >
            {audioEnabled ? '🔊 AUDIO: ON' : '🔇 AUDIO: OFF'}
          </button>
        </nav>
      </div>

      <div className="nav-right">
        <div className="trophy-badge" title="Trophy Rank">
          🏆 LEVEL 99
        </div>
        <div className="user-profile">
          <span className="online-indicator" aria-hidden="true" />
          <span className="user-name">SWAGAT10241</span>
        </div>
        <div className="clock-display" aria-label="System Time">
          {timeString}
        </div>
      </div>
    </header>
  );
}

