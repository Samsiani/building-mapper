import { memo, useRef, useLayoutEffect, useState } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { STATUS } from '../../../utils/constants';
import { formatPrice } from '../../../utils/formatPrice';
import { Maximize2, DollarSign, Compass, BedDouble } from 'lucide-react';

const UnitTooltip = memo(function UnitTooltip({ position, containerRef }) {
  const hoveredUnitId = useEditorStore((s) => s.hoveredUnitId);
  const unit = useProjectStore((s) => s.units.find((u) => u.id === hoveredUnitId));
  const currency = useProjectStore((s) => s.buildingConfig.currency);
  const tooltipRef = useRef(null);
  const [clamped, setClamped] = useState({ x: 0, y: 0 });

  // Viewport clamping
  useLayoutEffect(() => {
    if (!tooltipRef.current || !containerRef.current || !unit) return;
    const container = containerRef.current.getBoundingClientRect();
    const tt = tooltipRef.current;
    const tw = tt.offsetWidth;
    const th = tt.offsetHeight;

    let tx = position.x;
    let ty = position.y;

    // Flip to left side if overflowing right
    if (tx + tw > container.width - 12) tx = position.x - tw - 32;
    // Clamp top
    if (ty + th > container.height - 12) ty = container.height - th - 12;
    if (ty < 12) ty = 12;
    // Clamp left
    if (tx < 12) tx = 12;

    setClamped({ x: tx, y: ty });
  }, [position, unit, containerRef]);

  if (!unit || !hoveredUnitId) return null;

  const status = STATUS[unit.status] || STATUS.available;
  const pricePerSqm = unit.area > 0 ? unit.price / unit.area : 0;

  return (
    <div
      ref={tooltipRef}
      className="absolute pointer-events-none z-[100] min-w-[210px] max-w-[260px]"
      style={{
        left: clamped.x,
        top: clamped.y,
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        animation: 'tooltipIn 120ms cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      <div className="relative bg-[rgba(10,10,15,0.94)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]">
        {/* Colored accent bar top */}
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${status.color}, ${status.color}88)` }} />

        {/* Header */}
        <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-2.5">
          <div
            className="w-[9px] h-[9px] rounded-full flex-shrink-0 ring-2"
            style={{ background: status.color, boxShadow: `0 0 8px ${status.color}66`, ringColor: `${status.color}33` }}
          />
          <div className="flex-1 min-w-0">
            <div className="font-[var(--font-mono)] text-[13px] font-semibold text-[var(--text-primary)] tracking-tight truncate">
              {unit.name}
            </div>
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-[2px] rounded-full"
            style={{
              background: `${status.color}18`,
              color: status.color,
            }}
          >
            {status.label}
          </span>
        </div>

        {/* Separator */}
        <div className="mx-3.5 h-px bg-[rgba(255,255,255,0.06)]" />

        {/* Price hero */}
        <div className="px-3.5 py-2.5">
          <div className="text-[17px] font-bold text-white tracking-tight leading-none">
            {formatPrice(unit.price, currency)}
          </div>
          {pricePerSqm > 0 && (
            <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5 font-medium">
              {formatPrice(Math.round(pricePerSqm), currency)} / m²
            </div>
          )}
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-3 gap-px bg-[rgba(255,255,255,0.04)] mx-3.5 mb-3 rounded-lg overflow-hidden">
          <MiniStat icon={Maximize2} label="Area" value={`${unit.area}m²`} />
          <MiniStat icon={BedDouble} label="Rooms" value={unit.rooms} />
          <MiniStat icon={Compass} label="Orient." value={unit.orientation} />
        </div>
      </div>
    </div>
  );
});

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-[rgba(255,255,255,0.02)] px-2.5 py-2 text-center">
      <Icon size={11} className="mx-auto mb-1 text-[var(--text-tertiary)]" strokeWidth={2} />
      <div className="text-[11px] font-semibold text-[var(--text-primary)] leading-none">{value}</div>
    </div>
  );
}

export default UnitTooltip;
