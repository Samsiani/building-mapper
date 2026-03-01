import { memo, useRef, useLayoutEffect, useState } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { STATUS } from '../../../utils/constants';
import { formatPrice } from '../../../utils/formatPrice';
import { Maximize2, DollarSign, Compass, BedDouble, Building2, Layers, Home } from 'lucide-react';

const EntityTooltip = memo(function EntityTooltip({ position, containerRef }) {
  const hoveredEntityId = useEditorStore((s) => s.hoveredEntityId);
  const hoveredEntityType = useEditorStore((s) => s.hoveredEntityType);
  const buildings = useProjectStore((s) => s.buildings);
  const floors = useProjectStore((s) => s.floors);
  const units = useProjectStore((s) => s.units);
  const currency = useProjectStore((s) => s.projectConfig.currency);
  const tooltipRef = useRef(null);
  const [clamped, setClamped] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!tooltipRef.current || !containerRef.current || !hoveredEntityId) return;
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
  }, [position, hoveredEntityId, containerRef]);

  if (!hoveredEntityId) return null;

  if (hoveredEntityType === 'unit') {
    return <UnitTooltipContent id={hoveredEntityId} units={units} currency={currency} clamped={clamped} tooltipRef={tooltipRef} />;
  }

  if (hoveredEntityType === 'building') {
    const building = buildings.find((b) => b.id === hoveredEntityId);
    if (!building) return null;
    const buildingFloors = floors.filter((f) => f.buildingId === building.id);
    const buildingUnits = units.filter((u) => buildingFloors.some((f) => f.id === u.floorId));
    return (
      <div ref={tooltipRef} className="absolute pointer-events-none z-[100] min-w-[190px] max-w-[240px]" style={{ left: clamped.x, top: clamped.y, animation: 'tooltipIn 120ms cubic-bezier(0.2, 0, 0, 1)' }}>
        <div className="relative bg-[rgba(10,10,15,0.94)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
          <div className="h-[3px] bg-gradient-to-r from-indigo-500 to-indigo-400" />
          <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-2.5">
            <Building2 size={14} className="text-indigo-400" />
            <div className="text-[13px] font-semibold text-white tracking-tight">{building.name}</div>
          </div>
          <div className="mx-3.5 h-px bg-[rgba(255,255,255,0.06)]" />
          <div className="grid grid-cols-2 gap-px bg-[rgba(255,255,255,0.04)] mx-3.5 my-2.5 rounded-lg overflow-hidden">
            <MiniStat icon={Layers} label="Floors" value={buildingFloors.length} />
            <MiniStat icon={Home} label="Units" value={buildingUnits.length} />
          </div>
          <div className="px-3.5 pb-2.5 text-[10px] text-[var(--text-tertiary)]">Click to enter</div>
        </div>
      </div>
    );
  }

  if (hoveredEntityType === 'floor') {
    const floor = floors.find((f) => f.id === hoveredEntityId);
    if (!floor) return null;
    const floorUnits = units.filter((u) => u.floorId === floor.id);
    const available = floorUnits.filter((u) => u.status === 'available').length;
    const sold = floorUnits.filter((u) => u.status === 'sold').length;
    return (
      <div ref={tooltipRef} className="absolute pointer-events-none z-[100] min-w-[190px] max-w-[240px]" style={{ left: clamped.x, top: clamped.y, animation: 'tooltipIn 120ms cubic-bezier(0.2, 0, 0, 1)' }}>
        <div className="relative bg-[rgba(10,10,15,0.94)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
          <div className="h-[3px] bg-gradient-to-r from-purple-500 to-purple-400" />
          <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-2.5">
            <Layers size={14} className="text-purple-400" />
            <div className="text-[13px] font-semibold text-white tracking-tight">{floor.name}</div>
          </div>
          <div className="mx-3.5 h-px bg-[rgba(255,255,255,0.06)]" />
          <div className="grid grid-cols-3 gap-px bg-[rgba(255,255,255,0.04)] mx-3.5 my-2.5 rounded-lg overflow-hidden">
            <MiniStat icon={Home} label="Units" value={floorUnits.length} />
            <MiniStat label="Avail." value={available} color="#22c55e" />
            <MiniStat label="Sold" value={sold} color="#ef4444" />
          </div>
          <div className="px-3.5 pb-2.5 text-[10px] text-[var(--text-tertiary)]">Click to enter</div>
        </div>
      </div>
    );
  }

  return null;
});

function UnitTooltipContent({ id, units, currency, clamped, tooltipRef }) {
  const unit = units.find((u) => u.id === id);
  if (!unit) return null;
  const status = STATUS[unit.status] || STATUS.available;
  const pricePerSqm = unit.area > 0 ? unit.price / unit.area : 0;

  return (
    <div ref={tooltipRef} className="absolute pointer-events-none z-[100] min-w-[210px] max-w-[260px]" style={{ left: clamped.x, top: clamped.y, animation: 'tooltipIn 120ms cubic-bezier(0.2, 0, 0, 1)' }}>
      <div className="relative bg-[rgba(10,10,15,0.94)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${status.color}, ${status.color}88)` }} />
        <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-2.5">
          <div className="w-[9px] h-[9px] rounded-full flex-shrink-0 ring-2" style={{ background: status.color, boxShadow: `0 0 8px ${status.color}66`, ringColor: `${status.color}33` }} />
          <div className="flex-1 min-w-0">
            <div className="font-[var(--font-mono)] text-[13px] font-semibold text-[var(--text-primary)] tracking-tight truncate">{unit.name}</div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-[2px] rounded-full" style={{ background: `${status.color}18`, color: status.color }}>{status.label}</span>
        </div>
        <div className="mx-3.5 h-px bg-[rgba(255,255,255,0.06)]" />
        <div className="px-3.5 py-2.5">
          <div className="text-[17px] font-bold text-white tracking-tight leading-none">{formatPrice(unit.price, currency)}</div>
          {pricePerSqm > 0 && (
            <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5 font-medium">{formatPrice(Math.round(pricePerSqm), currency)} / m²</div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-px bg-[rgba(255,255,255,0.04)] mx-3.5 mb-3 rounded-lg overflow-hidden">
          <MiniStat icon={Maximize2} label="Area" value={`${unit.area}m²`} />
          <MiniStat icon={BedDouble} label="Rooms" value={unit.rooms} />
          <MiniStat icon={Compass} label="Orient." value={unit.orientation} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[rgba(255,255,255,0.02)] px-2.5 py-2 text-center">
      {Icon && <Icon size={11} className="mx-auto mb-1 text-[var(--text-tertiary)]" strokeWidth={2} />}
      {color && !Icon && <span className="inline-block w-[6px] h-[6px] rounded-full mb-1" style={{ background: color }} />}
      <div className="text-[11px] font-semibold text-[var(--text-primary)] leading-none">{value}</div>
    </div>
  );
}

export default EntityTooltip;
