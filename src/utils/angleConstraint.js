/**
 * Constrain a candidate point to the nearest 45-degree angle increment from an anchor.
 * Snaps to 0/45/90/135/180/225/270/315 degrees, projecting at the same distance.
 */
export function constrainAngle(candidate, anchor) {
  const dx = candidate.x - anchor.x;
  const dy = candidate.y - anchor.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance === 0) return { x: anchor.x, y: anchor.y };

  const angle = Math.atan2(dy, dx);
  const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);

  return {
    x: Math.round((anchor.x + distance * Math.cos(snappedAngle)) * 100) / 100,
    y: Math.round((anchor.y + distance * Math.sin(snappedAngle)) * 100) / 100,
  };
}
