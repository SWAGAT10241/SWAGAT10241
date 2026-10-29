/**
 * @fileoverview PlayStation Console Bottom Status & Controller Hints
 */
import React from 'react';
import { useGame } from '../../hooks/useGame.js';
import { useGamepad } from '../../hooks/useGamepad.js';

export function Footer() {
  const { isGamepadConnected } = useGame();
  const { padName } = useGamepad();

  return (
    <footer className="ps-footer">
      <div className="controller-prompts">
        <span className="prompt-item">
          <kbd className="p-key">🖱️ CURSOR</kbd> TRACK
        </span>
        <span className="prompt-item">
          <kbd className="p-key">A</kbd> <kbd className="p-key">D</kbd> MOVE
        </span>
        <span className="prompt-item">
          <kbd className="p-key">SPACE / L-CLICK</kbd> FIRE
        </span>
        <span className="prompt-item">
          <kbd className="p-key">E / R-CLICK</kbd> PARRY
        </span>
      </div>

      <div className="hardware-telemetry">
        <span
          className={`gamepad-indicator ${isGamepadConnected ? 'connected' : 'disconnected'}`}
        >
          🎮 {isGamepadConnected ? `${padName}: CONNECTED` : 'KEYBOARD & TOUCH ACTIVE'}
        </span>
        <span className="spec-item">VITE + REACT 18 · WEB AUDIO API</span>
      </div>
    </footer>
  );
}

