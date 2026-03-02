import { findNearestSnap } from './edgeSnap';

/**
 * Snap a point to the nearest grid intersection.
 */
export function snapToGrid(pt, snapSize, enabled) {
  if (!enabled) return pt;
  return {
    x: Math.round(Math.round(pt.x / snapSize) * snapSize * 100) / 100,
    y: Math.round(Math.round(pt.y / snapSize) * snapSize * 100) / 100,
  };
}

/**
 * Composite snap: edge/vertex snap first, then grid snap fallback.
 * Returns { point: {x,y}, snapInfo: { type: 'vertex'|'edge'|'grid' } | null }
 */
export function applySnap(pt, { snapEnabled, snapSize, siblingNodes = [], excludeNodeId = null }) {
  // 1. Try edge/vertex snap (always active when siblings exist)
  const edgeResult = findNearestSnap(pt, siblingNodes, 1.5, excludeNodeId);
  if (edgeResult) {
    return { point: edgeResult.snapped, snapInfo: { type: edgeResult.type } };
  }

  // 2. Fallback to grid snap
  if (snapEnabled) {
    return { point: snapToGrid(pt, snapSize, true), snapInfo: { type: 'grid' } };
  }

  // 3. No snap
  return { point: pt, snapInfo: null };
}
