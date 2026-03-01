import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';

const Breadcrumbs = memo(function Breadcrumbs() {
  const currentView = useEditorStore((s) => s.currentView);
  const buildings = useProjectStore((s) => s.buildings);
  const floors = useProjectStore((s) => s.floors);

  if (currentView.level === 'global') return null;

  const segments = [{ label: 'Global', onClick: () => useEditorStore.getState().navigateTo('global') }];

  if (currentView.level === 'building' || currentView.level === 'floor') {
    const building = buildings.find((b) => b.id === currentView.buildingId);
    segments.push({
      label: building?.name || 'Building',
      onClick: currentView.level === 'floor'
        ? () => useEditorStore.getState().navigateToBuilding(currentView.buildingId)
        : null,
    });
  }

  if (currentView.level === 'floor') {
    const floor = floors.find((f) => f.id === currentView.floorId);
    segments.push({
      label: floor?.name || 'Floor',
      onClick: null, // Current level, not clickable
    });
  }

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
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return (
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
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
});

export default Breadcrumbs;
