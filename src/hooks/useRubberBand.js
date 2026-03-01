import { useState, useCallback, useRef } from 'react';

export function useRubberBand(svgRef, units) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [rect, setRect] = useState(null);
  const startPoint = useRef(null);

  const startSelection = useCallback(
    (clientX, clientY) => {
      if (!svgRef.current) return;
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM().inverse();
      const svgPt = pt.matrixTransform(ctm);
      startPoint.current = { x: svgPt.x, y: svgPt.y };
      setIsSelecting(true);
      setRect({ x: svgPt.x, y: svgPt.y, width: 0, height: 0 });
    },
    [svgRef]
  );

  const updateSelection = useCallback(
    (clientX, clientY) => {
      if (!isSelecting || !startPoint.current || !svgRef.current) return;
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM().inverse();
      const svgPt = pt.matrixTransform(ctm);
      const sp = startPoint.current;

      setRect({
        x: Math.min(sp.x, svgPt.x),
        y: Math.min(sp.y, svgPt.y),
        width: Math.abs(svgPt.x - sp.x),
        height: Math.abs(svgPt.y - sp.y),
      });
    },
    [isSelecting, svgRef]
  );

  const endSelection = useCallback(() => {
    if (!rect || !units) {
      setIsSelecting(false);
      setRect(null);
      startPoint.current = null;
      return [];
    }

    // Find units whose centroid is inside the selection rect
    const selectedIds = units
      .filter((unit) => {
        if (!unit.points || unit.points.length === 0) return false;
        const cx = unit.points.reduce((s, p) => s + p.x, 0) / unit.points.length;
        const cy = unit.points.reduce((s, p) => s + p.y, 0) / unit.points.length;
        return (
          cx >= rect.x &&
          cx <= rect.x + rect.width &&
          cy >= rect.y &&
          cy <= rect.y + rect.height
        );
      })
      .map((u) => u.id);

    setIsSelecting(false);
    setRect(null);
    startPoint.current = null;
    return selectedIds;
  }, [rect, units]);

  return { isSelecting, rect, startSelection, updateSelection, endSelection };
}
