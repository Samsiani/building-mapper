import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { DEFAULT_PROJECT_CONFIG, SEED_NODES } from '../utils/constants';
import { NODE_TYPES } from '../utils/nodeTypes';

const MAX_HISTORY = 30;

export const useProjectStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // ─── Project-level config (company/global) ───
        projectConfig: { ...DEFAULT_PROJECT_CONFIG },

        // ─── Flat entity tree ───
        nodes: [...SEED_NODES],

        annotations: [],
        nextId: 14, // after seed IDs 1-13
        history: [_serializeState(SEED_NODES)],
        historyIndex: 0,

        // ─── Project Config ───
        updateProjectConfig: (data) =>
          set((state) => {
            Object.assign(state.projectConfig, data);
          }),

        // ─── Generic Node CRUD ───
        createNode: (data) => {
          let newNode;
          set((state) => {
            newNode = {
              id: state.nextId,
              parentId: data.parentId ?? null,
              type: data.type,
              name: data.name || `${NODE_TYPES[data.type]?.label || 'Node'} ${state.nextId}`,
              points: data.points || [],
              // Spread type-specific fields
              ...data,
              id: state.nextId,
            };
            state.nodes.push(newNode);
            state.nextId++;
            _snapshot(state);
          });
          return get().nodes.find((n) => n.id === newNode.id);
        },

        updateNode: (id, data) =>
          set((state) => {
            const node = state.nodes.find((n) => n.id === id);
            if (!node) return;
            Object.assign(node, data);
            _snapshot(state);
          }),

        removeNode: (id) =>
          set((state) => {
            // BFS cascade: collect all descendants
            const toRemove = new Set([id]);
            const queue = [id];
            while (queue.length > 0) {
              const current = queue.shift();
              for (const n of state.nodes) {
                if (n.parentId === current && !toRemove.has(n.id)) {
                  toRemove.add(n.id);
                  queue.push(n.id);
                }
              }
            }
            state.nodes = state.nodes.filter((n) => !toRemove.has(n.id));
            _snapshot(state);
          }),

        updateNodePoints: (id, points) =>
          set((state) => {
            const node = state.nodes.find((n) => n.id === id);
            if (!node) return;
            node.points = points;
            _snapshot(state);
          }),

        // ─── Helpers ───
        getChildren: (parentId) => get().nodes.filter((n) => n.parentId === parentId),

        getDescendants: (nodeId) => {
          const result = [];
          const queue = [nodeId];
          const nodes = get().nodes;
          while (queue.length > 0) {
            const current = queue.shift();
            for (const n of nodes) {
              if (n.parentId === current) {
                result.push(n);
                queue.push(n.id);
              }
            }
          }
          return result;
        },

        getAncestors: (nodeId) => {
          const ancestors = [];
          const nodes = get().nodes;
          let current = nodes.find((n) => n.id === nodeId);
          while (current && current.parentId !== null) {
            const parent = nodes.find((n) => n.id === current.parentId);
            if (parent) {
              ancestors.unshift(parent);
              current = parent;
            } else {
              break;
            }
          }
          return ancestors;
        },

        getNode: (id) => get().nodes.find((n) => n.id === id),

        // ─── Bulk operations ───
        bulkUpdateStatus: (ids, status) =>
          set((state) => {
            ids.forEach((id) => {
              const node = state.nodes.find((n) => n.id === id);
              if (node && NODE_TYPES[node.type]?.hasStatus) node.status = status;
            });
            _snapshot(state);
          }),

        bulkRemove: (ids) =>
          set((state) => {
            // Also cascade children of each removed node
            const toRemove = new Set();
            for (const id of ids) {
              toRemove.add(id);
              const queue = [id];
              while (queue.length > 0) {
                const current = queue.shift();
                for (const n of state.nodes) {
                  if (n.parentId === current && !toRemove.has(n.id)) {
                    toRemove.add(n.id);
                    queue.push(n.id);
                  }
                }
              }
            }
            state.nodes = state.nodes.filter((n) => !toRemove.has(n.id));
            _snapshot(state);
          }),

        // ─── Annotations ───
        addAnnotation: (annotation) =>
          set((state) => {
            state.annotations.push({ id: Date.now(), ...annotation });
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
            state.nodes = snap.nodes;
          });
          return true;
        },

        redo: () => {
          const { historyIndex, history } = get();
          if (historyIndex >= history.length - 1) return false;
          set((state) => {
            state.historyIndex++;
            const snap = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
            state.nodes = snap.nodes;
          });
          return true;
        },

        canUndo: () => get().historyIndex > 0,
        canRedo: () => get().historyIndex < get().history.length - 1,

        // ─── Export/Import ───
        exportData: () => {
          const { projectConfig, nodes } = get();
          return {
            version: 4,
            projectConfig: { ...projectConfig },
            nodes: JSON.parse(JSON.stringify(nodes)),
          };
        },

        importData: (data) =>
          set((state) => {
            // V1: old flat format (buildingConfig + units only)
            if (data.buildingConfig && !data.buildings && !data.nodes) {
              _migrateV1(state, data);
              return;
            }
            // V2: hierarchical (buildings + floors + units)
            if (data.buildings && !data.nodes) {
              _migrateV2(state, data);
              return;
            }
            // V3/V4: flat nodes
            if (data.projectConfig) {
              state.projectConfig = { ...DEFAULT_PROJECT_CONFIG, ...data.projectConfig };
            }
            if (Array.isArray(data.nodes)) {
              state.nodes = data.nodes;
            }
            // Migrate V3 status values
            if (!data.version || data.version < 4) {
              _migrateStatusAvailableToForSale(state.nodes);
            }
            const allIds = state.nodes.map((n) => n.id);
            state.nextId = Math.max(...allIds, 0) + 1;
            state.history = [_serializeState(state.nodes)];
            state.historyIndex = 0;
          }),
      })),
      {
        name: 'masterplan_data',
        version: 4,
        partialize: (state) => ({
          projectConfig: state.projectConfig,
          nodes: state.nodes,
          nextId: state.nextId,
          annotations: state.annotations,
        }),
        migrate: (persisted, version) => {
          // V1 → V4
          if (version === 0 || version === 1 || !version) {
            if (persisted.buildingConfig && !persisted.buildings) {
              const result = _migrateV1Persist(persisted);
              _migrateStatusAvailableToForSale(result.nodes);
              return result;
            }
          }
          // V2 → V4
          if (version === 2) {
            if (persisted.buildings && !persisted.nodes) {
              const result = _migrateV2Persist(persisted);
              _migrateStatusAvailableToForSale(result.nodes);
              return result;
            }
          }
          // V3 → V4
          if (version === 3) {
            if (Array.isArray(persisted.nodes)) {
              _migrateStatusAvailableToForSale(persisted.nodes);
            }
            return persisted;
          }
          return persisted;
        },
      }
    ),
    { name: 'ProjectStore' }
  )
);

