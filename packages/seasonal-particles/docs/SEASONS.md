# 🌿 Seasonal Cycles & Botanical Geometry Guide

`@swagat10241/seasonal-particles` implements the complete classical 6-season cycle (*Shada Ritu*), capturing the micro-climatic transformations of nature throughout the year.

---

## The 6 Seasons (*Shada Ritu*)

| Season Key | Sanskrit / Name | Traditional Calendar Range | Botanical & Atmospheric Effect |
| :--- | :--- | :--- | :--- |
| `shishira` | **Shishira** (*Deep Winter*) | Jan 15 – Mar 14 | **6-arm dendritic crystal snowflakes** with procedural secondary branching and soft tumbling drifts. |
| `vasanta` | **Vasanta** (*Spring*) | Mar 15 – May 14 | **Sakura cherry blossom petals** with notched tips, 3D helical flutter, and soft pink/rose palettes. |
| `grishma` | **Grishma** (*Summer*) | May 15 – Jun 30 | **Golden fireflies & sunlight pollen**, slow wandering buoyancy, and warm ambient glowing particles. |
| `varsha` | **Varsha** (*Monsoon*) | Jul 01 – Aug 31 | **Realistic angled rain streaks** with expanding concentric surface impact ripple rings on canvas bottom. |
| `sharad` | **Sharad** (*Autumn*) | Sep 01 – Oct 31 | **5-lobed Sugar Maple leaves** with realistic central and lateral leaf venation, fiery amber/crimson hues. |
| `hemanta` | **Hemanta** (*Pre-Winter*) | Nov 01 – Jan 14 | **Frosted English Oak leaves** with sinuous rounded lobes, icy silver tips, and ethereal aurora dust. |

---

## Botanical Geometry Architecture

Unlike standard particle engines that draw simple squares or fuzzy circles, `@swagat10241/seasonal-particles` constructs true vector paths per particle type:

### 1. Sugar Maple Leaf (`sharad`)
- Modeled with a **5-lobed palmate geometry** using quadratic Bezier curves.
- Features **central rachis and lateral leaf veins** rendered with adaptive line opacity.
- 3D tumbling physics: dynamically modulates horizontal scale factor (`cos(angle)`) to simulate realistic rotational flipping through air currents.

### 2. English Oak Leaf (`hemanta`)
- Rendered with **sinuous, rounded pinnatifid lobes** and an elongated stem base.
- Frosted leaf tips rendered with layered translucent gradients, shifting from bronze to cool icy highlights.

### 3. Dendritic Snow Crystals (`shishira`)
- Procedural **hexagonal crystal lattice**: 6 primary hexagonal axes branching symmetrically at 60° increments.
- Includes randomized secondary barbules along each spine for unique, non-repeating crystal formations.

### 4. Concentric Rain Surface Ripples (`varsha`)
- When falling raindrops hit the canvas bottom baseline, they spawn expanding circular ripple rings with decaying stroke alpha.
- Simulates surface tension and realistic water splash dynamics.

---

## Dual Mode Color Theming

Every season includes tailored color palettes optimized for both **Dark Terminals** and **Light/Bright UI** backgrounds:

```javascript
// Switch to Dark mode palette
engine.setTheme('dark');

// Switch to Light/Bright mode (enhanced contrast, richer saturation)
engine.setTheme('light');
```

### Custom Palette Overrides
You can supply your own custom color set at initialization or runtime:

```javascript
const engine = createSeasonalParticles(canvas, {
  season: 'sharad',
  colors: ['#ff4500', '#d2691e', '#8b0000', '#ffd700'] // Custom autumn palette
});
```

---

## Automatic Date Mode (`auto`)
When `season: 'auto'` is selected, the engine checks `new Date()` and automatically activates the true current season corresponding to your calendar day, seamlessly updating throughout the year without requiring code changes.
