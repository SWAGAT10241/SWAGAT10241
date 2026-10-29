/**
 * @fileoverview Main Console Dashboard View
 */
import React from 'react';
import { HeroCard } from './HeroCard.jsx';
import { LeaderboardModal } from './LeaderboardModal.jsx';
import { useGame } from '../../hooks/useGame.js';
import { SCREENS } from '../../context/gameReducer.js';
import { audioEngine } from '../../game/audio/AudioEngine.js';

export function Dashboard() {
  const { navigateTo, openModal, closeModal, activeModal, highScore, triggerToast } = useGame();

  const handleLaunchGame = () => {
    audioEngine.init();
    audioEngine.bootChime();
    navigateTo(SCREENS.GAME);
    setTimeout(() => {
      triggerToast('STAGE 07 COMBAT PROTOCOL', 'Defeat the Omega Dreadnought');
    }, 1200);
  };

  return (
    <section className="dashboard-view" aria-label="PlayStation Game Launcher">
      <HeroCard
        onPlay={handleLaunchGame}
        onOpenLeaderboard={() => openModal('LEADERBOARD')}
        highScore={highScore}
      />

      <LeaderboardModal
        isOpen={activeModal === 'LEADERBOARD'}
        onClose={closeModal}
      />
    </section>
  );
}

