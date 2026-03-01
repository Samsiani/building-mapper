import { memo, useRef, useLayoutEffect, useState } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { NODE_TYPES, getNodeColors, canDrillInto } from '../../../utils/nodeTypes';
import { STATUS } from '../../../utils/constants';
import { formatPrice } from '../../../utils/formatPrice';

const EntityTooltip = memo(function EntityTooltip({ position, containerRef }) {
  const hoveredNodeId = useEditorStore((s) => s.hoveredNodeId);
  const nodes = useProjectStore((s) => s.nodes);
  const currency = useProjectStore((s) => s.projectConfig.currency);
  const tooltipRef = useRef(null);
  const [clamped, setClamped] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!tooltipRef.current || !containerRef.current || !hoveredNodeId) return;
    const container = containerRef.current.getBoundingClientRect();
    const tt = tooltipRef.current;
    const tw = tt.offsetWidth;
    const th = tt.offsetHeight;
    let tx = position.x;
    let ty = position.y;
    if (tx + tw > container.width - 12) tx = position.x - tw - 32;
    if (ty + th > container.height - 12) ty = container.height - th - 12;
    if (ty < 12) ty = 12;
    if (tx < 12) tx = 12;
    setClamped({ x: tx, y: ty });
  }, [position, hoveredNodeId, containerRef]);

  if (!hoveredNodeId) return null;

  const node = nodes.find((n) => n.id === hoveredNodeId);
  if (!node) return null;

  const typeDef = NODE_TYPES[node.type];
  if (!typeDef) return null;

  // Status-bearing nodes (apartments) — show price/area/status
  if (typeDef.hasStatus) {
    const status = STATUS[node.status] || STATUS.available;
    return (
      <div ref={tooltipRef} className="ett" style={{ left: clamped.x, top: clamped.y }}>
        <div className="ett-card">
          <div className="ett-stripe" style={{ background: status.color }} />
          <div className="ett-head">
            <span className="ett-dot" style={{ background: status.color }} />
            <span className="ett-name">{node.name}</span>
            <span className="ett-badge" style={{ '--c': status.color }}>{status.label}</span>
          </div>
          {node.price > 0 && (
            <div className="ett-price">{formatPrice(node.price, currency)}</div>
          )}
          <div className="ett-row">
            <span>{node.area} m²</span>
            <span className="ett-row-sep" />
            <span>{node.rooms} rm</span>
            {node.orientation && (
              <>
                <span className="ett-row-sep" />
                <span>{node.orientation}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Non-status nodes — show name, type, child count
  const colors = getNodeColors(node);
  const childCount = nodes.filter((n) => n.parentId === node.id).length;
  const isDrillable = canDrillInto(node.type);

  return (
    <div ref={tooltipRef} className="ett" style={{ left: clamped.x, top: clamped.y }}>
      <div className="ett-card">
        <div className="ett-stripe" style={{ background: colors.color }} />
        <div className="ett-head">
          <span className="ett-name">{node.name}</span>
          <span className="ett-type" style={{ color: colors.color }}>{typeDef.label}</span>
        </div>
        {childCount > 0 && (
          <div className="ett-row">
            <span>{childCount} child{childCount !== 1 ? 'ren' : ''}</span>
          </div>
        )}
        {isDrillable && <div className="ett-hint">Click to enter</div>}
      </div>
    </div>
  );
});

export default EntityTooltip;
