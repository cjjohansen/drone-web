---
name: event-storming-drawio
description: Generate Big Picture Event Storming diagrams as draw.io (.drawio) XML files with proper styling. Handles element shapes, colors, pivotal markers, boundary ellipses, and programmatic XML generation. Use when the user asks to create, generate, or update a draw.io event storming diagram, or when working with .drawio files for event storming.
---

# Event Storming — draw.io Generation

Generate Big Picture Event Storming canvases as `.drawio` XML files. For event storming domain knowledge (element types, layout rules, pivotal events), see the `event-storming` skill.

## Element Styles

All elements use hand-drawn sketch style: `sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;`

### Domain Event (orange document, 100x100 square)

```
whiteSpace=wrap;html=1;shape=mxgraph.basic.document;fillColor=#f0a30a;fontColor=#000000;strokeColor=#BD7000;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;fontSize=9;fontStyle=1;
```

### Pivotal Event Marker (thin yellow vertical bar, behind event, BETWEEN subdomains)

```
whiteSpace=wrap;html=1;fillColor=#e3c800;fontColor=#000000;strokeColor=none;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;
```

- Width: 10px
- Height: ~320px (single lane) or ~660px (split — spanning both above and below lanes)
- Centered on pivotal event sticky: `x = event_x + (event_size / 2) - 5`
- Single lane: `y = event_y - 110`
- Split (tall bar): `y = event_y - 110`, height extends past the red line into the below lane
- Must appear **before** the event in XML (renders behind in z-order)

**Placement — pivotal events sit BETWEEN subdomains:**
- The pivotal event sticky and its yellow bar go in the **gap** between two subdomain ellipses
- They are NOT inside either subdomain — they are the boundary splitter
- Gap sizing: ~180px between subdomains (same parent), ~220px at parent domain boundaries
- Pivotal event x = `gap_start + (gap_width - event_size) / 2` (centered in the gap)
- For split pivotals, the tall yellow bar visually bridges the main lane and below lane

### Hotspot (red document, 100x100)

```
whiteSpace=wrap;html=1;shape=mxgraph.basic.document;fillColor=#e51400;fontColor=#FFFFFF;strokeColor=#CC0000;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;fontSize=9;fontStyle=1;
```

### Human Actor (yellow rectangle + stick figure, 50x100)

A composite component: yellow background rectangle, hand-drawn stick figure group, and role name label inside the rectangle near the bottom. Place **in front of** (to the left of) the first event in each subdomain stream. Use a **unified role name** per context (e.g. "Shopper") rather than listing individual personas if they trigger the same events.

### System Actor (yellow rectangle + cogwheel, 50x100)

For non-human actors (automated processes, external systems, schedulers). Same yellow rectangle but with a ⚙ cogwheel symbol instead of a stick figure. Name the role by what it does (e.g. "Catalog Sync") not the system name.

**Cogwheel cell** — large gear symbol centered on the yellow rect:
```
text;strokeColor=none;align=center;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=36;fontColor=#000000;
```
- Value: `⚙` (Unicode U+2699)
- Position: same (x, y) as yellow rect, width=50, height=50

**Generation helper** — call `addSystemActor(name, x, y)`:
```javascript
function addSystemActor(name, x, y) {
  // Yellow background rectangle (50x100)
  v('', 'whiteSpace=wrap;html=1;fillColor=#e3c800;fontColor=#000000;strokeColor=none;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;', x, y, 50, 100);
  // Cogwheel symbol
  v('⚙', 'text;strokeColor=none;align=center;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=36;fontColor=#000000;', x, y + 8, 50, 50);
  // Role name label (inside rect near bottom)
  v(name, 'text;strokeColor=none;align=center;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=9;fontColor=#000000;', x, y + 78, 50, 20);
}
```

### Human Actor — stick figure component

**Background rectangle** (50x100):
```
whiteSpace=wrap;html=1;fillColor=#e3c800;fontColor=#000000;strokeColor=none;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;
```

**Stick figure** — a group (`style="group"`) containing 4 children, positioned inside the yellow rectangle. Use the `addActor` helper below to generate all parts.

**Text label** — actor name below the rectangle:
```
text;strokeColor=none;align=center;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=9;fontStyle=0;fontColor=#000000;
```

**Generation helper** — call `addActor(name, x, y)` where (x, y) is the top-left of the yellow rectangle:

