import { useRef, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { useToastStore } from '../../../stores/toastStore';
import { useSVGCoordinates } from '../../../hooks/useSVGCoordinates';
import { useDrawingTool } from '../../../hooks/useDrawingTool';
import { useRubberBand } from '../../../hooks/useRubberBand';
import { useMeasurement } from '../../../hooks/useMeasurement';
import { NODE_TYPES } from '../../../utils/nodeTypes';
import { applySnap } from '../../../utils/snapPoint';
import { constrainAngle } from '../../../utils/angleConstraint';
import MasterplanSVG from './MasterplanSVG';
import Toolbar from '../toolbar/Toolbar';
import EntityTooltip from '../overlays/EntityTooltip';
import ApartmentDetailCard from '../overlays/ApartmentDetailCard';
import ZoomIndicator from '../overlays/ZoomIndicator';
import Breadcrumbs from '../overlays/Breadcrumbs';
import MiniMap from '../panels/MiniMap';
import LayersPanel from '../panels/LayersPanel';
import SelectionRectangle from './SelectionRectangle';

export default function CanvasArea({ containerRef, panZoom }) {
  const svgRef = useRef(null);
  const activeTool = useEditorStore((s) => s.activeTool);
  const hoveredNodeId = useEditorStore((s) => s.hoveredNodeId);
  const currentView = useEditorStore((s) => s.currentView);
  const { screenToSVG } = useSVGCoordinates(svgRef);
  const { addPoint, closePolygon, closePolygonWithPoints, isDrawing, drawingPoints } = useDrawingTool();

  // Get entities for rubber band — only hasStatus nodes (apartments) at current level
  const nodes = useProjectStore((s) => s.nodes);
  const rubberBandEntities = nodes.filter(
    (n) => n.parentId === currentView.parentId && NODE_TYPES[n.type]?.hasStatus
  );

  const { isSelecting, rect: selRect, startSelection, updateSelection, endSelection } = useRubberBand(svgRef, rubberBandEntities);
  const measurement = useMeasurement();
  const toast = useToastStore((s) => s.show);

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Show specs table when drilled into an apartment/villa
  const parentNode = nodes.find((n) => n.id === currentView.parentId);
  const isUnitView = parentNode && NODE_TYPES[parentNode.type]?.hasStatus;

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
      // Rubber band selection for hasStatus entities
      if (activeTool === 'select' && rubberBandEntities.length > 0 && !e.target.closest('.entity-polygon') && !e.shiftKey) {
        startSelection(e.clientX, e.clientY);
      }
    },
    [activeTool, panZoom, startSelection, rubberBandEntities.length]
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

      // Live move drag — update node points directly for instant feedback
      const { moveDrag } = useEditorStore.getState();
      if (moveDrag) {
        const currentPt = screenToSVG(e.clientX, e.clientY);
        const dx = currentPt.x - moveDrag.startPt.x;
        const dy = currentPt.y - moveDrag.startPt.y;
        const newPoints = moveDrag.originalPoints.map((p) => ({
          x: Math.round((p.x + dx) * 100) / 100,
          y: Math.round((p.y + dy) * 100) / 100,
        }));
        useProjectStore.setState((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === moveDrag.nodeId ? { ...n, points: newPoints } : n
          ),
        }));
      }

      if (hoveredNodeId) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: e.clientX - rect.left + 16,
            y: e.clientY - rect.top - 10,
          });
        }
      }
    },
    [panZoom, isSelecting, updateSelection, hoveredNodeId, containerRef, screenToSVG]
  );

  const handleMouseUp = useCallback(
    (e) => {
      if (panZoom.isPanning) {
        panZoom.endPan();
        return;
      }
      if (isSelecting) {
        const ids = endSelection();
        if (ids.length > 0) {
          useEditorStore.getState().setMultiSelect(ids);
        }
        return;
      }

      // Move finalize — commit with snap + single history snapshot
      const { moveDrag, cloneDrag, snapEnabled, snapSize, currentView: cv } = useEditorStore.getState();
      if (moveDrag) {
        const endPt = screenToSVG(e.clientX, e.clientY);
        let dx = endPt.x - moveDrag.startPt.x;
        let dy = endPt.y - moveDrag.startPt.y;

        // Snap: apply grid snap to the first point's final position, derive delta from that
        if (snapEnabled) {
          const firstOrig = moveDrag.originalPoints[0];
          const rawFirst = { x: firstOrig.x + dx, y: firstOrig.y + dy };
          const snappedFirst = applySnap(rawFirst, {
            snapEnabled, snapSize,
            siblingNodes: useProjectStore.getState().nodes.filter(
              (n) => n.parentId === cv.parentId && n.points?.length >= 2 && n.id !== moveDrag.nodeId
            ),
            excludeNodeId: moveDrag.nodeId,
          }).point;
          dx = snappedFirst.x - firstOrig.x;
          dy = snappedFirst.y - firstOrig.y;
        }

        const finalPoints = moveDrag.originalPoints.map((p) => ({
          x: Math.round((p.x + dx) * 100) / 100,
          y: Math.round((p.y + dy) * 100) / 100,
        }));
        useProjectStore.getState().updateNodePoints(moveDrag.nodeId, finalPoints);
        useEditorStore.getState().clearMoveDrag();
        return;
      }

      // Clone finalize
      if (cloneDrag) {
        const endPt = screenToSVG(e.clientX, e.clientY);
        const dx = endPt.x - cloneDrag.startPt.x;
        const dy = endPt.y - cloneDrag.startPt.y;
        const dragDist = Math.sqrt(dx * dx + dy * dy);

        if (dragDist > 1) {
          const allNodes = useProjectStore.getState().nodes;
          const source = allNodes.find((n) => n.id === cloneDrag.sourceNodeId);
          if (source) {
            const offsetPoints = source.points.map((p) => ({
              x: Math.round((p.x + dx) * 100) / 100,
              y: Math.round((p.y + dy) * 100) / 100,
            }));
            const cloneData = {
              ...source,
              name: source.name ? `${source.name} (copy)` : 'Copy',
              points: offsetPoints,
            };
            delete cloneData.id;
            const newNode = useProjectStore.getState().createNode(cloneData);
            if (newNode) {
              useEditorStore.getState().selectNode(newNode.id);
            }
            toast('Clone created', 'success', 2000);
          }
        }
        useEditorStore.getState().clearCloneDrag();
      }
    },
    [panZoom, isSelecting, endSelection, screenToSVG, toast]
  );

  const handleSVGClick = useCallback(
    (e) => {
      if (activeTool === 'pen') {
        const { snapEnabled, snapSize, currentView: cv } = useEditorStore.getState();
        const siblingNodes = useProjectStore.getState().nodes.filter(
          (n) => n.parentId === cv.parentId && n.points?.length >= 2
        );
        let pt = screenToSVG(e.clientX, e.clientY);
        if (e.shiftKey && drawingPoints.length > 0) {
          pt = constrainAngle(pt, drawingPoints[drawingPoints.length - 1]);
        }
        pt = applySnap(pt, { snapEnabled, snapSize, siblingNodes }).point;
        if (drawingPoints.length >= 3) {
          const first = drawingPoints[0];
          const d = Math.sqrt(Math.pow(pt.x - first.x, 2) + Math.pow(pt.y - first.y, 2));
          if (d < 2) {
            closePolygon();
            return;
          }
        }
        addPoint(pt);
        return;
      }

      if (activeTool === 'rect') {
        const { snapEnabled, snapSize, rectStart, currentView: cv } = useEditorStore.getState();
        const siblingNodes = useProjectStore.getState().nodes.filter(
          (n) => n.parentId === cv.parentId && n.points?.length >= 2
        );
        let pt = screenToSVG(e.clientX, e.clientY);
        pt = applySnap(pt, { snapEnabled, snapSize, siblingNodes }).point;
        if (!rectStart) {
          useEditorStore.getState().setRectStart(pt);
        } else {
          const s = rectStart;
          const corners = [
            { x: s.x, y: s.y },
            { x: pt.x, y: s.y },
            { x: pt.x, y: pt.y },
            { x: s.x, y: pt.y },
          ];
          closePolygonWithPoints(corners);
          useEditorStore.getState().clearRectStart();
        }
        return;
      }

      if (activeTool === 'measure') {
        const { snapEnabled, snapSize, currentView: cv } = useEditorStore.getState();
        const siblingNodes = useProjectStore.getState().nodes.filter(
          (n) => n.parentId === cv.parentId && n.points?.length >= 2
        );
        let pt = screenToSVG(e.clientX, e.clientY);
        pt = applySnap(pt, { snapEnabled, snapSize, siblingNodes }).point;
        measurement.addPoint(pt);
        return;
      }

      // Click on empty space = deselect (drill-down is double-click only, handled by PolygonLayer)
      if (activeTool === 'select') {
        if (!e.target.closest('.entity-polygon') && !e.target.closest('.edit-handle')) {
          useEditorStore.getState().deselectNode();
        }
      }
    },
    [activeTool, screenToSVG, addPoint, closePolygon, closePolygonWithPoints, drawingPoints, measurement]
  );

  const handleDoubleClick = useCallback(() => {
    if (activeTool === 'pen' && drawingPoints.length >= 3) {
      closePolygon();
    }
  }, [activeTool, drawingPoints, closePolygon]);

  return (
    <div
      ref={containerRef}
      className={`flex-1 relative overflow-hidden bg-[var(--bg-primary)] flex items-center justify-center ${cursorClass}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        backgroundImage: 'linear-gradient(rgba(129, 140, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(129, 140, 248, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div
        className="w-[95%] h-[95%] origin-center"
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

      <AnimatePresence>
        {isUnitView && <ApartmentDetailCard />}
      </AnimatePresence>

      {isSelecting && selRect && <SelectionRectangle rect={selRect} svgRef={svgRef} />}
    </div>
  );
}
