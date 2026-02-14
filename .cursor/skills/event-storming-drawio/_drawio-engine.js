/**
 * Reusable draw.io Event Storming generator engine.
 *
 * Usage:
 *   const engine = require('./_drawio-engine');
 *   engine.generate({
 *     output: 'event-storming-5.drawio',
 *     subdomains: [ ... ],
 *     pivotals: [ ... ],
 *     layout: { splits: [...], merges: [...] },
 *     legend: { roles: '...' },
 *   });
 */
const fs = require('fs');
const path = require('path');

/* ─── constants ─── */
const S = 100, G = 20, ST = S + G;
const SUB_PAD_L = 70, SUB_PAD_R = 60;
const GAP_PIV = 180, GAP_NO_PIV = 80;
const ACTOR_W = 50, ACTOR_GAP = 20;
const PIV_BAR_W = 10, PIV_BAR_H = 320;
const ELLIPSE_H = 380;

/* ─── styles ─── */
const STY = {
  event: 'whiteSpace=wrap;html=1;shape=mxgraph.basic.document;fillColor=#f0a30a;fontColor=#000000;strokeColor=#BD7000;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;fontSize=9;fontStyle=1;',
  hotspot: 'whiteSpace=wrap;html=1;shape=mxgraph.basic.document;fillColor=#e51400;fontColor=#FFFFFF;strokeColor=#CC0000;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;fontSize=9;fontStyle=1;',
  pivBar: 'whiteSpace=wrap;html=1;fillColor=#e3c800;fontColor=#000000;strokeColor=none;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;',
  actorRect: 'whiteSpace=wrap;html=1;fillColor=#e3c800;fontColor=#000000;strokeColor=none;sketch=1;curveFitting=1;jiggle=2;fillStyle=solid;',
  actorLabel: 'text;strokeColor=none;align=center;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=9;fontColor=#000000;',
  cogwheel: 'text;strokeColor=none;align=center;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=36;fontColor=#000000;',
  subdomain: 'ellipse;whiteSpace=wrap;html=1;fillColor=none;strokeWidth=2;strokeColor=#FF8000;fontSize=12;fontStyle=1;fontColor=#FF8000;verticalAlign=top;spacingTop=8;',
  parent: 'ellipse;whiteSpace=wrap;html=1;fillColor=none;strokeWidth=2;dashed=1;dashPattern=3 3;strokeColor=#6666CC;fontSize=14;fontStyle=1;fontColor=#6666CC;verticalAlign=top;spacingTop=-5;',
  timeline: 'endArrow=classic;html=1;strokeWidth=4;strokeColor=#999999;',
  timeLabel: 'text;html=1;align=center;verticalAlign=middle;strokeColor=none;fillColor=none;fontSize=16;fontStyle=3;fontColor=#DDDDDD;',
  redLine: 'endArrow=none;html=1;strokeWidth=3;strokeColor=#FF0000;sketch=1;curveFitting=1;jiggle=2;',
  legendBg: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#2D2D2D;strokeColor=#FF8000;fontSize=14;fontStyle=1;verticalAlign=top;align=center;spacingTop=8;',
  legendText: 'text;strokeColor=none;align=left;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=10;fontStyle=2;',
};

