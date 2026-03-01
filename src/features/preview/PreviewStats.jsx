import { STATUS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';

export default function PreviewStats({ stats, currency }) {
  return (
    <aside className="pvs">
      {/* Header */}
      <div className="pvs-header">
        <h2 className="pvs-name">Overview</h2>
      </div>

      {/* Total */}
      <div className="pvs-total-block">
        <span className="pvs-total-value">{stats.total}</span>
        <span className="pvs-total-label">Total Units</span>
      </div>

      {/* Status breakdown */}
      <div className="pvs-section">
        <h3 className="pvs-section-title">By Status</h3>
        <div className="pvs-status-list">
          {Object.entries(STATUS).map(([key, s]) => (
            <div key={key} className="pvs-status-row">
              <span className="pvs-status-row-dot" style={{ background: s.color }} />
              <span className="pvs-status-row-label">{s.label}</span>
              <span className="pvs-status-row-value">{stats[key] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Min price */}
      {stats.minPrice > 0 && (
        <div className="pvs-section">
          <h3 className="pvs-section-title">Starting Price</h3>
          <span className="pvs-min-price">{formatPrice(stats.minPrice, currency)}</span>
        </div>
      )}
    </aside>
  );
}
