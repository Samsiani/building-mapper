import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useEditorStore = create(
  devtools(
    (set, get) => ({
      activeTool: 'select',
      selectedUnitId: null,
      selectedUnitIds: [],
      hoveredUnitId: null,
      hoveredEntityId: null,
      hoveredEntityType: null,
      sidebarMode: 'config', // 'config' | 'edit' | 'create' | 'bulk' | 'analytics'
      pendingPoints: null,
      pendingCreationType: null, // 'building' | 'floor' | 'unit'
      pendingCreationParentId: null, // buildingId for floor, floorId for unit
      drawingPoints: [],
      snapEnabled: false,
      snapSize: 2,
      buildingLayerVisible: true,
      floorVisibility: {},
      layersPanelOpen: false,
      editorTheme: 'dark',

      // ─── Navigation state ───
      currentView: {
        level: 'global',   // 'global' | 'building' | 'floor'
        buildingId: null,
        floorId: null,
      },

      // ─── Navigation actions ───
      navigateTo: (level, buildingId = null, floorId = null) =>
        set({
          currentView: { level, buildingId, floorId },
          selectedUnitId: null,
          selectedUnitIds: [],
          hoveredUnitId: null,
          hoveredEntityId: null,
          hoveredEntityType: null,
          sidebarMode: 'config',
          pendingPoints: null,
          pendingCreationType: null,
          pendingCreationParentId: null,
          drawingPoints: [],
        }),

      navigateUp: () => {
        const { currentView } = get();
        if (currentView.level === 'floor') {
          set({
            currentView: { level: 'building', buildingId: currentView.buildingId, floorId: null },
            selectedUnitId: null,
            selectedUnitIds: [],
            hoveredUnitId: null,
            hoveredEntityId: null,
            hoveredEntityType: null,
            sidebarMode: 'config',
            pendingPoints: null,
            pendingCreationType: null,
            drawingPoints: [],
          });
        } else if (currentView.level === 'building') {
          set({
            currentView: { level: 'global', buildingId: null, floorId: null },
            selectedUnitId: null,
            selectedUnitIds: [],
            hoveredUnitId: null,
            hoveredEntityId: null,
            hoveredEntityType: null,
            sidebarMode: 'config',
            pendingPoints: null,
            pendingCreationType: null,
            drawingPoints: [],
          });
        }
      },

      navigateToBuilding: (buildingId) =>
        set({
          currentView: { level: 'building', buildingId, floorId: null },
          selectedUnitId: null,
          selectedUnitIds: [],
          hoveredUnitId: null,
          hoveredEntityId: null,
          hoveredEntityType: null,
          sidebarMode: 'config',
          pendingPoints: null,
          pendingCreationType: null,
          drawingPoints: [],
        }),

      navigateToFloor: (buildingId, floorId) =>
        set({
          currentView: { level: 'floor', buildingId, floorId },
          selectedUnitId: null,
          selectedUnitIds: [],
          hoveredUnitId: null,
          hoveredEntityId: null,
          hoveredEntityType: null,
          sidebarMode: 'config',
          pendingPoints: null,
          pendingCreationType: null,
          drawingPoints: [],
        }),

      // ─── Existing actions ───
      setActiveTool: (tool) =>
        set((state) => {
          const updates = { activeTool: tool };
          if (state.activeTool === 'pen' && tool !== 'pen') {
            updates.drawingPoints = [];
          }
          return updates;
        }),

      selectUnit: (id) =>
        set({
          selectedUnitId: id,
          selectedUnitIds: [id],
          sidebarMode: 'edit',
        }),

      deselectUnit: () =>
        set({
          selectedUnitId: null,
          selectedUnitIds: [],
          sidebarMode: 'config',
        }),

      setHoveredUnit: (id) => set({ hoveredUnitId: id }),

      setHoveredEntity: (id, type) => set({
        hoveredEntityId: id,
        hoveredEntityType: type,
        hoveredUnitId: type === 'unit' ? id : null,
      }),

      clearHoveredEntity: () => set({
        hoveredEntityId: null,
        hoveredEntityType: null,
        hoveredUnitId: null,
      }),

      setMultiSelect: (ids) =>
        set({
          selectedUnitId: ids.length === 1 ? ids[0] : null,
          selectedUnitIds: ids,
          sidebarMode: ids.length > 1 ? 'bulk' : ids.length === 1 ? 'edit' : 'config',
        }),

      toggleMultiSelect: (id) =>
        set((state) => {
          const ids = state.selectedUnitIds.includes(id)
            ? state.selectedUnitIds.filter((i) => i !== id)
            : [...state.selectedUnitIds, id];
          return {
            selectedUnitId: ids.length === 1 ? ids[0] : null,
            selectedUnitIds: ids,
            sidebarMode: ids.length > 1 ? 'bulk' : ids.length === 1 ? 'edit' : 'config',
          };
        }),

      setPendingPoints: (points) =>
        set((state) => {
          if (!points) {
            return {
              pendingPoints: null,
              pendingCreationType: null,
              pendingCreationParentId: null,
              sidebarMode: 'config',
            };
          }
          return {
            pendingPoints: points,
            sidebarMode: 'create',
          };
        }),

      setPendingCreation: ({ type, points, parentId }) =>
        set({
          pendingPoints: points,
          pendingCreationType: type,
          pendingCreationParentId: parentId,
          sidebarMode: 'create',
        }),

      setSidebarMode: (mode) => set({ sidebarMode: mode }),

      setDrawingPoints: (points) => set({ drawingPoints: points }),

      toggleSnap: () => set((s) => ({ snapEnabled: !s.snapEnabled })),
      setSnapSize: (size) => set({ snapSize: size }),

      toggleBuildingLayer: () => set((s) => ({ buildingLayerVisible: !s.buildingLayerVisible })),

      setFloorVisibility: (floor, visible) =>
        set((s) => ({
          floorVisibility: { ...s.floorVisibility, [floor]: visible },
        })),

      toggleLayersPanel: () => set((s) => ({ layersPanelOpen: !s.layersPanelOpen })),

      toggleEditorTheme: () =>
        set((s) => ({ editorTheme: s.editorTheme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'EditorStore' }
  )
);