/* ─── stick figure stencils ─── */
const STENCIL_BODY = 'shape=stencil(nVjZchpBDPwaXlUz0pzPjvMfrjKOqTjGhe0cf58mZAijhaect2VR746ubmlXdvP6ePeyXml4fdttv65/bO7fHlf2aaW6eX5c7zZvuFrZ7cpuHra79Zfd9v35/vD75W5vub/6tv2+f8LPA66YBNujNPw63FEp+ufG54P90+Z5ts9tss8SG7FPUstk36QEYp+9fYxSIgGU8fcRkCWwE1XRPgOa1EwBdXYZMaKAIjr7oPVakOKcBIuiiQCiNJ0BWcwuA3KXNEfJumQS1tykhwmQTIw4jTeE+Q0JTpNKAsBFKQcpzOmwAJjUSmvJlQa8CuRIFcU6A4pKIk63KD3NgCy5EACqfy6+0iSTN3SU9+x0RYOSTMcQJMyZq0UiCVNfNETt0khtdFv0tIkyJ3AkByjjEefDlEeeBgCPUOJ1BS3NiUDgWH3XIL3OALQ5JyZ1RwJtsJYr0uawdt5yCYDsAZ28wZDXtACQTIOrXVMDwMg1ooW7d/qvVxeqT7r6sHYS1upLCXljUW1erjoajjwf6lGdy0mMsAzEIDkAiI+4DBcctXbIA2EZq9KCByQCSDhS9YDMqLWJqfchsOIuYgunG2PKKLn7sLLCQIMWlzhULysMFXVHqmJsEEAeXCm1kZlLArTsBiUyDX3yYQVRsgbtXk9O2Pl8MfVFw3WqcbGfIQ3G9lG9AiFMyrhYUvJ5iIyKh56ddChngDP2jJOWNBmoqmsac8iJ+jB9g8txoW+MuU3HtHaioJ10A6Y1N7/VSn2w5MUEDdVIrWrzwxIULxKN1ji05jiZ8KEVY3aafcAYyzS6jbo82geaBvOslytlvSBpDlFOdABdzEn7+ZOcPwz6OR1wyfmDbzRM0KzR4lgqTkb0QM6TRk0e7dPojAuNZm7JCHQIg5bHOUBaqCiAWuKHFqU9F80pvrKKRUix2w75sheTV5Er6ySep3NU+b4KNjJXdbxrit8Y+L6NCcyvt5RZoAduP49jnjnf9jrGrWGPpmQj5GKqDXRDwiLborNnNIThyCWMC2ZSP0BesV9wOz8PVsxQP+AvOEo/Ek9woKsfni8spL4DaD38x/edK/a4+Pcx6WHz9HT4FnX6v//4hFuHD1d2+xs=);lineShape=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;';
const STENCIL_LLEG = 'shape=stencil(lVjZctswDPwav2JIggf4nKb/kZk4jadpnHHS6+8LjYaKAUmb5k22dkXiWADkgW9eH+9ejocUXt8u5+/H36f7t8cDfzmkdHp+PF5Ob/p04NsD3zycL8dvl/PP5/v598vdhJyefpx/TV/4M/N6p5InVgp/53+YwvzH1xn/dHq+xjfK1eAL5Q7wmVozeBkLbuMjcTD4mCjWfYI0SmwJlVIEhETZrpACVbCl1ig4QiFugBD9Chxo+rlHqIWKWEKhAGwoncR6lTvVAAiFkg1bZkrA6KJx6JZQxyc2CVkoJksQEgGE1ZamNYHRWZ1ovVR0S8BodaJEQ6iRCrCBebxeCJkK2BJHijbStY1QbhKm7Lc2tIAJ1cehMfRSStSsoJtGBqwQNXOsl1QhCaS36qtbG6RATUetAdYGEehWlXy2BC0LGQSuU3f4PCS4rVCq1gItawGYvPJpZ2pIDD5TFc9Int6jikcxa6NgXeEzKDCdwso/AewnBoorgqAQBy+1XqD6ldCtcnodQdwjZGezUIA54XNIhpe3+wJF20e0NdYCijYVW+9iCNCp6sHPEXj0sesdoSCQlJXFwEPrEAjs/RoB930NGVCNVjaH15wA+4kj56+TjpEqk4swwwirZovHZ9Rlx9v/VqVrBh+oXjZU3IA/V01f/QPrrs411QeggDIxidJpoFLFhOpc2qgBl/aNFK1A9TKWv5IAagSfxQc/2vVEDFy6lP2rTobwlaK1V1tlBSkt1FxrTVQAPkZvcFODUfPOoyQsBM0JVHe7d5FOLChkKmO2aaozUQc+Uqe6OqTzcACVdz0T1TQa3N7UJVZppUOCznVO+jpqRhAHzl77BdcW1tJpM6OEIe9tQvczgs7XqOdPA75dQSd4NOToa1mdEVBq6I67jXRexoC9U0i1geMGvaTzujvccYItodZRfpazmsCTlJ7VnB6mAzBwa1sFLgo8hUj0g0tcGtE2oYy4LkWJGlpAfNWuY3rbO2I7PMMD8/ssPfBLm9jDuzxaBoFtfPEOCvD8oT3JnTS1ioO2rHjx30djl7aw0jweXVnI2O47Hvpfq1F3+Iy+39f+b+j73TepCBNU8U7GccwNO01/1TUTRWyA6/ppHDn38J+7k/oQrw/vF2APp6en+f7s+r2/MNO/5ss2vv0H);lineShape=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;';
const STENCIL_RLEG = 'shape=stencil(lVjLUhtBDPwaX1Uz0jzPJPkPqjDBFYIpIK+/j7acWVuadQduZlHvSppWS5qd3Lw+3D7vdxxe316O3/a/DndvDzv5tGM+PD3sXw5v+msnn3dyc3982X99Of54ujv9/Xy7WC6/vh9/Lm/4fcL1RkUWFIc/pyc5Uzw9+XICPB6eLgGJejOAwhQSADClagGVJFwHtE7NulR5OLkNKN6lWqkjgFCLBtCYMnIpUOkWUKgBgDpQ2AB6oBwBIFEtFiDQJc1JyBaQqYAvlO5Puus5VADQfycLaJSAS0qE7mLolDoATGlVQAWA3EgsIIZAAfikbK7sg/iX6W2AULDc6AWSKQeKLuo0nmwC0kr/FRApIECibI+6Kb9ByaU4PF4BiZivA6QPcq6AQAJckkpsAbVQAlkS8YCCucHKBCcbMoRkG1BI7Emf2bINYIqWTFlVoF0HxEbBupQaFKaoOmNdSgWeg5ao+wCm0prz1V6GFG6H7Cta3y8oYsrdv5+BxgTqNl4lVgNEDUNPVvs0dPOKfbBCz40iqP5VG1b7MCTqir0rZT3BnpF9tvYVdoVI0aZf4OnGkbthjluINsngzFEjFxLLHYYiJF7bC8x8omSZEOOohSv2xWUel9Zkz3n09Pf5IwyZNoUrbeTrfdlMWmuAOTxVlir0R7igldigfXT+xKF215hsW4wUyiDeqVIkQCWZK1Fgg5kqPWLlnJRE2wcWKpceOGxFX1qaTHi4YpOJZ5QPmmcK7MwFZEabVve+o1DjULyzLnSQyfO5rF0UHpTWtetZSjTQIjS6YpmvhYhUkKnZHhoDNTQG6HjnAGW0se1SnzxauAzooE0t2tlHX4H6hE5XziXBQ2sK/hDSOsZuA1R/HKAOnmwDsh+Lde6tIGh9X3WLpVABCpEnCcoFSq6+j61G6MCHNF13ATee6ALCqNKmdaNEeNLLQtM8AMloyZ4aCkATyjI1OwDDk65xbFQXX0CNXjdRF3TusBXrrhstW7M+QYoUJoDALOm+zrbbpI6/UIZGXLRXpDKtT6NZHx16e1Kf0qpVjnaynnwMiwiAfUa3cydky4SHAI24ewCjGNrokRcA6FL3bGW8Pyz7v2smhSrKUvfrujZyNNcpoDttFXhJcXFhsCIq7CjLJ9ysFmHHVUCzKqDqGXGa/N7XoFYqQJz0RXj5o4AwqTFqQR+/F/w/QH+cryHvD4+Pp1vMy//7a0t9dLrylM9/AQ==);lineShape=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;';
const STENCIL_ARMS = 'shape=stencil(lVjJbhsxDP0aXwmJ1EKd0/Y/AsRpjKZxkKTb35dTQ47JGb8it1n4JPJxlXZy8/pw+7zfcXp9ezl+2/863L097OTTjvnw9LB/ObzZ004+7+Tm/viy//py/PF0d3p/vl0kl6fvx5/LCr9PuKwkaUFx+nP6IlTKvw9fTvKPh6dL+UZDnLxSUiDfqTQnnwsNsAEn6sUBmKkKAAjl4QENmmC/s99BEgkCDKrdAwoxAIgQVw9QWl6vAjolz1JhYmB0STSyB7S55zagUPcs1UQlA4BS8yrVQqVfB1Rzk6e12hKApWoaexsaT6u2AYM6e4DxBmhd1vM29EQ6AMBUCgAzGvihcwxvNVrBDl2j0VopA8dpm5FzBoy5xCZgNFIfrUNIEEBXgEICaB2Dhq8Zo1LFgLhDm+F4TaXuaR2dBigzy3pBJcUAiQlkSjYESNS8DTklSgl4rk8WL7YYgCYt0dUGQJVMM7URrW7A1d0UGJFX5DkDSKDJ4hHQZIAeAJUSyCCzIftaaa5BOarWoNQDGLraMijkqAEKcpzZsNoBppzMHni5AzDaSEwcjUYsjVWbXgK4wZRrGv2QgQ0X0XzhagEF37ZgX/AtmBrg1X5Hz+lMqm1AWRWaMZfYBmTqPQLQtKFKZZ2jKPoq8Uol1OXUIqFGo2EV+CigW+gEo+tsY9e6nK4SIqM+arXPq6R46qt11eUEduoyZlU5N95GDQHqzPkzgGeT2QZwjKU2KIHGK2Om8BlQYMpJJfUqGW+KADlWYxuJOjB6mbUDgKmh2XjVUWysQ/Xepm/xnrbBEWWcnQdqGETTTKltAFP3tErD08YMzbM8z/l9O1hjaeUOS4DE7mBf0CCQ53x3ngPG5GxTPsUqmSs8PKzKcM4koCIlqt5jNnZA9UPe8DxvbQfEHEDexVEeSwwf0x1kQIl1JcGx0EaPHsRRg9LZ8N7FM2hPOcUujuc7i+RUojxiXmIFwsdOi5Ma1++AzLwq6xkmlh3Nw5HQYgPQmTXWaJ5D9zX5j10t/FfeHt7vMe4Pj4+na5DL//Dewz6d7kzk818=);lineShape=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;';

