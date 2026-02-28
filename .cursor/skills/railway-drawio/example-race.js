const r = require('./_railway-engine');
const path = require('path');

r.reset();

const OUTER_ENTRY_STRAIGHTS = 3;
const OUTER_BOTTOM_STRAIGHTS = 11;
const OUTER_EXIT_STRAIGHTS = 3;
const UTURN_MID_STRAIGHTS = 2;

// ── Left legend: sample each component ──
const lx = -1300;
const ly = 80;
const gap = 260;

r.track(lx, ly, 0).straight().label('Straight');
r.track(lx, ly + gap, 0).halfStraight().label('Half Straight');
r.track(lx, ly + gap * 2, 0).bendRight().label('Bend Right (45°)');
r.track(lx, ly + gap * 3, 0).bendLeft().label('Bend Left (45°)');
r.track(lx, ly + gap * 4, 0).turnoutLeft().label('Turnout Left (Switch)');
r.track(lx, ly + gap * 5, 0).mergerLeft().label('Merger Left');

// ── Collision check (centerline approximation) ──
function collisionCheck() {
  const A = r.CFG.bendAngle;
  const L = r.CFG.straightLen;
  const R = r.CFG.bendRadius;

  function advance(state, dx, dy, da) {
    const nx = state.x + dx * Math.cos(state.h) - dy * Math.sin(state.h);
    const ny = state.y + dx * Math.sin(state.h) + dy * Math.cos(state.h);
    state.x = nx;
    state.y = ny;
    state.h += da;
  }

  function sampleStraight(state, out) {
    const steps = 6;
    for (let i = 1; i <= steps; i++) {
      const t = (L / steps) * i;
      const x = state.x + t * Math.cos(state.h);
      const y = state.y + t * Math.sin(state.h);
      out.push([x, y]);
    }
    advance(state, L, 0, 0);
  }

  function sampleBendRight(state, out) {
    const steps = 12;
    const perpX = -Math.sin(state.h);
    const perpY = Math.cos(state.h);
    const cx = state.x + R * perpX;
    const cy = state.y + R * perpY;
    const startA = state.h - Math.PI / 2;
    const endA = startA + A;
    for (let i = 1; i <= steps; i++) {
      const t = startA + (endA - startA) * (i / steps);
      out.push([cx + R * Math.cos(t), cy + R * Math.sin(t)]);
    }
    advance(state, R * Math.sin(A), R * (1 - Math.cos(A)), A);
  }

  function appendOuterPath(out) {
    const s = { x: 1600, y: 700 - r.GAP, h: 0 };
    for (let i = 0; i < OUTER_ENTRY_STRAIGHTS; i++) sampleStraight(s, out);
    sampleBendRight(s, out); sampleBendRight(s, out);
    for (let i = 0; i < UTURN_MID_STRAIGHTS; i++) sampleStraight(s, out);
    sampleBendRight(s, out); sampleBendRight(s, out);
    for (let i = 0; i < OUTER_BOTTOM_STRAIGHTS; i++) sampleStraight(s, out);
    sampleBendRight(s, out); sampleBendRight(s, out);
    for (let i = 0; i < UTURN_MID_STRAIGHTS; i++) sampleStraight(s, out);
    sampleBendRight(s, out); sampleBendRight(s, out);
    for (let i = 0; i < OUTER_EXIT_STRAIGHTS; i++) sampleStraight(s, out);
  }

  function appendInnerPath(out) {
    const s = { x: 400, y: 700, h: 0 };
    // Inner top mainline pieces (skip internal turnout/merger branch geometry)
    sampleStraight(s, out);                 // straight
    advance(s, 400, 0, 0);                 // merger length
    sampleStraight(s, out);                 // straight
    advance(s, 400, 0, 0);                 // turnout length
    sampleStraight(s, out);                 // straight

    sampleBendRight(s, out); sampleBendRight(s, out);
    sampleBendRight(s, out); sampleBendRight(s, out);
    for (let i = 0; i < 7; i++) sampleStraight(s, out);
    sampleBendRight(s, out); sampleBendRight(s, out);
    sampleBendRight(s, out); sampleBendRight(s, out);
  }

  const inner = [];
  const outer = [];
  appendInnerPath(inner);
  appendOuterPath(outer);

  let minDist = Infinity;
  for (const [ix, iy] of inner) {
    for (const [ox, oy] of outer) {
      const d = Math.hypot(ix - ox, iy - oy);
      if (d < minDist) minDist = d;
    }
  }

  const clearance = r.CFG.railGauge + 20;
  if (minDist < clearance) {
    throw new Error(`Collision check failed: min centerline distance ${minDist.toFixed(2)} < ${clearance}`);
  }
}

// ── Inner oval ──
// Top section (heading right): straight, mergerLeft, straight, turnoutLeft, straight
// = 200 + 400 + 200 + 400 + 200 = 1400px (x=400→1800)
// Mirror line at x = 1100
//
// The turnoutLeft branch creates the outer track.
// The mergerLeft receives the outer track back.
// Both branch endpoints are at y = 700 - GAP ≈ 534 (parallel, 166px above inner).

const inner = r.track(400, 700, 0);

// ── Top section ──
inner.straight();                    // x: 400→600
inner.mergerLeft();                  // x: 600→1000 (receives outer track from above-left)
inner.straight();                    // x: 1000→1200
inner.turnoutLeft(branch => {        // x: 1200→1600 (sends to outer track above-right)
  // Branch starts at (1600, ~534) heading 0°
  // Outer loop using only standard bends + straights:
  // right -> (2 bends + 4 straights + 2 bends) -> bottom -> (2 bends + 4 straights + 2 bends) -> left
  // Widened in X-axis: entry=3 straights, bottom=11 straights, exit=3 straights.
  for (let i = 0; i < OUTER_ENTRY_STRAIGHTS; i++) branch.straight();
  branch.bendRight(); branch.bendRight();
  for (let i = 0; i < UTURN_MID_STRAIGHTS; i++) branch.straight();
  branch.bendRight(); branch.bendRight();          // wider right U-turn -> heading π
  for (let i = 0; i < OUTER_BOTTOM_STRAIGHTS; i++) branch.straight();
  branch.bendRight(); branch.bendRight();
  for (let i = 0; i < UTURN_MID_STRAIGHTS; i++) branch.straight();
  branch.bendRight(); branch.bendRight();          // wider left U-turn -> heading 0°
  for (let i = 0; i < OUTER_EXIT_STRAIGHTS; i++) branch.straight();
});
inner.straight();                    // x: 1600→1800

// ── Inner right half-circle ──
inner.bendRight(); inner.bendRight(); inner.bendRight(); inner.bendRight();

// ── Bottom section (no turnouts — 7 straights heading left) ──
inner.straight(); inner.straight(); inner.straight();
inner.straight(); inner.straight(); inner.straight(); inner.straight();

// ── Inner left half-circle ──
inner.bendRight(); inner.bendRight(); inner.bendRight(); inner.bendRight();

collisionCheck();
r.writeXml(path.join(__dirname, 'example-race.drawio'));
