import { memo, useCallback, useMemo } from 'react';
import {
  MousePointer, Pen, Edit3, Hand, ZoomIn, ZoomOut,
  Undo2, Redo2, Grid3x3, Download, Upload, Ruler, ArrowLeft
} from 'lucide-react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { useToastStore } from '../../../stores/toastStore';
import { NODE_TYPES, getAllowedChildTypes } from '../../../utils/nodeTypes';
import { exportJSON, importJSON } from '../../../utils/exportImport';

const TOOL_ICONS = {
  select: MousePointer,
  pen: Pen,
  edit: Edit3,
  hand: Hand,
  measure: Ruler,
};

const TOOL_KEYS = {
  select: 'V',
  pen: 'P',
  edit: 'E',
  hand: 'H',
  measure: 'M',
};

const TOOL_ORDER = ['select', 'pen', 'edit', 'hand', 'measure'];

const Toolbar = memo(function Toolbar({ panZoom, measurement }) {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const snapEnabled = useEditorStore((s) => s.snapEnabled);
  const toggleSnap = useEditorStore((s) => s.toggleSnap);
  const currentView = useEditorStore((s) => s.currentView);
  const nodes = useProjectStore((s) => s.nodes);

  const canUndo = useProjectStore((s) => s.canUndo());
  const canRedo = useProjectStore((s) => s.canRedo());

  // Determine what type will be drawn based on current parent
  const drawLabel = useMemo(() => {
    const parentNode = currentView.parentId !== null ? nodes.find((n) => n.id === currentView.parentId) : null;
    const parentType = parentNode?.type || null;
    const allowed = getAllowedChildTypes(parentType);
    if (allowed.length === 1) {
      return NODE_TYPES[allowed[0]]?.label?.toLowerCase() || 'entity';
    }
    return 'entity';
  }, [currentView.parentId, nodes]);

  const handleToolChange = useCallback(
    (tool) => {
      setActiveTool(tool);
      if (measurement && tool !== 'measure') {
        measurement.reset();
      }
      if (tool === 'pen') {
        useToastStore.getState().show(`Draw a ${drawLabel} polygon. Enter or click first point to close.`, 'info', 4000);
      }
    },
    [setActiveTool, measurement, drawLabel]
  );

  const handleBack = useCallback(() => {
    useEditorStore.getState().navigateUp();
  }, []);

  const handleUndo = useCallback(() => {
    if (useProjectStore.getState().undo()) {
      useToastStore.getState().show('Undone', 'info', 2000);
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (useProjectStore.getState().redo()) {
      useToastStore.getState().show('Redone', 'info', 2000);
    }
  }, []);

  const handleExport = useCallback(() => {
    const data = useProjectStore.getState().exportData();
    exportJSON(data);
    useToastStore.getState().show('Project exported', 'success');
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const data = await importJSON(file);
        useProjectStore.getState().importData(data);
        useEditorStore.getState().navigateToRoot();
        useToastStore.getState().show('Project imported', 'success');
      } catch (err) {
        useToastStore.getState().show(err.message, 'error');
      }
    };
    input.click();
  }, []);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-0.5 py-[5px] px-2 bg-[var(--bg-glass)] backdrop-blur-[20px] saturate-[1.4] border border-[var(--border)] rounded-full shadow-lg">
      {/* Back button when not at root */}
      {currentView.parentId !== null && (
        <>
          <ToolButton title="Back (Esc)" onClick={handleBack}>
            <ArrowLeft size={18} />
          </ToolButton>
          <Divider />
        </>
      )}

      {/* Tool group */}
      <div className="flex items-center gap-0.5">
        {TOOL_ORDER.map((toolId) => {
          const Icon = TOOL_ICONS[toolId];
          const isActive = activeTool === toolId;
          return (
            <ToolButton
              key={toolId}
              title={`${toolId.charAt(0).toUpperCase() + toolId.slice(1)} (${TOOL_KEYS[toolId]})`}
              isActive={isActive}
              onClick={() => handleToolChange(toolId)}
              shortcutKey={TOOL_KEYS[toolId]}
            >
              <Icon size={18} />
            </ToolButton>
          );
        })}
      </div>

      <Divider />

      {/* Snap toggle */}
      <ToolButton
        title={`Grid Snap (Cmd+G) ${snapEnabled ? 'ON' : 'OFF'}`}
        isActive={snapEnabled}
        onClick={toggleSnap}
      >
        <Grid3x3 size={18} />
      </ToolButton>

      <Divider />

      {/* Zoom */}
      <div className="flex items-center gap-0.5">
        <ToolButton title="Zoom Out (-)" onClick={panZoom.zoomOut}>
          <ZoomOut size={18} />
        </ToolButton>
        <ToolButton title="Zoom In (+)" onClick={panZoom.zoomIn}>
          <ZoomIn size={18} />
        </ToolButton>
      </div>

      <Divider />

      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5">
        <ToolButton title="Undo (Ctrl+Z)" onClick={handleUndo} disabled={!canUndo}>
          <Undo2 size={18} />
        </ToolButton>
        <ToolButton title="Redo (Ctrl+Shift+Z)" onClick={handleRedo} disabled={!canRedo}>
          <Redo2 size={18} />
        </ToolButton>
      </div>

      <Divider />

      {/* Export/Import */}
      <div className="flex items-center gap-0.5">
        <ToolButton title="Export JSON" onClick={handleExport}>
          <Download size={18} />
        </ToolButton>
        <ToolButton title="Import JSON" onClick={handleImport}>
          <Upload size={18} />
        </ToolButton>
      </div>
    </div>
  );
});

function ToolButton({ title, isActive, onClick, disabled, children, shortcutKey }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center justify-center w-9 h-9 border-none rounded-[var(--radius-sm)] bg-transparent cursor-pointer transition-all duration-150 overflow-hidden
        ${isActive ? 'text-[var(--accent)] bg-[var(--accent-dim)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)]'}
        ${disabled ? 'opacity-30 pointer-events-none' : ''}
      `}
    >
      {children}
      {shortcutKey && (
        <span className="absolute bottom-0.5 right-[3px] text-[9px] font-semibold text-[var(--text-tertiary)] opacity-0 transition-opacity font-[var(--font-mono)] group-hover:opacity-100 hover:opacity-100"
          style={{ opacity: undefined }}
        >
          {shortcutKey}
        </span>
      )}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-[var(--border)] mx-1.5" />;
}

export default Toolbar;
