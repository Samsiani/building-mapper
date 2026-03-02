/**
 * Project point P onto segment A→B. Returns projected point (clamped to segment).
 */
function projectPointOntoSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return { x: a.x, y: a.y };

  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  return {
    x: Math.round((a.x + t * dx) * 100) / 100,
    y: Math.round((a.y + t * dy) * 100) / 100,
  };
}

function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Find the nearest vertex or edge snap among sibling nodes.
 * Returns { snapped: {x,y}, type: 'vertex'|'edge' } or null.
 */
export function findNearestSnap(pt, siblingNodes, threshold = 1.5, excludeNodeId = null) {
  let best = null;
  let bestDist = threshold;

  for (const node of siblingNodes) {
    if (node.id === excludeNodeId) continue;
    const pts = node.points;
    if (!pts || pts.length < 2) continue;

    // Check vertices
    for (const v of pts) {
      const d = dist(pt, v);
      if (d < bestDist) {
        bestDist = d;
        best = { snapped: { x: v.x, y: v.y }, type: 'vertex' };
      }
    }

    // Check edges
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const proj = projectPointOntoSegment(pt, a, b);
      const d = dist(pt, proj);
      if (d < bestDist) {
        bestDist = d;
        best = { snapped: proj, type: 'edge' };
      }
    }
  }

  return best;
}
