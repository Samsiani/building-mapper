/**
 * buildingRenderer.js — Imperative SVG building facade generator (dark/light themes)
 * Ported from prototype building.js for use in useEffect
 */

const NS = 'http://www.w3.org/2000/svg';

export const THEMES = {
  dark: {
    sky: ['#0c1220', '#141b2d'],
    building: '#1a2332',
    buildingAccent: '#212d3f',
    window: '#0d1520',
    windowFrame: 'rgba(255,255,255,0.05)',
    windowLit: 'rgba(245, 200, 80, 0.08)',
    divider: 'rgba(255,255,255,0.06)',
    ground: '#0e1218',
    groundAccent: '#161e28',
    entrance: '#0a0f16',
    entranceTrim: 'rgba(129, 140, 248, 0.3)',
    text: 'rgba(255,255,255,0.3)',
    nameText: 'rgba(255,255,255,0.18)',
    rooftop: '#243044',
    shadow: 'rgba(0,0,0,0.4)',
  },
  light: {
    sky: ['#7ec8e3', '#c9e4f0'],
    building: '#ddd5c8',
    buildingAccent: '#e8e2d8',
    window: '#a8cce0',
    windowFrame: 'rgba(0,0,0,0.07)',
    windowLit: 'rgba(135, 206, 235, 0.12)',
    divider: 'rgba(0,0,0,0.07)',
    ground: '#8aad6a',
    groundAccent: '#7a9a5a',
    entrance: '#5c4033',
    entranceTrim: '#8b6f4e',
    text: 'rgba(0,0,0,0.35)',
    nameText: 'rgba(0,0,0,0.22)',
    rooftop: '#c0b4a3',
    shadow: 'rgba(0,0,0,0.10)',
  },
};

const B_LEFT = 15;
const B_RIGHT = 85;
const B_TOP = 8;
const B_BOTTOM = 92;
const B_WIDTH = B_RIGHT - B_LEFT;
const B_HEIGHT = B_BOTTOM - B_TOP;

export function renderBuilding(layerEl, defsEl, config, themeName = 'dark') {
  if (!layerEl || !defsEl) return;
  layerEl.innerHTML = '';
  const t = THEMES[themeName] || THEMES.dark;
  const floors = Math.max(1, config.floors || 6);
  const unitsPerFloor = Math.max(1, config.unitsPerFloor || 4);

  _addDefs(defsEl, t, themeName);

  // Sky
  layerEl.appendChild(_rect(0, 0, 100, 100, `url(#sky-grad-${themeName})`));

  // Building shadow
  const shadow = _rect(B_LEFT + 1.5, B_TOP + 1.5, B_WIDTH, B_HEIGHT, t.shadow);
  shadow.setAttribute('rx', '0.5');
  shadow.setAttribute('filter', `url(#bld-shadow-${themeName})`);
  layerEl.appendChild(shadow);

  // Building body
  const body = _rect(B_LEFT, B_TOP, B_WIDTH, B_HEIGHT, `url(#bld-grad-${themeName})`);
  body.setAttribute('rx', '0.5');
  layerEl.appendChild(body);

  // Vertical edge highlights
  layerEl.appendChild(_line(B_LEFT, B_TOP, B_LEFT, B_BOTTOM, t.divider, 0.3));
  layerEl.appendChild(_line(B_RIGHT, B_TOP, B_RIGHT, B_BOTTOM, t.divider, 0.3));

  // Rooftop parapet
  const parapet = _rect(B_LEFT - 0.5, B_TOP - 1.5, B_WIDTH + 1, 2, t.rooftop);
  parapet.setAttribute('rx', '0.3');
  layerEl.appendChild(parapet);

  // Rooftop decorations
  layerEl.appendChild(_line(B_LEFT + B_WIDTH * 0.25, B_TOP - 1.5, B_LEFT + B_WIDTH * 0.25, B_TOP - 5, t.rooftop, 0.3));
  const tank = _rect(B_LEFT + B_WIDTH * 0.6, B_TOP - 4.5, 7, 3, t.rooftop);
  tank.setAttribute('rx', '0.4');
  layerEl.appendChild(tank);

  // Floor geometry
  const groundH = floors === 1 ? B_HEIGHT : B_HEIGHT * 0.18;
  const upperH = floors <= 1 ? 0 : (B_HEIGHT - groundH) / (floors - 1);

  for (let f = 0; f < floors; f++) {
    const isGF = f === 0;
    const fH = isGF ? groundH : upperH;
    const fTop = B_BOTTOM - (isGF ? groundH : groundH + f * upperH);

    // Divider line between floors
    if (f > 0) {
      layerEl.appendChild(_line(B_LEFT, fTop + fH, B_RIGHT, fTop + fH, t.divider, 0.2));
    }

    // Window geometry
    const mX = 2, gX = 1.5;
    const mY = isGF ? 3.5 : 2.5;
    const wW = (B_WIDTH - mX * 2 - gX * (unitsPerFloor - 1)) / unitsPerFloor;
    const wH = fH - mY * 2;
    const centerCol = Math.floor(unitsPerFloor / 2);

    for (let u = 0; u < unitsPerFloor; u++) {
      const wx = B_LEFT + mX + u * (wW + gX);
      const wy = fTop + mY;

      // Skip center column on GF for entrance
      if (isGF && unitsPerFloor > 1 && u === centerCol) continue;

      // Window
      const win = _rect(wx, wy, wW, wH, t.window);
      win.setAttribute('rx', '0.4');
      layerEl.appendChild(win);

      // Randomly light some windows
      if (!isGF && ((f * unitsPerFloor + u) % 3 === 0)) {
        const glow = _rect(wx + 0.3, wy + 0.3, wW - 0.6, wH - 0.6, t.windowLit);
        glow.setAttribute('rx', '0.3');
        layerEl.appendChild(glow);
      }

      // Cross bars
      const midX = wx + wW / 2;
      const midY = wy + wH / 2;
      layerEl.appendChild(_line(midX, wy + 0.5, midX, wy + wH - 0.5, t.windowFrame, 0.12));
      if (!isGF) {
        layerEl.appendChild(_line(wx + 0.5, midY, wx + wW - 0.5, midY, t.windowFrame, 0.12));
      }
    }

    // Entrance on ground floor
    if (isGF && unitsPerFloor > 1) {
      const eW = wW * 0.6;
      const eX = B_LEFT + mX + centerCol * (wW + gX) + (wW - eW) / 2;
      const eH = wH + mY - 1;
      const eY = fTop + fH - eH;

      const door = _rect(eX, eY, eW, eH, t.entrance);
      door.setAttribute('rx', '0.6');
      layerEl.appendChild(door);

      // Trim above door
      layerEl.appendChild(_rect(eX - 0.5, eY - 0.6, eW + 1, 0.7, t.entranceTrim));

      // Door panels
      const panelW = (eW - 0.4) / 2;
      layerEl.appendChild(_line(eX + panelW + 0.2, eY + 1, eX + panelW + 0.2, eY + eH - 0.5, t.windowFrame, 0.15));
    }

    // Floor label
    const lbl = document.createElementNS(NS, 'text');
    lbl.setAttribute('x', B_LEFT - 2);
    lbl.setAttribute('y', fTop + fH / 2);
    lbl.setAttribute('text-anchor', 'end');
    lbl.setAttribute('dominant-baseline', 'central');
    lbl.setAttribute('fill', t.text);
    lbl.setAttribute('font-size', '2.2');
    lbl.setAttribute('font-family', 'Inter, sans-serif');
    lbl.setAttribute('font-weight', '600');
    lbl.textContent = isGF ? 'GF' : String(f);
    layerEl.appendChild(lbl);
  }

  // Ground plane
  layerEl.appendChild(_rect(0, B_BOTTOM, 100, 8, t.ground));
  const sidewalk = _rect(B_LEFT - 3, B_BOTTOM, B_WIDTH + 6, 1.5, t.groundAccent);
  sidewalk.setAttribute('rx', '0.2');
  layerEl.appendChild(sidewalk);

  // Building name
  if (config.buildingName) {
    const nameEl = document.createElementNS(NS, 'text');
    nameEl.setAttribute('x', 50);
    nameEl.setAttribute('y', 97.5);
    nameEl.setAttribute('text-anchor', 'middle');
    nameEl.setAttribute('fill', t.nameText);
    nameEl.setAttribute('font-size', '2');
    nameEl.setAttribute('font-family', 'Inter, sans-serif');
    nameEl.setAttribute('font-weight', '700');
    nameEl.setAttribute('letter-spacing', '0.2');
    nameEl.textContent = config.buildingName.toUpperCase();
    layerEl.appendChild(nameEl);
  }
}