/* ─── cell buffer ─── */
let nid, cells;

function reset() { nid = 2; cells = []; }

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

/* ─── draw components ─── */

function drawActor(name, x, y) {
  v('', STY.actorRect, x, y, 50, 100);
  const gid = nid++;
  cells.push(`<mxCell id="${gid}" value="" style="group" vertex="1" connectable="0" parent="1"><mxGeometry x="${x+13}" y="${y+15}" width="23.24" height="60" as="geometry"/></mxCell>`);
  for (const [sty,cx,cy,cw,ch] of [
    ['ellipse;whiteSpace=wrap;html=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;',4.62,0,15.93,16.91],
    [STENCIL_BODY,9.39,16.18,3.74,22.98],[STENCIL_LLEG,0.84,37.61,11.02,22.39],
    [STENCIL_RLEG,12.43,38.30,5.28,18.61],[STENCIL_ARMS,0,22.33,23.24,3.26]])
  { const cid=nid++; cells.push(`<mxCell id="${cid}" value="" style="${sty}" vertex="1" parent="${gid}"><mxGeometry x="${cx}" y="${cy}" width="${cw}" height="${ch}" as="geometry"/></mxCell>`); }
  v(name, STY.actorLabel, x, y+78, 50, 20);
}

function drawSystemActor(name, x, y) {
  v('', STY.actorRect, x, y, 50, 100);
  v('\u2699', STY.cogwheel, x, y+8, 50, 50);
  v(name, STY.actorLabel, x, y+78, 50, 20);
}

