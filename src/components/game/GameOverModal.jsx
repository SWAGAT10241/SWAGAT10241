/**
 * @fileoverview Game Over & Debrief Modal
 */
import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { leaderboardService } from '../../api/services/leaderboardService.js';
import { formatScore } from '../../utils/formatters.js';

export function GameOverModal({ isOpen, onClose, onRestart, score = 0, isVictory = false }) {
  const [submitting, setSubmitting] = useState(false);
  const [submittedRank, setSubmittedRank] = useState(null);

  const handleSubmitScore = async () => {
    setSubmitting(true);
    try {
      const res = await leaderboardService.submitScore('SWAGAT10241', score);
      if (res.success) {
        setSubmittedRank(res.rank);
      }
    } catch (err) {
      console.error('Failed to submit score:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isVictory ? 'SIMULATION OVERRIDE: VICTORY' : 'SIMULATION TERMINATED: HULL BREACH'}
    >
      <div className="game-over-content">
        <div className="game-over-score-badge">
          <span className="label">FINAL COMBAT RATING</span>
          <h2 className="score-number">{formatScore(score)}</h2>
        </div>

        {submittedRank ? (
          <div className="submission-success">
            <span>🎉 Score recorded in Global Archive at Rank #{submittedRank}!</span>
          </div>
        ) : (
          <div className="submission-prompt">
            <Button
              variant="secondary"
              size="md"
              onClick={handleSubmitScore}
              disabled={submitting || score <= 0}
            >
              {submitting ? 'RECORDING TELEMETRY...' : 'SUBMIT TO GLOBAL LEADERBOARD'}
            </Button>
          </div>
        )}

        <div className="game-over-actions">
          <Button variant="primary" size="lg" onClick={onRestart}>
            🔄 RE-ENGAGE SIMULATION
          </Button>
          <Button variant="secondary" size="lg" onClick={onClose}>
            RETURN TO CONSOLE OS
          </Button>
        </div>
      </div>
    </Modal>
  );
}

