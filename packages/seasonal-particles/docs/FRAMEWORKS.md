# ⚡ Framework Integration Guides

`@swagat10241/seasonal-particles` is designed as a pure zero-dependency canvas engine that drops effortlessly into any frontend framework.

---

## Table of Contents
- [React 18 & 19](#react-18--19)
- [Next.js (App Router / SSR)](#nextjs-app-router--ssr)
- [Vue 3](#vue-3)
- [Svelte 4 & 5](#svelte-4--5)
- [Vanilla JavaScript / HTML](#vanilla-javascript--html)

---

## React 18 & 19

Create a reusable component using standard React hooks (`useRef`, `useEffect`):

```tsx
// components/SeasonalBackground.tsx
import React, { useEffect, useRef } from 'react';
import { createSeasonalParticles, SeasonalParticles } from '@swagat10241/seasonal-particles';

interface Props {
  season?: 'shishira' | 'vasanta' | 'grishma' | 'varsha' | 'sharad' | 'hemanta' | 'auto';
  theme?: 'dark' | 'light';
  particleCount?: number;
}

export const SeasonalBackground: React.FC<Props> = ({
  season = 'auto',
  theme = 'dark',
  particleCount = 65,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SeasonalParticles | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    engineRef.current = createSeasonalParticles(canvasRef.current, {
      season,
      theme,
      particleCount,
      interactive: true,
    });

    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  // Update theme dynamically without re-mounting
  useEffect(() => {
    engineRef.current?.setTheme(theme);
  }, [theme]);

  // Update season dynamically
  useEffect(() => {
    engineRef.current?.setSeason(season);
  }, [season]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // Allow clicks to pass through to UI
        zIndex: 0,
      }}
    />
  );
};
```

---

## Next.js (App Router / SSR)

Since Canvas relies on browser APIs (`window`, `HTMLCanvasElement`, `requestAnimationFrame`), load it with `'use client'` or dynamic import:

```tsx
// app/components/SeasonalBackgroundWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const SeasonalBackground = dynamic(
  () => import('./SeasonalBackground').then((mod) => mod.SeasonalBackground),
  { ssr: false }
);

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <SeasonalBackground season="auto" theme="dark" />
      <div className="relative z-10">
        <h1>Welcome to my website</h1>
      </div>
    </main>
  );
}
```

---

## Vue 3

Using Vue 3 Composition API (`<script setup>`):

```vue
<!-- components/SeasonalBackground.vue -->
<template>
  <canvas ref="canvasEl" class="seasonal-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { createSeasonalParticles } from '@swagat10241/seasonal-particles';

const props = defineProps({
  season: { type: String, default: 'auto' },
  theme: { type: String, default: 'dark' },
});

const canvasEl = ref(null);
let engine = null;

onMounted(() => {
  if (canvasEl.value) {
    engine = createSeasonalParticles(canvasEl.value, {
      season: props.season,
      theme: props.theme,
      interactive: true,
    });
  }
});

watch(() => props.season, (newSeason) => {
  engine?.setSeason(newSeason);
});

watch(() => props.theme, (newTheme) => {
  engine?.setTheme(newTheme);
});

onUnmounted(() => {
  engine?.destroy();
});
</script>

<style scoped>
.seasonal-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
}
</style>
```

---

## Svelte 4 & 5

Using Svelte `onMount`:

```svelte
<!-- SeasonalBackground.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { createSeasonalParticles } from '@swagat10241/seasonal-particles';

  export let season = 'auto';
  export let theme = 'dark';

  let canvas;
  let engine;

  onMount(() => {
    engine = createSeasonalParticles(canvas, {
      season,
      theme,
      interactive: true,
    });
  });

  onDestroy(() => {
    engine?.destroy();
  });

  $: engine?.setSeason(season);
  $: engine?.setTheme(theme);
</script>

<canvas bind:this={canvas} class="seasonal-canvas" />

<style>
  .seasonal-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
  }
</style>
```

---

## Vanilla JavaScript / HTML

Simply include a `<canvas>` element and initialize:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Seasonal Particles Demo</title>
  <style>
    body { margin: 0; background: #0f172a; overflow: hidden; }
    #particles { position: fixed; inset: 0; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <canvas id="particles"></canvas>

  <script type="module">
    import { createSeasonalParticles } from './src/index.js';

    const canvas = document.getElementById('particles');
    const engine = createSeasonalParticles(canvas, {
      season: 'auto',
      theme: 'dark',
      interactive: true,
    });
  </script>
</body>
</html>
```
