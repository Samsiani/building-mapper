import { memo, useCallback, useMemo, useRef, useEffect } from 'react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { useToastStore } from '../../../stores/toastStore';
import { NODE_TYPES, getNodeColors, canDrillInto } from '../../../utils/nodeTypes';
import { useSVGCoordinates } from '../../../hooks/useSVGCoordinates';
import { useConfirmStore } from '../../../stores/confirmStore';

const PolygonLayer = memo(function PolygonLayer({ svgRef }) {
  const currentView = useEditorStore((s) => s.currentView);
  const nodes = useProjectStore((s) => s.nodes);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const selectedNodeIds = useEditorStore((s) => s.selectedNodeIds);
  const hoveredNodeId = useEditorStore((s) => s.hoveredNodeId);
  const activeTool = useEditorStore((s) => s.activeTool);

  const { screenToSVG } = useSVGCoordinates(svgRef);

  // Children of the current view's parent
  const entities = useMemo(
    () => nodes.filter((n) => n.parentId === currentView.parentId),
    [nodes, currentView.parentId]
  );

  const handlePolygonMouseDown = useCallback(
    (e, entity) => {
      if (activeTool !== 'select' || selectedNodeId !== entity.id) return;
      e.stopPropagation();
      e.preventDefault();
      const startPt = screenToSVG(e.clientX, e.clientY);

      if (e.altKey) {
        // Alt+drag → clone
        useEditorStore.getState().setCloneDrag({ sourceNodeId: entity.id, startPt });
      } else {
        // Plain drag → move
        useEditorStore.getState().setMoveDrag({
          nodeId: entity.id,
          startPt,
          originalPoints: entity.points.map((p) => ({ ...p })),
        });
      }
    },
    [activeTool, selectedNodeId, screenToSVG]
  );

  const handleClick = useCallback(
    (e, entity) => {
      e.stopPropagation();
      if (activeTool === 'pen' || activeTool === 'hand' || activeTool === 'measure' || activeTool === 'rect') return;

      // Single click always selects — never drills down
      if (e.shiftKey) {
        useEditorStore.getState().toggleMultiSelect(entity.id);
      } else {
        useEditorStore.getState().selectNode(entity.id);
      }
    },
    [activeTool]
  );

  const handleDoubleClick = useCallback(
    (e, entity) => {
      e.stopPropagation();
      if (activeTool !== 'select') return;
      // Double click drills into drillable nodes
      if (canDrillInto(entity.type)) {
        useEditorStore.getState().navigateInto(entity.id);
      }
    },
    [activeTool]
  );

  const leaveTimerRef = useRef(null);
  useEffect(() => () => clearTimeout(leaveTimerRef.current), []);

  const handleEnter = useCallback((entity) => {
    clearTimeout(leaveTimerRef.current);
    useEditorStore.getState().setHoveredNode(entity.id);
  }, []);

  const handleLeave = useCallback(() => {
    clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      useEditorStore.getState().clearHoveredNode();
    }, 300);
  }, []);

  const handleDelete = useCallback(
    async (e, entity) => {
      e.stopPropagation();
      e.preventDefault();
      const typeDef = NODE_TYPES[entity.type];
      const name = entity.name || typeDef?.label || 'Item';

      const confirmed = await useConfirmStore.getState().confirm({
        title: `Delete "${name}"?`,
        message: 'This action cannot be undone.',
        confirmLabel: 'Delete',
        variant: 'danger',
      });
      if (!confirmed) return;

      useProjectStore.getState().removeNode(entity.id);
      useEditorStore.getState().clearHoveredNode();
      useEditorStore.getState().deselectNode();
      useToastStore.getState().show(`${name} deleted`, 'info');
    },
    []
  );

  const getDeletePos = useCallback((entity) => {
    if (!entity?.points?.length) return null;
    const xs = entity.points.map((p) => p.x);
    const ys = entity.points.map((p) => p.y);
    return { x: Math.max(...xs) - 2, y: Math.min(...ys) + 2 };
  }, []);

  return (
    <g className="polygon-layer">
      {entities.map((entity) => {
        if (!entity.points || entity.points.length < 3) return null;

        const colors = getNodeColors(entity);
        const isHovered = hoveredNodeId === entity.id;
        const isSelected = selectedNodeIds.includes(entity.id);
        const pointsStr = entity.points.map((p) => `${p.x},${p.y}`).join(' ');
        const typeDef = NODE_TYPES[entity.type];
        const isDrillable = canDrillInto(entity.type);

        return (
          <polygon
            key={entity.id}
            points={pointsStr}
            fill={isHovered && !isSelected ? colors.fillHover : colors.fill}
            stroke={isSelected ? '#818cf8' : colors.stroke}
            strokeWidth={isHovered || isSelected ? 0.6 : 0.4}
            className={`entity-polygon entity-${entity.type}${isSelected ? ' selected' : ''}`}
            data-id={entity.id}
            data-type={entity.type}
            style={{ cursor: activeTool === 'select' ? 'pointer' : 'default' }}
            onMouseDown={(e) => handlePolygonMouseDown(e, entity)}
            onMouseEnter={() => handleEnter(entity)}
            onMouseLeave={handleLeave}
            onClick={(e) => handleClick(e, entity)}
            onDoubleClick={(e) => handleDoubleClick(e, entity)}
          />
        );
      })}

      {/* Labels for non-status entities (buildings, floors, rooms, balconies) */}
      {entities.map((entity) => {
        if (!entity.points || entity.points.length < 3) return null;
        const typeDef = NODE_TYPES[entity.type];
        if (typeDef?.hasStatus) return null; // Apartments show via tooltip
        const cx = entity.points.reduce((s, p) => s + p.x, 0) / entity.points.length;
        const cy = entity.points.reduce((s, p) => s + p.y, 0) / entity.points.length;
        return (
          <text
            key={`label-${entity.id}`}
            x={cx} y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--text-primary, #fff)"
            fontSize="2.5"
            fontWeight="600"
            fontFamily="Inter, system-ui, sans-serif"
            style={{ pointerEvents: 'none' }}
          >
            {entity.name}
          </text>
        );
      })}

      {/* Delete button — appears on hover at top-right corner */}
      {hoveredNodeId && activeTool === 'select' && (() => {
        const entity = entities.find((e) => e.id === hoveredNodeId);
        if (!entity?.points?.length) return null;
        const pos = getDeletePos(entity);
        if (!pos) return null;
        return (
          <g
            className="pv-svg-delete-btn"
            transform={`translate(${pos.x}, ${pos.y})`}
            onMouseEnter={() => clearTimeout(leaveTimerRef.current)}
            onMouseLeave={handleLeave}
            onClick={(e) => handleDelete(e, entity)}
            style={{ cursor: 'pointer' }}
          >
            <circle r="3.2" fill="transparent" />
            <circle className="pv-del-bg" r="2" />
            <line x1="-0.65" y1="-0.65" x2="0.65" y2="0.65" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
            <line x1="0.65" y1="-0.65" x2="-0.65" y2="0.65" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
          </g>
        );
      })()}
    </g>
  );
});

export default PolygonLayer;
