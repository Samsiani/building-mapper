import { useState, useCallback, useRef, useEffect } from 'react';

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.15;

export function usePanZoom(containerRef) {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);

  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const panXRef = useRef(0);
  const panYRef = useRef(0);

  // Keep refs in sync
  zoomRef.current = zoom;
  panXRef.current = panX;
  panYRef.current = panY;

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  const startPan = useCallback((clientX, clientY) => {
    setIsPanning(true);
    panStart.current = { x: clientX, y: clientY };
    panOrigin.current = { x: panXRef.current, y: panYRef.current };
  }, []);

  const onPanMove = useCallback((clientX, clientY) => {
    setPanX(panOrigin.current.x + (clientX - panStart.current.x));
    setPanY(panOrigin.current.y + (clientY - panStart.current.y));
  }, []);

  const endPan = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Wheel zoom (Ctrl/Cmd + scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const dir = e.deltaY < 0 ? 1 : -1;
        setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + dir * ZOOM_STEP)));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [containerRef]);

  const transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;

  return {
    zoom,
    panX,
    panY,
    isPanning,
    transform,
    zoomIn,
    zoomOut,
    resetView,
    startPan,
    onPanMove,
    endPan,
  };
}