function drawSubdomain(sd, startX, eventsY) {
  const actorX = startX + SUB_PAD_L;
  const firstEventX = actorX + ACTOR_W + ACTOR_GAP;
  const events = [];
  let ex = firstEventX;
  for (const name of sd.events) {
    events.push({ name, x: ex, y: eventsY });
    ex += ST;
  }
  const sdRight = ex - G + SUB_PAD_R;
  return {
    id: sd.id, name: sd.name, actorType: sd.actorType, actorName: sd.actorName,
    parentDomain: sd.parentDomain,
    actorX, actorY: eventsY, events,
    hotspots: sd.hotspots || [],
    ellipse: { x: startX, y: eventsY - 30, w: sdRight - startX, h: ELLIPSE_H },
  };
}

function drawPivotal(name, x, y) {
  return { name, x, y };
}

function drawRedLine(x1, x2, y) {
  pointEdge('', STY.redLine, x1, y, x2, y);
}

/* ─── layout engine ─── */

function layoutRow(subdomains, pivotals, startX, eventsY) {
  // subdomains: array of sd data objects (with .id)
  // pivotals: [{ name, between: [leftId, rightId] }]
  const laid = [];
  const pivLaid = [];
  let x = startX;

  for (let i = 0; i < subdomains.length; i++) {
    const piv = pivotals.find(p => p.between[1] === subdomains[i].id);
    if (piv) {
      pivLaid.push(drawPivotal(piv.name, x + (GAP_PIV - S) / 2, eventsY));
      x += GAP_PIV;
    }
    const sd = drawSubdomain(subdomains[i], x, eventsY);
    laid.push(sd);
    x = sd.ellipse.x + sd.ellipse.w + GAP_NO_PIV;
  }
  return { subdomains: laid, pivotals: pivLaid };
}

