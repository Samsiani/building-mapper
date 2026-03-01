import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../../stores/editorStore';
import SidebarBrand from './SidebarBrand';
import ProjectConfigPanel from './ProjectConfigPanel';
import BuildingConfigPanel from './BuildingConfigPanel';
import BuildingCreatePanel from './BuildingCreatePanel';
import BuildingEditPanel from './BuildingEditPanel';
import FloorConfigPanel from './FloorConfigPanel';
import FloorCreatePanel from './FloorCreatePanel';
import FloorEditPanel from './FloorEditPanel';
import UnitEditPanel from './UnitEditPanel';
import UnitCreatePanel from './UnitCreatePanel';
import BulkEditPanel from './BulkEditPanel';
import AnalyticsPanel from './AnalyticsPanel';

const panelVariants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

const Sidebar = memo(function Sidebar() {
  const sidebarMode = useEditorStore((s) => s.sidebarMode);
  const currentView = useEditorStore((s) => s.currentView);
  const pendingCreationType = useEditorStore((s) => s.pendingCreationType);

  // Determine which panel to show
  const panelKey = `${sidebarMode}-${currentView.level}-${pendingCreationType || ''}`;

  const renderPanel = () => {
    // Analytics and bulk are level-independent
    if (sidebarMode === 'analytics') return <AnalyticsPanel />;
    if (sidebarMode === 'bulk') return <BulkEditPanel />;

    // Create mode — depends on what's being created
    if (sidebarMode === 'create') {
      if (pendingCreationType === 'building') return <BuildingCreatePanel />;
      if (pendingCreationType === 'floor') return <FloorCreatePanel />;
      return <UnitCreatePanel />;
    }

    // Edit mode — depends on current level
    if (sidebarMode === 'edit') {
      if (currentView.level === 'global') return <BuildingEditPanel />;
      if (currentView.level === 'building') return <FloorEditPanel />;
      return <UnitEditPanel />;
    }

    // Config mode — depends on current level
    if (currentView.level === 'global') return <ProjectConfigPanel />;
    if (currentView.level === 'building') return <BuildingConfigPanel />;
    return <FloorConfigPanel />;
  };

  return (
    <aside className="w-[var(--sidebar-width)] min-w-[var(--sidebar-width)] h-screen bg-[var(--bg-secondary)] border-l border-[var(--border)] flex flex-col overflow-hidden">
      <SidebarBrand />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={panelKey}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="h-full"
          >
            {renderPanel()}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
});

export default Sidebar;
