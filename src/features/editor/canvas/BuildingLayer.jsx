import { useRef, useEffect, memo } from 'react';
import { renderBuilding } from '../../../utils/buildingRenderer';
import { useEditorStore } from '../../../stores/editorStore';

const BuildingLayer = memo(function BuildingLayer({ config, theme }) {
  const layerRef = useRef(null);
  const defsRef = useRef(null);
  const visible = useEditorStore((s) => s.buildingLayerVisible);

  useEffect(() => {
    if (!layerRef.current || !defsRef.current) return;
    renderBuilding(layerRef.current, defsRef.current, config, theme);
  }, [config, theme]);

  return (
    <>
      <defs ref={defsRef} />
      <g ref={layerRef} opacity={visible ? 1 : 0} style={{ transition: 'opacity 300ms' }} />
    </>
  );
});

export default BuildingLayer;
