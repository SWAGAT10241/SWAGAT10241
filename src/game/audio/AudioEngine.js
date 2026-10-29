/**
 * @fileoverview Web Audio API Procedural Synthesizer
 * Zero-latency procedural sound generation with browser autoplay error handling.
 */
import { ENV } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

class AudioEngineClass {
  constructor() {
    this.ctx = null;
    this.enabled = ENV.ENABLE_SOUND;
    this.initialized = false;
  }

  /**
   * Initializes or resumes the AudioContext after user gesture
   */
  init() {
    if (!this.enabled) return;

    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        } else {
          logger.warn('Web Audio API not supported on this platform');
          return;
        }
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch((err) => {
          logger.warn('Failed to resume suspended AudioContext:', err);
        });
      }

      this.initialized = true;
    } catch (err) {
      logger.error('AudioEngine initialization error:', err);
    }
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (!this.enabled && this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {});
    }
  }

  /**
   * Generates a synthesized tone with frequency ramp and gain envelope
   * @param {OscillatorType} type
   * @param {number} startFreq
   * @param {number} endFreq
   * @param {number} duration
   * @param {number} volume
   */
  tone(type, startFreq, endFreq, duration, volume) {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') {
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') return;
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (err) {
      logger.debug('AudioEngine tone playback error:', err);
    }
  }

  laser() {
    this.tone('sawtooth', 920, 140, 0.1, 0.16);
  }

  hit() {
    this.tone('triangle', 260, 50, 0.14, 0.22);
  }

  parry() {
    this.tone('sine', 587, 1480, 0.2, 0.3);
  }

  bootChime() {
    if (!this.enabled) return;
    const chords = [261.63, 329.63, 392.0, 523.25, 659.25];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        this.tone('sine', freq, freq, 0.5, 0.1);
      }, idx * 75);
    });
  }

  trophy() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.tone('triangle', freq, freq, 0.35, 0.18);
      }, idx * 100);
    });
  }
}

export const audioEngine = new AudioEngineClass();

