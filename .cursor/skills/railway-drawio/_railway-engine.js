/**
 * Railway Track draw.io Engine v3 — LEGO/BRIO-style building blocks.
 *
 * Pieces snap together via turtle-graphics. Each piece's exit uniquely
 * defines the next piece's entry — no manual coordinate math.
 *
 * Piece inventory:
 *   straight        — 200px straight track
 *   bendRight/Left  — 45° curve, R≈283 (dx = 200 = straightLen)
 *   wideBendR/L     — 45° curve, R≈449 (for outer ovals)
 *   turnoutLeft/Right — 400px piece with parallel S-curve; both exits heading 0°
 *   mergerLeft/Right  — 400px piece, reverse S-curve; branch enters from parallel
 *
 * Usage:
 *   const r = require('./_railway-engine');
 *   r.reset();
 *   const t = r.track(0, 0, 0);
 *   t.straight().turnoutLeft(b => { ... outer track ... }).straight();
 *   r.writeXml('output.drawio');
 */
const fs = require('fs');
const path = require('path');

/* ─── configuration ─── */
const A = Math.PI / 4; // 45° bend angle
const L = 200;         // straight piece length

const CFG = {
  straightLen: L,
  bendRadius:  L / Math.sin(A),              // ≈282.84 — bend dx = L
  bendAngle:   A,
  railGauge:   40,
  sleeperExt:  10,
  sleeperSpacing: 38,
  arcSegments: 12,
};

// Derived geometry
const R = CFG.bendRadius;
const GAP = 2 * R * (1 - Math.cos(A));       // ≈165.69 — track-to-track offset
const TURNOUT_LEN = 2 * L;                   // 400 — turnout piece length (= 2 bends)
const R_WIDE = R + GAP;                       // ≈448.53 — outer curve radius

/* ─── styles ─── */
const STY = {
  rail:    'endArrow=none;html=1;strokeWidth=4;strokeColor=#444444;rounded=0;',
  sleeper: 'endArrow=none;html=1;strokeWidth=3;strokeColor=#8B6914;rounded=0;',
  branchRail: 'endArrow=none;html=1;strokeWidth=3;strokeColor=#666666;rounded=0;opacity=85;',
  label:   'text;html=1;align=center;verticalAlign=middle;strokeColor=none;fillColor=none;fontSize=11;fontStyle=1;fontColor=#333333;',
};

/* ─── XML buffer ─── */
let nid, cells;
function reset() { nid = 2; cells = []; }

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function r2(n) { return Math.round(n * 100) / 100; }

function addLine(style, x1, y1, x2, y2) {
  const i = nid++;
  cells.push(`<mxCell id="${i}" value="" style="${style}" edge="1" parent="1"><mxGeometry relative="1" as="geometry"><mxPoint x="${r2(x1)}" y="${r2(y1)}" as="sourcePoint"/><mxPoint x="${r2(x2)}" y="${r2(y2)}" as="targetPoint"/></mxGeometry></mxCell>`);
}

function addPoly(style, points) {
  if (points.length < 2) return;
  const src = points[0], tgt = points[points.length - 1];
  const mid = points.slice(1, -1);
  const i = nid++;
  let wp = '';
  if (mid.length) {
    wp = '<Array as="points">' +
      mid.map(p => `<mxPoint x="${r2(p[0])}" y="${r2(p[1])}"/>`).join('') +
      '</Array>';
  }
  cells.push(`<mxCell id="${i}" value="" style="${style}" edge="1" parent="1"><mxGeometry relative="1" as="geometry"><mxPoint x="${r2(src[0])}" y="${r2(src[1])}" as="sourcePoint"/><mxPoint x="${r2(tgt[0])}" y="${r2(tgt[1])}" as="targetPoint"/>${wp}</mxGeometry></mxCell>`);
}

function addLabel(text, x, y) {
  const i = nid++;
  cells.push(`<mxCell id="${i}" value="${esc(text)}" style="${STY.label}" vertex="1" parent="1"><mxGeometry x="${r2(x - 50)}" y="${r2(y)}" width="100" height="20" as="geometry"/></mxCell>`);
}

/* ─── 2D transform: local → global ─── */
function xf(px, py, a, lx, ly) {
  return [px + lx * Math.cos(a) - ly * Math.sin(a),
          py + lx * Math.sin(a) + ly * Math.cos(a)];
}

/* ─── piece drawing ─── */

