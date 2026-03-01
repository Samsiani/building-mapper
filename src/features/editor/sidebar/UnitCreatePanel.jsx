import { memo, useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { useToastStore } from '../../../stores/toastStore';
import { ORIENTATIONS } from '../../../utils/constants';
import FloatingInput from '../../../components/ui/FloatingInput';
import FloatingSelect from '../../../components/ui/FloatingSelect';
import Checkbox from '../../../components/ui/Checkbox';
import StatusSegmentedControl from '../../../components/ui/StatusSegmentedControl';
import Button from '../../../components/ui/Button';

const UnitCreatePanel = memo(function UnitCreatePanel() {
  const pendingPoints = useEditorStore((s) => s.pendingPoints);
  const pendingCreationParentId = useEditorStore((s) => s.pendingCreationParentId);
  const currentView = useEditorStore((s) => s.currentView);
  const setPendingPoints = useEditorStore((s) => s.setPendingPoints);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const selectUnit = useEditorStore((s) => s.selectUnit);
  const createUnit = useProjectStore((s) => s.createUnit);
  const toast = useToastStore((s) => s.show);

  const [form, setForm] = useState({
    name: '', area: '', price: '', rooms: 1,
    balcony: false, orientation: 'North', status: 'available', notes: '',
  });

  const handleSave = useCallback(() => {
    if (!form.name.trim()) {
      toast('Unit name is required', 'warning');
      return;
    }
    // floorId comes from pending creation or current view
    const floorId = pendingCreationParentId || currentView.floorId;
    const unit = createUnit({
      ...form,
      area: parseFloat(form.area) || 0,
      price: parseFloat(form.price) || 0,
      rooms: parseInt(form.rooms) || 1,
      points: pendingPoints,
      floorId,
    });
    setPendingPoints(null);
    selectUnit(unit.id);
    setActiveTool('select');
    toast('New unit created', 'success');
  }, [form, pendingPoints, pendingCreationParentId, currentView.floorId, createUnit, setPendingPoints, selectUnit, setActiveTool, toast]);

  const handleCancel = useCallback(() => {
    setPendingPoints(null);
    setActiveTool('select');
  }, [setPendingPoints, setActiveTool]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">New Unit</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
        <FloatingInput
          label="Unit Name" id="f-name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />

        <div className="grid grid-cols-2 gap-2.5">
          <FloatingInput
            label="Area (m²)" id="f-area" type="number"
            value={form.area} min="0"
            onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
          />
          <FloatingInput
            label="Price (€)" id="f-price" type="number"
            value={form.price} min="0" step="1000"
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <FloatingInput
            label="Rooms" id="f-rooms" type="number"
            value={form.rooms} min="1" max="20"
            onChange={(e) => setForm((f) => ({ ...f, rooms: e.target.value }))}
          />
          <FloatingSelect
            label="Orientation" id="f-orientation"
            value={form.orientation} options={ORIENTATIONS}
            onChange={(e) => setForm((f) => ({ ...f, orientation: e.target.value }))}
          />
        </div>

        <Checkbox
          label="Balcony"
          checked={form.balcony}
          onChange={(e) => setForm((f) => ({ ...f, balcony: e.target.checked }))}
        />

        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2 block">
            Status
          </label>
          <StatusSegmentedControl
            value={form.status}
            onChange={(status) => setForm((f) => ({ ...f, status }))}
          />
        </div>

        <div className="floating-input">
          <textarea
            id="f-notes" placeholder=" " rows="3"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
          <label htmlFor="f-notes">Notes</label>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-[var(--border)] flex flex-col gap-2">
        <Button onClick={handleSave}>
          <Check size={16} strokeWidth={2.5} />
          Create Unit
        </Button>
        <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
      </div>
    </div>
  );
});

export default UnitCreatePanel;
