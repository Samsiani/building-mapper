import { useRef, useEffect, memo } from 'react';
import { useEditorStore } from '../../../stores/editorStore';
import { useProjectStore } from '../../../stores/projectStore';
import { renderBuilding } from '../../../utils/buildingRenderer';
import { NODE_TYPES } from '../../../utils/nodeTypes';

const BackgroundLayer = memo(function BackgroundLayer({ theme }) {
  const currentView = useEditorStore((s) => s.currentView);
  const visible = useEditorStore((s) => s.buildingLayerVisible);
  const nodes = useProjectStore((s) => s.nodes);
  const projectConfig = useProjectStore((s) => s.projectConfig);

  const layerRef = useRef(null);
  const defsRef = useRef(null);

  // Determine background image and building config for procedural fallback
  let backgroundImage = null;
  let proceduralConfig = null;

  if (currentView.parentId === null) {
    // Root level — use site background
    backgroundImage = projectConfig.siteBackgroundImage || null;
  } else {
    // Inside a node — check the parent node
    const parentNode = nodes.find((n) => n.id === currentView.parentId);
    if (parentNode) {
      const typeDef = NODE_TYPES[parentNode.type];
      if (parentNode.backgroundImage) {
        backgroundImage = parentNode.backgroundImage;
      } else if (typeDef?.hasProceduralFallback) {
        proceduralConfig = {
          buildingName: parentNode.name,
          floors: parentNode.floors || 6,
          unitsPerFloor: parentNode.unitsPerFloor || 4,
          companyName: projectConfig.companyName,
        };
      }
    }
  }

  // Render procedural building when applicable
  useEffect(() => {
    if (!layerRef.current || !defsRef.current) return;
    if (proceduralConfig) {
      renderBuilding(layerRef.current, defsRef.current, proceduralConfig, theme);
    } else {
      layerRef.current.innerHTML = '';
    }
  }, [proceduralConfig?.buildingName, proceduralConfig?.floors, proceduralConfig?.unitsPerFloor, proceduralConfig?.companyName, theme, currentView.parentId]);

  return (
    <>
      <defs ref={defsRef} />
      {backgroundImage && (
        <image
          href={backgroundImage}
          x="0" y="0"
          width="100" height="100"
          preserveAspectRatio="xMidYMid slice"
          opacity={visible ? 1 : 0.15}
          style={{ transition: 'opacity 300ms' }}
        />
      )}
      <g ref={layerRef} opacity={visible ? 1 : 0} style={{ transition: 'opacity 300ms' }} />
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
