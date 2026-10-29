/**
 * @fileoverview Application Root Shell Component
 */
import React from 'react';
import { GameProvider } from './context/GameContext.jsx';
import { useGame } from './hooks/useGame.js';
import { SCREENS } from './context/gameReducer.js';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { BackgroundWaves } from './components/layout/BackgroundWaves.jsx';
import { Dashboard } from './components/dashboard/Dashboard.jsx';
import { GameView } from './components/game/GameView.jsx';
import { Toast } from './components/common/Toast.jsx';
import { CustomCursor } from './components/common/CustomCursor.jsx';

function MainShell() {
  const { currentScreen } = useGame();

  return (
    <div className="app-root-shell">
      <CustomCursor />
      <BackgroundWaves />

      {currentScreen === SCREENS.DASHBOARD && (
        <>
          <Header />
          <main className="main-content-stage">
            <Dashboard />
          </main>
          <Footer />
        </>
      )}

      {currentScreen === SCREENS.GAME && <GameView />}

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <MainShell />
      </GameProvider>
    </ErrorBoundary>
  );
}
