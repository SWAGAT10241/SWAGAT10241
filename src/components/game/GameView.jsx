/**
 * @fileoverview Main In-Game Orchestrator View
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../../game/core/GameEngine.js';
import { InputController } from '../../game/input/InputController.js';
import { GameHUD } from './GameHUD.jsx';
import { VirtualControls } from './VirtualControls.jsx';
import { GameOverModal } from './GameOverModal.jsx';
import { useGame } from '../../hooks/useGame.js';
import { SCREENS } from '../../context/gameReducer.js';
import { logger } from '../../utils/logger.js';

export function GameView() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const inputRef = useRef(null);

  const {
    navigateTo,
    updateScore,
    updateFps,
    updateHealth,
    updateBossHp,
    triggerToast,
    score,
  } = useGame();

  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [gameOverResult, setGameOverResult] = useState({ victory: false, score: 0 });
  const [engineError, setEngineError] = useState(null);

  const handleExit = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    navigateTo(SCREENS.DASHBOARD);
  }, [navigateTo]);

  const handleRestart = useCallback(() => {
    setIsGameOverOpen(false);
    if (engineRef.current) {
      engineRef.current.start();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const input = new InputController();
      input.attach(canvas);
      inputRef.current = input;

      const engine = new GameEngine(canvas);
      engineRef.current = engine;

      // Handle window resize
      const handleResize = () => {
        engine.resize(window.innerWidth, window.innerHeight);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      // Register input loop and parity triggers
      input.onParry(() => {
        engine.triggerParry();
      });

      // Hook up engine callbacks
      engine.setCallbacks({
        onScoreChange: (newScore) => updateScore(newScore),
        onFpsChange: (fps) => updateFps(fps),
        onPlayerHpChange: (hp) => updateHealth(hp),
        onBossHpChange: (hp) => updateBossHp(hp),
        onTrophy: (trophyName) => triggerToast(trophyName, 'Stage milestone reached!'),
        onGameOver: (result) => {
          setGameOverResult(result);
          setIsGameOverOpen(true);
        },
      });

      // Physics input ticking loop
      let physicsRaf = 0;
      const physicsTick = () => {
        if (engine.isRunning) {
          input.pollGamepad();
          engine.update(input.keys, input.cursor);
        }
        physicsRaf = requestAnimationFrame(physicsTick);
      };

      engine.start();
      physicsRaf = requestAnimationFrame(physicsTick);

      return () => {
        cancelAnimationFrame(physicsRaf);
        window.removeEventListener('resize', handleResize);
        engine.stop();
        input.detach();
      };
    } catch (err) {
      logger.error('Failed to initialize GameEngine:', err);
      setEngineError(err.message || 'Game initialization fault');
    }
  }, [updateScore, updateFps, updateHealth, updateBossHp, triggerToast]);

  if (engineError) {
    return (
      <div className="game-error-layer">
        <div className="error-card">
          <h3>ENGINE INITIALIZATION ERROR</h3>
          <p>{engineError}</p>
          <button type="button" className="ps-btn ps-btn-primary" onClick={handleExit}>
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-view-layer">
      <GameHUD onExit={handleExit} />
      <canvas ref={canvasRef} className="game-canvas" />
      <VirtualControls inputController={inputRef.current} />

      <GameOverModal
        isOpen={isGameOverOpen}
        onClose={handleExit}
        onRestart={handleRestart}
        score={gameOverResult.score || score}
        isVictory={gameOverResult.victory}
      />
    </div>
  );
}
export default GameView;

