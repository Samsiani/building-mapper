import { useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useProjectStore } from '../stores/projectStore';
import { useToastStore } from '../stores/toastStore';
import { useCommandStore } from '../stores/commandStore';
import { NODE_TYPES } from '../utils/nodeTypes';

export function useKeyboardShortcuts({ zoomIn, zoomOut, resetView }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.closest('input, textarea, select')) return;

      const { activeTool, setActiveTool, deselectNode, drawingPoints, setDrawingPoints, currentView } =
        useEditorStore.getState();
      const { undo, redo } = useProjectStore.getState();
      const toast = useToastStore.getState().show;

      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useCommandStore.getState().toggle();
        return;
      }

      // Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (undo()) toast('Undone', 'info', 2000);
        return;
      }

      // Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (redo()) toast('Redone', 'info', 2000);
        return;
      }

      // Reset zoom
      if (e.key === '0' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        resetView();
        return;
      }

      // Escape — navigate up or cancel
      if (e.key === 'Escape') {
        e.preventDefault();
        if (useCommandStore.getState().isOpen) {
          useCommandStore.getState().close();
          return;
        }
        const { rectStart, cloneDrag } = useEditorStore.getState();
        if (cloneDrag) {
          useEditorStore.getState().clearCloneDrag();
          toast('Clone cancelled', 'info', 2000);
          return;
        }
        if (rectStart) {
          useEditorStore.getState().clearRectStart();
          toast('Rectangle cancelled', 'info', 2000);
          return;
        }
        if (drawingPoints.length > 0) {
          setDrawingPoints([]);
          toast('Drawing cancelled', 'info', 2000);
        } else if (currentView.parentId !== null) {
          useEditorStore.getState().navigateUp();
        } else {
          deselectNode();
          setActiveTool('select');
        }
        return;
      }

      // Pen mode shortcuts
      if (activeTool === 'pen') {
        if (e.key === 'Backspace') {
          e.preventDefault();
          if (drawingPoints.length > 0) {
            setDrawingPoints(drawingPoints.slice(0, -1));
          }
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          return;
        }
      }

      // Delete selected node (works at any level)
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeTool !== 'pen') {
        const { selectedNodeId } = useEditorStore.getState();
        if (selectedNodeId) {
          e.preventDefault();
          const node = useProjectStore.getState().nodes.find((n) => n.id === selectedNodeId);
          const name = node?.name || NODE_TYPES[node?.type]?.label || 'Item';
          useProjectStore.getState().removeNode(selectedNodeId);
          deselectNode();
          toast(`${name} deleted`, 'info');
        }
        return;
      }

      // Tool shortcuts
      const key = e.key.toUpperCase();
      const toolMap = { V: 'select', P: 'pen', R: 'rect', E: 'edit', H: 'hand', M: 'measure' };
      if (toolMap[key]) {
        e.preventDefault();
        setActiveTool(toolMap[key]);
        return;
      }

      // Zoom shortcuts
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        zoomIn();
      }
      if (e.key === '-') {
        e.preventDefault();
        zoomOut();
      }

      // Toggle snap
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        useEditorStore.getState().toggleSnap();
      }

      // Toggle layers panel
      if (e.key === 'l' || e.key === 'L') {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          useEditorStore.getState().toggleLayersPanel();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetView]);
}
