import { STATUS } from '../../utils/constants';

export default function PreviewLegend() {
  return (
    <div className="flex justify-center gap-7 py-5">
      {Object.entries(STATUS).map(([key, s]) => (
        <div key={key} className="flex items-center gap-2 text-sm font-medium text-[var(--pv-text-secondary)]">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
          {s.label}
        </div>
      ))}
    </div>
  );
}
