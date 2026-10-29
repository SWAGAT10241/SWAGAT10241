# Architectural Specification & Design System

## 1. Overview & System Goals
**Cyber-Pulse: Void Breaker** is structured around strict separation of concerns, decoupling the high-frequency rendering/physics engine from the declarative React UI tree, with unified state management and resilient networking.

```
┌────────────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                             │
│       React 18 Component Tree (Header, Dashboard, HUD, Modals)         │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ (Custom Hooks & Actions)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        State Management Layer                          │
│          GameContext + gameReducer (Screen, Score, HP, Toasts)         │
└───────────────────────────┬────────────────────────────────────────────┘
                            │ (Callbacks & Events)
                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Core Domain Engine Layer                         │
│           GameEngine (requestAnimationFrame, Fixed Ticks)              │
│     ├── PlayerShip          ├── BossDreadnought   ├── Projectiles      │
│     ├── CollisionSystem     ├── ParticleSystem    └── AudioEngine      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Architecture

```text
SWAGAT10241/
├── docs/                       # Architectural & API documentation
│   ├── ARCHITECTURE.md
│   └── API.md
├── legacy/                     # Archived legacy single-file demo
│   └── standalone.html
├── public/                     # Static distribution assets
│   ├── favicon.svg
│   ├── gameplay-demo.gif
│   └── profile.png
├── src/
│   ├── api/                    # Scalable REST & Mock API client
│   │   ├── client.js           # Resilient HTTP client with interceptors
│   │   ├── endpoints.js        # Central endpoint constants
│   │   ├── error.js            # ApiError, NetworkError, TimeoutError
│   │   └── services/           # Domain API services (Leaderboard, Profile)
│   ├── config/                 # Environment & game tuning configs
│   │   ├── env.js              # Type-safe environment validation
│   │   ├── game.config.js      # Gameplay mechanics tuning
│   │   └── theme.config.js     # PlayStation design system tokens
│   ├── context/                # Centralized state management
│   │   ├── GameContext.jsx     # Context provider with localStorage sync
│   │   └── gameReducer.js      # Pure reducer with action types
│   ├── game/                   # Decoupled business & simulation logic
│   │   ├── audio/              # Procedural Web Audio API sound generator
│   │   ├── core/               # Canvas 2D engine, collision & particles
│   │   ├── entities/           # Ship, Boss, and Projectiles
│   │   └── input/              # Unified keyboard, touch & gamepad controller
│   ├── hooks/                  # Reusable custom React hooks
│   │   ├── useClock.js         # Real-time console clock
│   │   ├── useGame.js          # GameContext consumer
│   │   └── useGamepad.js       # Gamepad API integration
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Primitives: Button, Badge, Modal, Toast, ErrorBoundary
│   │   ├── layout/             # Shell: Header, Footer, BackgroundWaves
│   │   ├── dashboard/          # Views: Dashboard, HeroCard, LeaderboardModal
│   │   └── game/               # In-Game: GameView, GameHUD, VirtualControls, GameOverModal
│   ├── styles/                 # Modular CSS architecture
│   │   ├── variables.css       # CSS custom properties
│   │   ├── components.css      # Component-level styling
│   │   └── global.css          # Reset & base canvas styling
│   ├── utils/                  # Helpers: logger, storage, formatters
│   ├── App.jsx                 # Application root orchestrator
│   └── main.jsx                # Application bootstrap
├── index.html                  # Vite application HTML entry
├── vite.config.js              # Build & alias configuration
└── package.json                # Project dependencies & scripts
```

---

## 3. Separation of Concerns

### A. Business Logic vs. UI
- **Pure Game Logic**: `GameEngine`, `PlayerShip`, `BossDreadnought`, and `CollisionSystem` are standard ES6 classes with **zero React DOM dependencies**. They can run in headless tests or Node canvas environments.
- **Event-Driven Communication**: When game state changes (score, HP, boss status), `GameEngine` dispatches through subscribed callback listeners without knowing anything about React components.
- **Presentation**: Components (`GameHUD`, `HeroCard`, `LeaderboardModal`) render state provided via React Context and dispatch actions.

### B. Input Abstraction
`InputController` unifies four distinct input vectors:
1. **Cursor & Pointer**: High-precision mouse / pointer tracking with smooth target interpolation, in-canvas targeting reticle, Left-Click fire, and Right-Click parry.
2. **Keyboard**: WASD and arrow keys with Spacebar fire and `E` parry.
3. **Virtual Touch**: On-screen touch buttons for mobile devices and tablets.
4. **Standard Gamepad / DualSense**: Native analog stick and D-Pad with dual-rumble haptic feedback via `navigator.getGamepads()`.

---

## 4. State Management
The project implements a centralized state machine with `GameContext` and `gameReducer`:
- **Screen Navigation**: Toggle between `DASHBOARD` and `GAME`
- **Scores & Persistence**: Automatic high score persistence to `localStorage` with error handling
- **HUD Telemetry**: Player health, boss health, render FPS
- **Audio & Haptics Toggles**: Saved to persistent storage and mirrored into the procedural audio synthesizer

---

## 5. Comprehensive Error Handling Strategy
1. **React Runtime Crashes**: Caught by `ErrorBoundary.jsx`, presenting a PlayStation-themed diagnostic screen with reboot and recovery actions.
2. **Web Audio Policies**: Handled in `AudioEngine.js`, safely handling browser autoplay restrictions and un-suspended context errors without throwing uncaught exceptions.
3. **Canvas 2D Context Failure**: Handled in `GameView.jsx` and `GameEngine.js` with fallback error cards.
4. **Network & API Failures**: `client.js` wraps `fetch` with `AbortController` timeouts and custom error classes (`NetworkError`, `TimeoutError`, `ApiError`).
5. **Storage Quotas**: `storage.js` wraps all `localStorage` reads/writes in `try/catch` blocks.

