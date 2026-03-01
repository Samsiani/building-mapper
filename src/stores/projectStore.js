import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  DEFAULT_PROJECT_CONFIG,
  DEFAULT_BUILDING_CONFIG,
  SEED_BUILDINGS,
  SEED_FLOORS,
  SEED_UNITS,
} from '../utils/constants';

const MAX_HISTORY = 30;

export const useProjectStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // ─── Project-level config (company/global) ───
        projectConfig: { ...DEFAULT_PROJECT_CONFIG },

        // ─── Hierarchical entities ───
        buildings: [...SEED_BUILDINGS],
        floors: [...SEED_FLOORS],
        units: [...SEED_UNITS],

        annotations: [],
        nextId: 9, // after seed IDs 1-8
        history: [_serializeState(SEED_BUILDINGS, SEED_FLOORS, SEED_UNITS)],
        historyIndex: 0,

        // ─── Project Config ───
        updateProjectConfig: (data) =>
          set((state) => {
            Object.assign(state.projectConfig, data);
          }),

        // Backwards-compat helper (not a getter — call via get())
        getBuildingConfig: () => {
          const pc = get().projectConfig;
          const b = get().buildings[0];
          return {
            buildingName: b?.name || pc.projectName,
            floors: b?.floors || 6,
            unitsPerFloor: b?.unitsPerFloor || 4,
            companyName: pc.companyName,
            companyTagline: pc.companyTagline,
            currency: pc.currency,
            contactPhone: pc.contactPhone,
            contactEmail: pc.contactEmail,
          };
        },

        // ─── Buildings CRUD ───
        createBuilding: (data) => {
          let newBuilding;
          set((state) => {
            newBuilding = {
              id: state.nextId,
              name: data.name || `Building ${state.nextId}`,
              description: data.description || '',
              backgroundImage: data.backgroundImage || null,
              points: data.points || [],
              floors: data.floors || 6,
              unitsPerFloor: data.unitsPerFloor || 4,
            };
            state.buildings.push(newBuilding);
            state.nextId++;
            _snapshot(state);
          });
          return get().buildings.find((b) => b.id === newBuilding.id);
        },

        updateBuilding: (id, data) =>
          set((state) => {
            const building = state.buildings.find((b) => b.id === id);
            if (!building) return;
            Object.assign(building, data);
            _snapshot(state);
          }),

        removeBuilding: (id) =>
          set((state) => {
            // Cascade: remove floors and their units
            const floorIds = state.floors.filter((f) => f.buildingId === id).map((f) => f.id);
            state.units = state.units.filter((u) => !floorIds.includes(u.floorId));
            state.floors = state.floors.filter((f) => f.buildingId !== id);
            state.buildings = state.buildings.filter((b) => b.id !== id);
            _snapshot(state);
          }),

        updateBuildingPoints: (id, points) =>
          set((state) => {
            const building = state.buildings.find((b) => b.id === id);
            if (!building) return;
            building.points = points;
            _snapshot(state);
          }),

        // ─── Floors CRUD ───
        createFloor: (data) => {
          let newFloor;
          set((state) => {
            newFloor = {
              id: state.nextId,
              buildingId: data.buildingId,
              floorNumber: data.floorNumber || 1,
              name: data.name || `Floor ${data.floorNumber || state.nextId}`,
              backgroundImage: data.backgroundImage || null,
              points: data.points || [],
            };
            state.floors.push(newFloor);
            state.nextId++;
            _snapshot(state);
          });
          return get().floors.find((f) => f.id === newFloor.id);
        },

        updateFloor: (id, data) =>
          set((state) => {
            const floor = state.floors.filter((f) => f.id === id)[0];
            if (!floor) return;
            Object.assign(floor, data);
            _snapshot(state);
          }),

        removeFloor: (id) =>
          set((state) => {
            // Cascade: remove units belonging to this floor
            state.units = state.units.filter((u) => u.floorId !== id);
            state.floors = state.floors.filter((f) => f.id !== id);
            _snapshot(state);
          }),

        updateFloorPoints: (id, points) =>
          set((state) => {
            const floor = state.floors.find((f) => f.id === id);
            if (!floor) return;
            floor.points = points;
            _snapshot(state);
          }),

        // ─── Helpers ───
        getBuildingFloors: (buildingId) => get().floors.filter((f) => f.buildingId === buildingId),
        getFloorUnits: (floorId) => get().units.filter((u) => u.floorId === floorId),

        // ─── Units CRUD ───
        createUnit: (data) => {
          let newUnit;
          set((state) => {
            newUnit = {
              id: state.nextId,
              floorId: data.floorId || null,
              name: data.name || `Unit ${state.nextId}`,
              area: data.area || 0,
              price: data.price || 0,
              rooms: data.rooms || 1,
              balcony: data.balcony || false,
              orientation: data.orientation || 'North',
              status: data.status || 'available',
              notes: data.notes || '',
              points: data.points || [],
            };
            state.units.push(newUnit);
            state.nextId++;
            _snapshot(state);
          });
          return get().units.find((u) => u.id === newUnit.id);
        },

        updateUnit: (id, data) =>
          set((state) => {
            const unit = state.units.find((u) => u.id === id);
            if (!unit) return;
            Object.assign(unit, data);
            _snapshot(state);
          }),

        removeUnit: (id) =>
          set((state) => {
            const idx = state.units.findIndex((u) => u.id === id);
            if (idx === -1) return;
            state.units.splice(idx, 1);
            _snapshot(state);
          }),

        updateUnitPoints: (id, points) =>
          set((state) => {
            const unit = state.units.find((u) => u.id === id);
            if (!unit) return;
            unit.points = points;
            _snapshot(state);
          }),

        bulkUpdateStatus: (ids, status) =>
          set((state) => {
            ids.forEach((id) => {
              const unit = state.units.find((u) => u.id === id);
              if (unit) unit.status = status;
            });
            _snapshot(state);
          }),

        bulkRemove: (ids) =>
          set((state) => {
            state.units = state.units.filter((u) => !ids.includes(u.id));
            _snapshot(state);
          }),

        // ─── Annotations ───
        addAnnotation: (annotation) =>
          set((state) => {
            state.annotations.push({
              id: Date.now(),
              ...annotation,
            });
          }),

        updateAnnotation: (id, data) =>
          set((state) => {
            const ann = state.annotations.find((a) => a.id === id);
            if (ann) Object.assign(ann, data);
          }),

        removeAnnotation: (id) =>
          set((state) => {
            state.annotations = state.annotations.filter((a) => a.id !== id);
          }),

        // ─── History ───
        undo: () => {
          const { historyIndex } = get();
          if (historyIndex <= 0) return false;
          set((state) => {
            state.historyIndex--;
            const snap = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
            state.buildings = snap.buildings;
            state.floors = snap.floors;
            state.units = snap.units;
          });
          return true;
        },

        redo: () => {
          const { historyIndex, history } = get();
          if (historyIndex >= history.length - 1) return false;
          set((state) => {
            state.historyIndex++;
            const snap = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
            state.buildings = snap.buildings;
            state.floors = snap.floors;
            state.units = snap.units;
          });
          return true;
        },

        canUndo: () => get().historyIndex > 0,
        canRedo: () => get().historyIndex < get().history.length - 1,

        // ─── Export/Import ───
        exportData: () => {
          const { projectConfig, buildings, floors, units } = get();
          return {
            projectConfig: { ...projectConfig },
            buildings: JSON.parse(JSON.stringify(buildings)),
            floors: JSON.parse(JSON.stringify(floors)),
            units: JSON.parse(JSON.stringify(units)),
          };
        },

        importData: (data) =>
          set((state) => {
            // Support old format (buildingConfig + units only)
            if (data.buildingConfig && !data.buildings) {
              _migrateOldFormat(state, data);
              return;
            }

            if (data.projectConfig) {
              state.projectConfig = { ...DEFAULT_PROJECT_CONFIG, ...data.projectConfig };
            }
            if (Array.isArray(data.buildings)) {
              state.buildings = data.buildings;
            }
            if (Array.isArray(data.floors)) {
              state.floors = data.floors;
            }
            if (Array.isArray(data.units)) {
              state.units = data.units;
            }
            // Recalculate nextId from all entity IDs
            const allIds = [
              ...state.buildings.map((b) => b.id),
              ...state.floors.map((f) => f.id),
              ...state.units.map((u) => u.id),
            ];
            state.nextId = Math.max(...allIds, 0) + 1;
            state.history = [_serializeState(state.buildings, state.floors, state.units)];
            state.historyIndex = 0;
          }),
      })),
      {
        name: 'masterplan_data',
        version: 2,
        partialize: (state) => ({
          projectConfig: state.projectConfig,
          buildings: state.buildings,
          floors: state.floors,
          units: state.units,
          nextId: state.nextId,
          annotations: state.annotations,
        }),
        migrate: (persisted, version) => {
          // Migrate from v1 (old flat format) to v2 (hierarchical)
          if (version === 0 || version === 1 || !version) {
            if (persisted.buildingConfig && !persisted.buildings) {
              const cfg = persisted.buildingConfig;
              const building = {
                id: 1,
                name: cfg.buildingName || 'Building A',
                description: '',
                backgroundImage: null,
                points: [],
                floors: cfg.floors || 6,
                unitsPerFloor: cfg.unitsPerFloor || 4,
              };
              const floor = {
                id: 2,
                buildingId: 1,
                floorNumber: 1,
                name: 'Floor 1',
                backgroundImage: null,
                points: [],
              };
              const units = (persisted.units || []).map((u) => ({
                ...u,
                floorId: u.floorId || 2,
              }));
              const allIds = [1, 2, ...units.map((u) => u.id)];
              return {
                projectConfig: {
                  projectName: cfg.buildingName || DEFAULT_PROJECT_CONFIG.projectName,
                  companyName: cfg.companyName || DEFAULT_PROJECT_CONFIG.companyName,
                  companyTagline: cfg.companyTagline || DEFAULT_PROJECT_CONFIG.companyTagline,
                  currency: cfg.currency || DEFAULT_PROJECT_CONFIG.currency,
                  contactPhone: cfg.contactPhone || DEFAULT_PROJECT_CONFIG.contactPhone,
                  contactEmail: cfg.contactEmail || DEFAULT_PROJECT_CONFIG.contactEmail,
                },
                buildings: [building],
                floors: [floor],
                units,
                nextId: Math.max(...allIds, 0) + 1,
                annotations: persisted.annotations || [],
              };
            }
          }
          return persisted;
        },
      }
    ),
    { name: 'ProjectStore' }
  )
);

