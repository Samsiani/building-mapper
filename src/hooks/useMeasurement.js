import { useState, useCallback } from 'react';

export function useMeasurement() {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const addPoint = useCallback(
    (pt) => {
      if (!startPoint) {
        setStartPoint(pt);
        setIsActive(true);
      } else {
        setEndPoint(pt);
      }
    },
    [startPoint]
  );

  const reset = useCallback(() => {
    setStartPoint(null);
    setEndPoint(null);
    setIsActive(false);
  }, []);

  const distance =
    startPoint && endPoint
      ? Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2))
      : null;

  return { startPoint, endPoint, distance, isActive, addPoint, reset };
}
