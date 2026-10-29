/**
 * @fileoverview Pure State Reducer for PlayStation OS & Game State
 */

export const ACTION_TYPES = Object.freeze({
  SET_SCREEN: 'SET_SCREEN',
  UPDATE_SCORE: 'UPDATE_SCORE',
  UPDATE_HEALTH: 'UPDATE_HEALTH',
  UPDATE_BOSS_HP: 'UPDATE_BOSS_HP',
  UPDATE_FPS: 'UPDATE_FPS',
  TRIGGER_TOAST: 'TRIGGER_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  SET_GAMEPAD_STATUS: 'SET_GAMEPAD_STATUS',
  GAME_OVER: 'GAME_OVER',
});

export const SCREENS = Object.freeze({
  DASHBOARD: 'DASHBOARD',
  GAME: 'GAME',
});

export const initialState = {
  currentScreen: SCREENS.DASHBOARD,
  score: 0,
  highScore: 0,
  fps: 60,
  playerHp: { current: 100, max: 100 },
  bossHp: { current: 5000, max: 5000 },
  toast: { show: false, title: '', message: '' },
  activeModal: null, // 'LEADERBOARD' | 'GAME_OVER' | null
  audioEnabled: true,
  isGamepadConnected: false,
  gameOverData: null,
};

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_SCREEN:
      return {
        ...state,
        currentScreen: action.payload,
        activeModal: null,
      };

    case ACTION_TYPES.UPDATE_SCORE: {
      const newScore = action.payload;
      return {
        ...state,
        score: newScore,
        highScore: Math.max(state.highScore, newScore),
      };
    }

    case ACTION_TYPES.UPDATE_HEALTH:
      return {
        ...state,
        playerHp: action.payload,
      };

    case ACTION_TYPES.UPDATE_BOSS_HP:
      return {
        ...state,
        bossHp: action.payload,
      };

    case ACTION_TYPES.UPDATE_FPS:
      return {
        ...state,
        fps: action.payload,
      };

    case ACTION_TYPES.TRIGGER_TOAST:
      return {
        ...state,
        toast: {
          show: true,
          title: action.payload.title || 'TROPHY UNLOCKED',
          message: action.payload.message || '',
        },
      };

    case ACTION_TYPES.DISMISS_TOAST:
      return {
        ...state,
        toast: { ...state.toast, show: false },
      };

    case ACTION_TYPES.OPEN_MODAL:
      return {
        ...state,
        activeModal: action.payload,
      };

    case ACTION_TYPES.CLOSE_MODAL:
      return {
        ...state,
        activeModal: null,
      };

    case ACTION_TYPES.TOGGLE_AUDIO:
      return {
        ...state,
        audioEnabled: action.payload !== undefined ? action.payload : !state.audioEnabled,
      };

    case ACTION_TYPES.SET_GAMEPAD_STATUS:
      return {
        ...state,
        isGamepadConnected: action.payload,
      };

    case ACTION_TYPES.GAME_OVER:
      return {
        ...state,
        gameOverData: action.payload,
        activeModal: 'GAME_OVER',
      };

    default:
      return state;
  }
}

