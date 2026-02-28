---
name: railway-drawio
description: Generate top-down schematic railway track diagrams as draw.io (.drawio) XML files. LEGO/BRIO-style snap-together pieces using turtle graphics — straight, bend, wide bend, turnout, merger. Use when the user asks to create railway track diagrams, causal flow topology diagrams with track metaphors, or draw.io files with railway-style layouts.
---

# Railway Track — draw.io Generation

Generate top-down schematic railway track diagrams as `.drawio` XML files with LEGO/BRIO-style building pieces that snap together via turtle graphics.

See `README.md` in this folder for full component specifications, dimensions, and derived constants.

## Engine Location

`.cursor/skills/railway-drawio/_railway-engine.js`

## Building Pieces

| Piece | API | Length | Description |
|-------|-----|--------|-------------|
| Straight | `t.straight()` | 200px | Standard straight track |
| Half Straight | `t.halfStraight()` | 100px | Half-length straight |
| Bend | `t.bendRight()` / `t.bendLeft()` | 45° arc, R=283 | Standard curve (dx=200, grid-aligned) |
| Wide Bend | `t.wideBendRight()` / `t.wideBendLeft()` | 45° arc, R=449 | Outer oval curve |
| Turnout | `t.turnoutLeft(fn)` / `t.turnoutRight(fn)` | 400px | S-curve switch — both exits parallel, 166px offset |
| Merger | `t.mergerLeft()` / `t.mergerRight()` | 400px | Reverse S-curve — branch merges into main |
| Label | `t.label(text)` | — | Text label at current position |

## Key Geometry

- **L = 200px** — straight piece length
- **R = 283px** — bend radius (L/sin 45°), makes bend dx = L
- **GAP = 166px** — track-to-track offset from turnout S-curve
- **R_WIDE = 449px** — wide bend radius (R + GAP), for outer ovals
- 4 bends = 180° half-circle; 4 wide bends = wider half-circle matching GAP

## Turtle Graphics

Each piece's exit defines the next piece's entry. No manual coordinate math.

```javascript
const r = require('./_railway-engine');
r.reset();
const t = r.track(x, y, heading);  // heading in radians (0 = right)
t.straight().bendRight().straight();
r.writeXml('output.drawio');
```

Turnout branches receive a new TrackBuilder in the callback:

```javascript
t.turnoutLeft(branch => {
  branch.straight().wideBendRight().wideBendRight()
    .straight().wideBendRight().wideBendRight().straight();
});
```

## Examples

- `example-race.js` — double-oval race track with inner/outer ovals connected by a turnout and merger
- `example-race.drawio` — generated output (open in draw.io)

## Usage Pattern

1. Create a generator script in this folder (or require the engine from elsewhere)
2. Call `r.reset()`, build tracks with `r.track()`, call `r.writeXml(path)`
3. Open the `.drawio` file in draw.io to view