```javascript
// Stick figure stencil data (body, left leg, right leg, arms)
const STENCIL_BODY = 'shape=stencil(nVjZchpBDPwaXlUz0pzPjvMfrjKOqTjGhe0cf58mZAijhaect2VR746ubmlXdvP6ePeyXml4fdttv65/bO7fHlf2aaW6eX5c7zZvuFrZ7cpuHra79Zfd9v35/vD75W5vub/6tv2+f8LPA66YBNujNPw63FEp+ufG54P90+Z5ts9tss8SG7FPUstk36QEYp+9fYxSIgGU8fcRkCWwE1XRPgOa1EwBdXYZMaKAIjr7oPVakOKcBIuiiQCiNJ0BWcwuA3KXNEfJumQS1tykhwmQTIw4jTeE+Q0JTpNKAsBFKQcpzOmwAJjUSmvJlQa8CuRIFcU6A4pKIk63KD3NgCy5EACqfy6+0iSTN3SU9+x0RYOSTMcQJMyZq0UiCVNfNETt0khtdFv0tIkyJ3AkByjjEefDlEeeBgCPUOJ1BS3NiUDgWH3XIL3OALQ5JyZ1RwJtsJYr0uawdt5yCYDsAZ28wZDXtACQTIOrXVMDwMg1ooW7d/qvVxeqT7r6sHYS1upLCXljUW1erjoajjwf6lGdy0mMsAzEIDkAiI+4DBcctXbIA2EZq9KCByQCSDhS9YDMqLWJqfchsOIuYgunG2PKKLn7sLLCQIMWlzhULysMFXVHqmJsEEAeXCm1kZlLArTsBiUyDX3yYQVRsgbtXk9O2Pl8MfVFw3WqcbGfIQ3G9lG9AiFMyrhYUvJ5iIyKh56ddChngDP2jJOWNBmoqmsac8iJ+jB9g8txoW+MuU3HtHaioJ10A6Y1N7/VSn2w5MUEDdVIrWrzwxIULxKN1ji05jiZ8KEVY3aafcAYyzS6jbo82geaBvOslytlvSBpDlFOdABdzEn7+ZOcPwz6OR1wyfmDbzRM0KzR4lgqTkb0QM6TRk0e7dPojAuNZm7JCHQIg5bHOUBaqCiAWuKHFqU9F80pvrKKRUix2w75sheTV5Er6ySep3NU+b4KNjJXdbxrit8Y+L6NCcyvt5RZoAduP49jnjnf9jrGrWGPpmQj5GKqDXRDwiLborNnNIThyCWMC2ZSP0BesV9wOz8PVsxQP+AvOEo/Ek9woKsfni8spL4DaD38x/edK/a4+Pcx6WHz9HT4FnX6v//4hFuHD1d2+xs=);lineShape=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;';
const STENCIL_LLEG = 'shape=stencil(lVjZctswDPwav2JIggf4nKb/kZk4jadpnHHS6+8LjYaKAUmb5k22dkXiWADkgW9eH+9ejocUXt8u5+/H36f7t8cDfzmkdHp+PF5Ob/p04NsD3zycL8dvl/PP5/v598vdhJyefpx/TV/4M/N6p5InVgp/53+YwvzH1xn/dHq+xjfK1eAL5Q7wmVozeBkLbuMjcTD4mCjWfYI0SmwJlVIEhETZrpACVbCl1ig4QiFugBD9Chxo+rlHqIWKWEKhAGwoncR6lTvVAAiFkg1bZkrA6KJx6JZQxyc2CVkoJksQEgGE1ZamNYHRWZ1ovVR0S8BodaJEQ6iRCrCBebxeCJkK2BJHijbStY1QbhKm7Lc2tIAJ1cehMfRSStSsoJtGBqwQNXOsl1QhCaS36qtbG6RATUetAdYGEehWlXy2BC0LGQSuU3f4PCS4rVCq1gItawGYvPJpZ2pIDD5TFc9Int6jikcxa6NgXeEzKDCdwso/AewnBoorgqAQBy+1XqD6ldCtcnodQdwjZGezUIA54XNIhpe3+wJF20e0NdYCijYVW+9iCNCp6sHPEXj0sesdoSCQlJXFwEPrEAjs/RoB930NGVCNVjaH15wA+4kj56+TjpEqk4swwwirZovHZ9Rlx9v/VqVrBh+oXjZU3IA/V01f/QPrrs411QeggDIxidJpoFLFhOpc2qgBl/aNFK1A9TKWv5IAagSfxQc/2vVEDFy6lP2rTobwlaK1V1tlBSkt1FxrTVQAPkZvcFODUfPOoyQsBM0JVHe7d5FOLChkKmO2aaozUQc+Uqe6OqTzcACVdz0T1TQa3N7UJVZppUOCznVO+jpqRhAHzl77BdcW1tJpM6OEIe9tQvczgs7XqOdPA75dQSd4NOToa1mdEVBq6I67jXRexoC9U0i1geMGvaTzujvccYItodZRfpazmsCTlJ7VnB6mAzBwa1sFLgo8hUj0g0tcGtE2oYy4LkWJGlpAfNWuY3rbO2I7PMMD8/ssPfBLm9jDuzxaBoFtfPEOCvD8oT3JnTS1ioO2rHjx30djl7aw0jweXVnI2O47Hvpfq1F3+Iy+39f+b+j73TepCBNU8U7GccwNO01/1TUTRWyA6/ppHDn38J+7k/oQrw/vF2APp6en+f7s+r2/MNO/5ss2vv0H);lineShape=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;';
const STENCIL_RLEG = 'shape=stencil(lVjLUhtBDPwaX1Uz0jzPJPkPqjDBFYIpIK+/j7acWVuadQduZlHvSppWS5qd3Lw+3D7vdxxe316O3/a/DndvDzv5tGM+PD3sXw5v+msnn3dyc3982X99Of54ujv9/Xy7WC6/vh9/Lm/4fcL1RkUWFIc/pyc5Uzw9+XICPB6eLgGJejOAwhQSADClagGVJFwHtE7NulR5OLkNKN6lWqkjgFCLBtCYMnIpUOkWUKgBgDpQ2AB6oBwBIFEtFiDQJc1JyBaQqYAvlO5Puus5VADQfycLaJSAS0qE7mLolDoATGlVQAWA3EgsIIZAAfikbK7sg/iX6W2AULDc6AWSKQeKLuo0nmwC0kr/FRApIECibI+6Kb9ByaU4PF4BiZivA6QPcq6AQAJckkpsAbVQAlkS8YCCucHKBCcbMoRkG1BI7Emf2bINYIqWTFlVoF0HxEbBupQaFKaoOmNdSgWeg5ao+wCm0prz1V6GFG6H7Cta3y8oYsrdv5+BxgTqNl4lVgNEDUNPVvs0dPOKfbBCz40iqP5VG1b7MCTqir0rZT3BnpF9tvYVdoVI0aZf4OnGkbthjluINsngzFEjFxLLHYYiJF7bC8x8omSZEOOohSv2xWUel9Zkz3n09Pf5IwyZNoUrbeTrfdlMWmuAOTxVlir0R7igldigfXT+xKF215hsW4wUyiDeqVIkQCWZK1Fgg5kqPWLlnJRE2wcWKpceOGxFX1qaTHi4YpOJZ5QPmmcK7MwFZEabVve+o1DjULyzLnSQyfO5rF0UHpTWtetZSjTQIjS6YpmvhYhUkKnZHhoDNTQG6HjnAGW0se1SnzxauAzooE0t2tlHX4H6hE5XziXBQ2sK/hDSOsZuA1R/HKAOnmwDsh+Lde6tIGh9X3WLpVABCpEnCcoFSq6+j61G6MCHNF13ATee6ALCqNKmdaNEeNLLQtM8AMloyZ4aCkATyjI1OwDDk65xbFQXX0CNXjdRF3TusBXrrhstW7M+QYoUJoDALOm+zrbbpI6/UIZGXLRXpDKtT6NZHx16e1Kf0qpVjnaynnwMiwiAfUa3cydky4SHAI24ewCjGNrokRcA6FL3bGW8Pyz7v2smhSrKUvfrujZyNNcpoDttFXhJcXFhsCIq7CjLJ9ysFmHHVUCzKqDqGXGa/N7XoFYqQJz0RXj5o4AwqTFqQR+/F/w/QH+cryHvD4+Pp1vMy//7a0t9dLrylM9/AQ==);lineShape=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;';
const STENCIL_ARMS = 'shape=stencil(lVjJbhsxDP0aXwmJ1EKd0/Y/AsRpjKZxkKTb35dTQ47JGb8it1n4JPJxlXZy8/pw+7zfcXp9ezl+2/863L097OTTjvnw9LB/ObzZ004+7+Tm/viy//py/PF0d3p/vl0kl6fvx5/LCr9PuKwkaUFx+nP6IlTKvw9fTvKPh6dL+UZDnLxSUiDfqTQnnwsNsAEn6sUBmKkKAAjl4QENmmC/s99BEgkCDKrdAwoxAIgQVw9QWl6vAjolz1JhYmB0STSyB7S55zagUPcs1UQlA4BS8yrVQqVfB1Rzk6e12hKApWoaexsaT6u2AYM6e4DxBmhd1vM29EQ6AMBUCgAzGvihcwxvNVrBDl2j0VopA8dpm5FzBoy5xCZgNFIfrUNIEEBXgEICaB2Dhq8Zo1LFgLhDm+F4TaXuaR2dBigzy3pBJcUAiQlkSjYESNS8DTklSgl4rk8WL7YYgCYt0dUGQJVMM7URrW7A1d0UGJFX5DkDSKDJ4hHQZIAeAJUSyCCzIftaaa5BOarWoNQDGLraMijkqAEKcpzZsNoBppzMHni5AzDaSEwcjUYsjVWbXgK4wZRrGv2QgQ0X0XzhagEF37ZgX/AtmBrg1X5Hz+lMqm1AWRWaMZfYBmTqPQLQtKFKZZ2jKPoq8Uol1OXUIqFGo2EV+CigW+gEo+tsY9e6nK4SIqM+arXPq6R46qt11eUEduoyZlU5N95GDQHqzPkzgGeT2QZwjKU2KIHGK2Om8BlQYMpJJfUqGW+KADlWYxuJOjB6mbUDgKmh2XjVUWysQ/Xepm/xnrbBEWWcnQdqGETTTKltAFP3tErD08YMzbM8z/l9O1hjaeUOS4DE7mBf0CCQ53x3ngPG5GxTPsUqmSs8PKzKcM4koCIlqt5jNnZA9UPe8DxvbQfEHEDexVEeSwwf0x1kQIl1JcGx0EaPHsRRg9LZ8N7FM2hPOcUujuc7i+RUojxiXmIFwsdOi5Ma1++AzLwq6xkmlh3Nw5HQYgPQmTXWaJ5D9zX5j10t/FfeHt7vMe4Pj4+na5DL//Hewz6d7kzk818=);lineShape=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;';

// Generates an actor component: yellow rect + stick figure + label
// (x, y) = top-left of yellow rectangle. Returns next available nid.
function addActor(name, x, y) {
  // Yellow background rectangle (50x100)
  v('', 'whiteSpace=wrap;html=1;fillColor=#e3c800;fontColor=#000000;strokeColor=none;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;', x, y, 50, 100);
  // Stick figure group
  const gid = nid++;
  cells.push(`<mxCell id="${gid}" value="" style="group" vertex="1" connectable="0" parent="1"><mxGeometry x="${x + 13}" y="${y + 15}" width="23.24" height="60" as="geometry"/></mxCell>`);
  // Head
  v('', 'ellipse;whiteSpace=wrap;html=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;', 4.62, 0, 15.93, 16.91);
  // Reassign parent for group children — override last cell's parent
  cells[cells.length - 1] = cells[cells.length - 1].replace('parent="1"', `parent="${gid}"`);
  // Body
  v('', STENCIL_BODY, 9.39, 16.18, 3.74, 22.98);
  cells[cells.length - 1] = cells[cells.length - 1].replace('parent="1"', `parent="${gid}"`);
  // Left leg
  v('', STENCIL_LLEG, 0.84, 37.61, 11.02, 22.39);
  cells[cells.length - 1] = cells[cells.length - 1].replace('parent="1"', `parent="${gid}"`);
  // Right leg
  v('', STENCIL_RLEG, 12.43, 38.30, 5.28, 18.61);
  cells[cells.length - 1] = cells[cells.length - 1].replace('parent="1"', `parent="${gid}"`);
  // Arms
  v('', STENCIL_ARMS, 0, 22.33, 23.24, 3.26);
  cells[cells.length - 1] = cells[cells.length - 1].replace('parent="1"', `parent="${gid}"`);
  // Actor name label (inside yellow rect, near bottom)
  v(name, 'text;strokeColor=none;align=center;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=9;fontColor=#000000;', x, y + 78, 50, 20);
}
```

