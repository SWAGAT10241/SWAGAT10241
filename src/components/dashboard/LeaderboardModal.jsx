/**
 * @fileoverview Scalable Leaderboard Modal Dialog
 */
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { leaderboardService } from '../../api/services/leaderboardService.js';
import { formatScore } from '../../utils/formatters.js';

export function LeaderboardModal({ isOpen, onClose }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    leaderboardService
      .getScores()
      .then((data) => {
        if (mounted) setScores(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to fetch leaderboard');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SIMULATION GLOBAL LEADERBOARD">
      <div className="leaderboard-container">
        {loading && <div className="loading-spinner">ACCESSING MAINFRAME TELEMETRY...</div>}

        {error && (
          <div className="error-banner" role="alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        {!loading && !error && (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>PILOT</th>
                <th>SCORE</th>
                <th>DATE</th>
                <th>NETWORK</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((row) => (
                <tr key={`${row.rank}-${row.pilot}`} className={row.rank <= 3 ? 'top-tier' : ''}>
                  <td className="rank-col">
                    {row.rank === 1 ? '🥇 #1' : row.rank === 2 ? '🥈 #2' : row.rank === 3 ? '🥉 #3' : `#${row.rank}`}
                  </td>
                  <td className="pilot-col">{row.pilot}</td>
                  <td className="score-col">{formatScore(row.score)}</td>
                  <td>{row.date}</td>
                  <td>
                    <span className={`status-pill ${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Modal>
  );
}

