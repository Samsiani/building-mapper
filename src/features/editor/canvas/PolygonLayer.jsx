import { memo, useCallback, useMemo } from 'react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { STATUS } from '../../../utils/constants';

const ENTITY_COLORS = {
  building: {
    fill: 'rgba(99, 102, 241, 0.15)',
    fillHover: 'rgba(99, 102, 241, 0.35)',
    stroke: '#6366f1',
  },
  floor: {
    fill: 'rgba(168, 85, 247, 0.15)',
    fillHover: 'rgba(168, 85, 247, 0.35)',
    stroke: '#a855f7',
  },
};

const PolygonLayer = memo(function PolygonLayer({ svgRef }) {
  const currentView = useEditorStore((s) => s.currentView);
  const buildings = useProjectStore((s) => s.buildings);
  const floors = useProjectStore((s) => s.floors);
  const units = useProjectStore((s) => s.units);
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);
  const selectedUnitIds = useEditorStore((s) => s.selectedUnitIds);
  const hoveredEntityId = useEditorStore((s) => s.hoveredEntityId);
  const activeTool = useEditorStore((s) => s.activeTool);

  // Determine what entities to render based on level
  const { entities, entityType } = useMemo(() => {
    if (currentView.level === 'global') {
      return { entities: buildings, entityType: 'building' };
    } else if (currentView.level === 'building') {
      return {
        entities: floors.filter((f) => f.buildingId === currentView.buildingId),
        entityType: 'floor',
      };
    } else {
      return {
        entities: units.filter((u) => u.floorId === currentView.floorId),
        entityType: 'unit',
      };
    }
  }, [currentView, buildings, floors, units]);

  const handleClick = useCallback(
    (e, entity) => {
      e.stopPropagation();
      if (activeTool === 'pen' || activeTool === 'hand' || activeTool === 'measure') return;

      if (entityType === 'building') {
        useEditorStore.getState().navigateToBuilding(entity.id);
      } else if (entityType === 'floor') {
        useEditorStore.getState().navigateToFloor(currentView.buildingId, entity.id);
      } else if (entityType === 'unit') {
        if (e.shiftKey) {
          useEditorStore.getState().toggleMultiSelect(entity.id);
        } else {
          useEditorStore.getState().selectUnit(entity.id);
        }
      }
    },
    [activeTool, entityType, currentView.buildingId]
  );

  const handleDoubleClick = useCallback(
    (e, entity) => {
      e.stopPropagation();
      if (activeTool !== 'select') return;

      if (entityType === 'building') {
        useEditorStore.getState().navigateToBuilding(entity.id);
      } else if (entityType === 'floor') {
        useEditorStore.getState().navigateToFloor(currentView.buildingId, entity.id);
      }
    },
    [activeTool, entityType, currentView.buildingId]
  );

  const handleEnter = useCallback((entity) => {
    useEditorStore.getState().setHoveredEntity(entity.id, entityType);
  }, [entityType]);

  const handleLeave = useCallback(() => {
    useEditorStore.getState().clearHoveredEntity();
  }, []);

  return (
    <g className="polygon-layer">
      {entities.map((entity) => {
        if (!entity.points || entity.points.length < 3) return null;

        const isHovered = hoveredEntityId === entity.id;
        const pointsStr = entity.points.map((p) => `${p.x},${p.y}`).join(' ');

        if (entityType === 'unit') {
          // Unit rendering (existing behavior)
          const status = STATUS[entity.status] || STATUS.available;
          const isSelected = selectedUnitIds.includes(entity.id);
          return (
            <polygon
              key={entity.id}
              points={pointsStr}
              fill={isHovered && !isSelected ? status.fillHover : status.fill}
              stroke={isSelected ? '#818cf8' : status.stroke}
              strokeWidth={isHovered || isSelected ? 0.6 : 0.4}
              className={`unit-polygon ${isSelected ? 'selected' : ''}`}
              data-id={entity.id}
              data-type="unit"
              onMouseEnter={() => handleEnter(entity)}
              onMouseLeave={handleLeave}
              onClick={(e) => handleClick(e, entity)}
              onDoubleClick={(e) => handleDoubleClick(e, entity)}
            />
          );
        }

        // Building or Floor rendering
        const colors = ENTITY_COLORS[entityType];
        return (
          <polygon
            key={entity.id}
            points={pointsStr}
            fill={isHovered ? colors.fillHover : colors.fill}
            stroke={colors.stroke}
            strokeWidth={isHovered ? 0.6 : 0.4}
            className={`entity-polygon entity-${entityType}`}
            data-id={entity.id}
            data-type={entityType}
            style={{ cursor: activeTool === 'select' ? 'pointer' : 'default' }}
            onMouseEnter={() => handleEnter(entity)}
            onMouseLeave={handleLeave}
            onClick={(e) => handleClick(e, entity)}
            onDoubleClick={(e) => handleDoubleClick(e, entity)}
          />
        );
      })}

      {/* Labels for building/floor polygons */}
      {entityType !== 'unit' &&
        entities.map((entity) => {
          if (!entity.points || entity.points.length < 3) return null;
          // Calculate centroid
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
    </g>
  );
});

export default PolygonLayer;
