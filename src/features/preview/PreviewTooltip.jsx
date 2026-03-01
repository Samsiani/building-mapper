import { useRef, useLayoutEffect, useState } from 'react';
import { STATUS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';

export default function PreviewTooltip({ unit, entity, entityType, position, currency }) {
  const tooltipRef = useRef(null);
  const [clamped, setClamped] = useState({ x: 0, y: 0 });

  const target = unit || entity;

  useLayoutEffect(() => {
    if (!tooltipRef.current || !target) return;
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
  }, [position, target]);

  if (!target) return null;

  // Unit tooltip
  if (unit) {
    const status = STATUS[unit.status] || STATUS.available;
    const pricePerSqm = unit.area > 0 ? unit.price / unit.area : 0;

    return (
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none z-[200] min-w-[220px] max-w-[270px]"
        style={{ left: clamped.x, top: clamped.y, animation: 'tooltipIn 120ms cubic-bezier(0.2, 0, 0, 1)' }}
      >
        <div className="relative bg-white/[0.97] backdrop-blur-[16px] border border-[rgba(0,0,0,0.08)] rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${status.color}, ${status.color}88)` }} />
          <div className="flex items-center gap-2.5 px-4 pt-3 pb-2">
            <div className="w-[9px] h-[9px] rounded-full flex-shrink-0" style={{ background: status.color, boxShadow: `0 0 6px ${status.color}44` }} />
            <span className="text-[14px] font-bold text-[var(--pv-text)] tracking-tight flex-1 truncate">{unit.name}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-[2px] rounded-full" style={{ background: `${status.color}14`, color: status.color }}>{status.label}</span>
          </div>
          <div className="px-4 pb-2.5">
            <div className="text-[18px] font-bold text-[var(--pv-accent)] tracking-tight leading-none">{formatPrice(unit.price, currency)}</div>
            {pricePerSqm > 0 && (
              <div className="text-[10px] text-[var(--pv-text-muted)] mt-1 font-medium">{formatPrice(Math.round(pricePerSqm), currency)} / m²</div>
            )}
          </div>
          <div className="mx-4 h-px bg-[rgba(0,0,0,0.06)]" />
          <div className="grid grid-cols-3 px-4 py-2.5 gap-2">
            <CompactStat label="Area" value={`${unit.area} m²`} />
            <CompactStat label="Rooms" value={unit.rooms} />
            <CompactStat label="Orient." value={unit.orientation} />
          </div>
          <div className="bg-[rgba(0,0,0,0.02)] px-4 py-1.5 text-center">
            <span className="text-[10px] text-[var(--pv-text-muted)] font-medium">Click for details</span>
          </div>
        </div>
      </div>
    );
  }

  // Building/Floor entity tooltip
  const color = entityType === 'building' ? '#6366f1' : '#a855f7';
  return (
    <div
      ref={tooltipRef}
      className="fixed pointer-events-none z-[200] min-w-[180px] max-w-[240px]"
      style={{ left: clamped.x, top: clamped.y, animation: 'tooltipIn 120ms cubic-bezier(0.2, 0, 0, 1)' }}
    >
      <div className="relative bg-white/[0.97] backdrop-blur-[16px] border border-[rgba(0,0,0,0.08)] rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
        <div className="px-4 pt-3 pb-2">
          <div className="text-[14px] font-bold text-[var(--pv-text)] tracking-tight">{entity.name}</div>
          {entity.description && (
            <div className="text-[11px] text-[var(--pv-text-muted)] mt-0.5">{entity.description}</div>
          )}
        </div>
        <div className="bg-[rgba(0,0,0,0.02)] px-4 py-1.5 text-center">
          <span className="text-[10px] text-[var(--pv-text-muted)] font-medium">Click to explore</span>
        </div>
      </div>
    </div>
  );
}

function CompactStat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-[12px] font-semibold text-[var(--pv-text)]">{value}</div>
      <div className="text-[9px] text-[var(--pv-text-muted)] font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}