function drawStraightPiece(px, py, a, len) {
  const pLen = len || CFG.straightLen;
  const g = CFG.railGauge / 2;
  const ext = g + CFG.sleeperExt;
  addLine(STY.rail, ...xf(px, py, a, 0, -g), ...xf(px, py, a, pLen, -g));
  addLine(STY.rail, ...xf(px, py, a, 0,  g), ...xf(px, py, a, pLen,  g));
  const n = Math.max(2, Math.round(pLen / CFG.sleeperSpacing));
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n * pLen;
    addLine(STY.sleeper, ...xf(px, py, a, t, -ext), ...xf(px, py, a, t, ext));
  }
}

function drawBendArc(px, py, a, dir, radius, style, sleepers) {
  const BA = CFG.bendAngle;
  const g = CFG.railGauge / 2;
  const ext = CFG.sleeperExt;
  const segs = CFG.arcSegments;
  const perpX = -Math.sin(a), perpY = Math.cos(a);
  const cx = px + dir * radius * perpX;
  const cy = py + dir * radius * perpY;
  const startA = a - dir * Math.PI / 2;
  const endA   = startA + dir * BA;
  const rIn = radius - g, rOut = radius + g;
  const inner = [], outer = [];
  for (let s = 0; s <= segs; s++) {
    const t = startA + (endA - startA) * (s / segs);
    inner.push([cx + rIn * Math.cos(t), cy + rIn * Math.sin(t)]);
    outer.push([cx + rOut * Math.cos(t), cy + rOut * Math.sin(t)]);
  }
  addPoly(style, inner);
  addPoly(style, outer);
  if (style === STY.rail || sleepers) {
    const rSI = radius - g - ext, rSO = radius + g + ext;
    const n = Math.max(2, Math.round(radius * BA / CFG.sleeperSpacing));
    for (let i = 0; i < n; i++) {
      const t = startA + (endA - startA) * ((i + 0.5) / n);
      addLine(STY.sleeper,
        cx + rSI * Math.cos(t), cy + rSI * Math.sin(t),
        cx + rSO * Math.cos(t), cy + rSO * Math.sin(t));
    }
  }
}

function bendExitR(dir, radius) {
  return {
    dx: radius * Math.sin(A),
    dy: dir * radius * (1 - Math.cos(A)),
    da: dir * A,
  };
}

// Turnout: 400px piece with S-curve branch (both exits parallel, offset by GAP)
function drawTurnoutPiece(px, py, a, dir) {
  drawStraightPiece(px, py, a, TURNOUT_LEN);
  drawBendArc(px, py, a, dir, R, STY.branchRail, true);
  const e1 = bendExitR(dir, R);
  const [mx, my] = xf(px, py, a, e1.dx, e1.dy);
  drawBendArc(mx, my, a + e1.da, -dir, R, STY.branchRail, true);
}

// Merger: 400px piece with reverse S-curve (branch enters from offset, merges to main)
function drawMergerPiece(px, py, a, dir) {
  drawStraightPiece(px, py, a, TURNOUT_LEN);
  const [bx, by] = xf(px, py, a, 0, dir * GAP);
  drawBendArc(bx, by, a, -dir, R, STY.branchRail, true);
  const e1 = bendExitR(-dir, R);
  const [mx, my] = xf(bx, by, a, e1.dx, e1.dy);
  drawBendArc(mx, my, a + e1.da, dir, R, STY.branchRail, true);
}

/* ─── exit geometry helpers ─── */

function straightExit(len) {
  return { dx: len || CFG.straightLen, dy: 0, da: 0 };
}

function bendExit(dir) {
  return bendExitR(dir, R);
}

function wideBendExit(dir) {
  return bendExitR(dir, R_WIDE);
}

function turnoutBranchExit(dir) {
  // The branch exit is at (TURNOUT_LEN, dir*GAP) relative to piece start, heading 0
  return { dx: TURNOUT_LEN, dy: dir * GAP, da: 0 };
}

/* ─── TrackBuilder (turtle graphics) ─── */

class TrackBuilder {
  constructor(x, y, heading) {
    this.x = x || 0;
    this.y = y || 0;
    this.h = heading || 0;
    this._stack = [];
  }

  _advance(exit) {
    const [nx, ny] = xf(this.x, this.y, this.h, exit.dx, exit.dy);
    this.x = nx; this.y = ny; this.h += exit.da;
    return this;
  }

  straight()  { drawStraightPiece(this.x, this.y, this.h); return this._advance(straightExit()); }
  halfStraight() { drawStraightPiece(this.x, this.y, this.h, L/2); return this._advance(straightExit(L/2)); }

