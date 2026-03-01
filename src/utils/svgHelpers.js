/**
 * SVG coordinate conversion utilities
 */
export function screenToSVG(svgEl, clientX, clientY) {
  const pt = svgEl.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svgEl.getScreenCTM().inverse();
  const svgPt = pt.matrixTransform(ctm);
  return {
    x: Math.round(svgPt.x * 100) / 100,
    y: Math.round(svgPt.y * 100) / 100,
  };
}

export function pointsToString(points) {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

export function clampToViewBox(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}