### External System (wide pink sticky)

```
whiteSpace=wrap;html=1;fillColor=#FFB6C1;fontColor=#000000;strokeColor=#E0909A;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;fontSize=9;fontStyle=2;
```

### Bounded Context Ellipse (dashed orange, no fill)

```
ellipse;whiteSpace=wrap;html=1;fillColor=none;strokeWidth=2;dashed=1;dashPattern=8 4;sketch=1;curveFitting=1;jiggle=2;strokeColor=#FF8000;
```

### Timeline Arrow (thick, bottom of canvas)

```
endArrow=classic;html=1;strokeWidth=4;strokeColor=#999999;
```

### Async Event Arrow (dashed, between contexts)

```
endArrow=classic;html=1;strokeWidth=2;dashed=1;dashPattern=6 4;strokeColor=#888888;fontSize=10;fontColor=#888888;
```

### Red Separator Line (at pivotal split points)

```
endArrow=none;html=1;strokeWidth=3;strokeColor=#FF0000;sketch=1;curveFitting=1;jiggle=2;
```

Red separators are **local** lines drawn at the Y level between the main-lane and below-lane ellipses, extending across the subscribing subdomain area at each split point.

**Split layout rules (even/odd generalization):**

- **Even subscribers (n = 2, 4, 6...):** Draw **1 red line** at the split Y. Stack n/2 subscribers above, n/2 below. Primary flow above.
- **Odd subscribers (n = 1, 3, 5...):** Place 1 subscriber at the pivotal level (center, main line). If n > 1, draw **2 red lines** (above and below center). Stack (n-1)/2 above the upper line, (n-1)/2 below the lower. When n = 1: no red line, simple continuation.

