import { useCallback } from 'react';

export function useSVGCoordinates(svgRef) {
  const screenToSVG = useCallback(
    (clientX, clientY) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM().inverse();
      const svgPt = pt.matrixTransform(ctm);
      return {
        x: Math.round(svgPt.x * 100) / 100,
        y: Math.round(svgPt.y * 100) / 100,
      };
    },
    [svgRef]
  );

  return { screenToSVG };
}
