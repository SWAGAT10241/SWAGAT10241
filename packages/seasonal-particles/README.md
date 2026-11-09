# @swagat10241/seasonal-particles

> Ultra-lightweight, zero-dependency, 60 FPS atmospheric particle engine with **interactive cursor repulsion**, **click shockwaves**, and **3D aerodynamic botanical physics** for Canvas 2D and modern web applications.

[![npm version](https://img.shields.io/badge/npm-v1.0.0-0070D1.svg?style=flat-square)](https://github.com/SWAGAT10241/SWAGAT10241)
[![license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![bundle size](https://img.shields.io/badge/dependencies-0%20(Zero!)-success.svg?style=flat-square)](https://github.com/SWAGAT10241/SWAGAT10241)

---

## ✨ Features

- ⚡ **Zero Dependencies (`0 KB` added dependencies)**: No heavy third-party baggage, no vulnerability warnings. Pure, high-performance Canvas 2D.
- 🎯 **Interactive Cursor Repulsion**: Particles detect mouse proximity and naturally deflect/push away from the cursor with physical damping.
- 💥 **Click Shockwaves**: Clicking triggers expanding radial shockwaves that scatter particles in real-time.
- 🍁 **Botanical & Crystalline Realism**:
  - **Autumn & Pre-Winter**: True 5-lobed Sugar Maple leaves with delicate venation + sinuous Oak leaves tumbling in 3D (`scaleX(cos(tilt))`).
  - **Winter**: 6-arm dendritic fractal snowflakes with secondary chevron spines.
  - **Monsoon**: High-velocity slanted rain streaks with surface impact ripple rings.
  - **Spring**: Swirling cherry blossom sakura petals.
  - **Summer**: Bioluminescent floating solar fireflies with pulsating sine glow.
- 🗓️ **6-Season Atmospheric Cycle**: Full support for traditional climatological and Shada Ritu cycles.
- 📱 **Mobile & Desktop Optimized**: Adaptive particle density and window resize handling.

---

## 📦 Installation

```bash
npm install @swagat10241/seasonal-particles
```

or with yarn / pnpm:

```bash
yarn add @swagat10241/seasonal-particles
# or
pnpm add @swagat10241/seasonal-particles
```

---

## 🚀 Quick Start (Vanilla JavaScript / HTML5 Canvas)

```html
<canvas id="weatherCanvas" style="position: fixed; inset: 0; pointer-events: none;"></canvas>

<script type="module">
  import { SeasonalParticles, SEASONS } from '@swagat10241/seasonal-particles';

  const canvas = document.getElementById('weatherCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Initialize engine with pre-winter frosted aurora & cursor repulsion
  const engine = new SeasonalParticles(canvas.width, canvas.height, {
    season: SEASONS.PREWINTER,
    cursorRadius: 130,
    cursorStrength: 5.0,
  });

  // Track cursor
  window.addEventListener('mousemove', (e) => engine.onMouseMove(e.clientX, e.clientY));
  window.addEventListener('mouseleave', () => engine.onPointerLeave());
  window.addEventListener('click', (e) => engine.onClick(e.clientX, e.clientY));

  // 60 FPS Loop
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    engine.update();
    engine.draw(ctx);
    requestAnimationFrame(loop);
  }
  loop();
</script>
```

---

## ⚛️ Quick Start (React Component)

```jsx
import React, { useEffect, useRef } from 'react';
import { SeasonalParticles, SEASONS } from '@swagat10241/seasonal-particles';

export function WeatherBackground({ season = SEASONS.WINTER }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engine = new SeasonalParticles(canvas.width, canvas.height, season);
    engineRef.current = engine;

    const onMove = (e) => engine.onMouseMove(e.clientX, e.clientY);
    const onLeave = () => engine.onPointerLeave();
    const onClick = (e) => engine.onClick(e.clientX, e.clientY);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('click', onClick);

    let rafId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      engine.update();
      engine.draw(ctx);
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('click', onClick);
    };
  }, [season]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}
```

---

## 📖 API Reference

### `new SeasonalParticles(width, height, options)`

#### Options:
| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `season` | `string` | `'winter'` | `'winter'` \| `'spring'` \| `'summer'` \| `'rain'` \| `'autumn'` \| `'prewinter'` \| `'waves'` |
| `cursorRadius` | `number` | `120` | Detection radius in px where particles begin deflecting |
| `cursorStrength` | `number` | `4.5` | Force applied to push particles away |
| `enableCursorRepulsion` | `boolean` | `true` | Enable/disable mouse repulsion |
| `enableClickShockwave` | `boolean` | `true` | Enable/disable click scatter wave |

#### Methods:
- `engine.setSeason(newSeason)`: Dynamically change the season and re-seed the particles.
- `engine.onMouseMove(x, y)`: Pass cursor coordinates for real-time repulsion.
- `engine.onPointerLeave()`: Deactivate cursor repulsion when cursor leaves the viewport.
- `engine.onClick(x, y)`: Trigger a physical shockwave that scatters particles outward.
- `engine.update()`: Advance physics calculation by 1 frame.
- `engine.draw(ctx)`: Render particles and ripples to the Canvas 2D context.
- `engine.resize(width, height)`: Recalculate boundary bounds on window resize.

---

## 📄 License

MIT © [Swagat Sourav Dhar](https://github.com/SWAGAT10241)
