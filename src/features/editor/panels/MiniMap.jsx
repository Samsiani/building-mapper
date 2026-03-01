import { memo, useRef, useEffect, useMemo } from 'react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { renderBuilding } from '../../../utils/buildingRenderer';
import { STATUS } from '../../../utils/constants';

const ENTITY_COLORS = {
  building: { fill: 'rgba(99, 102, 241, 0.25)', stroke: '#6366f1' },
  floor: { fill: 'rgba(168, 85, 247, 0.25)', stroke: '#a855f7' },
};

const MiniMap = memo(function MiniMap({ zoom }) {
  const layerRef = useRef(null);
  const defsRef = useRef(null);
  const currentView = useEditorStore((s) => s.currentView);
  const buildings = useProjectStore((s) => s.buildings);
  const floors = useProjectStore((s) => s.floors);
  const units = useProjectStore((s) => s.units);
  const projectConfig = useProjectStore((s) => s.projectConfig);
  const theme = useEditorStore((s) => s.editorTheme);

  // Determine what to show on minimap based on level
  const { entities, entityType, proceduralConfig } = useMemo(() => {
    if (currentView.level === 'global') {
      return { entities: buildings, entityType: 'building', proceduralConfig: null };
    }
    if (currentView.level === 'building') {
      const building = buildings.find((b) => b.id === currentView.buildingId);
      const cfg = building && !building.backgroundImage ? {
        buildingName: building.name,
        floors: building.floors || 6,
        unitsPerFloor: building.unitsPerFloor || 4,
        companyName: projectConfig.companyName,
      } : null;
      return {
        entities: floors.filter((f) => f.buildingId === currentView.buildingId),
        entityType: 'floor',
        proceduralConfig: cfg,
      };
    }
    return {
      entities: units.filter((u) => u.floorId === currentView.floorId),
      entityType: 'unit',
      proceduralConfig: null,
    };
  }, [currentView, buildings, floors, units, projectConfig]);

  // Only show when zoomed in
  if (zoom < 1.5) return null;

  return (
    <div className="absolute bottom-14 right-4 z-50 w-[120px] h-[120px] bg-[var(--bg-glass)] backdrop-blur-[12px] border border-[var(--border)] rounded-[var(--radius-md)] shadow-lg overflow-hidden">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs ref={defsRef} />
        <g ref={layerRef} />
        {proceduralConfig && (
          <MiniMapBuilding layerRef={layerRef} defsRef={defsRef} config={proceduralConfig} theme={theme} />
        )}
        {entities.map((entity) => {
          if (!entity.points || entity.points.length < 3) return null;
          const pts = entity.points.map((p) => `${p.x},${p.y}`).join(' ');
          if (entityType === 'unit') {
            const status = STATUS[entity.status] || STATUS.available;
            return <polygon key={entity.id} points={pts} fill={status.fill} stroke={status.stroke} strokeWidth="0.8" />;
          }
          const colors = ENTITY_COLORS[entityType];
          return <polygon key={entity.id} points={pts} fill={colors.fill} stroke={colors.stroke} strokeWidth="0.8" />;
        })}
        <rect
          x={50 - 50 / zoom} y={50 - 50 / zoom}
          width={100 / zoom} height={100 / zoom}
          fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3,2" opacity="0.6"
        />
      </svg>
    </div>
  );
});

function MiniMapBuilding({ layerRef, defsRef, config, theme }) {
  useEffect(() => {
    if (layerRef.current && defsRef.current) {
      renderBuilding(layerRef.current, defsRef.current, config, theme);
    }
  }, [layerRef, defsRef, config, theme]);
  return null;
}

export default MiniMap;
