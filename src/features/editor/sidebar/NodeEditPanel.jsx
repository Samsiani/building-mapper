import { memo, useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { useToastStore } from '../../../stores/toastStore';
import { NODE_TYPES } from '../../../utils/nodeTypes';
import { ORIENTATIONS } from '../../../utils/constants';
import FloatingInput from '../../../components/ui/FloatingInput';
import FloatingSelect from '../../../components/ui/FloatingSelect';
import Checkbox from '../../../components/ui/Checkbox';
import StatusSegmentedControl from '../../../components/ui/StatusSegmentedControl';
import ImageUpload from '../../../components/ui/ImageUpload';
import Button from '../../../components/ui/Button';
import ConfirmButton from '../../../components/ui/ConfirmButton';

const NodeEditPanel = memo(function NodeEditPanel() {
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const node = useProjectStore((s) => s.nodes.find((n) => n.id === selectedNodeId));
  const updateNode = useProjectStore((s) => s.updateNode);
  const removeNode = useProjectStore((s) => s.removeNode);
  const deselectNode = useEditorStore((s) => s.deselectNode);
  const toast = useToastStore((s) => s.show);

  const typeDef = node ? NODE_TYPES[node.type] : null;

  const [form, setForm] = useState({});

  useEffect(() => {
    if (node) {
      setForm({
        name: node.name || '',
        description: node.description || '',
        area: node.area || 0,
        price: node.price || 0,
        rooms: node.rooms || 1,
        balcony: node.balcony || false,
        orientation: node.orientation || 'North',
        status: node.status || 'for_sale',
        notes: node.notes || '',
        floorNumber: node.floorNumber || 1,
        floors: node.floors || 6,
        unitsPerFloor: node.unitsPerFloor || 4,
        backgroundImage: node.backgroundImage || null,
        roomType: node.roomType || 'living',
        entrance: node.entrance || 1,
      });
    }
  }, [node]);

  const handleSave = useCallback(() => {
    if (!form.name.trim()) {
      toast(`${typeDef?.label || 'Entity'} name is required`, 'warning');
      return;
    }

    const data = { name: form.name };

    if (node.type === 'neighborhood' || node.type === 'phase') {
      data.description = form.description;
    }

    if (node.type === 'villa') {
      data.description = form.description;
    }

    if (node.type === 'building') {
      data.description = form.description;
      data.floors = parseInt(form.floors) || 6;
      data.unitsPerFloor = parseInt(form.unitsPerFloor) || 4;
    }

    if (node.type === 'floor') {
      data.floorNumber = parseInt(form.floorNumber) || 1;
    }

    if (typeDef?.hasStatus) {
      data.area = parseFloat(form.area) || 0;
      data.price = parseFloat(form.price) || 0;
      data.rooms = parseInt(form.rooms) || 1;
      data.balcony = form.balcony;
      data.orientation = form.orientation;
      data.status = form.status;
      data.notes = form.notes;
    }

    if (node.type === 'apartment') {
      data.entrance = parseInt(form.entrance) || 1;
    }

    if (node.type === 'room') {
      data.area = parseFloat(form.area) || 0;
      data.roomType = form.roomType;
    }

    if (node.type === 'balcony') {
      data.area = parseFloat(form.area) || 0;
    }

    // Universal background image for all types
    data.backgroundImage = form.backgroundImage;

    updateNode(selectedNodeId, data);
    toast(`${typeDef?.label || 'Entity'} updated successfully`, 'success');
  }, [form, selectedNodeId, node, typeDef, updateNode, toast]);

  const handleDelete = useCallback(() => {
    const name = node?.name || typeDef?.label || 'Item';
    removeNode(selectedNodeId);
    deselectNode();
    toast(`${name} deleted`, 'info');
  }, [selectedNodeId, node, typeDef, removeNode, deselectNode, toast]);

  if (!node || !typeDef) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">{typeDef.label} Properties</h3>
        <span className="font-[var(--font-mono)] text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-[var(--radius-sm)]">
          #{selectedNodeId}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
        <FloatingInput
          label={`${typeDef.label} Name`} id="f-edit-name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />

        {(node.type === 'neighborhood' || node.type === 'phase') && (
          <>
            <FloatingInput
              label="Description" id="f-edit-desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <ImageUpload
              value={form.backgroundImage}
              onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
              label={`${typeDef.label} Image`}
            />
          </>
        )}

        {node.type === 'building' && (
          <>
            <FloatingInput
              label="Description" id="f-edit-desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <FloatingInput
                label="Floors" id="f-edit-floors" type="number"
                value={form.floors} min="1" max="30"
                onChange={(e) => setForm((f) => ({ ...f, floors: e.target.value }))}
              />
              <FloatingInput
                label="Units / Floor" id="f-edit-upf" type="number"
                value={form.unitsPerFloor} min="1" max="12"
                onChange={(e) => setForm((f) => ({ ...f, unitsPerFloor: e.target.value }))}
              />
            </div>
            <ImageUpload
              value={form.backgroundImage}
              onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
              label="Building Image"
            />
          </>
        )}

        {node.type === 'floor' && (
          <>
            <FloatingInput
              label="Floor Number" id="f-edit-fnum" type="number"
              value={form.floorNumber} min="1"
              onChange={(e) => setForm((f) => ({ ...f, floorNumber: e.target.value }))}
            />
            <ImageUpload
              value={form.backgroundImage}
              onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
              label="Floor Plan Image"
            />
          </>
        )}

        {typeDef.hasStatus && (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <FloatingInput
                label="Area (m²)" id="f-edit-area" type="number"
                value={form.area} min="0"
                onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              />
              <FloatingInput
                label="Price (€)" id="f-edit-price" type="number"
                value={form.price} min="0" step="1000"
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <FloatingInput
                label="Rooms" id="f-edit-rooms" type="number"
                value={form.rooms} min="1" max="20"
                onChange={(e) => setForm((f) => ({ ...f, rooms: e.target.value }))}
              />
              <FloatingSelect
                label="Orientation" id="f-edit-orient"
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
                id="f-edit-notes" placeholder=" " rows="3"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
              <label htmlFor="f-edit-notes">Notes</label>
            </div>
            {node.type === 'villa' && (
              <>
                <FloatingInput
                  label="Description" id="f-edit-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                <ImageUpload
                  value={form.backgroundImage}
                  onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
                  label="Villa Image"
                />
              </>
            )}
          </>
        )}

        {node.type === 'apartment' && (
          <FloatingInput
            label="Entrance" id="f-edit-entrance" type="number"
            value={form.entrance} min="1"
            onChange={(e) => setForm((f) => ({ ...f, entrance: e.target.value }))}
          />
        )}

        {node.type === 'room' && (
          <>
            <FloatingInput
              label="Area (m²)" id="f-edit-area" type="number"
              value={form.area} min="0"
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
            />
            <FloatingSelect
              label="Room Type" id="f-edit-roomtype"
              value={form.roomType}
              options={['living', 'bedroom', 'kitchen', 'bathroom', 'storage']}
              onChange={(e) => setForm((f) => ({ ...f, roomType: e.target.value }))}
            />
            <ImageUpload
              value={form.backgroundImage}
              onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
              label="Room Image"
            />
          </>
        )}

        {node.type === 'balcony' && (
          <>
            <FloatingInput
              label="Area (m²)" id="f-edit-area" type="number"
              value={form.area} min="0"
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
            />
            <ImageUpload
              value={form.backgroundImage}
              onChange={(img) => setForm((f) => ({ ...f, backgroundImage: img }))}
              label="Balcony Image"
            />
          </>
        )}
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

export default NodeEditPanel;
