# Cyber-Pulse (Vite + React)

This profile repo includes a small **Vite + React** web app for the browser demo.

## Structure

```text
package.json          # npm scripts & dependencies
vite.config.js        # Vite + React, base /SWAGAT10241/
index.html            # Standalone demo (works without build) OR Vite entry after migration
src/
  main.jsx            # React bootstrap
  App.jsx             # Shell: dashboard ↔ game
  components/         # UI pieces
  game/audio.js       # Web Audio SFX
  styles/global.css   # Theme
assets/               # Profile images + gameplay GIF
.github/workflows/    # CI build + Pages deploy
```

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/SWAGAT10241/`).

```bash
npm run build    # → dist/
npm run preview
```

## GitHub Pages

1. **Settings → Pages → Source: GitHub Actions**
2. Push to `main` runs `.github/workflows/pages.yml` (install → build → deploy `dist/`)

Demo URL after deploy: `https://swagat10241.github.io/SWAGAT10241/`

## Note

Until the Vite entry fully replaces the legacy single-file `index.html`, the **standalone HTML demo still works** via htmlpreview or direct file view. After Pages is enabled with the Actions workflow, the React build is the primary experience.

## Stack

Vite 5 · React 18 · Canvas 2D · Web Audio API
