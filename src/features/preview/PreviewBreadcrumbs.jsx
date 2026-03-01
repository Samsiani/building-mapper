import { ChevronRight } from 'lucide-react';

export default function PreviewBreadcrumbs({ previewView, buildings, floors, onNavigate }) {
  if (previewView.level === 'global') return null;

  const segments = [
    { label: 'All Buildings', onClick: () => onNavigate('global') },
  ];

  if (previewView.level === 'building' || previewView.level === 'floor') {
    const building = buildings.find((b) => b.id === previewView.buildingId);
    segments.push({
      label: building?.name || 'Building',
      onClick: previewView.level === 'floor'
        ? () => onNavigate('building', previewView.buildingId)
        : null,
    });
  }

  if (previewView.level === 'floor') {
    const floor = floors.find((f) => f.id === previewView.floorId);
    segments.push({
      label: floor?.name || 'Floor',
      onClick: null,
    });
  }

  return (
    <div className="flex items-center gap-1.5 mb-4 text-[13px]">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="text-[var(--pv-text)]" style={{ opacity: 0.4 }} />}
            {seg.onClick ? (
              <button
                onClick={seg.onClick}
                className="bg-transparent border-none font-medium cursor-pointer hover:underline px-0"
                style={{ color: 'var(--pv-text)', opacity: 0.6 }}
              >
                {seg.label}
              </button>
            ) : (
              <span className="font-semibold" style={{ color: 'var(--pv-text)' }}>
                {seg.label}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
