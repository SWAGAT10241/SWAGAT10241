# Contributing to `@swagat10241/seasonal-particles`

First off, thank you for considering contributing! Projects like this thrive because of community contributors like you.

---

## 🧭 Code of Conduct

This project is governed by the [Contributor Covenant v2.1](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## 🚀 Getting Started

### 1. Fork and Clone
```bash
git clone https://github.com/<your-username>/seasonal-particles.git
cd seasonal-particles
```

### 2. Zero-Dependency Philosophy
`@swagat10241/seasonal-particles` has a strict **zero-runtime-dependency constraint**. All procedural geometry (botanical leaf venation, dendritic snowflakes, water surface ripple physics) and aerodynamic vectors run directly on standard HTML5 Canvas 2D without pulling in heavy math or animation libraries.

When contributing:
- ❌ Do not add external runtime packages (`npm install <library>`).
- ✅ Use pure JavaScript / Canvas 2D math (`Math.sin`, `Math.cos`, Bezier paths, offscreen canvas pre-caching where applicable).
- Keep minified bundle size under 8 kB.

### 3. Running the Demo Locally
No build step or bundler is required to test changes! Open the standalone test harness in any browser:
```bash
# Using Python built-in server:
python3 -m http.server 8080

# Or using Node:
npx serve .
```
Visit `http://localhost:8080/demo/` to test seasonal switches, cursor repulsion, shockwaves, and FPS in real-time.

---

## 🛠 Project Structure

```
seasonal-particles/
├── .github/
│   ├── DISCUSSION_TEMPLATE/   # Ideas, Q&A, and Showcase templates
│   ├── ISSUE_TEMPLATE/        # Structured bug & feature templates
│   ├── workflows/             # CI & automated GitHub Pages deployment
│   └── PULL_REQUEST_TEMPLATE.md
├── demo/
│   └── index.html             # Zero-build interactive HTML5 demo playground
├── docs/
│   ├── API.md                 # Complete method & options reference
│   ├── SEASONS.md             # Guide to the 6 Shada Ritu cycles & palettes
│   ├── FRAMEWORKS.md          # React, Next.js, Vue, Svelte, Angular setups
│   └── BENCHMARKS.md          # 60 FPS performance & memory analysis
├── src/
│   ├── SeasonalEngine.js      # Core zero-dependency canvas particle engine
│   ├── index.js               # Module entry point
│   └── types.d.ts             # Strict TypeScript definitions
├── CHANGELOG.md               # Version history
├── CODE_OF_CONDUCT.md         # Community standards
├── CONTRIBUTING.md            # This contributor guide
├── LICENSE                    # MIT License
├── README.md                  # Main overview and quickstart
└── SECURITY.md                # Vulnerability disclosure process
```

---

## 🌿 Contribution Guidelines

### Adding a New Season or Effect
1. Open a discussion in [GitHub Discussions: Ideas](https://github.com/SWAGAT10241/seasonal-particles/discussions/categories/ideas) to pitch the concept and visual style.
2. Ensure colors include both `dark` and `light` (brighter) modes for high contrast across terminals and bright surfaces.
3. Keep rendering procedural using Canvas paths (`ctx.beginPath()`, `ctx.bezierCurveTo()`, `ctx.arc()`) rather than static bitmap assets.

### TypeScript Definitions
Whenever modifying options or public methods on `SeasonalParticles`:
1. Update `src/SeasonalEngine.js`.
2. Update `src/types.d.ts` with matching interfaces and docstrings.
3. Validate types using `npx tsc --noEmit`.

---

## 🔄 Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feat/cherry-blossom-flutter
   ```
2. Commit with conventional commit messages:
   ```bash
   git commit -m "feat(physics): add realistic angular tilt to cherry blossom flutter"
   ```
3. Push to your fork:
   ```bash
   git push origin feat/cherry-blossom-flutter
   ```
4. Open a Pull Request pointing to `main` on `SWAGAT10241/seasonal-particles`.
5. Complete the checklist in the PR template.

---

## 💬 Community & Discussions

Got questions or want to collaborate?
- Join the conversations in [GitHub Discussions](https://github.com/SWAGAT10241/seasonal-particles/discussions).
- Maintainer email: [swagatsourav10241@gmail.com](mailto:swagatsourav10241@gmail.com)