function _serializeState(nodes) {
  return JSON.parse(JSON.stringify({ nodes }));
}

function _snapshot(state) {
  state.historyIndex++;
  state.history = state.history.slice(0, state.historyIndex);
  state.history.push(_serializeState(state.nodes));
  if (state.history.length > MAX_HISTORY) {
    state.history.shift();
    state.historyIndex--;
  }
}

// ─── Migration helpers ───

function _buildingsFloorsUnitsToNodes(buildings, floors, units) {
  const nodes = [];
  for (const b of buildings) {
    nodes.push({
      ...b,
      parentId: null,
      type: 'building',
    });
  }
  for (const f of floors) {
    nodes.push({
      ...f,
      parentId: f.buildingId,
      type: 'floor',
    });
  }
  for (const u of units) {
    nodes.push({
      ...u,
      parentId: u.floorId,
      type: 'apartment',
    });
  }
  // Clean up legacy keys
  for (const n of nodes) {
    delete n.buildingId;
    delete n.floorId;
  }
  return nodes;
}

function _migrateV1(state, data) {
  const cfg = data.buildingConfig;
  const building = {
    id: 1, name: cfg.buildingName || 'Building A', description: '',
    backgroundImage: null, points: [], floors: cfg.floors || 6, unitsPerFloor: cfg.unitsPerFloor || 4,
  };
  const floor = { id: 2, buildingId: 1, floorNumber: 1, name: 'Floor 1', backgroundImage: null, points: [] };
  const units = (data.units || []).map((u) => ({ ...u, floorId: u.floorId || 2 }));
  const nodes = _buildingsFloorsUnitsToNodes([building], [floor], units);
  state.projectConfig = {
    projectName: cfg.buildingName || DEFAULT_PROJECT_CONFIG.projectName,
    companyName: cfg.companyName || DEFAULT_PROJECT_CONFIG.companyName,
    companyTagline: cfg.companyTagline || DEFAULT_PROJECT_CONFIG.companyTagline,
    currency: cfg.currency || DEFAULT_PROJECT_CONFIG.currency,
    contactPhone: cfg.contactPhone || DEFAULT_PROJECT_CONFIG.contactPhone,
    contactEmail: cfg.contactEmail || DEFAULT_PROJECT_CONFIG.contactEmail,
  };
  state.nodes = nodes;
  state.nextId = Math.max(...nodes.map((n) => n.id), 0) + 1;
  state.history = [_serializeState(state.nodes)];
  state.historyIndex = 0;
}

