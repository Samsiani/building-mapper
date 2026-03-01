import { STATUS } from './constants';

export const NODE_TYPES = {
  neighborhood: {
    label: 'Neighborhood',
    labelPlural: 'Neighborhoods',
    color: '#10b981',
    fill: 'rgba(16, 185, 129, 0.15)',
    fillHover: 'rgba(16, 185, 129, 0.35)',
    stroke: '#10b981',
    icon: 'MapPin',
    allowedChildren: ['phase', 'building', 'villa'],
    isLeaf: false,
    hasStatus: false,
    hasBackgroundImage: true,
    hasProceduralFallback: false,
    fields: [
      { key: 'name', label: 'Neighborhood Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'backgroundImage', label: 'Neighborhood Image', type: 'image' },
    ],
  },
  phase: {
    label: 'Phase',
    labelPlural: 'Phases',
    color: '#f97316',
    fill: 'rgba(249, 115, 22, 0.15)',
    fillHover: 'rgba(249, 115, 22, 0.35)',
    stroke: '#f97316',
    icon: 'FolderOpen',
    allowedChildren: ['building', 'villa'],
    isLeaf: false,
    hasStatus: false,
    hasBackgroundImage: true,
    hasProceduralFallback: false,
    fields: [
      { key: 'name', label: 'Phase Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'backgroundImage', label: 'Phase Image', type: 'image' },
    ],
  },
  villa: {
    label: 'Villa',
    labelPlural: 'Villas',
    // Color determined by status at render time
    color: null,
    fill: null,
    fillHover: null,
    stroke: null,
    icon: 'House',
    allowedChildren: ['floor'],
    isLeaf: false,
    hasStatus: true,
    hasBackgroundImage: true,
    hasProceduralFallback: false,
    fields: [
      { key: 'name', label: 'Villa Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'area', label: 'Area (m²)', type: 'number', min: 0 },
      { key: 'price', label: 'Price', type: 'number', min: 0, step: 1000 },
      { key: 'rooms', label: 'Rooms', type: 'number', min: 1, max: 20, default: 1 },
      { key: 'orientation', label: 'Orientation', type: 'select', options: 'ORIENTATIONS' },
      { key: 'balcony', label: 'Balcony', type: 'checkbox' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'backgroundImage', label: 'Villa Image', type: 'image' },
    ],
  },
  building: {
    label: 'Building',
    labelPlural: 'Buildings',
    color: '#6366f1',
    fill: 'rgba(99, 102, 241, 0.15)',
    fillHover: 'rgba(99, 102, 241, 0.35)',
    stroke: '#6366f1',
    icon: 'Building2',
    allowedChildren: ['floor'],
    isLeaf: false,
    hasStatus: false,
    hasBackgroundImage: true,
    hasProceduralFallback: true,
    fields: [
      { key: 'name', label: 'Building Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'floors', label: 'Floors', type: 'number', min: 1, max: 30, default: 6 },
      { key: 'unitsPerFloor', label: 'Units / Floor', type: 'number', min: 1, max: 12, default: 4 },
      { key: 'backgroundImage', label: 'Building Image', type: 'image' },
    ],
  },
  floor: {
    label: 'Floor',
    labelPlural: 'Floors',
    color: '#a855f7',
    fill: 'rgba(168, 85, 247, 0.15)',
    fillHover: 'rgba(168, 85, 247, 0.35)',
    stroke: '#a855f7',
    icon: 'Layers',
    allowedChildren: ['apartment', 'room', 'balcony'],
    isLeaf: false,
    hasStatus: false,
    hasBackgroundImage: true,
    hasProceduralFallback: false,
    fields: [
      { key: 'name', label: 'Floor Name', type: 'text', required: true },
      { key: 'floorNumber', label: 'Floor Number', type: 'number', min: 1, default: 1 },
      { key: 'backgroundImage', label: 'Floor Plan Image', type: 'image' },
    ],
  },
  apartment: {
    label: 'Apartment',
    labelPlural: 'Apartments',
    // Color determined by status at render time
    color: null,
    fill: null,
    fillHover: null,
    stroke: null,
    icon: 'Home',
    allowedChildren: ['room', 'balcony'],
    isLeaf: false,
    hasStatus: true,
    hasBackgroundImage: true,
    hasProceduralFallback: false,
    fields: [
      { key: 'name', label: 'Apartment Name', type: 'text', required: true },
      { key: 'area', label: 'Area (m²)', type: 'number', min: 0 },
      { key: 'price', label: 'Price', type: 'number', min: 0, step: 1000 },
      { key: 'rooms', label: 'Rooms', type: 'number', min: 1, max: 20, default: 1 },
      { key: 'orientation', label: 'Orientation', type: 'select', options: 'ORIENTATIONS' },
      { key: 'balcony', label: 'Balcony', type: 'checkbox' },
      { key: 'entrance', label: 'Entrance', type: 'number', min: 1, default: 1 },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'backgroundImage', label: 'Apartment Image', type: 'image' },
    ],
  },
  room: {
    label: 'Room',
    labelPlural: 'Rooms',
    color: '#3b82f6',
    fill: 'rgba(59, 130, 246, 0.15)',
    fillHover: 'rgba(59, 130, 246, 0.35)',
    stroke: '#3b82f6',
    icon: 'Square',
    allowedChildren: [],
    isLeaf: true,
    hasStatus: false,
    hasBackgroundImage: true,
    hasProceduralFallback: false,
    fields: [
      { key: 'name', label: 'Room Name', type: 'text', required: true },
      { key: 'area', label: 'Area (m²)', type: 'number', min: 0 },
      { key: 'roomType', label: 'Room Type', type: 'select', options: ['living', 'bedroom', 'kitchen', 'bathroom', 'storage'] },
      { key: 'backgroundImage', label: 'Room Image', type: 'image' },
    ],
  },
  balcony: {
    label: 'Balcony',
    labelPlural: 'Balconies',
    color: '#06b6d4',
    fill: 'rgba(6, 182, 212, 0.15)',
    fillHover: 'rgba(6, 182, 212, 0.35)',
    stroke: '#06b6d4',
    icon: 'Sun',
    allowedChildren: [],
    isLeaf: true,
    hasStatus: false,
    hasBackgroundImage: true,
    hasProceduralFallback: false,
    fields: [
      { key: 'name', label: 'Balcony Name', type: 'text', required: true },
      { key: 'area', label: 'Area (m²)', type: 'number', min: 0 },
      { key: 'backgroundImage', label: 'Balcony Image', type: 'image' },
    ],
  },
};

/**
 * Get rendering colors for a node. Status-bearing nodes use STATUS colors,
 * others use their fixed type colors.
 */
export function getNodeColors(node) {
  const typeDef = NODE_TYPES[node.type];
  if (!typeDef) return { fill: 'rgba(128,128,128,0.15)', fillHover: 'rgba(128,128,128,0.35)', stroke: '#888', color: '#888' };

  if (typeDef.hasStatus && node.status) {
    const s = STATUS[node.status] || STATUS.for_sale;
    return { fill: s.fill, fillHover: s.fillHover, stroke: s.stroke, color: s.color };
  }

  return {
    fill: typeDef.fill,
    fillHover: typeDef.fillHover,
    stroke: typeDef.stroke,
    color: typeDef.color,
  };
}

/**
 * What child types can be added under a given parent type?
 * parentType=null means root (project) level.
 * grandparentType is used for conditional children (e.g. floor under villa vs building).
 */
export function getAllowedChildTypes(parentType, grandparentType) {
  if (!parentType) return ['neighborhood', 'phase', 'building', 'villa'];

  if (parentType === 'floor') {
    if (grandparentType === 'villa') return ['room', 'balcony'];
    if (grandparentType === 'building') return ['apartment'];
    return ['apartment', 'room', 'balcony']; // fallback
  }

  return NODE_TYPES[parentType]?.allowedChildren || [];
}

/**
 * Can the user drill into this node type? (i.e. it has possible children)
 */
export function canDrillInto(type) {
  const typeDef = NODE_TYPES[type];
  return typeDef && !typeDef.isLeaf;
}
