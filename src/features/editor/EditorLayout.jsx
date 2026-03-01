import { useRef } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import CanvasArea from './canvas/CanvasArea';
import Sidebar from './sidebar/Sidebar';

export default function EditorLayout() {
  const containerRef = useRef(null);
  const activeTool = useEditorStore((s) => s.activeTool);
  const isPanningState = useEditorStore((s) => s.activeTool === 'hand');

  const panZoom = usePanZoom(containerRef);
  useKeyboardShortcuts({
    zoomIn: panZoom.zoomIn,
    zoomOut: panZoom.zoomOut,
    resetView: panZoom.resetView,
  });

  return (
    <div className="flex h-screen w-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <CanvasArea
        containerRef={containerRef}
        panZoom={panZoom}
      />
      <Sidebar />
    </div>
  );
}
