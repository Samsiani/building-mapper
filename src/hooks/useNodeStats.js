import { useMemo } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { NODE_TYPES, canDrillInto } from '../utils/nodeTypes';

/**
 * Pure function: BFS from nodeId, collect all descendant nodes with hasStatus,
 * return { total, byStatus: { for_sale: N, ... }, units: [] }.
 */
export function computeNodeStats(nodes, nodeId) {
  if (nodeId == null) {
    // Root level: all hasStatus nodes
    const units = nodes.filter((n) => NODE_TYPES[n.type]?.hasStatus);
    return tally(units);
  }

  const result = [];
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift();
    for (const n of nodes) {
      if (n.parentId === current) {
        if (NODE_TYPES[n.type]?.hasStatus) result.push(n);
        if (canDrillInto(n.type)) queue.push(n.id);
      }
    }
  }
  return tally(result);
}

function tally(units) {
  const byStatus = {};
  for (const u of units) {
    const s = u.status || 'for_sale';
    byStatus[s] = (byStatus[s] || 0) + 1;
  }
  return { total: units.length, byStatus, units };
}

/**
 * Hook version — reads nodes from the store.
 */
export function useNodeStats(nodeId) {
  const nodes = useProjectStore((s) => s.nodes);
  return useMemo(() => computeNodeStats(nodes, nodeId), [nodes, nodeId]);
}
