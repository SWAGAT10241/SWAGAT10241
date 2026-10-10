const FEATURES = [
  'Canvas render loop',
  'Web Audio synthesizer',
  'Keyboard + touch',
  'Optional gamepad rumble',
];

export default function Dashboard({ onPlay }) {
  return (
    <section className="hero-card">
      <div className="hero-visual">
        <img
          src={`${import.meta.env.BASE_URL}gameplay-demo.gif`}
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
          Pilot the Interceptor against the Omega Dreadnought. Built as a small
          portfolio playground — canvas game loop, procedural SFX, and optional
          DualSense-compatible vibration. Not a commercial game engine.
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
