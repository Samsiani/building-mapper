import { useRef, useCallback, useState } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { useToastStore } from '../../../stores/toastStore';
import { useSVGCoordinates } from '../../../hooks/useSVGCoordinates';
import { useDrawingTool } from '../../../hooks/useDrawingTool';
import { useRubberBand } from '../../../hooks/useRubberBand';
import { useMeasurement } from '../../../hooks/useMeasurement';
import MasterplanSVG from './MasterplanSVG';
import Toolbar from '../toolbar/Toolbar';
import EntityTooltip from '../overlays/EntityTooltip';
import ZoomIndicator from '../overlays/ZoomIndicator';
import Breadcrumbs from '../overlays/Breadcrumbs';
import MiniMap from '../panels/MiniMap';
import LayersPanel from '../panels/LayersPanel';
import SelectionRectangle from './SelectionRectangle';

export default function CanvasArea({ containerRef, panZoom }) {
  const svgRef = useRef(null);
  const activeTool = useEditorStore((s) => s.activeTool);
  const hoveredUnitId = useEditorStore((s) => s.hoveredUnitId);
  const hoveredEntityId = useEditorStore((s) => s.hoveredEntityId);
  const currentView = useEditorStore((s) => s.currentView);
  const { screenToSVG } = useSVGCoordinates(svgRef);
  const { addPoint, closePolygon, isDrawing, drawingPoints } = useDrawingTool();

  // Get entities for rubber band based on level
  const buildings = useProjectStore((s) => s.buildings);
  const floors = useProjectStore((s) => s.floors);
  const units = useProjectStore((s) => s.units);

  const rubberBandEntities = currentView.level === 'floor'
    ? units.filter((u) => u.floorId === currentView.floorId)
    : [];

  const { isSelecting, rect: selRect, startSelection, updateSelection, endSelection } = useRubberBand(svgRef, rubberBandEntities);
  const measurement = useMeasurement();
  const toast = useToastStore((s) => s.show);

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const cursorClass = `cursor-${activeTool}${panZoom.isPanning ? ' panning' : ''}`;

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button === 1) {
        e.preventDefault();
        panZoom.startPan(e.clientX, e.clientY);
        return;
      }
      if (activeTool === 'hand') {
        panZoom.startPan(e.clientX, e.clientY);
        return;
      }
      // Rubber band selection only at floor level
      if (activeTool === 'select' && currentView.level === 'floor' && !e.target.closest('.unit-polygon') && !e.shiftKey) {
        startSelection(e.clientX, e.clientY);
      }
    },
    [activeTool, panZoom, startSelection, currentView.level]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (panZoom.isPanning) {
        panZoom.onPanMove(e.clientX, e.clientY);
        return;
      }
      if (isSelecting) {
        updateSelection(e.clientX, e.clientY);
      }
      // Tooltip tracking
      if (hoveredEntityId) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: e.clientX - rect.left + 16,
            y: e.clientY - rect.top - 10,
          });
        }
      }
    },
    [panZoom, isSelecting, updateSelection, hoveredEntityId, containerRef]
  );

  const handleMouseUp = useCallback(() => {
    if (panZoom.isPanning) {
      panZoom.endPan();
      return;
    }
    if (isSelecting) {
      const ids = endSelection();
      if (ids.length > 0) {
        useEditorStore.getState().setMultiSelect(ids);
      }
    }
  }, [panZoom, isSelecting, endSelection]);

  const handleSVGClick = useCallback(
    (e) => {
      if (activeTool === 'pen') {
        const pt = screenToSVG(e.clientX, e.clientY);
        if (drawingPoints.length >= 3) {
          const first = drawingPoints[0];
          const dist = Math.sqrt(Math.pow(pt.x - first.x, 2) + Math.pow(pt.y - first.y, 2));
          if (dist < 2) {
            closePolygon();
            return;
          }
        }
        addPoint(pt);
        return;
      }

      if (activeTool === 'measure') {
        const pt = screenToSVG(e.clientX, e.clientY);
        measurement.addPoint(pt);
        return;
      }

      // Drill-down: click on building/floor polygon with select tool
      if (activeTool === 'select') {
        const polygonEl = e.target.closest('.entity-polygon');
        if (polygonEl) {
          const entityId = parseInt(polygonEl.dataset.id);
          const entityType = polygonEl.dataset.type;
          if (entityType === 'building') {
            useEditorStore.getState().navigateToBuilding(entityId);
            return;
          }
          if (entityType === 'floor') {
            useEditorStore.getState().navigateToFloor(currentView.buildingId, entityId);
            return;
          }
        }

        // Click on empty space = deselect
        if (!e.target.closest('.unit-polygon') && !e.target.closest('.entity-polygon') && !e.target.closest('.edit-handle')) {
          useEditorStore.getState().deselectUnit();
        }
      }
    },
    [activeTool, screenToSVG, addPoint, closePolygon, drawingPoints, measurement, currentView.buildingId]
  );

  const handleDoubleClick = useCallback(() => {
    if (activeTool === 'pen' && drawingPoints.length >= 3) {
      closePolygon();
    }
  }, [activeTool, drawingPoints, closePolygon]);

  return (
    <div
      ref={containerRef}
      className={`flex-1 relative overflow-hidden bg-[var(--bg-primary)] ${cursorClass}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        backgroundImage: 'linear-gradient(rgba(129, 140, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(129, 140, 248, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      {/* Pan/Zoom wrapper */}
      <div
        className="w-full h-full origin-center"
        style={{ transform: panZoom.transform }}
      >
        <MasterplanSVG
          ref={svgRef}
          onClick={handleSVGClick}
          onDoubleClick={handleDoubleClick}
          measurement={measurement}
        />
      </div>

      <Toolbar panZoom={panZoom} measurement={measurement} />
      <Breadcrumbs />

      {/* Preview button */}
      <a
        href="/preview"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 z-50 flex items-center gap-[7px] py-2 px-[18px] bg-[var(--bg-glass)] backdrop-blur-[20px] border border-[var(--border)] rounded-full text-[var(--text-secondary)] text-[13px] font-semibold no-underline hover:bg-[var(--bg-glass-hover)] hover:text-[var(--accent)] hover:shadow-[var(--shadow-md),0_0_12px_var(--accent-glow)] transition-all shadow-[var(--shadow-sm)] active:scale-[0.97]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Preview
      </a>

      <EntityTooltip position={tooltipPos} containerRef={containerRef} />
      <ZoomIndicator zoom={panZoom.zoom} />
      <MiniMap zoom={panZoom.zoom} />
      <LayersPanel />

      {isSelecting && selRect && <SelectionRectangle rect={selRect} svgRef={svgRef} />}
    </div>
  );
}