function _serializeState(buildings, floors, units) {
  return JSON.parse(JSON.stringify({ buildings, floors, units }));
}

function _snapshot(state) {
  state.historyIndex++;
  state.history = state.history.slice(0, state.historyIndex);
  state.history.push(_serializeState(state.buildings, state.floors, state.units));
  if (state.history.length > MAX_HISTORY) {
    state.history.shift();
    state.historyIndex--;
  }
}

function _migrateOldFormat(state, data) {
  const cfg = data.buildingConfig;
  const building = {
    id: 1,
    name: cfg.buildingName || 'Building A',
    description: '',
    backgroundImage: null,
    points: [],
    floors: cfg.floors || 6,
    unitsPerFloor: cfg.unitsPerFloor || 4,
  };
  const floor = {
    id: 2,
    buildingId: 1,
    floorNumber: 1,
    name: 'Floor 1',
    backgroundImage: null,
    points: [],
  };
  const units = (data.units || []).map((u) => ({
    ...u,
    floorId: u.floorId || 2,
  }));
  state.projectConfig = {
    projectName: cfg.buildingName || DEFAULT_PROJECT_CONFIG.projectName,
    companyName: cfg.companyName || DEFAULT_PROJECT_CONFIG.companyName,
    companyTagline: cfg.companyTagline || DEFAULT_PROJECT_CONFIG.companyTagline,
    currency: cfg.currency || DEFAULT_PROJECT_CONFIG.currency,
    contactPhone: cfg.contactPhone || DEFAULT_PROJECT_CONFIG.contactPhone,
    contactEmail: cfg.contactEmail || DEFAULT_PROJECT_CONFIG.contactEmail,
  };
  state.buildings = [building];
  state.floors = [floor];
  state.units = units;
  const allIds = [1, 2, ...units.map((u) => u.id)];
  state.nextId = Math.max(...allIds, 0) + 1;
  state.history = [_serializeState(state.buildings, state.floors, state.units)];
  state.historyIndex = 0;
}

// Backwards-compat selector for components that need the old buildingConfig shape
export function selectBuildingConfig(state) {
  const pc = state.projectConfig;
  const b = state.buildings[0];
  return {
    buildingName: b?.name || pc.projectName,
    floors: b?.floors || 6,
    unitsPerFloor: b?.unitsPerFloor || 4,
    companyName: pc.companyName,
    companyTagline: pc.companyTagline,
    currency: pc.currency,
    contactPhone: pc.contactPhone,
    contactEmail: pc.contactEmail,
  };
}
