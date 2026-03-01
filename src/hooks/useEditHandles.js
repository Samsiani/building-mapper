import { useState, useCallback, useRef } from 'react';
import { useProjectStore } from '../stores/projectStore';

export function useEditHandles(svgRef, nodeId) {
  const [isDragging, setIsDragging] = useState(false);
  const draggingIndex = useRef(null);

  const entity = useProjectStore((s) => s.nodes.find((n) => n.id === nodeId));

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
        const x = Math.max(0, Math.min(100, Math.round(svgPt.x * 100) / 100));
        const y = Math.max(0, Math.min(100, Math.round(svgPt.y * 100) / 100));

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

  return {
    handles: entity?.points || [],
    onHandleMouseDown,
    isDragging,
  };
}