function computeParentBounds(subdomains, pivotals, margin = 30) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const sd of subdomains) {
    minX = Math.min(minX, sd.ellipse.x);
    maxX = Math.max(maxX, sd.ellipse.x + sd.ellipse.w);
    minY = Math.min(minY, sd.ellipse.y);
    maxY = Math.max(maxY, sd.ellipse.y + sd.ellipse.h);
  }
  for (const p of pivotals) {
    minX = Math.min(minX, p.x - 40);
    maxX = Math.max(maxX, p.x + S + 40);
  }
  return { x: minX - margin, y: minY - margin, w: maxX - minX + 2*margin, h: maxY - minY + 2*margin };
}

/* ─── render helpers ─── */

function renderParent(name, bounds) {
  v(name, STY.parent, bounds.x, bounds.y, bounds.w, bounds.h);
}

function renderSubdomainEllipse(sd) {
  v(sd.name, STY.subdomain, sd.ellipse.x, sd.ellipse.y, sd.ellipse.w, sd.ellipse.h);
}

function renderPivotalBar(piv) {
  v('', STY.pivBar, piv.x + (S/2) - (PIV_BAR_W/2), piv.y - 110, PIV_BAR_W, PIV_BAR_H);
}

function renderActor(sd) {
  if (sd.actorType === 'human') drawActor(sd.actorName, sd.actorX, sd.actorY);
  else drawSystemActor(sd.actorName, sd.actorX, sd.actorY);
}

function renderEvents(sd) {
  for (const e of sd.events) v(e.name, STY.event, e.x, e.y, S, S);
}

function renderPivotalSticky(piv) {
  v(piv.name, STY.event, piv.x, piv.y, S, S);
}

function renderHotspots(sd) {
  for (const hs of sd.hotspots) {
    const evt = sd.events.find(e => e.name === hs.after);
    if (evt) v(hs.name, STY.hotspot, evt.x, evt.y + S + 20, S, S);
  }
}

function renderTimeline(leftX, rightX, y) {
  pointEdge('', STY.timeline, leftX, y, rightX, y);
  v('TIMELINE  \u2192  \u2192  \u2192', STY.timeLabel, leftX + 20, y + 12, rightX - leftX - 80, 30);
  v('Time', STY.timeLabel, rightX + 10, y + 12, 60, 25);
}