**Red line positioning:**
- Y = midpoint between main-lane ellipse bottom and below-lane ellipse top (e.g., `RED_Y = 570` when main ellipses end at ~530 and below ellipses start at ~610)
- X start: ~40px left of the pivotal event sticky
- X end: ~40px right of the widest subscribing subdomain (max of above and below ellipse right edges)
- Do NOT use full-width lines — only local to the split point
- Do NOT use arrows or connectors — the layout communicates causality

## Dimensions

| Element | Width | Height | Gap | Stride |
|---------|-------|--------|-----|--------|
| Event sticky | 100 | 100 | 20 | 120 |
| Gap between subdomains (no pivotal) | — | — | 80 | — |
| Gap between subdomains (with pivotal) | — | — | 180 | — |
| Gap at parent domain boundary (with pivotal) | — | — | 220 | — |
| Subdomain ellipse padding (left) | — | — | 70 | — |
| Subdomain ellipse padding (right) | — | — | 60 | — |
| Pivotal bar (single lane) | 10 | 320 | — | — |
| Pivotal bar (split, tall) | 10 | 900 | — | — |
| Actor component | 50 | 100 | — | — |
| Actor-to-event gap | — | — | 20 | — |
| Actor label | 50 | 20 | — | — |
| Red line overshoot (left/right) | — | — | 40 | — |
| Main→Below lane gap (ellipse bottom → red line) | — | — | ~40 | — |
| Red line→Below ellipse gap | — | — | ~40 | — |
| Above lane events Y | — | 350 | — | — |
| Main lane events Y (MID) | — | 600 | — | — |
| Red line Y | — | 785 | — | — |
| Below lane events Y | — | 900 | — | — |
| Ellipse height | — | 380 | — | — |

