import { useRef, useEffect, useState } from 'react';
import { renderBuilding } from '../../utils/buildingRenderer';
import PreviewPolygon from './PreviewPolygon';

const ENTITY_COLORS = {
  building: {
    fill: 'rgba(99, 102, 241, 0.18)',
    fillHover: 'rgba(99, 102, 241, 0.40)',
    stroke: '#6366f1',
  },
  floor: {
    fill: 'rgba(168, 85, 247, 0.18)',
    fillHover: 'rgba(168, 85, 247, 0.40)',
    stroke: '#a855f7',
  },
};

export default function PreviewBuilding({ entities, entityType, backgroundImage, proceduralConfig, onHover, onLeave, onClick }) {
  const layerRef = useRef(null);
  const defsRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!layerRef.current || !defsRef.current) return;
    if (proceduralConfig) {
      renderBuilding(layerRef.current, defsRef.current, proceduralConfig, 'light');
    } else {
      layerRef.current.innerHTML = '';
    }
  }, [proceduralConfig]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className="block w-full max-h-[600px]"
    >
      <defs ref={defsRef} />

      {backgroundImage && (
        <image
          href={backgroundImage}
          x="0" y="0"
          width="100" height="100"
          preserveAspectRatio="xMidYMid meet"
        />
      )}

      <g ref={layerRef} />

      {!backgroundImage && !proceduralConfig && (
        <g opacity="0.06">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#888" strokeWidth="0.1" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#888" strokeWidth="0.1" />
          ))}
        </g>
      )}

      <g className="preview-polygon-layer">
        {entities.map((entity) => {
          if (!entity.points || entity.points.length < 3) return null;

          if (entityType === 'unit') {
            return (
              <PreviewPolygon
                key={entity.id}
                unit={entity}
                onHover={(pos) => onHover(entity, pos)}
                onLeave={onLeave}
                onClick={() => onClick(entity)}
              />
            );
          }

          return (
            <PreviewEntityPolygon
              key={entity.id}
              entity={entity}
              colors={ENTITY_COLORS[entityType]}
              onHover={(pos) => onHover(entity, pos)}
              onLeave={onLeave}
              onClick={() => onClick(entity)}
            />
          );
        })}
      </g>

      {entityType !== 'unit' && entities.map((entity) => {
        if (!entity.points || entity.points.length < 3) return null;
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
