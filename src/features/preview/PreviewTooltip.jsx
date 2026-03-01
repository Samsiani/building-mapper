import { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { NODE_TYPES, getNodeColors, canDrillInto } from '../../utils/nodeTypes';
import { STATUS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';
import { computeNodeStats } from '../../hooks/useNodeStats';

export default function PreviewTooltip({ entity, nodes, position, currency }) {
  const tooltipRef = useRef(null);
  const [clamped, setClamped] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!tooltipRef.current || !entity) return;
    const tt = tooltipRef.current;
    const tw = tt.offsetWidth;
    const th = tt.offsetHeight;
    let tx = position.x;
    let ty = position.y;
    if (tx + tw > window.innerWidth - 16) tx = position.x - tw - 32;
    if (ty + th > window.innerHeight - 16) ty = window.innerHeight - th - 16;
    if (ty < 12) ty = 12;
    if (tx < 12) tx = 12;
    setClamped({ x: tx, y: ty });
  }, [position, entity]);

  // Must call useMemo unconditionally (hooks rules)
  const stats = useMemo(
    () => (nodes && entity) ? computeNodeStats(nodes, entity.id) : { total: 0, byStatus: {} },
    [nodes, entity?.id]
  );

  if (!entity) return null;

  const typeDef = NODE_TYPES[entity.type];
  if (!typeDef) return null;

  // Status-bearing entities (apartments) — show price/area/status
  if (typeDef.hasStatus) {
    const status = STATUS[entity.status] || STATUS.for_sale;
    return (
      <div ref={tooltipRef} className="pvtt" style={{ left: clamped.x, top: clamped.y }}>
        <div className="pvtt-card">
          <div className="pvtt-stripe" style={{ background: status.color }} />
          <div className="pvtt-head">
            <span className="pvtt-dot" style={{ background: status.color }} />
            <span className="pvtt-name">{entity.name}</span>
            <span className="pvtt-badge" style={{ '--c': status.color }}>{status.label}</span>
          </div>
          {entity.price > 0 && (
            <div className="pvtt-price">{formatPrice(entity.price, currency)}</div>
          )}
          <div className="pvtt-row">
            <span>{entity.area} m²</span>
            <span className="pvtt-row-sep" />
            <span>{entity.rooms} rm</span>
            {entity.orientation && (
              <>
                <span className="pvtt-row-sep" />
                <span>{entity.orientation}</span>
              </>
            )}
          </div>
          <div className="pvtt-hint">Click for details</div>
        </div>
      </div>
    );
  }

  // Non-status entities — show name + type + aggregated stats
  const colors = getNodeColors(entity);
  const isDrillable = canDrillInto(entity.type);

  return (
    <div ref={tooltipRef} className="pvtt" style={{ left: clamped.x, top: clamped.y }}>
      <div className="pvtt-card">
        <div className="pvtt-stripe" style={{ background: colors.color }} />
        <div className="pvtt-head">
          <span className="pvtt-name">{entity.name}</span>
          <span className="pvtt-type" style={{ color: colors.color }}>{typeDef.label}</span>
        </div>
        {entity.description && (
          <div className="pvtt-desc">{entity.description}</div>
        )}
        {stats.total > 0 && (
          <div className="pvtt-stats">
            <span className="pvtt-stats-total">{stats.total} Unit{stats.total !== 1 ? 's' : ''}</span>
            <div className="pvtt-stats-row">
              {Object.entries(stats.byStatus).map(([key, count]) => (
                <span key={key} className="pvtt-stats-item">
                  <span className="pvtt-stats-dot" style={{ background: STATUS[key]?.color }} />
                  {count}
                </span>
              ))}
            </div>
          </div>
        )}
        {entity.completionDate && (
          <div className="pvtt-row">
            <span>Completion: {entity.completionDate}</span>
          </div>
        )}
        {isDrillable && <div className="pvtt-hint">Click to explore</div>}
      </div>
    </div>
  );
}
