import { useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useProjectStore } from '../stores/projectStore';
import { useToastStore } from '../stores/toastStore';
import { useCommandStore } from '../stores/commandStore';

export function useKeyboardShortcuts({ zoomIn, zoomOut, resetView }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when typing in inputs
      if (e.target.closest('input, textarea, select')) return;

      const { activeTool, setActiveTool, deselectUnit, drawingPoints, setDrawingPoints, currentView } =
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
        // Close command palette if open
        if (useCommandStore.getState().isOpen) {
          useCommandStore.getState().close();
          return;
        }
        if (drawingPoints.length > 0) {
          setDrawingPoints([]);
          toast('Drawing cancelled', 'info', 2000);
        } else if (currentView.level !== 'global') {
          // Navigate up one level
          useEditorStore.getState().navigateUp();
        } else {
          deselectUnit();
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

      // Delete selected unit (only at floor level)
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeTool !== 'pen') {
        const { selectedUnitId } = useEditorStore.getState();
        if (selectedUnitId && currentView.level === 'floor') {
          e.preventDefault();
          const unit = useProjectStore.getState().units.find((u) => u.id === selectedUnitId);
          useProjectStore.getState().removeUnit(selectedUnitId);
          deselectUnit();
          toast(`${unit?.name || 'Unit'} deleted`, 'info');
        }
        return;
      }

      // Tool shortcuts
      const key = e.key.toUpperCase();
      const toolMap = { V: 'select', P: 'pen', E: 'edit', H: 'hand', M: 'measure' };
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
