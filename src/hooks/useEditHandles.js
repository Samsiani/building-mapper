import { useState, useCallback, useRef } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useEditorStore } from '../stores/editorStore';

export function useEditHandles(svgRef, entityId) {
  const [isDragging, setIsDragging] = useState(false);
  const draggingIndex = useRef(null);

  const currentView = useEditorStore((s) => s.currentView);

  // Determine which entity collection to use based on view level
  const entityType = currentView.level === 'global' ? 'building' : currentView.level === 'building' ? 'floor' : 'unit';

  const entity = useProjectStore((s) => {
    if (entityType === 'building') return s.buildings.find((b) => b.id === entityId);
    if (entityType === 'floor') return s.floors.find((f) => f.id === entityId);
    return s.units.find((u) => u.id === entityId);
  });

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
        const collection = entityType === 'building' ? 'buildings' : entityType === 'floor' ? 'floors' : 'units';
        const current = store[collection].find((e) => e.id === entityId);
        if (current) {
          const newPoints = current.points.map((p, i) =>
            i === draggingIndex.current ? { x, y } : { ...p }
          );
          useProjectStore.setState((state) => ({
            [collection]: state[collection].map((e) =>
              e.id === entityId ? { ...e, points: newPoints } : e
            ),
          }));
        }
      };

      const handleMouseUp = () => {
        if (draggingIndex.current !== null) {
          const store = useProjectStore.getState();
          const collection = entityType === 'building' ? 'buildings' : entityType === 'floor' ? 'floors' : 'units';
          const current = store[collection].find((e) => e.id === entityId);
          if (current) {
            if (entityType === 'building') {
              store.updateBuildingPoints(entityId, [...current.points]);
            } else if (entityType === 'floor') {
              store.updateFloorPoints(entityId, [...current.points]);
            } else {
              store.updateUnitPoints(entityId, [...current.points]);
            }
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
    [svgRef, entityId, entityType]
  );

  return {
    handles: entity?.points || [],
    onHandleMouseDown,
    isDragging,
  };
}
