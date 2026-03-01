import { useRef, useLayoutEffect, useState } from 'react';
import { NODE_TYPES, getNodeColors, canDrillInto } from '../../utils/nodeTypes';
import { STATUS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';

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

  if (!entity) return null;

  const typeDef = NODE_TYPES[entity.type];
  if (!typeDef) return null;

  // Status-bearing entities (apartments) — show price/area/status
  if (typeDef.hasStatus) {
    const status = STATUS[entity.status] || STATUS.available;
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

  // Non-status entities — show name + type + child count
  const colors = getNodeColors(entity);
  const childCount = nodes ? nodes.filter((n) => n.parentId === entity.id).length : 0;
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
        {childCount > 0 && (
          <div className="pvtt-row">
            <span>{childCount} child{childCount !== 1 ? 'ren' : ''}</span>
          </div>
        )}
        {isDrillable && <div className="pvtt-hint">Click to explore</div>}
      </div>
    </div>
  );
}