  bendRight() { drawBendArc(this.x, this.y, this.h, +1, R, STY.rail); return this._advance(bendExit(+1)); }
  bendLeft()  { drawBendArc(this.x, this.y, this.h, -1, R, STY.rail); return this._advance(bendExit(-1)); }

  wideBendRight() { drawBendArc(this.x, this.y, this.h, +1, R_WIDE, STY.rail); return this._advance(wideBendExit(+1)); }
  wideBendLeft()  { drawBendArc(this.x, this.y, this.h, -1, R_WIDE, STY.rail); return this._advance(wideBendExit(-1)); }

  turnoutLeft(branchFn) {
    drawTurnoutPiece(this.x, this.y, this.h, -1);
    if (branchFn) {
      const e = turnoutBranchExit(-1);
      const [bx, by] = xf(this.x, this.y, this.h, e.dx, e.dy);
      branchFn(new TrackBuilder(bx, by, this.h));
    }
    return this._advance(straightExit(TURNOUT_LEN));
  }

  turnoutRight(branchFn) {
    drawTurnoutPiece(this.x, this.y, this.h, +1);
    if (branchFn) {
      const e = turnoutBranchExit(+1);
      const [bx, by] = xf(this.x, this.y, this.h, e.dx, e.dy);
      branchFn(new TrackBuilder(bx, by, this.h));
    }
    return this._advance(straightExit(TURNOUT_LEN));
  }

  mergerLeft()  { drawMergerPiece(this.x, this.y, this.h, -1); return this._advance(straightExit(TURNOUT_LEN)); }
  mergerRight() { drawMergerPiece(this.x, this.y, this.h, +1); return this._advance(straightExit(TURNOUT_LEN)); }

  save()    { this._stack.push({ x: this.x, y: this.y, h: this.h }); return this; }
  restore() { const s = this._stack.pop(); if (s) { this.x = s.x; this.y = s.y; this.h = s.h; } return this; }
  label(text) { addLabel(text, this.x, this.y + CFG.railGauge + 15); return this; }
  pos()     { return { x: this.x, y: this.y, h: this.h }; }
}

function track(x, y, heading) { return new TrackBuilder(x, y, heading); }

/* ─── DSL: piece list + per-piece collision check ─── */

function expandPieceList(pieces) {
  const out = [];
  for (const item of pieces || []) {
    if (typeof item === 'string') {
      out.push(item);
      continue;
    }
    if (Array.isArray(item) && item.length >= 2) {
      const piece = item[0];
      const repeat = Math.max(1, Math.floor(item[1] || 1));
      for (let i = 0; i < repeat; i++) out.push(piece);
      continue;
    }
    if (item && typeof item === 'object') {
      const piece = item.piece || item.name || item.type;
      const repeat = Math.max(1, Math.floor(item.repeat || item.count || 1));
      if (!piece) throw new Error('Invalid piece spec: missing piece/name/type');
      for (let i = 0; i < repeat; i++) out.push(piece);
      continue;
    }
    throw new Error(`Invalid piece spec: ${String(item)}`);
  }
  return out;
}

function sampleStraightCenterline(state, len, steps) {
  const pts = [];
  const n = Math.max(2, steps || 6);
  for (let i = 1; i <= n; i++) {
    const t = (len * i) / n;
    pts.push([state.x + t * Math.cos(state.h), state.y + t * Math.sin(state.h)]);
  }
  const [nx, ny] = xf(state.x, state.y, state.h, len, 0);
  state.x = nx; state.y = ny;
  return pts;
}

function sampleBendCenterline(state, dir, radius, steps) {
  const pts = [];
  const n = Math.max(4, steps || 12);
  const perpX = -Math.sin(state.h), perpY = Math.cos(state.h);
  const cx = state.x + dir * radius * perpX;
  const cy = state.y + dir * radius * perpY;
  const startA = state.h - dir * Math.PI / 2;
  const endA = startA + dir * A;
  for (let i = 1; i <= n; i++) {
    const t = startA + (endA - startA) * (i / n);
    pts.push([cx + radius * Math.cos(t), cy + radius * Math.sin(t)]);
  }
  const e = bendExitR(dir, radius);
  const [nx, ny] = xf(state.x, state.y, state.h, e.dx, e.dy);
  state.x = nx; state.y = ny; state.h += e.da;
  return pts;
}