## Z-Order (back to front)

Cells render in XML order. Later = on top. Always output in this order:

1. Parent domain ellipses (furthest back)
2. Subdomain ellipses
3. Pivotal event yellow bars (behind events, in the gaps between subdomains)
4. Actor components (yellow rect + stick figure group + label)
5. Domain event stickies (inside subdomain ellipses)
6. Pivotal event stickies (in the gaps between subdomains)
7. Hotspots
8. Red separator lines (local, at split points)
9. Timeline arrow + "Time" label
10. Async event arrows (only if spatial proximity is insufficient)
11. Legend

## Reusable Engine

A reusable Node.js engine module exists at `.cursor/skills/event-storming-drawio/_drawio-engine.js`. It encapsulates:
- All constants (sizes, gaps, paddings)
- All draw.io styles
- Stick figure stencil data
- Element drawing functions (`drawSubdomain`, `drawPivotal`, `drawActor`, `drawSystemActor`, `drawRedLine`)
- Layout functions (`layoutRow`, `computeParentBounds`)
- Render functions (z-ordered output for each element type)
- XML generation and file writing (`writeXml`)

### Usage

1. Create a temporary `_gen_*.js` script in the output directory
2. `require()` the engine: `const e = require('../../.cursor/skills/event-storming-drawio/_drawio-engine');`
3. Call `e.reset()` to initialize
4. Define subdomain data and layout using engine functions
5. Render in z-order, then call `e.writeXml(outputPath)`
6. **Delete the temporary script** after generation

