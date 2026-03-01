import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../../stores/editorStore';
import SidebarBrand from './SidebarBrand';
import ProjectConfigPanel from './ProjectConfigPanel';
import NodeConfigPanel from './NodeConfigPanel';
import NodeCreatePanel from './NodeCreatePanel';
import NodeEditPanel from './NodeEditPanel';
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

  const panelKey = `${sidebarMode}-${currentView.parentId}-${pendingCreationType || ''}`;

  const renderPanel = () => {
    if (sidebarMode === 'analytics') return <AnalyticsPanel />;
    if (sidebarMode === 'bulk') return <BulkEditPanel />;
    if (sidebarMode === 'create') return <NodeCreatePanel />;
    if (sidebarMode === 'edit') return <NodeEditPanel />;

    // Config mode
    if (currentView.parentId === null) return <ProjectConfigPanel />;
    return <NodeConfigPanel />;
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