function renderLegend(x, y, rolesText) {
  const w = 260, h = 600;
  v('LEGEND', STY.legendBg, x, y, w, h);
  let ly = y + 45;
  v('Domain Event', STY.event, x+20, ly, 100, 36); ly += 50;
  v('', STY.pivBar, x+65, ly, 10, 52);
  v('Pivotal Event', STY.event, x+20, ly+8, 100, 36); ly += 63;
  // Human Actor
  v('', STY.actorRect, x+20, ly, 30, 60);
  { const gid=nid++;
    cells.push(`<mxCell id="${gid}" value="" style="group" vertex="1" connectable="0" parent="1"><mxGeometry x="${x+27}" y="${ly+5}" width="17" height="45" as="geometry"/></mxCell>`);
    for (const [sty,cx,cy,cw,ch] of [
      ['ellipse;whiteSpace=wrap;html=1;sketch=1;fillStyle=solid;strokeColor=#000000;strokeWidth=2;fillColor=none;',3.4,0,11.7,12.4],
      [STENCIL_BODY,6.9,11.8,2.7,16.8],[STENCIL_LLEG,0.6,27.5,8.1,16.4],
      [STENCIL_RLEG,9.1,28,3.9,13.6],[STENCIL_ARMS,0,16.3,17,2.4]])
    { const cid=nid++; cells.push(`<mxCell id="${cid}" value="" style="${sty}" vertex="1" parent="${gid}"><mxGeometry x="${cx}" y="${cy}" width="${cw}" height="${ch}" as="geometry"/></mxCell>`); }
  }
  v('Human Actor', `${STY.legendText}fontColor=#FFFFFF;`, x+60, ly+17, 100, 25); ly += 70;
  v('', STY.actorRect, x+20, ly, 30, 45);
  v('\u2699','text;strokeColor=none;align=center;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=22;fontColor=#000000;',x+20,ly,30,35);
  v('System Actor', `${STY.legendText}fontColor=#FFFFFF;`, x+60, ly+10, 100, 25); ly += 55;
  v('Hotspot', STY.hotspot, x+20, ly, 100, 36); ly += 50;
  v('', 'ellipse;whiteSpace=wrap;html=1;fillColor=none;strokeWidth=2;strokeColor=#FF8000;', x+20, ly, 100, 36);
  v('Subdomain', `${STY.legendText}fontColor=#FF9933;`, x+130, ly+5, 100, 25); ly += 48;
  v('', 'ellipse;whiteSpace=wrap;html=1;fillColor=none;strokeWidth=2;dashed=1;dashPattern=3 3;strokeColor=#9999FF;', x+20, ly, 100, 36);
  v('Parent Domain', `${STY.legendText}fontColor=#9999FF;`, x+130, ly+5, 110, 25); ly += 48;
  pointEdge('', STY.redLine, x+20, ly+10, x+120, ly+10);
  v('Separator (split)', `${STY.legendText}fontColor=#FF0000;`, x+130, ly, 110, 25); ly += 40;
  v('Pivotal events sit BETWEEN\nsubdomains \u2014 boundary splitters', 'text;strokeColor=none;align=left;fillColor=none;html=1;verticalAlign=top;whiteSpace=wrap;rounded=0;fontSize=9;fontStyle=2;fontColor=#e3c800;', x+20, ly, 220, 40); ly += 45;
  v('Dependent subdomains sit\nBELOW their trigger subdomain', 'text;strokeColor=none;align=left;fillColor=none;html=1;verticalAlign=top;whiteSpace=wrap;rounded=0;fontSize=9;fontStyle=2;fontColor=#FF6666;', x+20, ly, 220, 40); ly += 45;
  if (rolesText) {
    v('Roles &amp; Personas', 'text;strokeColor=none;align=left;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=11;fontStyle=1;fontColor=#FFFFFF;', x+15, ly, 230, 20); ly += 22;
    v(rolesText, 'text;strokeColor=none;align=left;fillColor=none;html=1;verticalAlign=top;whiteSpace=wrap;rounded=0;fontSize=9;fontStyle=0;fontColor=#CCCCCC;', x+15, ly, 230, 40);
  }
}

function writeXml(outputPath) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" type="device">
  <diagram name="Event Storming - Big Picture" id="bp-evt-storm">
    <mxGraphModel dx="7000" dy="2000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="8000" pageHeight="3000" math="0" shadow="0">
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
  reset, layoutRow, computeParentBounds, drawSubdomain, drawPivotal, drawRedLine,
  renderParent, renderSubdomainEllipse, renderPivotalBar, renderActor,
  renderEvents, renderPivotalSticky, renderHotspots, renderTimeline, renderLegend,
  writeXml, v, pointEdge,
  S, G, ST, GAP_PIV, GAP_NO_PIV, SUB_PAD_L, SUB_PAD_R,
};
