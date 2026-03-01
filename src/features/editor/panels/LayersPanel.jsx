import { memo, useMemo } from 'react';
import { Eye, EyeOff, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';

const LayersPanel = memo(function LayersPanel() {
  const isOpen = useEditorStore((s) => s.layersPanelOpen);
  const togglePanel = useEditorStore((s) => s.toggleLayersPanel);
  const buildingVisible = useEditorStore((s) => s.buildingLayerVisible);
  const toggleBuilding = useEditorStore((s) => s.toggleBuildingLayer);
  const currentView = useEditorStore((s) => s.currentView);
  const buildings = useProjectStore((s) => s.buildings);
  const floors = useProjectStore((s) => s.floors);
  const units = useProjectStore((s) => s.units);

  const entities = useMemo(() => {
    if (currentView.level === 'global') return buildings;
    if (currentView.level === 'building') return floors.filter((f) => f.buildingId === currentView.buildingId);
    return units.filter((u) => u.floorId === currentView.floorId);
  }, [currentView, buildings, floors, units]);

  const levelLabel = currentView.level === 'global' ? 'Buildings' : currentView.level === 'building' ? 'Floors' : 'Units';

  return (
    <div className="absolute bottom-4 left-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="mb-2 w-[220px] bg-[var(--bg-glass)] backdrop-blur-[20px] border border-[var(--border)] rounded-[var(--radius-md)] shadow-lg overflow-hidden"
          >
            <div className="px-3 py-2.5 border-b border-[var(--border)]">
              <h4 className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide">
                Layers — {levelLabel}
              </h4>
            </div>
            <div className="max-h-[240px] overflow-y-auto">
              <LayerRow
                label="Background"
                visible={buildingVisible}
                onToggle={toggleBuilding}
              />
              {entities.map((entity) => (
                <LayerRow key={entity.id} label={entity.name} visible={true} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={togglePanel}
        title="Layers (L)"
        className={`flex items-center gap-1.5 py-1.5 px-3 bg-[var(--bg-glass)] backdrop-blur-[20px] border border-[var(--border)] rounded-full text-[12px] font-semibold cursor-pointer transition-all shadow-[var(--shadow-sm)]
          ${isOpen ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
      >
        <Layers size={14} />
        Layers
      </button>
    </div>
  );
});

function LayerRow({ label, visible, onToggle }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 hover:bg-[rgba(255,255,255,0.03)] transition-colors">
      <button
        onClick={onToggle}
        className="flex-shrink-0 w-5 h-5 flex items-center justify-center border-none bg-transparent text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors"
      >
        {visible ? <Eye size={13} /> : <EyeOff size={13} />}
      </button>
      <span className="text-[12px] text-[var(--text-secondary)] truncate">{label}</span>
    </div>
  );
}

export default LayersPanel;
