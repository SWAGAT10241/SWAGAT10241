# Cyber-Pulse: Void Breaker (Vite + React)

A modular, high-performance browser arcade experience and PlayStation-themed console OS playground built with **React 18**, **Vite 5**, **HTML5 Canvas 2D**, and the **Web Audio API**.

---

## 📁 Project Architecture & Folder Structure

```text
SWAGAT10241/
├── .env.example                     # Environment configuration template
├── .env                             # Active environment configuration
├── docs/
│   ├── ARCHITECTURE.md              # System design & separation of concerns
│   └── API.md                       # Scalable API architecture & contracts
├── legacy/
│   └── standalone.html              # Preserved monolithic legacy single-file demo
├── public/                          # Static distribution assets
│   ├── favicon.svg                  # Brand favicon
│   ├── gameplay-demo.gif            # Game visual preview
│   └── profile.png                  # Profile avatar asset
├── src/
│   ├── api/                         # Scalable API client & services
│   │   ├── client.js                # Resilient Fetch client with interceptors
│   │   ├── endpoints.js             # Centralized endpoint dictionary
│   │   ├── error.js                 # Custom ApiError & NetworkError hierarchy
│   │   └── services/                # Domain services
│   │       ├── leaderboardService.js # High scores with local cache fallback
│   │       └── profileService.js    # User stats & achievements sync
│   ├── config/                      # Environment & Game configurations
│   │   ├── env.js                   # Type-safe, validated environment variables
│   │   ├── game.config.js           # Gameplay parameters, physics & scoring
│   │   └── theme.config.js          # Design system & console UI theme tokens
│   ├── context/                     # Centralized state management
│   │   ├── GameContext.jsx          # Context provider with localStorage sync
│   │   └── gameReducer.js           # Pure state transition reducer
│   ├── game/                        # Decoupled business & simulation logic
│   │   ├── audio/
│   │   │   ├── AudioEngine.js       # Procedural Web Audio API sound generator
│   │   │   └── haptics.js           # DualSense & Gamepad vibration actuator
│   │   ├── core/
│   │   │   ├── GameEngine.js        # Decoupled Canvas 2D engine & game loop
│   │   │   ├── CollisionSystem.js   # Bounding box & distance collision checks
│   │   │   └── ParticleSystem.js    # Spark & explosion effects
│   │   ├── entities/
│   │   │   ├── PlayerShip.js        # Player state, movement, parry bubble
│   │   │   ├── BossDreadnought.js   # Boss movement patterns, HP, phases
│   │   │   └── Projectile.js        # Player & enemy lasers / bullets
│   │   └── input/
│   │       └── InputController.js   # Unified keyboard, touch & gamepad input
│   ├── hooks/                       # Custom reusable React hooks
│   │   ├── useClock.js              # Real-time console clock hook
│   │   ├── useGame.js               # Convenience hook for GameContext
│   │   └── useGamepad.js            # Gamepad connection & polling hook
│   ├── components/                  # Modular UI components
│   │   ├── common/                  # Reusable UI primitives
│   │   │   ├── Badge.jsx            # Status badge
│   │   │   ├── Button.jsx           # Styled button with variants
│   │   │   ├── ErrorBoundary.jsx    # React Error Boundary for resilient crash recovery
│   │   │   ├── Modal.jsx            # Accessible dialog shell
│   │   │   └── Toast.jsx            # PlayStation trophy notification
│   │   ├── layout/                  # Shell & ambient layout
│   │   │   ├── Header.jsx           # PlayStation OS top navigation bar
│   │   │   ├── Footer.jsx           # Controller hints & footer bar
│   │   │   └── BackgroundWaves.jsx  # Ambient procedural light ribbons
│   │   ├── dashboard/               # Dashboard view
│   │   │   ├── Dashboard.jsx        # Main console dashboard
│   │   │   ├── HeroCard.jsx         # Enhanced hero game launch card
│   │   │   └── LeaderboardModal.jsx # Live leaderboard & score viewer
│   │   └── game/                    # Game view UI
│   │       ├── GameView.jsx         # Game canvas container & engine lifecycle
│   │       ├── GameHUD.jsx          # Health bars, stage info, score & FPS counter
│   │       ├── VirtualControls.jsx  # On-screen touch buttons for mobile/tablets
│   │       └── GameOverModal.jsx    # Victory / Defeat summary modal
│   ├── styles/                      # Modular CSS stylesheets
│   │   ├── variables.css            # CSS custom properties
│   │   ├── global.css               # Base reset & typography
│   │   └── components.css           # Modular component styling
│   ├── utils/                       # Shared helpers & utilities
│   │   ├── formatters.js            # Number formatting (score padding, time)
│   │   ├── logger.js                # Environment-aware structured logger
│   │   └── storage.js               # LocalStorage wrapper with error handling
│   ├── App.jsx                      # Root application component
│   └── main.jsx                     # Application bootstrap
├── index.html                       # Vite HTML entry point
├── vite.config.js                   # Vite configuration with path aliases
└── package.json                     # Dependencies & npm scripts
```

---

## ⚙️ Environment Configuration

Environment settings are defined in `.env` and type-safely exposed via `src/config/env.js`:

| Key | Description | Default |
| :--- | :--- | :--- |
| `VITE_APP_TITLE` | Application Title | `CYBER-PULSE: VOID BREAKER` |
| `VITE_ENABLE_SOUND` | Toggle procedural sound | `true` |
| `VITE_ENABLE_HAPTICS` | Enable gamepad rumble | `true` |
| `VITE_ENABLE_MOCK_API` | Enable mock API fallback | `true` |
| `VITE_API_BASE_URL` | Base URL for REST services | `https://api.swagat10241.dev/v1` |
| `VITE_API_TIMEOUT_MS` | Request timeout duration | `8000` |

---

## 🕹️ Controls

- **Cursor / Mouse Movement:** Move cursor across canvas to smoothly track player ship position
- **Mouse Firing & Deflection:** Left-Click fires lasers continuously · Right-Click activates Parry shield
- **Keyboard Movement:** `A` / `D` or `←` / `→`
- **Keyboard Actions:** `Space` fires weapon · `E` activates Parry energy barrier
- **Gamepad / DualSense:** Left Analog / D-Pad moves · `✕` / `R2` fires · `○` / `L2` parries with dual-rumble
- **Mobile / Touch:** Virtual on-screen touch buttons appear automatically on mobile devices

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Production build
npm run build

# 4. Preview production build
npm run preview
```

---

## 🛡️ Error Handling Everywhere

- **React Crashes:** Caught by `ErrorBoundary` with console diagnostic report and recovery actions.
- **Web Audio Errors:** Safe initialization, autoplay unblocker, and suspended context handling in `AudioEngine`.
- **Canvas Failures:** Context verification with fallback notification.
- **API Resilience:** Network timeout cancellation, structured `ApiError` hierarchy, and offline `localStorage` fallback.
