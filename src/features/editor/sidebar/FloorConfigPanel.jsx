import { memo, useCallback, useMemo } from 'react';
import { Layers } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import FloatingInput from '../../../components/ui/FloatingInput';
import ImageUpload from '../../../components/ui/ImageUpload';

const FloorConfigPanel = memo(function FloorConfigPanel() {
  const currentView = useEditorStore((s) => s.currentView);
  const floor = useProjectStore((s) => s.floors.find((f) => f.id === currentView.floorId));
  const allUnits = useProjectStore((s) => s.units);
  const updateFloor = useProjectStore((s) => s.updateFloor);

  const units = useMemo(
    () => allUnits.filter((u) => u.floorId === currentView.floorId),
    [allUnits, currentView.floorId]
  );

  const handleChange = useCallback(
    (key, type = 'text') => (e) => {
      let val = e.target.value;
      if (type === 'number') val = parseInt(val) || 1;
      updateFloor(currentView.floorId, { [key]: val });
    },
    [updateFloor, currentView.floorId]
  );

  const handleImageChange = useCallback(
    (image) => {
      updateFloor(currentView.floorId, { backgroundImage: image });
    },
    [updateFloor, currentView.floorId]
  );

  if (!floor) return null;

  const available = units.filter((u) => u.status === 'available').length;
  const reserved = units.filter((u) => u.status === 'reserved').length;
  const sold = units.filter((u) => u.status === 'sold').length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">Floor Settings</h3>
        <span className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
          <Layers size={14} />
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
        <SectionTitle>Floor Info</SectionTitle>
        <FloatingInput
          label="Floor Name" id="cfg-floor-name"
          value={floor.name} onChange={handleChange('name')}
        />
        <FloatingInput
          label="Floor Number" id="cfg-floor-num" type="number"
          value={floor.floorNumber} onChange={handleChange('floorNumber', 'number')}
          min="1"
        />

        <SectionTitle>Background</SectionTitle>
        <ImageUpload
          value={floor.backgroundImage}
          onChange={handleImageChange}
          label="Floor Plan Image"
        />

        <SectionTitle>Unit Summary</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="Available" value={available} color="#22c55e" />
          <StatBox label="Reserved" value={reserved} color="#f59e0b" />
          <StatBox label="Sold" value={sold} color="#ef4444" />
        </div>
        <p className="text-[11px] text-[var(--text-tertiary)]">
          {units.length} total units on this floor
        </p>
      </div>
    </div>
  );
});

function SectionTitle({ children }) {
  return (
    <h4 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide pb-1.5 border-b border-[var(--border)] mb-0.5">
      {children}
    </h4>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] px-2 py-2 text-center">
      <span className="inline-block w-[6px] h-[6px] rounded-full mb-1" style={{ background: color }} />
      <div className="text-[13px] font-bold text-[var(--text-primary)]">{value}</div>
      <div className="text-[9px] text-[var(--text-tertiary)] uppercase">{label}</div>
    </div>
  );
}

export default FloorConfigPanel;