function _addDefs(defsEl, t, id) {
  defsEl.innerHTML = '';

  // Sky gradient
  defsEl.appendChild(
    _gradient(`sky-grad-${id}`, 'vertical', [
      [0, t.sky[0]],
      [100, t.sky[1]],
    ])
  );

  // Building gradient
  defsEl.appendChild(
    _gradient(`bld-grad-${id}`, 'horizontal', [
      [0, t.buildingAccent],
      [50, t.building],
      [100, t.buildingAccent],
    ])
  );

  // Shadow filter
  const filter = document.createElementNS(NS, 'filter');
  filter.id = `bld-shadow-${id}`;
  filter.setAttribute('x', '-20%');
  filter.setAttribute('y', '-10%');
  filter.setAttribute('width', '150%');
  filter.setAttribute('height', '130%');
  const blur = document.createElementNS(NS, 'feGaussianBlur');
  blur.setAttribute('in', 'SourceGraphic');
  blur.setAttribute('stdDeviation', '1.5');
  filter.appendChild(blur);
  defsEl.appendChild(filter);
}

function _gradient(id, dir, stops) {
  const g = document.createElementNS(NS, 'linearGradient');
  g.id = id;
  if (dir === 'vertical') {
    g.setAttribute('x1', '0'); g.setAttribute('y1', '0');
    g.setAttribute('x2', '0'); g.setAttribute('y2', '1');
  } else {
    g.setAttribute('x1', '0'); g.setAttribute('y1', '0');
    g.setAttribute('x2', '1'); g.setAttribute('y2', '0');
  }
  stops.forEach(([offset, color]) => {
    const stop = document.createElementNS(NS, 'stop');
    stop.setAttribute('offset', `${offset}%`);
    stop.setAttribute('stop-color', color);
    g.appendChild(stop);
  });
  return g;
}

function _rect(x, y, w, h, fill) {
  const r = document.createElementNS(NS, 'rect');
  r.setAttribute('x', x);
  r.setAttribute('y', y);
  r.setAttribute('width', w);
  r.setAttribute('height', h);
  r.setAttribute('fill', fill);
  return r;
}

function _line(x1, y1, x2, y2, stroke, width) {
  const l = document.createElementNS(NS, 'line');
  l.setAttribute('x1', x1);
  l.setAttribute('y1', y1);
  l.setAttribute('x2', x2);
  l.setAttribute('y2', y2);
  l.setAttribute('stroke', stroke);
  l.setAttribute('stroke-width', width);
  return l;
}
