# 📚 API Reference: `@swagat10241/seasonal-particles`

Complete reference documentation for the `@swagat10241/seasonal-particles` engine.

---

## Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Factory Function: `createSeasonalParticles`](#factory-function-createseasonalparticles)
- [Class: `SeasonalParticles`](#class-seasonalparticles)
  - [Constructor](#constructor)
  - [Methods](#methods)
  - [Configuration Options](#configuration-options)
- [Constants: `SEASONS`](#constants-seasons)
- [TypeScript Definitions](#typescript-definitions)

---

## Installation

```bash
# npm
npm install @swagat10241/seasonal-particles

# pnpm
pnpm add @swagat10241/seasonal-particles

# yarn
yarn add @swagat10241/seasonal-particles
```

---

## Quick Start

```javascript
import { createSeasonalParticles } from '@swagat10241/seasonal-particles';

// Attach to an existing <canvas> element
const canvas = document.getElementById('particles-canvas');

const engine = createSeasonalParticles(canvas, {
  season: 'auto',          // Automatically selects based on current calendar date
  theme: 'dark',           // 'dark' or 'light'
  particleCount: 75,       // Total active particles
  interactive: true,       // Enable cursor repulsion & shockwaves
});

// Clean up when unmounting / navigating away
// engine.destroy();
```

---

## Factory Function: `createSeasonalParticles`

```typescript
function createSeasonalParticles(
  canvas: HTMLCanvasElement,
  options?: Partial<SeasonalParticleOptions>
): SeasonalParticles
```

Convenience helper that initializes a `SeasonalParticles` instance and immediately starts the animation loop.

---

## Class: `SeasonalParticles`

The core simulation class controlling the Canvas rendering loop and physics calculations.

### Constructor

```typescript
const engine = new SeasonalParticles(
  canvas: HTMLCanvasElement,
  options?: Partial<SeasonalParticleOptions>
);
```

#### Parameters
* `canvas` (`HTMLCanvasElement`): The target DOM canvas element.
* `options` (`Partial<SeasonalParticleOptions>`, optional): Configuration object (see [Configuration Options](#configuration-options)).

---

### Methods

#### `engine.setSeason(season: SeasonName | 'auto'): void`
Dynamically changes the active season. Re-initializes particles to match the new botanical geometry and color palette.
```javascript
engine.setSeason('varsha'); // Switch to Monsoon rain streaks & ripples
```

#### `engine.setTheme(theme: 'dark' | 'light'): void`
Updates color saturation and brightness dynamically without destroying particle positions.
```javascript
engine.setTheme('light'); // Switch to high-contrast brighter palette
```

#### `engine.triggerShockwave(x: number, y: number, strength?: number): void`
Manually triggers a radial shockwave burst centered at `(x, y)` in canvas coordinates, scattering nearby particles outward with quadratic falloff.
```javascript
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  engine.triggerShockwave(e.clientX - rect.left, e.clientY - rect.top, 14);
});
```

#### `engine.setWind(wind: { x?: number, y?: number }): void`
Adjusts continuous horizontal drift speed and directional air velocity.
```javascript
engine.setWind({ x: 2.5 }); // Strong easterly breeze
```

#### `engine.pause(): void`
Pauses the `requestAnimationFrame` loop to save battery when the tab is in the background or canvas is scrolled out of viewport.

#### `engine.resume(): void`
Resumes simulation after being paused.

#### `engine.destroy(): void`
Stops the render loop, cancels active timers, cleans up event listeners on `window` and `canvas`, and releases references to prevent memory leaks. Always call this inside React `useEffect` cleanup or Vue `onUnmounted`.

---

### Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `season` | `SeasonName \| 'auto'` | `'auto'` | Active season: `'shishira'`, `'vasanta'`, `'grishma'`, `'varsha'`, `'sharad'`, `'hemanta'`, or `'auto'`. |
| `theme` | `'dark' \| 'light'` | `'dark'` | Palette mode: dark mode or brighter light mode contrast. |
| `particleCount` | `number` | `65` | Number of simultaneous particles on screen (automatically scaled down on mobile). |
| `speed` | `number` | `1.0` | Global simulation velocity multiplier. |
| `wind` | `number` | `0.4` | Base horizontal air current velocity. |
| `interactive` | `boolean` | `true` | Enables mouse/touch repulsion and click shockwave physics. |
| `interactionRadius`| `number` | `140` | Repulsion radius around cursor in pixels. |
| `shockwaveStrength`| `number` | `12` | Initial force velocity applied during click shockwaves. |
| `autoResize` | `boolean` | `true` | Automatically synchronizes canvas resolution to element bounding box and device pixel ratio. |
| `colors` | `string[]` | *Dynamic* | Optional array of hex/rgba colors to override default seasonal palette. |

---

## Constants: `SEASONS`

An object containing available season keys:
```javascript
import { SEASONS } from '@swagat10241/seasonal-particles';

console.log(SEASONS);
// {
//   SHISHIRA: 'shishira',
//   VASANTA: 'vasanta',
//   GRISHMA: 'grishma',
//   VARSHA: 'varsha',
//   SHARAD: 'sharad',
//   HEMANTA: 'hemanta',
// }
```

---

## TypeScript Definitions

Full TypeScript definitions are included in `@swagat10241/seasonal-particles/src/types.d.ts`. You get complete autocompletion and type safety in VS Code and modern IDEs out of the box.
