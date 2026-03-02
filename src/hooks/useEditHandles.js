import { useState, useCallback, useRef, useMemo } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useEditorStore } from '../stores/editorStore';
import { useToastStore } from '../stores/toastStore';
import { applySnap } from '../utils/snapPoint';

export function useEditHandles(svgRef, nodeId) {
  const [isDragging, setIsDragging] = useState(false);
  const draggingIndex = useRef(null);

  const entity = useProjectStore((s) => s.nodes.find((n) => n.id === nodeId));
  const points = entity?.points || [];

  // Compute midpoints for each edge
  const midpoints = useMemo(() => {
    if (points.length < 3) return [];
    return points.map((p, i) => {
      const next = points[(i + 1) % points.length];
      return {
        x: Math.round(((p.x + next.x) / 2) * 100) / 100,
        y: Math.round(((p.y + next.y) / 2) * 100) / 100,
        afterIndex: i,
      };
    });
  }, [points]);

  const onHandleMouseDown = useCallback(
    (e, index) => {
      e.stopPropagation();
      e.preventDefault();
      draggingIndex.current = index;
      setIsDragging(true);

      const handleMouseMove = (moveE) => {
        if (draggingIndex.current === null || !svgRef.current) return;
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();
        pt.x = moveE.clientX;
        pt.y = moveE.clientY;
        const ctm = svg.getScreenCTM().inverse();
        const svgPt = pt.matrixTransform(ctm);
        let x = Math.max(0, Math.min(100, Math.round(svgPt.x * 100) / 100));
        let y = Math.max(0, Math.min(100, Math.round(svgPt.y * 100) / 100));
        const { snapEnabled, snapSize, currentView } = useEditorStore.getState();
        const siblingNodes = useProjectStore.getState().nodes.filter(
          (n) => n.parentId === currentView.parentId && n.points?.length >= 2
        );
        const result = applySnap({ x, y }, { snapEnabled, snapSize, siblingNodes, excludeNodeId: nodeId });
        x = result.point.x;
        y = result.point.y;

        const store = useProjectStore.getState();
        const current = store.nodes.find((n) => n.id === nodeId);
        if (current) {
          const newPoints = current.points.map((p, i) =>
            i === draggingIndex.current ? { x, y } : { ...p }
          );
          useProjectStore.setState((state) => ({
            nodes: state.nodes.map((n) =>
              n.id === nodeId ? { ...n, points: newPoints } : n
            ),
          }));
        }
      };

      const handleMouseUp = () => {
        if (draggingIndex.current !== null) {
          const store = useProjectStore.getState();
          const current = store.nodes.find((n) => n.id === nodeId);
          if (current) {
            store.updateNodePoints(nodeId, [...current.points]);
          }
        }
        draggingIndex.current = null;
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [svgRef, nodeId]
  );

  const onMidpointClick = useCallback(
    (e, afterIndex) => {
      e.stopPropagation();
      const store = useProjectStore.getState();
      const current = store.nodes.find((n) => n.id === nodeId);
      if (!current) return;

      const pts = [...current.points];
      const a = pts[afterIndex];
      const b = pts[(afterIndex + 1) % pts.length];
      const mid = {
        x: Math.round(((a.x + b.x) / 2) * 100) / 100,
        y: Math.round(((a.y + b.y) / 2) * 100) / 100,
      };
      pts.splice(afterIndex + 1, 0, mid);
      store.updateNodePoints(nodeId, pts);
    },
    [nodeId]
  );

  const onHandleDoubleClick = useCallback(
    (e, index) => {
      e.stopPropagation();
      const store = useProjectStore.getState();
      const current = store.nodes.find((n) => n.id === nodeId);
      if (!current) return;

      if (current.points.length <= 3) {
        useToastStore.getState().show('Cannot remove vertex — polygon needs at least 3 points', 'warning');
        return;
      }

      const pts = current.points.filter((_, i) => i !== index);
      store.updateNodePoints(nodeId, pts);
    },
    [nodeId]
  );

  return {
    handles: points,
    midpoints,
    onHandleMouseDown,
    onMidpointClick,
    onHandleDoubleClick,
    isDragging,
  };
}
