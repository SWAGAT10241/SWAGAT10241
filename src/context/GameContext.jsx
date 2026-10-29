/**
 * @fileoverview Central State Management Context Provider
 */
import { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { gameReducer, initialState, ACTION_TYPES, SCREENS } from './gameReducer.js';
import { storage } from '../utils/storage.js';
import { audioEngine } from '../game/audio/AudioEngine.js';

const STORAGE_KEY_HIGH_SCORE = 'swagat_cyberpulse_highscore';
const STORAGE_KEY_AUDIO_MUTED = 'swagat_cyberpulse_audiomuted';

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, (init) => {
    const savedHighScore = storage.get(STORAGE_KEY_HIGH_SCORE, 0);
    const audioMuted = storage.get(STORAGE_KEY_AUDIO_MUTED, false);
    return {
      ...init,
      highScore: savedHighScore,
      audioEnabled: !audioMuted,
    };
  });

  // Sync high score to local storage
  useEffect(() => {
    storage.set(STORAGE_KEY_HIGH_SCORE, state.highScore);
  }, [state.highScore]);

  // Sync audio enabled state with AudioEngine
  useEffect(() => {
    audioEngine.setEnabled(state.audioEnabled);
    storage.set(STORAGE_KEY_AUDIO_MUTED, !state.audioEnabled);
  }, [state.audioEnabled]);

  // Navigation actions
  const navigateTo = useCallback((screen) => {
    dispatch({ type: ACTION_TYPES.SET_SCREEN, payload: screen });
  }, []);

  const openModal = useCallback((modalName) => {
    dispatch({ type: ACTION_TYPES.OPEN_MODAL, payload: modalName });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLOSE_MODAL });
  }, []);

  // In-Game state dispatches
  const updateScore = useCallback((score) => {
    dispatch({ type: ACTION_TYPES.UPDATE_SCORE, payload: score });
  }, []);

  const updateHealth = useCallback((hp) => {
    dispatch({ type: ACTION_TYPES.UPDATE_HEALTH, payload: hp });
  }, []);

  const updateBossHp = useCallback((hp) => {
    dispatch({ type: ACTION_TYPES.UPDATE_BOSS_HP, payload: hp });
  }, []);

  const updateFps = useCallback((fps) => {
    dispatch({ type: ACTION_TYPES.UPDATE_FPS, payload: fps });
  }, []);

  // Notifications
  const triggerToast = useCallback((title, message) => {
    dispatch({
      type: ACTION_TYPES.TRIGGER_TOAST,
      payload: { title, message },
    });
    audioEngine.trophy();
    setTimeout(() => {
      dispatch({ type: ACTION_TYPES.DISMISS_TOAST });
    }, 4000);
  }, []);

  const toggleAudio = useCallback(() => {
    dispatch({ type: ACTION_TYPES.TOGGLE_AUDIO });
  }, []);

  const setGamepadConnected = useCallback((connected) => {
    dispatch({ type: ACTION_TYPES.SET_GAMEPAD_STATUS, payload: connected });
  }, []);

  const triggerGameOver = useCallback((data) => {
    dispatch({ type: ACTION_TYPES.GAME_OVER, payload: data });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      navigateTo,
      openModal,
      closeModal,
      updateScore,
      updateHealth,
      updateBossHp,
      updateFps,
      triggerToast,
      toggleAudio,
      setGamepadConnected,
      triggerGameOver,
    }),
    [
      state,
      navigateTo,
      openModal,
      closeModal,
      updateScore,
      updateHealth,
      updateBossHp,
      updateFps,
      triggerToast,
      toggleAudio,
      setGamepadConnected,
      triggerGameOver,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

