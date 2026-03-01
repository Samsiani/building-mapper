import { ChevronRight, Home } from 'lucide-react';

export default function PreviewBreadcrumbs({ previewView, nodes, onNavigate }) {
  if (previewView.parentId === null) return null;

  const segments = [
    { label: 'Overview', icon: Home, onClick: () => onNavigate(null) },
  ];

  // Build ancestor chain
  const ancestors = [];
  let current = nodes.find((n) => n.id === previewView.parentId);
  while (current) {
    ancestors.unshift(current);
    current = current.parentId !== null ? nodes.find((n) => n.id === current.parentId) : null;
  }

  ancestors.forEach((ancestor, i) => {
    const isLast = i === ancestors.length - 1;
    segments.push({
      label: ancestor.name,
      onClick: isLast ? null : () => onNavigate(ancestor.id),
    });
  });

  return (
    <nav className="pv-breadcrumbs">
      {segments.map((seg, i) => {
        const Icon = seg.icon;
        return (
          <span key={i} className="pv-breadcrumb-item">
            {i > 0 && <ChevronRight size={12} className="pv-breadcrumb-sep" />}
            {seg.onClick ? (
              <button onClick={seg.onClick} className="pv-breadcrumb-btn">
                {Icon && <Icon size={13} />}
                {seg.label}
              </button>
            ) : (
              <span className="pv-breadcrumb-current">
                {Icon && <Icon size={13} />}
                {seg.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
