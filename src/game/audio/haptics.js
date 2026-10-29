/**
 * @fileoverview DualSense & Gamepad Vibration Actuator
 */
import { ENV } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

/**
 * Triggers DualSense / Standard Gamepad haptic feedback
 * @param {number} [duration=80] Duration in milliseconds
 * @param {number} [weakMagnitude=0.4] Low-frequency motor magnitude (0.0 to 1.0)
 * @param {number} [strongMagnitude=0.4] High-frequency motor magnitude (0.0 to 1.0)
 */
export function triggerHaptics(duration = 80, weakMagnitude = 0.4, strongMagnitude = 0.4) {
  if (!ENV.ENABLE_HAPTICS || typeof navigator === 'undefined' || !navigator.getGamepads) {
    return;
  }

  try {
    const gamepads = navigator.getGamepads();
    if (!gamepads) return;

    for (let i = 0; i < gamepads.length; i++) {
      const pad = gamepads[i];
      if (pad && pad.vibrationActuator) {
        pad.vibrationActuator
          .playEffect('dual-rumble', {
            startDelay: 0,
            duration,
            weakMagnitude,
            strongMagnitude,
          })
          .catch((err) => {
            logger.debug('Vibration actuator playEffect rejected:', err);
          });
      }
    }
  } catch (err) {
    logger.debug('Gamepad haptics error:', err);
  }
}

