import { formatPrice } from '../../utils/formatPrice';

export default function PreviewStats({ stats, currency }) {
  return (
    <footer className="pv-stats-bar">
      <Stat label="Total" value={stats.total} />
      <span className="pv-stats-sep" />
      <Stat label="Available" value={stats.available} dot="#22c55e" />
      <span className="pv-stats-sep" />
      <Stat label="Reserved" value={stats.reserved} dot="#f59e0b" />
      <span className="pv-stats-sep" />
      <Stat label="Sold" value={stats.sold} dot="#ef4444" />
      {stats.minPrice > 0 && (
        <>
          <span className="pv-stats-sep" />
          <Stat label="From" value={formatPrice(stats.minPrice, currency)} />
        </>
      )}
    </footer>
  );
}

function Stat({ label, value, dot }) {
  return (
    <div className="pv-stats-item">
      {dot && <span className="pv-stats-dot" style={{ background: dot }} />}
      <span className="pv-stats-label">{label}</span>
      <span className="pv-stats-value">{value}</span>
    </div>
  );
}
