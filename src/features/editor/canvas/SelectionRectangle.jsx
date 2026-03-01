import { memo } from 'react';

const SelectionRectangle = memo(function SelectionRectangle({ rect, svgRef }) {
  if (!rect || !svgRef.current) return null;

  // Convert SVG coordinates to screen coordinates for the overlay
  // The rect is already in SVG space, render it inside the SVG
  return null; // Will be rendered inside MasterplanSVG instead
});

export default SelectionRectangle;