function _migrateV2(state, data) {
  if (data.projectConfig) {
    state.projectConfig = { ...DEFAULT_PROJECT_CONFIG, ...data.projectConfig };
  }
  const nodes = _buildingsFloorsUnitsToNodes(
    data.buildings || [], data.floors || [], data.units || [],
  );
  state.nodes = nodes;
  state.nextId = Math.max(...nodes.map((n) => n.id), 0) + 1;
  state.history = [_serializeState(state.nodes)];
  state.historyIndex = 0;
}

function _migrateV1Persist(persisted) {
  const cfg = persisted.buildingConfig;
  const building = {
    id: 1, name: cfg.buildingName || 'Building A', description: '',
    backgroundImage: null, points: [], floors: cfg.floors || 6, unitsPerFloor: cfg.unitsPerFloor || 4,
  };
  const floor = { id: 2, buildingId: 1, floorNumber: 1, name: 'Floor 1', backgroundImage: null, points: [] };
  const units = (persisted.units || []).map((u) => ({ ...u, floorId: u.floorId || 2 }));
  const nodes = _buildingsFloorsUnitsToNodes([building], [floor], units);
  return {
    projectConfig: {
      projectName: cfg.buildingName || DEFAULT_PROJECT_CONFIG.projectName,
      companyName: cfg.companyName || DEFAULT_PROJECT_CONFIG.companyName,
      companyTagline: cfg.companyTagline || DEFAULT_PROJECT_CONFIG.companyTagline,
      currency: cfg.currency || DEFAULT_PROJECT_CONFIG.currency,
      contactPhone: cfg.contactPhone || DEFAULT_PROJECT_CONFIG.contactPhone,
      contactEmail: cfg.contactEmail || DEFAULT_PROJECT_CONFIG.contactEmail,
    },
    nodes,
    nextId: Math.max(...nodes.map((n) => n.id), 0) + 1,
    annotations: persisted.annotations || [],
  };
}

function _migrateV2Persist(persisted) {
  const nodes = _buildingsFloorsUnitsToNodes(
    persisted.buildings || [], persisted.floors || [], persisted.units || [],
  );
  return {
    projectConfig: persisted.projectConfig || { ...DEFAULT_PROJECT_CONFIG },
    nodes,
    nextId: Math.max(...nodes.map((n) => n.id), persisted.nextId || 0, 0) + 1,
    annotations: persisted.annotations || [],
  };
}

function _migrateStatusAvailableToForSale(nodes) {
  for (const n of nodes) {
    if (n.status === 'available') {
      n.status = 'for_sale';
    }
  }
}
