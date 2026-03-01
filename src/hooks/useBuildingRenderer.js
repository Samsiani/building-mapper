import { useEffect } from 'react';
import { renderBuilding } from '../utils/buildingRenderer';

export function useBuildingRenderer(layerRef, defsRef, config, theme = 'dark') {
  useEffect(() => {
    if (!layerRef.current || !defsRef.current) return;
    renderBuilding(layerRef.current, defsRef.current, config, theme);
  }, [layerRef, defsRef, config, theme]);
}
