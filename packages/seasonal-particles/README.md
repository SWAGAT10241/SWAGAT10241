# 🍂 `@swagat10241/seasonal-particles`

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Zero)-success?style=for-the-badge)](package.json)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-2.1%20kB%20gzipped-orange?style=for-the-badge)](docs/BENCHMARKS.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](src/types.d.ts)
[![Discussions](https://img.shields.io/badge/Community-Discussions-purple?style=for-the-badge&logo=github)](https://github.com/SWAGAT10241/seasonal-particles/discussions)

**Ultra-lightweight, zero-dependency, 60 FPS atmospheric seasonal particle engine with interactive cursor repulsion, click shockwaves, and 3D aerodynamic physics.**

[🎮 Try Live Interactive Demo](https://swagat10241.github.io/SWAGAT10241/) • [📚 Documentation](docs/API.md) • [💬 Join GitHub Discussions](https://github.com/SWAGAT10241/seasonal-particles/discussions)

</div>

---

## ✨ Features

- 🍃 **Procedural Botanical Geometry**: True 5-lobed Sugar Maple leaves with venation, sinuous English Oak leaves, 6-arm dendritic crystal snowflakes, cherry blossoms, and expanding water ripple rings.
- ⚡ **Zero Runtime Dependencies**: No heavy physics engines, no bloat. Pure Canvas 2D math running fluidly at 60–120 FPS under 2.1 kB gzipped.
- 🗓 **Full 6-Season Cycle (*Shada Ritu*)**: Shishira (Winter), Vasanta (Spring), Grishma (Summer), Varsha (Monsoon), Sharad (Autumn), and Hemanta (Pre-Winter / Frost).
- 🖱 **Interactive Cursor Physics**: Real-time cursor repulsion evasion and click-triggered radial shockwave blasts with quadratic distance falloff.
- 🌓 **Dual Theming**: Tailored high-contrast color palettes for both Dark Mode and Brighter Light Mode.
- 📱 **Mobile & Battery Optimized**: Automatic High-DPI Retina scaling (`devicePixelRatio`), automatic window resizing, and tab visibility throttling.
- 🧩 **Universal Compatibility**: Works seamlessly with React, Next.js (SSR), Vue 3, Svelte, Angular, or Vanilla HTML/JS.

---

## 📦 Installation

```bash
# npm
npm install @swagat10241/seasonal-particles

# pnpm
pnpm add @swagat10241/seasonal-particles

# yarn
yarn add @swagat10241/seasonal-particles
```

---

## 🚀 Quick Start

### Vanilla JavaScript

```html
<canvas id="particles-canvas"></canvas>

<script type="module">
  import { createSeasonalParticles } from '@swagat10241/seasonal-particles';

  const canvas = document.getElementById('particles-canvas');
  const engine = createSeasonalParticles(canvas, {
    season: 'auto',      // Detects current season from calendar date
    theme: 'dark',       // 'dark' or 'light'
    particleCount: 65,   // Number of active particles
    interactive: true,   // Cursor repulsion & click shockwaves
  });
</script>
```

### React / Next.js

```tsx
import React, { useEffect, useRef } from 'react';
import { createSeasonalParticles } from '@swagat10241/seasonal-particles';

export const SeasonalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = createSeasonalParticles(canvasRef.current, {
      season: 'auto',
      theme: 'dark',
      interactive: true,
    });
    return () => engine.destroy();
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }} />;
};
```

*For Next.js App Router, Vue 3, and Svelte setups, see the [Framework Integration Guide](docs/FRAMEWORKS.md).*

---

## 🌿 The 6 Seasons (*Shada Ritu*)

| Season Key | Season Name | Date Range | Visual Botanical Effects |
| :--- | :--- | :--- | :--- |
| `shishira` | **Shishira** (*Winter*) | Jan 15 – Mar 14 | 6-arm dendritic crystal snowflakes with secondary barbules & soft drifts |
| `vasanta` | **Vasanta** (*Spring*) | Mar 15 – May 14 | Sakura cherry blossom petals with notched tips & 3D helical flutter |
| `grishma` | **Grishma** (*Summer*) | May 15 – Jun 30 | Golden fireflies, sunlit pollen dust motes & gentle wandering buoyancy |
| `varsha` | **Varsha** (*Monsoon*) | Jul 01 – Aug 31 | Angled rain streaks with expanding water impact ripple rings on ground |
| `sharad` | **Sharad** (*Autumn*) | Sep 01 – Oct 31 | 5-lobed Sugar Maple leaves with central and lateral leaf venation |
| `hemanta` | **Hemanta** (*Pre-Winter*) | Nov 01 – Jan 14 | Sinuous English Oak leaves with rounded lobes, frosty highlights & aurora dust |

*Read the [Seasons & Botanical Guide](docs/SEASONS.md) for geometry deep-dives and custom palette overrides.*

---

## ⚙️ Interactive Controls & API

```javascript
// Dynamically switch season at runtime
engine.setSeason('vasanta');

// Toggle between Dark and Light mode
engine.setTheme('light');

// Trigger a custom radial shockwave blast at coordinates (x, y)
engine.triggerShockwave(window.innerWidth / 2, window.innerHeight / 2, 16);

// Adjust wind velocity
engine.setWind({ x: 1.8 });

// Pause / Resume rendering loop
engine.pause();
engine.resume();

// Clean up memory and event listeners
engine.destroy();
```

*See the full [API Reference](docs/API.md) for all options and parameter schemas.*

---

## 📊 Performance Benchmarks

| Metric | `@swagat10241/seasonal-particles` | `tsparticles` | `react-snowfall` |
| :--- | :---: | :---: | :---: |
| **Runtime Dependencies** | **0 (Zero)** | 14+ | 2 |
| **Gzipped Size** | **~2.1 kB** | ~41.8 kB | ~4.3 kB |
| **Frame Time (100 particles)**| **0.85 ms** | 4.20 ms | 1.95 ms |
| **Memory Allocation** | **Recycled Object Pool** | High GC churn | Small GC churn |
| **Interactive Shockwaves** | **Built-in** | Plugin needed | Not supported |

*Full analysis in [Performance & Benchmarks](docs/BENCHMARKS.md).*

---

## 💬 Community & Discussions

We welcome ideas, showcases, questions, and feature requests:
- 💡 [Propose New Ideas & Visuals](https://github.com/SWAGAT10241/seasonal-particles/discussions/categories/ideas)
- ❓ [Ask for Help & Integration Advice](https://github.com/SWAGAT10241/seasonal-particles/discussions/categories/q-and-a)
- 🎨 [Show Off Your Project](https://github.com/SWAGAT10241/seasonal-particles/discussions/categories/show-and-tell)
- 💬 [General Discussions](https://github.com/SWAGAT10241/seasonal-particles/discussions/categories/general)

Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 License

MIT © [Swagat Sourav Dhar](https://github.com/SWAGAT10241)
