/**
 * @fileoverview Gamepad Status Detection Hook
 */
import { useState, useEffect } from 'react';
import { useGame } from './useGame.js';

export function useGamepad() {
  const { setGamepadConnected } = useGame();
  const [padName, setPadName] = useState('DUALSENSE WIRELESS');

  useEffect(() => {
    const handleConnected = (e) => {
      setGamepadConnected(true);
      if (e.gamepad?.id) {
        setPadName(e.gamepad.id.slice(0, 24));
      }
    };

    const handleDisconnected = () => {
      setGamepadConnected(false);
    };

    window.addEventListener('gamepadconnected', handleConnected);
    window.addEventListener('gamepaddisconnected', handleDisconnected);

    // Initial check
    if (navigator.getGamepads) {
      const pads = navigator.getGamepads();
      if (pads && pads[0]) {
        setGamepadConnected(true);
        setPadName(pads[0].id.slice(0, 24));
      }
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleConnected);
      window.removeEventListener('gamepaddisconnected', handleDisconnected);
    };
  }, [setGamepadConnected]);

  return { padName };
}

