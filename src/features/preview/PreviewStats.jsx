import { STATUS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';

export default function PreviewStats({ stats, currency }) {
  return (
    <footer className="pv-stats-bar">
      <Stat label="Total" value={stats.total} />
      {Object.entries(STATUS).map(([key, s]) => (
        <span key={key} className="contents">
          <span className="pv-stats-sep" />
          <Stat label={s.label} value={stats[key] || 0} dot={s.color} />
        </span>
      ))}
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
