import { memo, useMemo, useCallback } from 'react';
import { BarChart3 } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { NODE_TYPES, canDrillInto } from '../../../utils/nodeTypes';
import { STATUS } from '../../../utils/constants';
import { formatPrice } from '../../../utils/formatPrice';

const AnalyticsPanel = memo(function AnalyticsPanel() {
  const nodes = useProjectStore((s) => s.nodes);
  const config = useProjectStore((s) => s.projectConfig);
  const currentView = useEditorStore((s) => s.currentView);

  // Collect all apartment-type descendants under the current view
  const getApartmentDescendants = useCallback((parentId) => {
    const result = [];
    const queue = [parentId];
    while (queue.length > 0) {
      const current = queue.shift();
      for (const n of nodes) {
        if (n.parentId === current) {
          if (NODE_TYPES[n.type]?.hasStatus) result.push(n);
          if (canDrillInto(n.type)) queue.push(n.id);
        }
      }
    }
    return result;
  }, [nodes]);

  const apartments = useMemo(() => {
    if (currentView.parentId === null) {
      // Root: all apartments in the project
      return nodes.filter((n) => NODE_TYPES[n.type]?.hasStatus);
    }
    // Direct hasStatus children + deeper descendants
    const directChildren = nodes.filter((n) => n.parentId === currentView.parentId);
    const direct = directChildren.filter((n) => NODE_TYPES[n.type]?.hasStatus);
    const deeper = directChildren.filter((n) => canDrillInto(n.type)).flatMap((n) => getApartmentDescendants(n.id));
    return [...direct, ...deeper];
  }, [nodes, currentView.parentId, getApartmentDescendants]);

  // Scope label from parent node
  const scopeLabel = useMemo(() => {
    if (currentView.parentId === null) return 'Project';
    const parent = nodes.find((n) => n.id === currentView.parentId);
    return parent ? NODE_TYPES[parent.type]?.label || 'Scope' : 'Scope';
  }, [nodes, currentView.parentId]);

  const stats = useMemo(() => {
    const total = apartments.length;
    const byStatus = {};
    Object.keys(STATUS).forEach((k) => { byStatus[k] = 0; });
    apartments.forEach((u) => { byStatus[u.status] = (byStatus[u.status] || 0) + 1; });

    const totalRevenue = apartments.reduce((s, u) => s + (u.price || 0), 0);
    const soldRevenue = apartments.filter((u) => u.status === 'sold').reduce((s, u) => s + u.price, 0);
    const availableRevenue = apartments.filter((u) => u.status === 'available').reduce((s, u) => s + u.price, 0);
    const totalArea = apartments.reduce((s, u) => s + (u.area || 0), 0);
    const avgPrice = total > 0 ? totalRevenue / total : 0;
    const avgArea = total > 0 ? totalArea / total : 0;
    const prices = apartments.filter((u) => u.price > 0).map((u) => u.price);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    return {
      total, byStatus, totalRevenue, soldRevenue, availableRevenue,
      totalArea, avgPrice, avgArea, minPrice, maxPrice,
    };
  }, [apartments]);

  const donutSegments = useMemo(() => {
    const entries = Object.entries(stats.byStatus).filter(([, v]) => v > 0);
    const total = stats.total || 1;
    let cumulative = 0;
    return entries.map(([key, count]) => {
      const pct = count / total;
      const start = cumulative;
      cumulative += pct;
      return {
        key, count, pct,
        color: STATUS[key].color,
        label: STATUS[key].label,
        dashArray: `${pct * 100} ${100 - pct * 100}`,
        dashOffset: 100 - start * 100 + 25,
      };
    });
  }, [stats]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
          <BarChart3 size={16} />
          Analytics
        </h3>
        <span className="text-[10px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
          {scopeLabel}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 42 42" className="w-24 h-24 flex-shrink-0">
            <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--bg-tertiary)" strokeWidth="4" />
            {donutSegments.map((seg) => (
              <circle
                key={seg.key}
                cx="21" cy="21" r="15.915"
                fill="none" stroke={seg.color} strokeWidth="4"
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="round"
              />
            ))}
            <text x="21" y="19" textAnchor="middle" fill="var(--text-primary)" fontSize="8" fontWeight="700" fontFamily="Inter">{stats.total}</text>
            <text x="21" y="26" textAnchor="middle" fill="var(--text-tertiary)" fontSize="3.5" fontFamily="Inter">APARTMENTS</text>
          </svg>
          <div className="flex flex-col gap-1.5">
            {donutSegments.map((seg) => (
              <div key={seg.key} className="flex items-center gap-2 text-[12px]">
                <span className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                <span className="text-[var(--text-secondary)]">{seg.label}</span>
                <span className="text-[var(--text-primary)] font-semibold ml-auto">{seg.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide pb-1.5 border-b border-[var(--border)] mb-2">Revenue</h4>
          <div className="flex flex-col gap-2">
            <StatRow label="Total Portfolio" value={formatPrice(stats.totalRevenue, config.currency)} />
            <StatRow label="Sold Revenue" value={formatPrice(stats.soldRevenue, config.currency)} />
            <StatRow label="Available Value" value={formatPrice(stats.availableRevenue, config.currency)} />
            <StatRow label="Average Price" value={formatPrice(stats.avgPrice, config.currency)} />
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide pb-1.5 border-b border-[var(--border)] mb-2">Area</h4>
          <div className="flex flex-col gap-2">
            <StatRow label="Total Area" value={`${stats.totalArea.toLocaleString()} m²`} />
            <StatRow label="Average Area" value={`${stats.avgArea.toFixed(0)} m²`} />
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide pb-1.5 border-b border-[var(--border)] mb-2">Price Range</h4>
          <div className="flex flex-col gap-2">
            <StatRow label="Minimum" value={formatPrice(stats.minPrice, config.currency)} />
            <StatRow label="Maximum" value={formatPrice(stats.maxPrice, config.currency)} />
          </div>
        </div>
      </div>
    </div>
  );
});

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-[12px]">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className="text-[var(--text-primary)] font-semibold tabular-nums">{value}</span>
    </div>
  );
}

export default AnalyticsPanel;