function samplePieceCenterline(state, piece, opts) {
  const straightSteps = opts.sampleStraightSteps || 6;
  const arcSteps = opts.sampleArcSteps || 12;
  switch (piece) {
    case 'straight': return sampleStraightCenterline(state, L, straightSteps);
    case 'halfStraight': return sampleStraightCenterline(state, L / 2, straightSteps);
    case 'bendRight': return sampleBendCenterline(state, +1, R, arcSteps);
    case 'bendLeft': return sampleBendCenterline(state, -1, R, arcSteps);
    case 'wideBendRight': return sampleBendCenterline(state, +1, R_WIDE, arcSteps);
    case 'wideBendLeft': return sampleBendCenterline(state, -1, R_WIDE, arcSteps);
    // Mainline collision check for switch/merger DSL usage.
    case 'turnoutLeft':
    case 'turnoutRight':
    case 'mergerLeft':
    case 'mergerRight':
      return sampleStraightCenterline(state, TURNOUT_LEN, straightSteps);
    default:
      throw new Error(`Unknown piece in DSL: ${piece}`);
  }
}

function placePiece(builder, piece) {
  switch (piece) {
    case 'straight': return builder.straight();
    case 'halfStraight': return builder.halfStraight();
    case 'bendRight': return builder.bendRight();
    case 'bendLeft': return builder.bendLeft();
    case 'wideBendRight': return builder.wideBendRight();
    case 'wideBendLeft': return builder.wideBendLeft();
    case 'turnoutLeft': return builder.turnoutLeft();
    case 'turnoutRight': return builder.turnoutRight();
    case 'mergerLeft': return builder.mergerLeft();
    case 'mergerRight': return builder.mergerRight();
    default: throw new Error(`Unknown piece in DSL: ${piece}`);
  }
}

function minDistance(newPts, existingPts, ignoreTail) {
  const limit = Math.max(0, existingPts.length - (ignoreTail || 0));
  let best = Infinity;
  for (const [x1, y1] of newPts) {
    for (let i = 0; i < limit; i++) {
      const [x2, y2] = existingPts[i];
      const d = Math.hypot(x1 - x2, y1 - y2);
      if (d < best) best = d;
    }
  }
  return best;
}

function buildTrackFromList(x, y, heading, pieces, options) {
  const opts = options || {};
  const doCollisionCheck = opts.collisionCheck !== false;
  const clearance = opts.clearance || (CFG.railGauge + 20);
  const ignoreTail = opts.ignoreTailPoints || 12;
  const expanded = expandPieceList(pieces);

  const t = track(x, y, heading);
  const sim = { x: x || 0, y: y || 0, h: heading || 0 };
  const occupied = [[sim.x, sim.y]];

  for (let idx = 0; idx < expanded.length; idx++) {
    const piece = expanded[idx];
    const pts = samplePieceCenterline(sim, piece, opts);
    if (doCollisionCheck && occupied.length > 1) {
      const d = minDistance(pts, occupied, ignoreTail);
      if (d < clearance) {
        throw new Error(`Illegal track at index ${idx} (${piece}): min distance ${d.toFixed(2)} < ${clearance}`);
      }
    }
    placePiece(t, piece);
    occupied.push(...pts);
  }
  return t;
}

class TrackDSL {
  constructor(x, y, heading) {
    this.x = x || 0;
    this.y = y || 0;
    this.h = heading || 0;
    this._pieces = [];
  }

  add(piece, repeat) {
    if (typeof piece === 'string' && repeat && repeat > 1) {
      this._pieces.push({ piece, repeat });
    } else {
      this._pieces.push(piece);
    }
    return this;
  }

  addMany(pieces) {
    this._pieces.push(...(pieces || []));
    return this;
  }

  pieces() {
    return expandPieceList(this._pieces);
  }

  build(options) {
    return buildTrackFromList(this.x, this.y, this.h, this._pieces, options);
  }
}

function dsl(x, y, heading) {
  return new TrackDSL(x, y, heading);
}

/* ─── XML output ─── */

function writeXml(outputPath) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" type="device">
  <diagram name="Railway Track" id="railway">
    <mxGraphModel dx="2500" dy="2000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="4000" pageHeight="3000" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
${cells.join('\n')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`Generated ${path.basename(outputPath)} (${cells.length} cells)`);
}

module.exports = {
  reset, track, dsl, buildTrackFromList, expandPieceList, writeXml,
  CFG, GAP, TURNOUT_LEN, R_WIDE,
};
