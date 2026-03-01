import { memo, useCallback } from 'react';
import { Building2 } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import FloatingInput from '../../../components/ui/FloatingInput';
import ImageUpload from '../../../components/ui/ImageUpload';

const BuildingConfigPanel = memo(function BuildingConfigPanel() {
  const currentView = useEditorStore((s) => s.currentView);
  const building = useProjectStore((s) => s.buildings.find((b) => b.id === currentView.buildingId));
  const updateBuilding = useProjectStore((s) => s.updateBuilding);

  const handleChange = useCallback(
    (key, type = 'text') => (e) => {
      let val = e.target.value;
      if (type === 'number') val = parseInt(val) || 1;
      updateBuilding(currentView.buildingId, { [key]: val });
    },
    [updateBuilding, currentView.buildingId]
  );

  const handleImageChange = useCallback(
    (image) => {
      updateBuilding(currentView.buildingId, { backgroundImage: image });
    },
    [updateBuilding, currentView.buildingId]
  );

  if (!building) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold tracking-tight">Building Settings</h3>
        <span className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
          <Building2 size={14} />
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
        <SectionTitle>Building</SectionTitle>
        <FloatingInput
          label="Building Name" id="cfg-bldg-name"
          value={building.name} onChange={handleChange('name')}
        />
        <FloatingInput
          label="Description" id="cfg-bldg-desc"
          value={building.description || ''} onChange={handleChange('description')}
        />

        <SectionTitle>Procedural Facade</SectionTitle>
        <div className="grid grid-cols-2 gap-2.5">
          <FloatingInput
            label="Floors" id="cfg-bldg-floors" type="number"
            value={building.floors || 6} onChange={handleChange('floors', 'number')}
            min="1" max="30"
          />
          <FloatingInput
            label="Units / Floor" id="cfg-bldg-upf" type="number"
            value={building.unitsPerFloor || 4} onChange={handleChange('unitsPerFloor', 'number')}
            min="1" max="12"
          />
        </div>

        <SectionTitle>Background</SectionTitle>
        <ImageUpload
          value={building.backgroundImage}
          onChange={handleImageChange}
          label="Building Image"
        />
        <p className="text-[10px] text-[var(--text-tertiary)] -mt-2">
          Upload an image to replace the procedural facade
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

export default BuildingConfigPanel;
