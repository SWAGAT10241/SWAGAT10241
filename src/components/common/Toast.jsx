/**
 * @fileoverview Accessible PlayStation Trophy Toast Notification
 */
import React from 'react';
import { useGame } from '../../hooks/useGame.js';

export function Toast() {
  const { toast } = useGame();

  return (
    <aside
      className={`trophy-toast ${toast.show ? 'show' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="trophy-toast-icon" aria-hidden="true">
        🏆
      </div>
      <div className="trophy-toast-content">
        <h4 className="trophy-toast-title">{toast.title || 'TROPHY UNLOCKED'}</h4>
        <p className="trophy-toast-desc">{toast.message || 'Combat loop confirmed.'}</p>
      </div>
    </aside>
  );
}

