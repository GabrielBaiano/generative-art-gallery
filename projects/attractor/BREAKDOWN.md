# Attractor

Generative pattern based on additive blending of dashed Bézier curves with post-process colorization via LUT (Lookup Table).

**Inspiration:** [Chris Mccully](https://www.chrismccully.com/) — his work explores how visual complexity can emerge from the repetition of simple geometric rules.

<p align="center">
  <img src="../../output/images/attractor-neon-1778729737123.png" alt="Attractor — Neon" width="320">
  <img src="../../output/images/attractor-mono-1778729752247.png" alt="Attractor — Mono" width="320">
</p>

---

## The Algorithm

The entire composition is built from **four identical structures** anchored to each edge of the canvas. Each one goes through the same drawing logic, just rotated 90° apart (`0`, `π/2`, `π`, `3π/2`).

### 1. Convergent Bézier Fan

For each edge, 60 cubic Bézier curves fan out from a horizontal baseline toward a shared attractor point near the center.

```
bezier(startX, 0, cp1x, cp1y, cp2x, cp2y, offsetX, offsetY)
```

- **Start point:** evenly distributed along the edge (`startX` linearly mapped across 70% of canvas width)
- **End point:** a random attractor offset — `offsetX ∈ [-120, 120]`, `offsetY ∈ [50, 250]`
- **Control points** are proportional fractions of the offset, creating the organic curvature:
  - `cp1 = (startX × 0.6, offsetY × 0.4)` — pulls the curve inward early
  - `cp2 = (offsetX × 0.8, offsetY × 0.7)` — guides the curve toward the attractor

This means the curves don't travel in straight lines — they arc, converge, and overlap in a way that creates emergent interference patterns.

### 2. Dashed Line Fragmentation

Instead of solid strokes, each layer uses a randomized `setLineDash` pattern:

```js
dashPattern = [random(2,20), random(2,10), random(5,30), random(2,10)]
```

This breaks every curve into irregular fragments. The randomized `lineDashOffset` shifts where the pattern starts, so no two layers align — creating a moiré-like texture when stacked.

### 3. Additive Stacking

The core visual trick. The canvas uses **`blendMode(ADD)`** — additive blending.

Each curve is drawn with extremely low opacity (`stroke(255, 12)` — about 5% white). A single layer is nearly invisible. But when 10–35 layers stack on top of each other:

- **Where curves overlap → brightness accumulates** (light adds up)
- **Where curves don't overlap → stays dark**

This is what creates the glowing, luminous quality — it's the same principle behind long-exposure photography.

### 4. LUT Colorization (Post-Process)

The algorithm draws everything in **grayscale**. Color is applied as a final step.

A **Lookup Table** maps each of the 256 possible brightness levels to a color from a gradient palette:

```
brightness 0   → palette start (black/dark)
brightness 180 → palette end (bright/white)
```

The domain is capped at 180 (not 255) so colors saturate before reaching pure white, giving richer tones.

This separation of **structure** (grayscale drawing) and **color** (LUT mapping) means you can swap palettes without re-rendering the geometry — and the same composition looks completely different depending on which palette you choose.

---

## Parameters

| Parameter | Range | Effect |
|-----------|-------|--------|
| Stacking layers | 5–35 | More layers = more detail and brightness accumulation |
| Palette (LUT) | 5 presets | Color mapping applied after rendering |
| Attractor offset | random per generation | Determines the focal point where curves converge |
| Dash pattern | random per layer | Controls the fragmentation texture |
| Stroke weight | 0.5–2.0 | Varies line thickness across layers |

---

## Key Concepts

- **Additive blending** — light accumulates where geometry overlaps, mimicking real optical interference
- **Bézier curves** — parametric curves defined by control points, enabling smooth organic paths
- **LUT (Lookup Table)** — a pre-computed color mapping that replaces per-pixel calculations with array lookups for performance
- **Moiré patterns** — visual interference that emerges when regular patterns overlay with slight offsets
- **Emergence** — complex visual structures arising from the repetition of simple rules
