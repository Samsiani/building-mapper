import { useCallback } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useToastStore } from '../stores/toastStore';

export function useDrawingTool() {
  const drawingPoints = useEditorStore((s) => s.drawingPoints);
  const setDrawingPoints = useEditorStore((s) => s.setDrawingPoints);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  const addPoint = useCallback(
    (pt) => {
      const current = useEditorStore.getState().drawingPoints;
      setDrawingPoints([...current, pt]);
    },
    [setDrawingPoints]
  );

  const removeLastPoint = useCallback(() => {
    const current = useEditorStore.getState().drawingPoints;
    if (current.length > 0) {
      setDrawingPoints(current.slice(0, -1));
    }
  }, [setDrawingPoints]);

  const closePolygon = useCallback(() => {
    const current = useEditorStore.getState().drawingPoints;
    if (current.length < 3) {
      useToastStore.getState().show('Need at least 3 points to create a polygon', 'warning');
      return;
    }

    const { currentView } = useEditorStore.getState();
    const points = [...current];

    // Determine what entity type is being created based on current view level
    let type, parentId;
    if (currentView.level === 'global') {
      type = 'building';
      parentId = null;
    } else if (currentView.level === 'building') {
      type = 'floor';
      parentId = currentView.buildingId;
    } else {
      type = 'unit';
      parentId = currentView.floorId;
    }

    setDrawingPoints([]);
    useEditorStore.getState().setPendingCreation({ type, points, parentId });

    const label = type.charAt(0).toUpperCase() + type.slice(1);
    useToastStore.getState().show(`${label} polygon drawn — fill in the details`, 'info');
  }, [setDrawingPoints]);

  const cancelDrawing = useCallback(() => {
    setDrawingPoints([]);
    useToastStore.getState().show('Drawing cancelled', 'info', 2000);
  }, [setDrawingPoints]);

  return {
    drawingPoints,
    addPoint,
    removeLastPoint,
    closePolygon,
    cancelDrawing,
    isDrawing: drawingPoints.length > 0,
  };
}
