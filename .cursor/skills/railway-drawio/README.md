# Railway Track — draw.io Engine

Generate top-down schematic railway track diagrams as `.drawio` XML files using LEGO/BRIO-style snap-together pieces.

## How It Works

A **turtle-graphics cursor** advances piece by piece. Each piece's exit point uniquely defines the next piece's entry — no manual coordinate math. You only provide the starting position and heading; the geometry follows from the piece sequence.

```javascript
const r = require('./_railway-engine');
r.reset();
const t = r.track(200, 400, 0);   // start at (200,400), heading right (0 rad)
t.straight().bendRight().straight().bendRight()
 .straight().bendRight().straight().bendRight(); // simple oval
r.writeXml('my-track.drawio');
```

## Track List DSL (Reusable Builder)

You can build tracks from a **piece list DSL**. This is useful when you want to describe a route as data and validate each placement.

```javascript
const r = require('./_railway-engine');
r.reset();

r.dsl(400, 700, 0) // start x, y, heading
  .add('straight', 2)
  .add('bendRight')
  .addMany(['straight', 'straight', 'bendRight'])
  .build({
    collisionCheck: true,    // default true
    clearance: 60,           // default railGauge + 20
    ignoreTailPoints: 12,    // suppress false positives at the current connection
    sampleStraightSteps: 6,  // sampling density for straights
    sampleArcSteps: 12       // sampling density for arcs
  });

r.writeXml('track-from-list.drawio');
```

If a piece creates an illegal overlap, `build()` throws with the piece index:

```text
Illegal track at index 9 (bendRight): min distance 0.00 < 80
```

Supported DSL piece names:

- `straight`
- `halfStraight`
- `bendRight`, `bendLeft`
- `wideBendRight`, `wideBendLeft`
- `turnoutLeft`, `turnoutRight`
- `mergerLeft`, `mergerRight`

## Track Components

All dimensions derive from two constants: **L = 200px** (straight length) and **A = 45°** (bend angle).

### Straight

| Property | Value |
|----------|-------|
| Length | 200px |
| Exit | same heading, 200px forward |
| API | `t.straight()` |

```
╠══════════╣   200px, heading unchanged
```

### Half Straight

| Property | Value |
|----------|-------|
| Length | 100px |
| Exit | same heading, 100px forward |
| API | `t.halfStraight()` |

### Bend (Standard)

| Property | Value |
|----------|-------|
| Radius | 283px (= 200 / sin 45°) |
| Angle | 45° |
| dx | 200px (= 1 straight — grid-aligned) |
| dy | 83px |
| API | `t.bendRight()`, `t.bendLeft()` |

4 consecutive `bendRight()` = 180° half-circle, net displacement (0, 566px).

```
    ╲
     ╲  45° arc, R=283
      ╲
```

### Bend (Wide)

| Property | Value |
|----------|-------|
| Radius | 449px (= R + GAP) |
| Angle | 45° |
| dx | 317px |
| dy | 131px |
| API | `t.wideBendRight()`, `t.wideBendLeft()` |

Used for outer ovals. 4 consecutive `wideBendRight()` = 180° half-circle, net displacement (0, 897px).

### Turnout (Switch)

| Property | Value |
|----------|-------|
| Length | 400px (= 2 straights) |
| Branch offset | 166px (= GAP) |
| Branch heading | 0° (parallel to main — both exits same heading) |
| Internal geometry | S-curve: bend 45° + bend -45° |
| API | `t.turnoutLeft(branchFn)`, `t.turnoutRight(branchFn)` |

The turnout contains the full S-curve internally. Both the main exit and the branch exit are **parallel** at the same heading, offset by GAP. The branch callback receives a new `TrackBuilder` starting at the branch exit.

```
═══════════════════════╣   main exit (400px forward)
    ╲               ╱
     ╲─────────────╱      branch exit (400px forward, 166px offset)
```

### Merger

| Property | Value |
|----------|-------|
| Length | 400px (= 2 straights) |
| Branch entry | 166px offset, same heading (parallel) |
| Internal geometry | reverse S-curve |
| API | `t.mergerLeft()`, `t.mergerRight()` |

Mirror of the turnout — a branch track merges into the main. The branch entry point is at the **start** of the piece, offset by GAP; the S-curve converges to the main exit.

```
═══════════════════════╣   main exit (400px forward)
    ╱               ╲
───╱                 ╲    branch entry (at piece start, 166px offset)
```

## Derived Constants

| Constant | Value | Formula |
|----------|-------|---------|
| L | 200px | straight length |
| R | 283px | L / sin(45°) |
| GAP | 166px | 2R(1 − cos 45°) |
| TURNOUT_LEN | 400px | 2L |
| R_WIDE | 449px | R + GAP |

These ensure bends are grid-aligned (bend dx = L) and the outer oval's half-circle spans exactly the inner half-circle + 2×GAP.

## Visual Style

- **Rails:** two parallel dark grey lines (#444, strokeWidth 4)
- **Branch rails:** slightly thinner grey lines (#666, strokeWidth 3, 85% opacity)
- **Sleepers:** perpendicular brown cross bars (#8B6914, strokeWidth 3)
- **Rail gauge:** 40px between rails
- **Sleeper extension:** 10px beyond each rail

## Utility Methods

| Method | Description |
|--------|-------------|
| `t.save()` | Push turtle state (x, y, heading) onto stack |
| `t.restore()` | Pop and restore turtle state |
| `t.label(text)` | Place a text label at current position |
| `t.pos()` | Return `{ x, y, h }` of current turtle |

## Exported API

```javascript
const r = require('./_railway-engine');

r.reset();                          // clear buffer
r.track(x, y, heading);            // create TrackBuilder at (x,y) facing heading (radians)
r.dsl(x, y, heading);              // create list-based DSL builder
r.buildTrackFromList(x, y, h, pieces, opts); // direct list execution with collision check
r.expandPieceList(pieces);         // normalize piece specs to flat list
r.writeXml(outputPath);            // write .drawio file

// Constants (read-only)
r.CFG                              // { straightLen, bendRadius, bendAngle, railGauge, ... }
r.GAP                              // 166 — track-to-track offset
r.TURNOUT_LEN                      // 400 — turnout piece length
r.R_WIDE                           // 449 — wide bend radius
```

## Files

| File | Description |
|------|-------------|
| `_railway-engine.js` | The engine |
| `example-race.js` | Double-oval race track with turnout/merger |
| `example-race.drawio` | Generated output (open in draw.io) |
| `SKILL.md` | Cursor skill descriptor |
| `README.md` | This file |
