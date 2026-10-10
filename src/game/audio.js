/** Lightweight Web Audio SFX — no asset files required */
export const AudioEngine = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  },

  tone(type, f0, f1, dur, vol) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(1, f1),
      this.ctx.currentTime + dur
    );
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur + 0.02);
  },

  laser() {
    this.tone('sawtooth', 920, 140, 0.1, 0.16);
  },
  hit() {
    this.tone('triangle', 260, 50, 0.14, 0.22);
  },
  parry() {
    this.tone('sine', 587, 1480, 0.2, 0.3);
  },
  boot() {
    [261.63, 329.63, 392, 523.25].forEach((f, i) => {
      setTimeout(() => this.tone('sine', f, f, 0.5, 0.1), i * 80);
    });
  },
  trophy() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => this.tone('triangle', f, f, 0.4, 0.18), i * 110);
    });
  },
};

export function rumble(duration = 80, weak = 0.4, strong = 0.4) {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  if (pads[0]?.vibrationActuator) {
    pads[0].vibrationActuator
      .playEffect('dual-rumble', {
        startDelay: 0,
        duration,
        weakMagnitude: weak,
        strongMagnitude: strong,
      })
      .catch(() => {});
  }
}
