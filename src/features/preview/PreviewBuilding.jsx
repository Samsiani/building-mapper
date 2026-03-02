import { useRef, useEffect, useState, useCallback } from 'react';
import { renderBuilding } from '../../utils/buildingRenderer';
import { NODE_TYPES, getNodeColors, canDrillInto } from '../../utils/nodeTypes';
import PreviewPolygon from './PreviewPolygon';

export default function PreviewBuilding({ entities, backgroundImage, proceduralConfig, onHover, onLeave, onClick, onDelete }) {
  const layerRef = useRef(null);
  const defsRef = useRef(null);
  const svgRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const leaveTimerRef = useRef(null);

  const clearHoverNow = useCallback(() => {
    clearTimeout(leaveTimerRef.current);
    setHoveredId(null);
    onLeave();
  }, [onLeave]);

  const setHoverEntity = useCallback((id, entity, pos) => {
    clearTimeout(leaveTimerRef.current);
    setHoveredId(id);
    onHover(entity, pos);
  }, [onHover]);

  const scheduleLeave = useCallback(() => {
    clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setHoveredId(null);
      onLeave();
    }, 300);
  }, [onLeave]);

  useEffect(() => {
    if (!layerRef.current || !defsRef.current) return;
    if (proceduralConfig) {
      renderBuilding(layerRef.current, defsRef.current, proceduralConfig, 'light');
    } else {
      layerRef.current.innerHTML = '';
    }
  }, [proceduralConfig]);

  useEffect(() => { clearTimeout(leaveTimerRef.current); setHoveredId(null); }, [entities]);
  useEffect(() => () => clearTimeout(leaveTimerRef.current), []);

  const handleDeleteClick = useCallback((entity, e) => {
    e.stopPropagation();
    e.preventDefault();
    clearTimeout(leaveTimerRef.current);
    if (onDelete) {
      onDelete(entity, { x: e.clientX, y: e.clientY });
    }
    setHoveredId(null);
  }, [onDelete]);

  const getDeletePos = useCallback((entity) => {
    if (!entity?.points?.length) return null;
    const xs = entity.points.map((p) => p.x);
    const ys = entity.points.map((p) => p.y);
    return { x: Math.max(...xs) - 2, y: Math.min(...ys) + 2 };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="pv-canvas-svg"
      onContextMenu={(e) => e.preventDefault()}
    >
      <defs ref={defsRef} />

      {backgroundImage && (
        <image
          href={backgroundImage}
          x="0" y="0"
          width="100" height="100"
          preserveAspectRatio="xMidYMid slice"
        />
      )}

      <g ref={layerRef} />

      {!backgroundImage && !proceduralConfig && (
        <g opacity="0.04">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#888" strokeWidth="0.15" />
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#888" strokeWidth="0.15" />
          ))}
        </g>
      )}

      <g className="preview-polygon-layer">
        {entities.map((entity) => {
          if (!entity.points || entity.points.length < 3) return null;

          const typeDef = NODE_TYPES[entity.type];

          // Status-bearing entities use PreviewPolygon (colored by status)
          if (typeDef?.hasStatus) {
            return (
              <PreviewPolygon
                key={entity.id}
                unit={entity}
                onHover={(pos) => setHoverEntity(entity.id, entity, pos)}
                onLeave={scheduleLeave}
                onClick={() => onClick(entity)}
              />
            );
          }

          // Other entities — use type colors
          const colors = getNodeColors(entity);
          return (
            <PreviewEntityPolygon
              key={entity.id}
              entity={entity}
              colors={colors}
              onHover={(pos) => setHoverEntity(entity.id, entity, pos)}
              onLeave={scheduleLeave}
              onClick={() => onClick(entity)}
            />
          );
        })}
      </g>

      {/* Entity labels for non-status entities */}
      {entities.map((entity) => {
        if (!entity.points || entity.points.length < 3) return null;
        const typeDef = NODE_TYPES[entity.type];
        if (typeDef?.hasStatus) return null;
        const cx = entity.points.reduce((s, p) => s + p.x, 0) / entity.points.length;
        const cy = entity.points.reduce((s, p) => s + p.y, 0) / entity.points.length;
        return (
          <text
            key={`label-${entity.id}`}
            x={cx} y={cy}
            textAnchor="middle" dominantBaseline="central"
            fill="#333" fontSize="2.5" fontWeight="600"
            fontFamily="Inter, system-ui, sans-serif"
            style={{ pointerEvents: 'none' }}
          >
            {entity.name}
          </text>
        );
      })}

      {/* Delete button */}
      {hoveredId && (() => {
        const entity = entities.find((e) => e.id === hoveredId);
        if (!entity) return null;
        const pos = getDeletePos(entity);
        if (!pos) return null;
        return (
          <g
            className="pv-svg-delete-btn"
            transform={`translate(${pos.x}, ${pos.y})`}
            onMouseEnter={() => clearTimeout(leaveTimerRef.current)}
            onMouseLeave={scheduleLeave}
            onClick={(e) => handleDeleteClick(entity, e)}
            style={{ cursor: 'pointer' }}
          >
            <circle r="3.2" fill="transparent" />
            <circle className="pv-del-bg" r="2" />
            <line x1="-0.65" y1="-0.65" x2="0.65" y2="0.65" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
            <line x1="0.65" y1="-0.65" x2="-0.65" y2="0.65" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
          </g>
        );
      })()}
    </svg>
  );
}

function PreviewEntityPolygon({ entity, colors, onHover, onLeave, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const pointsStr = entity.points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <polygon
      points={pointsStr}
      fill={isHovered ? colors.fillHover : colors.fill}
      stroke={colors.stroke}
      strokeWidth={isHovered ? 0.7 : 0.4}
      className="pv-entity-polygon"
      style={{
        cursor: 'pointer',
        filter: isHovered ? `drop-shadow(0 0 4px ${colors.stroke}66)` : 'none',
        transition: 'fill 150ms, stroke-width 150ms, filter 200ms',
      }}
      onMouseEnter={(e) => { setIsHovered(true); onHover({ x: e.clientX + 16, y: e.clientY - 10 }); }}
      onMouseMove={(e) => onHover({ x: e.clientX + 16, y: e.clientY - 10 })}
      onMouseLeave={() => { setIsHovered(false); onLeave(); }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    />
  );
}
