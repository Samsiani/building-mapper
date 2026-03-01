import { memo, useCallback, useMemo } from 'react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { NODE_TYPES } from '../../../utils/nodeTypes';
import { STATUS, ORIENTATIONS } from '../../../utils/constants';
import FloatingInput from '../../../components/ui/FloatingInput';
import FloatingSelect from '../../../components/ui/FloatingSelect';
import Checkbox from '../../../components/ui/Checkbox';
import StatusSegmentedControl from '../../../components/ui/StatusSegmentedControl';
import RoomSchemaRepeater from '../../../components/ui/RoomSchemaRepeater';
import ImageUpload from '../../../components/ui/ImageUpload';

const NodeConfigPanel = memo(function NodeConfigPanel() {
  const currentView = useEditorStore((s) => s.currentView);
  const nodes = useProjectStore((s) => s.nodes);
  const updateNode = useProjectStore((s) => s.updateNode);

  const parentNode = nodes.find((n) => n.id === currentView.parentId);
  const typeDef = parentNode ? NODE_TYPES[parentNode.type] : null;

  const children = useMemo(
    () => nodes.filter((n) => n.parentId === currentView.parentId),
    [nodes, currentView.parentId]
  );

  // Stats for apartment children
  const apartmentChildren = useMemo(
    () => children.filter((c) => NODE_TYPES[c.type]?.hasStatus),
    [children]
  );

  const handleChange = useCallback(
    (key, type = 'text') => (e) => {
      let val = e.target.value;
      if (type === 'number') val = parseInt(val) || 1;
      updateNode(currentView.parentId, { [key]: val });
    },
    [updateNode, currentView.parentId]
  );

  const handleFloatChange = useCallback(
    (key) => (e) => {
      updateNode(currentView.parentId, { [key]: parseFloat(e.target.value) || 0 });
    },
    [updateNode, currentView.parentId]
  );

  const handleCheckboxChange = useCallback(
    (key) => (e) => {
      updateNode(currentView.parentId, { [key]: e.target.checked });
    },
    [updateNode, currentView.parentId]
  );

  const handleDirectChange = useCallback(
    (key, val) => {
      updateNode(currentView.parentId, { [key]: val });
    },
    [updateNode, currentView.parentId]
  );

  const handleImageChange = useCallback(
    (image) => {
      updateNode(currentView.parentId, { backgroundImage: image });
    },
    [updateNode, currentView.parentId]
  );

  if (!parentNode || !typeDef) return null;

  const statusDef = typeDef.hasStatus ? (STATUS[parentNode.status] || STATUS.for_sale) : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">{typeDef.label} Settings</h3>
        {statusDef ? (
          <span
            className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{ color: statusDef.color, background: `color-mix(in srgb, ${statusDef.color} 14%, transparent)` }}
          >
            {statusDef.label}
          </span>
        ) : (
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: typeDef.color || 'var(--text-tertiary)' }}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
        <SectionTitle>{typeDef.label}</SectionTitle>
        <FloatingInput
          label={`${typeDef.label} Name`} id="cfg-node-name"
          value={parentNode.name} onChange={handleChange('name')}
        />

        {(parentNode.type === 'neighborhood' || parentNode.type === 'phase' || parentNode.type === 'villa') && (
          <FloatingInput
            label="Description" id="cfg-node-desc"
            value={parentNode.description || ''} onChange={handleChange('description')}
          />
        )}

        {(parentNode.type === 'phase' || parentNode.type === 'villa') && (
          <FloatingInput
            label="Completion Date" id="cfg-node-compdate"
            value={parentNode.completionDate || ''} onChange={handleChange('completionDate')}
          />
        )}

        {parentNode.type === 'building' && (
          <>
            <FloatingInput
              label="Description" id="cfg-node-desc"
              value={parentNode.description || ''} onChange={handleChange('description')}
            />
            <FloatingInput
              label="Completion Date" id="cfg-node-compdate"
              value={parentNode.completionDate || ''} onChange={handleChange('completionDate')}
            />
            <SectionTitle>Procedural Facade</SectionTitle>
            <div className="grid grid-cols-2 gap-2.5">
              <FloatingInput
                label="Floors" id="cfg-node-floors" type="number"
                value={parentNode.floors || 6} onChange={handleChange('floors', 'number')}
                min="1" max="30"
              />
              <FloatingInput
                label="Units / Floor" id="cfg-node-upf" type="number"
                value={parentNode.unitsPerFloor || 4} onChange={handleChange('unitsPerFloor', 'number')}
                min="1" max="12"
              />
            </div>
          </>
        )}

        {parentNode.type === 'floor' && (
          <FloatingInput
            label="Floor Number" id="cfg-node-fnum" type="number"
            value={parentNode.floorNumber || 1} onChange={handleChange('floorNumber', 'number')}
            min="1"
          />
        )}

        {/* Apartment / Villa specs */}
        {typeDef.hasStatus && (
          <>
            <SectionTitle>Specifications</SectionTitle>
            <div className="grid grid-cols-2 gap-2.5">
              <FloatingInput
                label="Area (m²)" id="cfg-node-area" type="number"
                value={parentNode.area || 0} min="0"
                onChange={handleFloatChange('area')}
              />
              <FloatingInput
                label="Price (€)" id="cfg-node-price" type="number"
                value={parentNode.price || 0} min="0" step="1000"
                onChange={handleFloatChange('price')}
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <FloatingInput
                label="Rooms" id="cfg-node-rooms" type="number"
                value={parentNode.rooms || 1} min="1" max="20"
                onChange={handleChange('rooms', 'number')}
              />
              <FloatingSelect
                label="Orientation" id="cfg-node-orient"
                value={parentNode.orientation || 'North'} options={ORIENTATIONS}
                onChange={handleChange('orientation')}
              />
            </div>
            {parentNode.type === 'apartment' && (
              <FloatingInput
                label="Entrance" id="cfg-node-entrance" type="number"
                value={parentNode.entrance || 1} min="1"
                onChange={handleChange('entrance', 'number')}
              />
            )}
            <Checkbox
              label="Balcony"
              checked={parentNode.balcony || false}
              onChange={handleCheckboxChange('balcony')}
            />
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2 block">
                Status
              </label>
              <StatusSegmentedControl
                value={parentNode.status || 'for_sale'}
                onChange={(status) => handleDirectChange('status', status)}
              />
            </div>
            <div className="floating-input">
              <textarea
                id="cfg-node-notes" placeholder=" " rows="3"
                value={parentNode.notes || ''}
                onChange={handleChange('notes')}
              />
              <label htmlFor="cfg-node-notes">Notes</label>
            </div>
            {parentNode.type === 'apartment' && (
              <RoomSchemaRepeater
                value={parentNode.roomSchema || []}
                onChange={(rs) => handleDirectChange('roomSchema', rs)}
              />
            )}
          </>
        )}

        {typeDef.hasBackgroundImage && (
          <>
            <SectionTitle>Background</SectionTitle>
            <ImageUpload
              value={parentNode.backgroundImage}
              onChange={handleImageChange}
              label={`${typeDef.label} Image`}
            />
            {parentNode.type === 'building' && (
              <p className="text-[10px] text-[var(--text-tertiary)] -mt-2">
                Upload an image to replace the procedural facade
              </p>
            )}
          </>
        )}

        {/* Child summary */}
        <SectionTitle>Children</SectionTitle>
        {children.length === 0 ? (
          <p className="text-[11px] text-[var(--text-tertiary)]">
            No children yet. Use the Pen tool to draw.
          </p>
        ) : (
          <>
            {/* Group children by type */}
            {Object.entries(
              children.reduce((acc, c) => {
                const t = c.type;
                if (!acc[t]) acc[t] = 0;
                acc[t]++;
                return acc;
              }, {})
            ).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center text-[12px]">
                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: NODE_TYPES[type]?.color || '#888' }}
                  />
                  {NODE_TYPES[type]?.labelPlural || type}
                </span>
                <span className="text-[var(--text-primary)] font-semibold">{count}</span>
              </div>
            ))}
          </>
        )}

        {/* Apartment status summary */}
        {apartmentChildren.length > 0 && (
          <>
            <SectionTitle>Status Summary</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(STATUS).map(([key, s]) => {
                const count = apartmentChildren.filter((c) => c.status === key).length;
                return (
                  <StatBox key={key} label={s.label} value={count} color={s.color} />
                );
              })}
            </div>
          </>
        )}
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

export default NodeConfigPanel;
