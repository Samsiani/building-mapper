import { useRef, useEffect, memo } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { renderBuilding } from '../../../utils/buildingRenderer';

const BackgroundLayer = memo(function BackgroundLayer({ theme }) {
  const currentView = useEditorStore((s) => s.currentView);
  const visible = useEditorStore((s) => s.buildingLayerVisible);

  const buildings = useProjectStore((s) => s.buildings);
  const floors = useProjectStore((s) => s.floors);
  const projectConfig = useProjectStore((s) => s.projectConfig);

  const layerRef = useRef(null);
  const defsRef = useRef(null);

  // Determine background image and building config for procedural fallback
  let backgroundImage = null;
  let proceduralConfig = null;

  if (currentView.level === 'global') {
    // Global level: no background by default (just grid)
    backgroundImage = null;
  } else if (currentView.level === 'building') {
    const building = buildings.find((b) => b.id === currentView.buildingId);
    if (building?.backgroundImage) {
      backgroundImage = building.backgroundImage;
    } else if (building) {
      // Fallback to procedural renderer
      proceduralConfig = {
        buildingName: building.name,
        floors: building.floors || 6,
        unitsPerFloor: building.unitsPerFloor || 4,
        companyName: projectConfig.companyName,
      };
    }
  } else if (currentView.level === 'floor') {
    const floor = floors.find((f) => f.id === currentView.floorId);
    if (floor?.backgroundImage) {
      backgroundImage = floor.backgroundImage;
    }
    // No procedural fallback for floor level
  }

  // Render procedural building when at building level with no image
  useEffect(() => {
    if (!layerRef.current || !defsRef.current) return;
    if (proceduralConfig) {
      renderBuilding(layerRef.current, defsRef.current, proceduralConfig, theme);
    } else {
      // Clear procedural content
      layerRef.current.innerHTML = '';
    }
  }, [proceduralConfig?.buildingName, proceduralConfig?.floors, proceduralConfig?.unitsPerFloor, proceduralConfig?.companyName, theme, currentView.level, currentView.buildingId]);

  return (
    <>
      <defs ref={defsRef} />
      {/* Background image */}
      {backgroundImage && (
        <image
          href={backgroundImage}
          x="0" y="0"
          width="100" height="100"
          preserveAspectRatio="xMidYMid meet"
          opacity={visible ? 1 : 0.15}
          style={{ transition: 'opacity 300ms' }}
        />
      )}
      {/* Procedural building renderer */}
      <g ref={layerRef} opacity={visible ? 1 : 0} style={{ transition: 'opacity 300ms' }} />
      {/* Subtle grid placeholder when no background at global/floor level */}
      {!backgroundImage && !proceduralConfig && (
        <g opacity="0.08">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="var(--text-tertiary, #666)" strokeWidth="0.1" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="var(--text-tertiary, #666)" strokeWidth="0.1" />
          ))}
        </g>
      )}
    </>
  );
});

export default BackgroundLayer;
