import { memo, useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { useToastStore } from '../../../stores/toastStore';
import FloatingInput from '../../../components/ui/FloatingInput';
import ImageUpload from '../../../components/ui/ImageUpload';
import Button from '../../../components/ui/Button';
import ConfirmButton from '../../../components/ui/ConfirmButton';

const FloorEditPanel = memo(function FloorEditPanel() {
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);
  const floor = useProjectStore((s) => s.floors.find((f) => f.id === selectedUnitId));
  const updateFloor = useProjectStore((s) => s.updateFloor);
  const removeFloor = useProjectStore((s) => s.removeFloor);
  const deselectUnit = useEditorStore((s) => s.deselectUnit);
  const toast = useToastStore((s) => s.show);

  const [form, setForm] = useState({
    name: '', floorNumber: 1, backgroundImage: null,
  });

  useEffect(() => {
    if (floor) {
      setForm({
        name: floor.name || '',
        floorNumber: floor.floorNumber || 1,
        backgroundImage: floor.backgroundImage || null,
      });
    }
  }, [floor]);

  const handleSave = useCallback(() => {
    if (!form.name.trim()) {
      toast('Floor name is required', 'warning');
      return;
    }
    updateFloor(selectedUnitId, {
      ...form,
      floorNumber: parseInt(form.floorNumber) || 1,
    });
    toast('Floor updated', 'success');
  }, [form, selectedUnitId, updateFloor, toast]);

  const handleDelete = useCallback(() => {
    const name = floor?.name || 'Floor';
    removeFloor(selectedUnitId);
    deselectUnit();
    toast(`${name} deleted (including all units)`, 'info');
  }, [selectedUnitId, floor, removeFloor, deselectUnit, toast]);

  if (!floor) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">Floor Properties</h3>
        <span className="font-[var(--font-mono)] text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-[var(--radius-sm)]">
          #{selectedUnitId}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
        <FloatingInput
          label="Floor Name" id="f-floor-name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <FloatingInput
          label="Floor Number" id="f-floor-num" type="number"
          value={form.floorNumber} min="1"
          onChange={(e) => setForm((f) => ({ ...f, floorNumber: e.target.value }))}
        />
        <ImageUpload
          value={form.backgroundImage}
          onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
          label="Floor Plan Image"
        />
      </div>

      <div className="px-5 py-4 border-t border-[var(--border)] flex flex-col gap-2">
        <Button onClick={handleSave}>
          <Check size={16} strokeWidth={2.5} />
          Save Changes
        </Button>
        <ConfirmButton onConfirm={handleDelete} />
      </div>
    </div>
  );
});

export default FloorEditPanel;
