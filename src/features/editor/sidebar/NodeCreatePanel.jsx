import { memo, useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { useToastStore } from '../../../stores/toastStore';
import { NODE_TYPES, getAllowedChildTypes } from '../../../utils/nodeTypes';
import { ORIENTATIONS } from '../../../utils/constants';
import FloatingInput from '../../../components/ui/FloatingInput';
import FloatingSelect from '../../../components/ui/FloatingSelect';
import Checkbox from '../../../components/ui/Checkbox';
import StatusSegmentedControl from '../../../components/ui/StatusSegmentedControl';
import ImageUpload from '../../../components/ui/ImageUpload';
import Button from '../../../components/ui/Button';

const NodeCreatePanel = memo(function NodeCreatePanel() {
  const pendingPoints = useEditorStore((s) => s.pendingPoints);
  const pendingCreationType = useEditorStore((s) => s.pendingCreationType);
  const pendingCreationParentId = useEditorStore((s) => s.pendingCreationParentId);
  const setPendingPoints = useEditorStore((s) => s.setPendingPoints);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const createNode = useProjectStore((s) => s.createNode);
  const nodes = useProjectStore((s) => s.nodes);
  const toast = useToastStore((s) => s.show);

  // Determine allowed types for this parent
  const parentNode = pendingCreationParentId != null
    ? nodes.find((n) => n.id === pendingCreationParentId)
    : null;
  const parentType = parentNode?.type || null;
  let grandparentType = null;
  if (parentNode?.parentId != null) {
    const gpNode = nodes.find((n) => n.id === parentNode.parentId);
    grandparentType = gpNode?.type || null;
  }
  const allowedTypes = getAllowedChildTypes(parentType, grandparentType);

  const [selectedType, setSelectedType] = useState(pendingCreationType || (allowedTypes.length === 1 ? allowedTypes[0] : null));
  const [form, setForm] = useState({
    name: '', description: '', area: '', price: '', rooms: 1,
    balcony: false, orientation: 'North', status: 'for_sale', notes: '',
    floorNumber: '', floors: 6, unitsPerFloor: 4, backgroundImage: null,
    roomType: 'living', entrance: 1,
  });

  const typeDef = selectedType ? NODE_TYPES[selectedType] : null;

  const handleSave = useCallback(() => {
    if (!selectedType) {
      toast('Please select an entity type', 'warning');
      return;
    }
    if (!form.name.trim()) {
      toast(`${typeDef?.label || 'Entity'} name is required`, 'warning');
      return;
    }

    const data = {
      type: selectedType,
      parentId: pendingCreationParentId,
      name: form.name,
      points: pendingPoints,
    };

    // Add type-specific fields
    if (typeDef?.hasStatus) {
      data.area = parseFloat(form.area) || 0;
      data.price = parseFloat(form.price) || 0;
      data.rooms = parseInt(form.rooms) || 1;
      data.balcony = form.balcony;
      data.orientation = form.orientation;
      data.status = form.status;
      data.notes = form.notes;
    }

    if (selectedType === 'neighborhood' || selectedType === 'phase') {
      data.description = form.description;
    }

    if (selectedType === 'villa') {
      data.description = form.description;
    }

    if (selectedType === 'building') {
      data.description = form.description;
      data.floors = parseInt(form.floors) || 6;
      data.unitsPerFloor = parseInt(form.unitsPerFloor) || 4;
    }

    if (selectedType === 'floor') {
      data.floorNumber = parseInt(form.floorNumber) || 1;
    }

    if (selectedType === 'apartment') {
      data.entrance = parseInt(form.entrance) || 1;
    }

    if (selectedType === 'room') {
      data.area = parseFloat(form.area) || 0;
      data.roomType = form.roomType;
    }

    if (selectedType === 'balcony') {
      data.area = parseFloat(form.area) || 0;
    }

    // Universal background image for all types
    data.backgroundImage = form.backgroundImage;

    const node = createNode(data);
    setPendingPoints(null);

    if (typeDef?.hasStatus) {
      useEditorStore.getState().selectNode(node.id);
    }

    setActiveTool('select');
    toast(`${node.name} created`, 'success');
  }, [selectedType, form, pendingPoints, pendingCreationParentId, typeDef, createNode, setPendingPoints, setActiveTool, toast]);

  const handleCancel = useCallback(() => {
    setPendingPoints(null);
    setActiveTool('select');
  }, [setPendingPoints, setActiveTool]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">
          {selectedType ? `New ${typeDef?.label}` : 'New Entity'}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
        {/* Type picker — shown when multiple types are allowed */}
        {!pendingCreationType && allowedTypes.length > 1 && (
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2 block">
              Entity Type
            </label>
            <div className="flex flex-col gap-1.5">
              {allowedTypes.map((t) => {
                const td = NODE_TYPES[t];
                const isActive = selectedType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 border rounded-[var(--radius-sm)] text-[13px] font-medium cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]'
                        : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: td.color || 'var(--text-tertiary)' }}
                    />
                    {td.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Type-specific form fields */}
        {selectedType && (
          <>
            <FloatingInput
              label={`${typeDef.label} Name`} id="f-node-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />

            {(selectedType === 'neighborhood' || selectedType === 'phase') && (
              <>
                <FloatingInput
                  label="Description" id="f-node-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                <ImageUpload
                  value={form.backgroundImage}
                  onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
                  label={`${typeDef.label} Image (optional)`}
                />
              </>
            )}

            {selectedType === 'building' && (
              <>
                <FloatingInput
                  label="Description" id="f-node-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <FloatingInput
                    label="Floors" id="f-node-floors" type="number"
                    value={form.floors} min="1" max="30"
                    onChange={(e) => setForm((f) => ({ ...f, floors: e.target.value }))}
                  />
                  <FloatingInput
                    label="Units / Floor" id="f-node-upf" type="number"
                    value={form.unitsPerFloor} min="1" max="12"
                    onChange={(e) => setForm((f) => ({ ...f, unitsPerFloor: e.target.value }))}
                  />
                </div>
                <ImageUpload
                  value={form.backgroundImage}
                  onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
                  label="Building Image (optional)"
                />
              </>
            )}

            {selectedType === 'floor' && (
              <>
                <FloatingInput
                  label="Floor Number" id="f-node-fnum" type="number"
                  value={form.floorNumber} min="1"
                  onChange={(e) => setForm((f) => ({ ...f, floorNumber: e.target.value }))}
                />
                <ImageUpload
                  value={form.backgroundImage}
                  onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
                  label="Floor Plan Image (optional)"
                />
              </>
            )}

            {typeDef.hasStatus && (
              <>
                <div className="grid grid-cols-2 gap-2.5">
                  <FloatingInput
                    label="Area (m²)" id="f-node-area" type="number"
                    value={form.area} min="0"
                    onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                  />
                  <FloatingInput
                    label="Price (€)" id="f-node-price" type="number"
                    value={form.price} min="0" step="1000"
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <FloatingInput
                    label="Rooms" id="f-node-rooms" type="number"
                    value={form.rooms} min="1" max="20"
                    onChange={(e) => setForm((f) => ({ ...f, rooms: e.target.value }))}
                  />
                  <FloatingSelect
                    label="Orientation" id="f-node-orient"
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
                    id="f-node-notes" placeholder=" " rows="3"
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                  <label htmlFor="f-node-notes">Notes</label>
                </div>
                {selectedType === 'villa' && (
                  <>
                    <FloatingInput
                      label="Description" id="f-node-desc"
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    />
                    <ImageUpload
                      value={form.backgroundImage}
                      onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
                      label="Villa Image (optional)"
                    />
                  </>
                )}
              </>
            )}

            {selectedType === 'apartment' && (
              <FloatingInput
                label="Entrance" id="f-node-entrance" type="number"
                value={form.entrance} min="1"
                onChange={(e) => setForm((f) => ({ ...f, entrance: e.target.value }))}
              />
            )}

            {selectedType === 'room' && (
              <>
                <FloatingInput
                  label="Area (m²)" id="f-node-area" type="number"
                  value={form.area} min="0"
                  onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                />
                <FloatingSelect
                  label="Room Type" id="f-node-roomtype"
                  value={form.roomType}
                  options={['living', 'bedroom', 'kitchen', 'bathroom', 'storage']}
                  onChange={(e) => setForm((f) => ({ ...f, roomType: e.target.value }))}
                />
                <ImageUpload
                  value={form.backgroundImage}
                  onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
                  label="Room Image (optional)"
                />
              </>
            )}

            {selectedType === 'balcony' && (
              <>
                <FloatingInput
                  label="Area (m²)" id="f-node-area" type="number"
                  value={form.area} min="0"
                  onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                />
                <ImageUpload
                  value={form.backgroundImage}
                  onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
                  label="Balcony Image (optional)"
                />
              </>
            )}
          </>
        )}
      </div>

      <div className="px-5 py-4 border-t border-[var(--border)] flex flex-col gap-2">
        <Button onClick={handleSave} disabled={!selectedType}>
          <Check size={16} strokeWidth={2.5} />
          Create {typeDef?.label || 'Entity'}
        </Button>
        <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
      </div>
    </div>
  );
});

export default NodeCreatePanel;
