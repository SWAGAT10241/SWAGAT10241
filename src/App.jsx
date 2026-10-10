import { useCallback, useEffect, useState } from 'react';
import BackgroundWaves from './components/BackgroundWaves.jsx';
import Dashboard from './components/Dashboard.jsx';
import GameView from './components/GameView.jsx';
import TrophyToast from './components/TrophyToast.jsx';
import { AudioEngine } from './game/audio.js';

export default function App() {
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState({ show: false, text: '' });
  const [clock, setClock] = useState('--:--');

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const showTrophy = useCallback((text) => {
    setToast({ show: true, text });
    AudioEngine.trophy();
    setTimeout(() => setToast({ show: false, text: '' }), 3500);
  }, []);

  const startGame = () => {
    AudioEngine.init();
    AudioEngine.boot();
    setPlaying(true);
    setTimeout(() => showTrophy('Combat loop online'), 900);
  };

  return (
    <div className="app-shell">
      <BackgroundWaves />
      <header className="top-bar">
        <div className="brand">
          <span className="ps-mark">PS</span>
          <span>CYBER-PULSE // VOID BREAKER</span>
        </div>
        <div className="status-row">
          <span className="dot" aria-hidden />
          <strong>SWAGAT10241</strong>
          <span>{clock}</span>
        </div>
      </header>
      <main className="main-stage">{!playing && <Dashboard onPlay={startGame} />}</main>
      {playing && <GameView onExit={() => setPlaying(false)} onTrophy={showTrophy} />}
      <TrophyToast show={toast.show} text={toast.text} />
      <footer className="bottom-bar">
        <span>A/D or ←/→ move · Space fire · E parry</span>
        <span>Vite + React · Web Audio · Canvas</span>
      </footer>
    </div>
  );
}
