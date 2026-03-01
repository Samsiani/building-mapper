import { memo, useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { useToastStore } from '../../../stores/toastStore';
import FloatingInput from '../../../components/ui/FloatingInput';
import ImageUpload from '../../../components/ui/ImageUpload';
import Button from '../../../components/ui/Button';

const BuildingCreatePanel = memo(function BuildingCreatePanel() {
  const pendingPoints = useEditorStore((s) => s.pendingPoints);
  const setPendingPoints = useEditorStore((s) => s.setPendingPoints);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const createBuilding = useProjectStore((s) => s.createBuilding);
  const toast = useToastStore((s) => s.show);

  const [form, setForm] = useState({
    name: '',
    description: '',
    backgroundImage: null,
    floors: 6,
    unitsPerFloor: 4,
  });

  const handleSave = useCallback(() => {
    if (!form.name.trim()) {
      toast('Building name is required', 'warning');
      return;
    }
    const building = createBuilding({
      ...form,
      floors: parseInt(form.floors) || 6,
      unitsPerFloor: parseInt(form.unitsPerFloor) || 4,
      points: pendingPoints,
    });
    setPendingPoints(null);
    setActiveTool('select');
    toast(`${building.name} created`, 'success');
  }, [form, pendingPoints, createBuilding, setPendingPoints, setActiveTool, toast]);

  const handleCancel = useCallback(() => {
    setPendingPoints(null);
    setActiveTool('select');
  }, [setPendingPoints, setActiveTool]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">New Building</h3>
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
          label="Building Image (optional)"
        />
      </div>

      <div className="px-5 py-4 border-t border-[var(--border)] flex flex-col gap-2">
        <Button onClick={handleSave}>
          <Check size={16} strokeWidth={2.5} />
          Create Building
        </Button>
        <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
      </div>
    </div>
  );
});

export default BuildingCreatePanel;
