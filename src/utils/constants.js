export const STATUS = {
  available: {
    label: 'Available',
    color: '#22c55e',
    fill: 'rgba(34, 197, 94, 0.25)',
    fillHover: 'rgba(34, 197, 94, 0.50)',
    stroke: '#22c55e',
  },
  reserved: {
    label: 'Reserved',
    color: '#f59e0b',
    fill: 'rgba(245, 158, 11, 0.25)',
    fillHover: 'rgba(245, 158, 11, 0.50)',
    stroke: '#f59e0b',
  },
  sold: {
    label: 'Sold',
    color: '#ef4444',
    fill: 'rgba(239, 68, 68, 0.25)',
    fillHover: 'rgba(239, 68, 68, 0.50)',
    stroke: '#ef4444',
  },
};

export const ORIENTATIONS = ['North', 'South', 'East', 'West', 'NE', 'NW', 'SE', 'SW'];

export const DEFAULT_PROJECT_CONFIG = {
  projectName: 'Residence Azure',
  companyName: 'Azure Developments',
  companyTagline: 'Premium Living, Elevated Design',
  currency: 'EUR',
  contactPhone: '+30 210 123 4567',
  contactEmail: 'info@azure-dev.com',
};

// Backwards compat alias
export const DEFAULT_BUILDING_CONFIG = {
  ...DEFAULT_PROJECT_CONFIG,
  buildingName: DEFAULT_PROJECT_CONFIG.projectName,
  floors: 6,
  unitsPerFloor: 4,
};

export const SEED_BUILDINGS = [
  {
    id: 1,
    name: 'Building A',
    description: 'Main residential building',
    backgroundImage: null,
    points: [
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 50, y: 90 },
      { x: 10, y: 90 },
    ],
    // Procedural renderer config (used when backgroundImage is null)
    floors: 6,
    unitsPerFloor: 4,
  },
];

export const SEED_FLOORS = [
  {
    id: 2,
    buildingId: 1,
    floorNumber: 1,
    name: 'Ground Floor',
    backgroundImage: null,
    points: [
      { x: 15, y: 78 },
      { x: 85, y: 78 },
      { x: 85, y: 92 },
      { x: 15, y: 92 },
    ],
  },
  {
    id: 3,
    buildingId: 1,
    floorNumber: 2,
    name: 'Floor 2',
    backgroundImage: null,
    points: [
      { x: 15, y: 64 },
      { x: 85, y: 64 },
      { x: 85, y: 76 },
      { x: 15, y: 76 },
    ],
  },
  {
    id: 4,
    buildingId: 1,
    floorNumber: 3,
    name: 'Floor 3',
    backgroundImage: null,
    points: [
      { x: 15, y: 50 },
      { x: 85, y: 50 },
      { x: 85, y: 62 },
      { x: 15, y: 62 },
    ],
  },
];

export const SEED_UNITS = [
  {
    id: 5,
    floorId: 2,
    name: 'Unit A-101',
    area: 85,
    price: 245000,
    rooms: 3,
    balcony: true,
    orientation: 'South',
    status: 'available',
    notes: 'Corner unit with sea view',
    points: [
      { x: 16, y: 78 },
      { x: 32, y: 78 },
      { x: 32, y: 91 },
      { x: 16, y: 91 },
    ],
  },
  {
    id: 6,
    floorId: 3,
    name: 'Unit A-102',
    area: 110,
    price: 320000,
    rooms: 4,
    balcony: true,
    orientation: 'East',
    status: 'reserved',
    notes: 'Penthouse duplex',
    points: [
      { x: 34, y: 23 },
      { x: 49, y: 23 },
      { x: 49, y: 34.5 },
      { x: 42, y: 34.5 },
      { x: 34, y: 30 },
    ],
  },
  {
    id: 7,
    floorId: 2,
    name: 'Unit B-201',
    area: 65,
    price: 185000,
    rooms: 2,
    balcony: false,
    orientation: 'West',
    status: 'sold',
    notes: '',
    points: [
      { x: 51, y: 64.5 },
      { x: 66, y: 64.5 },
      { x: 66, y: 75.5 },
      { x: 51, y: 75.5 },
    ],
  },
  {
    id: 8,
    floorId: 4,
    name: 'Unit B-202',
    area: 95,
    price: 275000,
    rooms: 3,
    balcony: true,
    orientation: 'NW',
    status: 'available',
    notes: 'Garden level with patio',
    points: [
      { x: 16, y: 51 },
      { x: 49, y: 51 },
      { x: 49, y: 62 },
      { x: 32, y: 62 },
      { x: 16, y: 58 },
    ],
  },
];

export const TOOLS = [
  { id: 'select', label: 'Select', key: 'V' },
  { id: 'pen', label: 'Pen', key: 'P' },
  { id: 'edit', label: 'Edit', key: 'E' },
  { id: 'hand', label: 'Hand', key: 'H' },
  { id: 'measure', label: 'Measure', key: 'M' },
];

// Building geometry constants (inside 0 0 100 100 viewBox)
export const BUILDING = {
  LEFT: 15,
  RIGHT: 85,
  TOP: 8,
  BOTTOM: 92,
  get WIDTH() { return this.RIGHT - this.LEFT; },
  get HEIGHT() { return this.BOTTOM - this.TOP; },
};
