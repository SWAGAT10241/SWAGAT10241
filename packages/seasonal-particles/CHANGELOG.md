# Changelog

All notable changes to `@swagat10241/seasonal-particles` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-09

### Added
- **Complete 6-Season Engine (*Shada Ritu*)**:
  - `shishira` (Winter): 6-arm dendritic crystal snowflakes with procedural branching.
  - `vasanta` (Spring): Sakura cherry blossom petals with asymmetrical notched tips and 3D fluttering.
  - `grishma` (Summer): High-contrast golden embers, sunlit pollen dust, and atmospheric heat motes.
  - `varsha` (Monsoon): Realistic angled rain streaks with concentric water impact ripple rings on canvas bottom.
  - `sharad` (Autumn): 5-lobed Sugar Maple leaves with procedural central and lateral leaf venation.
  - `hemanta` (Pre-Winter / Frost): Sinuous English Oak leaves with rounded lobes, frosty silver highlights, and aurora embers.
- **Dynamic Theming Support**:
  - Dual `dark` and `light` (brighter) mode color palettes for maximum readability across light interfaces and dark themes.
- **Interactive Cursor Physics**:
  - Distance-based cursor repulsion with velocity damping.
  - Click-triggered radial shockwave blasts with quadratic distance falloff.
- **Zero-Dependency Architecture**:
  - Standard HTML5 Canvas 2D implementation with no external runtime dependencies.
  - High-DPI Retina screen auto-scaling (`window.devicePixelRatio`).
  - Automatic window resize handling and resource cleanup on `.destroy()`.
- **TypeScript Support**:
  - Strict type definitions in `src/types.d.ts` for all configuration parameters, seasons, themes, and methods.
- **Comprehensive Documentation & Community Suite**:
  - GitHub Discussions templates (Ideas, Q&A, Show & Tell, General).
  - Issue templates and PR templates.
  - Documentation guides (`API.md`, `SEASONS.md`, `FRAMEWORKS.md`, `BENCHMARKS.md`).
  - Standalone zero-build interactive demo in `demo/index.html`.
