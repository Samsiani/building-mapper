import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';

const Breadcrumbs = memo(function Breadcrumbs() {
  const currentView = useEditorStore((s) => s.currentView);
  const nodes = useProjectStore((s) => s.nodes);

  if (currentView.parentId === null) return null;

  // Build ancestor chain
  const segments = [{ label: 'Global', onClick: () => useEditorStore.getState().navigateToRoot() }];

  const ancestors = [];
  let current = nodes.find((n) => n.id === currentView.parentId);
  while (current) {
    ancestors.unshift(current);
    current = current.parentId !== null ? nodes.find((n) => n.id === current.parentId) : null;
  }

  ancestors.forEach((ancestor, i) => {
    const isLast = i === ancestors.length - 1;
    segments.push({
      label: ancestor.name,
      onClick: isLast ? null : () => useEditorStore.getState().navigateInto(ancestor.id),
    });
  });

  return (
    <AnimatePresence>
      <motion.div
        className="absolute top-4 left-4 z-50 flex items-center gap-1 py-1.5 px-3 bg-[var(--bg-glass)] backdrop-blur-[20px] border border-[var(--border)] rounded-full shadow-[var(--shadow-sm)]"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.2 }}
      >
        <Home size={13} className="text-[var(--text-tertiary)] mr-0.5" />
        {segments.map((seg, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="text-[var(--text-tertiary)]" />}
            {seg.onClick ? (
              <button
                onClick={seg.onClick}
                className="bg-transparent border-none text-[12px] font-medium text-[var(--text-secondary)] cursor-pointer hover:text-[var(--accent)] transition-colors px-0.5"
              >
                {seg.label}
              </button>
            ) : (
              <span className="text-[12px] font-semibold text-[var(--text-primary)] px-0.5">
                {seg.label}
              </span>
            )}
          </span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
});

export default Breadcrumbs;
