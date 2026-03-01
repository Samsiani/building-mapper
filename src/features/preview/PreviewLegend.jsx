import { STATUS } from '../../utils/constants';

export default function PreviewLegend() {
  return (
    <div className="pv-legend">
      {Object.entries(STATUS).map(([key, s]) => (
        <div key={key} className="pv-legend-item">
          <span className="pv-legend-dot" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}40` }} />
          {s.label}
        </div>
      ))}
    </div>
  );
}