### Exported API

```javascript
const e = require('./_drawio-engine');
e.reset();                           // Clear cell buffer
e.drawSubdomain(sdData, x, eventsY); // Returns positioned subdomain object
e.drawPivotal(name, x, y);           // Returns pivotal position object
e.drawRedLine(x1, x2, y);            // Draw red separator
e.computeParentBounds(sds, pivs);    // Compute wrapping ellipse bounds
e.renderParent(name, bounds);        // Render parent domain ellipse
e.renderSubdomainEllipse(sd);        // Render subdomain ellipse
e.renderPivotalBar(piv);             // Render yellow bar (single-lane height)
e.renderActor(sd);                   // Render human/system actor
e.renderEvents(sd);                  // Render event stickies
e.renderPivotalSticky(piv);          // Render pivotal event sticky
e.renderHotspots(sd);                // Render hotspot stickies
e.renderTimeline(leftX, rightX, y);  // Render timeline arrow
e.renderLegend(x, y, rolesText);     // Render legend box
e.writeXml(outputPath);              // Write .drawio file
e.v(val, style, x, y, w, h);        // Low-level vertex (for custom elements)
e.pointEdge(val, style, x1, y1, x2, y2); // Low-level edge
```

**Note:** For split layouts with tall pivotal bars, use `e.v()` directly with custom height instead of `e.renderPivotalBar()` (which uses single-lane height).

## XML Generation (Manual)

For diagrams with many events (20+), use the engine above. For manual XML generation without the engine:

### Helper Functions

```javascript
const fs = require('fs');
const S = 100, G = 20, ST = S + G; // 120px stride

let nid = 2;
const cells = [];

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function v(val, style, x, y, w, h) {
  const i = nid++;
  cells.push(`<mxCell id="${i}" value="${esc(val)}" style="${style}" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
  return i;
}

function pointEdge(val, style, x1, y1, x2, y2) {
  const i = nid++;
  cells.push(`<mxCell id="${i}" value="${esc(val)}" style="${style}" edge="1" parent="1"><mxGeometry width="50" height="50" relative="1" as="geometry"><mxPoint x="${x1}" y="${y1}" as="sourcePoint"/><mxPoint x="${x2}" y="${y2}" as="targetPoint"/></mxGeometry></mxCell>`);
  return i;
}
```

### XML Wrapper

```javascript
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" type="device">
  <diagram name="Event Storming - Big Picture" id="bp">
    <mxGraphModel dx="2000" dy="1500" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="5000" pageHeight="2000" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
${cells.join('\n')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

fs.writeFileSync('output.drawio', xml, 'utf-8');
```

### Canvas Settings

- `page="0"` — infinite canvas, no page boundaries
- `dx="2000" dy="1500"` — initial viewport size
- `gridSize="10"` — snap alignment

## Legend

Always include a legend box (dark background `#2D2D2D`, orange stroke) showing:

- Domain Event (orange document shape)
- Pivotal Event (document + yellow bar behind it) + note: "Pivotal events sit BETWEEN subdomains"
- Human Actor (yellow rectangle with stick figure)
- System Actor (yellow rectangle with ⚙ cogwheel)
- Hotspot (red document shape)
- Subdomain (solid orange ellipse)
- Parent Domain (dashed purple ellipse)
- Separator (red line at split point)
- Notes: "Pivotal events sit BETWEEN subdomains" and "Subscribing subdomains above/below red line at split"
- Roles & Personas note (e.g. "Shopper = Integrator, Fleet Buyer, Browser")

## draw.io in VS Code

The `hediet.vscode-drawio` extension opens `.drawio` files visually.

- Install: search "Draw.io Integration" in Extensions
- Set default editor: right-click `.drawio` → "Open With..." → configure
- **Escape** returns to pointer tool
- **V** for selection mode
