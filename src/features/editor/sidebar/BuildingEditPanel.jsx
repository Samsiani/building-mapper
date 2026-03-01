import { memo, useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { useToastStore } from '../../../stores/toastStore';
import FloatingInput from '../../../components/ui/FloatingInput';
import ImageUpload from '../../../components/ui/ImageUpload';
import Button from '../../../components/ui/Button';
import ConfirmButton from '../../../components/ui/ConfirmButton';

const BuildingEditPanel = memo(function BuildingEditPanel() {
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);
  const building = useProjectStore((s) => s.buildings.find((b) => b.id === selectedUnitId));
  const updateBuilding = useProjectStore((s) => s.updateBuilding);
  const removeBuilding = useProjectStore((s) => s.removeBuilding);
  const deselectUnit = useEditorStore((s) => s.deselectUnit);
  const toast = useToastStore((s) => s.show);

  const [form, setForm] = useState({
    name: '', description: '', backgroundImage: null, floors: 6, unitsPerFloor: 4,
  });

  useEffect(() => {
    if (building) {
      setForm({
        name: building.name || '',
        description: building.description || '',
        backgroundImage: building.backgroundImage || null,
        floors: building.floors || 6,
        unitsPerFloor: building.unitsPerFloor || 4,
      });
    }
  }, [building]);

  const handleSave = useCallback(() => {
    if (!form.name.trim()) {
      toast('Building name is required', 'warning');
      return;
    }
    updateBuilding(selectedUnitId, {
      ...form,
      floors: parseInt(form.floors) || 6,
      unitsPerFloor: parseInt(form.unitsPerFloor) || 4,
    });
    toast('Building updated', 'success');
  }, [form, selectedUnitId, updateBuilding, toast]);

  const handleDelete = useCallback(() => {
    const name = building?.name || 'Building';
    removeBuilding(selectedUnitId);
    deselectUnit();
    toast(`${name} deleted (including all floors and units)`, 'info');
  }, [selectedUnitId, building, removeBuilding, deselectUnit, toast]);

  if (!building) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">Building Properties</h3>
        <span className="font-[var(--font-mono)] text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-[var(--radius-sm)]">
          #{selectedUnitId}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
        <FloatingInput
          label="Building Name" id="f-bldg-name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <FloatingInput
          label="Description" id="f-bldg-desc"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-2.5">
          <FloatingInput
            label="Floors" id="f-bldg-floors" type="number"
            value={form.floors} min="1" max="30"
            onChange={(e) => setForm((f) => ({ ...f, floors: e.target.value }))}
          />
          <FloatingInput
            label="Units / Floor" id="f-bldg-upf" type="number"
            value={form.unitsPerFloor} min="1" max="12"
            onChange={(e) => setForm((f) => ({ ...f, unitsPerFloor: e.target.value }))}
          />
        </div>
        <ImageUpload
          value={form.backgroundImage}
          onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
          label="Building Image"
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

export default BuildingEditPanel;
