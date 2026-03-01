import { memo, useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { useToastStore } from '../../../stores/toastStore';
import FloatingInput from '../../../components/ui/FloatingInput';
import ImageUpload from '../../../components/ui/ImageUpload';
import Button from '../../../components/ui/Button';

const FloorCreatePanel = memo(function FloorCreatePanel() {
  const pendingPoints = useEditorStore((s) => s.pendingPoints);
  const pendingCreationParentId = useEditorStore((s) => s.pendingCreationParentId);
  const setPendingPoints = useEditorStore((s) => s.setPendingPoints);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const createFloor = useProjectStore((s) => s.createFloor);
  const floors = useProjectStore((s) => s.floors);
  const toast = useToastStore((s) => s.show);

  // Suggest next floor number
  const buildingFloors = floors.filter((f) => f.buildingId === pendingCreationParentId);
  const nextNumber = buildingFloors.length > 0 ? Math.max(...buildingFloors.map((f) => f.floorNumber)) + 1 : 1;

  const [form, setForm] = useState({
    name: `Floor ${nextNumber}`,
    floorNumber: nextNumber,
    backgroundImage: null,
  });

  const handleSave = useCallback(() => {
    if (!form.name.trim()) {
      toast('Floor name is required', 'warning');
      return;
    }
    const floor = createFloor({
      ...form,
      floorNumber: parseInt(form.floorNumber) || 1,
      buildingId: pendingCreationParentId,
      points: pendingPoints,
    });
    setPendingPoints(null);
    setActiveTool('select');
    toast(`${floor.name} created`, 'success');
  }, [form, pendingPoints, pendingCreationParentId, createFloor, setPendingPoints, setActiveTool, toast]);

  const handleCancel = useCallback(() => {
    setPendingPoints(null);
    setActiveTool('select');
  }, [setPendingPoints, setActiveTool]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">New Floor</h3>
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
          label="Floor Plan Image (optional)"
        />
      </div>

      <div className="px-5 py-4 border-t border-[var(--border)] flex flex-col gap-2">
        <Button onClick={handleSave}>
          <Check size={16} strokeWidth={2.5} />
          Create Floor
        </Button>
        <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
      </div>
    </div>
  );
});

export default FloorCreatePanel;
