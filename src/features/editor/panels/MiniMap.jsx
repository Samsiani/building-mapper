import { memo, useRef, useEffect, useMemo } from 'react';
import { useProjectStore } from '../../../stores/projectStore';
import { useEditorStore } from '../../../stores/editorStore';
import { NODE_TYPES, getNodeColors } from '../../../utils/nodeTypes';
import { renderBuilding } from '../../../utils/buildingRenderer';

const MiniMap = memo(function MiniMap({ zoom }) {
  const layerRef = useRef(null);
  const defsRef = useRef(null);
  const currentView = useEditorStore((s) => s.currentView);
  const nodes = useProjectStore((s) => s.nodes);
  const projectConfig = useProjectStore((s) => s.projectConfig);
  const theme = useEditorStore((s) => s.editorTheme);

  // Determine what to show on minimap based on current parentId
  const { entities, proceduralConfig } = useMemo(() => {
    const children = nodes.filter((n) => n.parentId === currentView.parentId);

    let cfg = null;
    if (currentView.parentId !== null) {
      const parentNode = nodes.find((n) => n.id === currentView.parentId);
      if (parentNode) {
        const typeDef = NODE_TYPES[parentNode.type];
        if (typeDef?.hasProceduralFallback && !parentNode.backgroundImage) {
          cfg = {
            buildingName: parentNode.name,
            floors: parentNode.floors || 6,
            unitsPerFloor: parentNode.unitsPerFloor || 4,
            companyName: projectConfig.companyName,
          };
        }
      }
    }

    return { entities: children, proceduralConfig: cfg };
  }, [currentView.parentId, nodes, projectConfig]);

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
          const colors = getNodeColors(entity);
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
