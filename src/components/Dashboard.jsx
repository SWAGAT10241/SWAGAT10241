const FEATURES = [
  'Canvas render loop',
  'Web Audio synthesizer',
  'Keyboard + touch',
  'Optional gamepad rumble',
];

const PREVIEW =
  'https://raw.githubusercontent.com/SWAGAT10241/SWAGAT10241/main/assets/gameplay-demo.gif';

export default function Dashboard({ onPlay }) {
  return (
    <section className="hero-card">
      <div className="hero-visual">
        <img
          src={PREVIEW}
          alt="Cyber-Pulse gameplay preview"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.innerHTML =
              '<div class="fallback">GAME PREVIEW</div>';
          }}
        />
      </div>
      <div className="hero-body">
        <span className="badge">BROWSER ARCADE · VITE + REACT</span>
        <h1>CYBER-PULSE: VOID BREAKER</h1>
        <p>
          Pilot the Interceptor against the Omega Dreadnought. Portfolio playground —
          canvas game loop, procedural SFX, optional gamepad vibration. Not a commercial engine.
        </p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <span key={f}>▸ {f}</span>
          ))}
        </div>
        <button type="button" className="launch-btn" onClick={onPlay}>
          PLAY DEMO
        </button>
      </div>
    </section>
  );
}
