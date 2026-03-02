import { useCallback } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useToastStore } from '../stores/toastStore';
import { getAllowedChildTypes, NODE_TYPES } from '../utils/nodeTypes';
import { useProjectStore } from '../stores/projectStore';

/**
 * Shared helper: resolve parent type hierarchy and trigger creation.
 */
function _resolveCreation(points, parentId) {
  let parentType = null;
  let grandparentType = null;
  if (parentId !== null) {
    const nodes = useProjectStore.getState().nodes;
    const parentNode = nodes.find((n) => n.id === parentId);
    parentType = parentNode?.type || null;
    if (parentNode?.parentId != null) {
      const grandparentNode = nodes.find((n) => n.id === parentNode.parentId);
      grandparentType = grandparentNode?.type || null;
    }
  }

  const allowedTypes = getAllowedChildTypes(parentType, grandparentType);

  if (allowedTypes.length === 1) {
    const type = allowedTypes[0];
    useEditorStore.getState().setPendingCreation({ type, points, parentId });
    const label = NODE_TYPES[type]?.label || type;
    useToastStore.getState().show(`${label} polygon drawn — fill in the details`, 'info');
  } else if (allowedTypes.length > 1) {
    useEditorStore.getState().setPendingCreation({ type: null, points, parentId });
    useToastStore.getState().show('Polygon drawn — choose entity type', 'info');
  }
}

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
    const parentId = currentView.parentId;

    setDrawingPoints([]);
    _resolveCreation(points, parentId);
  }, [setDrawingPoints]);

  const closePolygonWithPoints = useCallback((points) => {
    if (points.length < 3) {
      useToastStore.getState().show('Need at least 3 points to create a polygon', 'warning');
      return;
    }
    const { currentView } = useEditorStore.getState();
    _resolveCreation([...points], currentView.parentId);
  }, []);

  const cancelDrawing = useCallback(() => {
    setDrawingPoints([]);
    useToastStore.getState().show('Drawing cancelled', 'info', 2000);
  }, [setDrawingPoints]);

  return {
    drawingPoints,
    addPoint,
    removeLastPoint,
    closePolygon,
    closePolygonWithPoints,
    cancelDrawing,
    isDrawing: drawingPoints.length > 0,
  };
}
