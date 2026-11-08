/**
 * @fileoverview Season & Weather Selector Modal Dialog
 */
import React from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { useGame } from '../../hooks/useGame.js';
import { SEASONS, SEASON_PRESETS } from '../../config/season.config.js';

export function SeasonModal({ isOpen, onClose }) {
  const { season, activeSeason, setSeason, triggerToast } = useGame();

  const handleSelect = (seasonId) => {
    setSeason(seasonId);
    const label = seasonId === SEASONS.AUTO
      ? `Auto Season (${SEASON_PRESETS[activeSeason]?.label})`
      : SEASON_PRESETS[seasonId]?.label;
    triggerToast('AMBIENT WEATHER UPDATED', `${label} active`);
  };

  const seasonKeys = [
    SEASONS.WINTER,
    SEASONS.SPRING,
    SEASONS.SUMMER,
    SEASONS.RAIN,
    SEASONS.AUTUMN,
    SEASONS.PREWINTER,
    SEASONS.WAVES,
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ATMOSPHERIC WEATHER & SEASONS">
      <div className="season-selector-content">
        <div className="season-auto-banner">
          <div className="season-auto-info">
            <span className="auto-icon">🌐</span>
            <div>
              <h4>REAL-WORLD CALENDAR SYNC</h4>
              <p>
                Automatically synchronizes weather with current date (Currently:{' '}
                <strong>{SEASON_PRESETS[activeSeason]?.label}</strong>).
              </p>
            </div>
          </div>
          <Button
            variant={season === SEASONS.AUTO ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleSelect(SEASONS.AUTO)}
          >
            {season === SEASONS.AUTO ? '✓ AUTO ACTIVE' : 'ENABLE AUTO'}
          </Button>
        </div>

        <div className="season-grid">
          {seasonKeys.map((key) => {
            const preset = SEASON_PRESETS[key];
            const isSelected = season === key;
            const isCurrentlyRendered = activeSeason === key;

            return (
              <button
                key={key}
                type="button"
                className={`season-card ${isSelected ? 'selected' : ''} ${isCurrentlyRendered ? 'rendering' : ''}`}
                onClick={() => handleSelect(key)}
              >
                <div className="season-card-header">
                  <span className="season-card-icon" aria-hidden="true">
                    {preset.icon}
                  </span>
                  <Badge variant={isSelected ? 'primary' : 'secondary'}>
                    {preset.tag}
                  </Badge>
                </div>
                <h4 className="season-card-title">{preset.label}</h4>
                <p className="season-card-desc">{preset.description}</p>
                <div className="season-card-status">
                  {isSelected && <span className="status-selected">● SELECTED</span>}
                  {!isSelected && isCurrentlyRendered && (
                    <span className="status-auto">● AUTO-ACTIVE</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="season-modal-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            CLOSE SETTINGS
          </Button>
        </div>
      </div>
    </Modal>
  );
}
