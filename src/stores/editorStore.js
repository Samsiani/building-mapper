import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useEditorStore = create(
  devtools(
    (set, get) => ({
      activeTool: 'select',
      selectedNodeId: null,
      selectedNodeIds: [],
      hoveredNodeId: null,
      sidebarMode: 'config', // 'config' | 'edit' | 'create' | 'bulk' | 'analytics'
      pendingPoints: null,
      pendingCreationType: null, // any node type string
      pendingCreationParentId: null,
      drawingPoints: [],
      rectStart: null,
      cloneDrag: null,
      moveDrag: null, // { nodeId, startPt, originalPoints }
      snapEnabled: false,
      snapSize: 2,
      buildingLayerVisible: true,
      layersPanelOpen: false,
      editorTheme: 'dark',

      // ─── Navigation state ───
      // parentId=null means root (project) level
      currentView: { parentId: null },

      // ─── Navigation actions ───
      navigateInto: (nodeId) =>
        set({
          currentView: { parentId: nodeId },
          selectedNodeId: null,
          selectedNodeIds: [],
          hoveredNodeId: null,
          sidebarMode: 'config',
          pendingPoints: null,
          pendingCreationType: null,
          pendingCreationParentId: null,
          drawingPoints: [],
        }),

      navigateUp: () => {
        const { currentView } = get();
        if (currentView.parentId === null) return;

        // Walk up the tree: find the parent node, then navigate to its parent
        const { useProjectStore } = require('./projectStore');
        const nodes = useProjectStore.getState().nodes;
        const currentParent = nodes.find((n) => n.id === currentView.parentId);
        const newParentId = currentParent ? currentParent.parentId : null;

        set({
          currentView: { parentId: newParentId },
          selectedNodeId: null,
          selectedNodeIds: [],
          hoveredNodeId: null,
          sidebarMode: 'config',
          pendingPoints: null,
          pendingCreationType: null,
          pendingCreationParentId: null,
          drawingPoints: [],
        });
      },

      navigateToRoot: () =>
        set({
          currentView: { parentId: null },
          selectedNodeId: null,
          selectedNodeIds: [],
          hoveredNodeId: null,
          sidebarMode: 'config',
          pendingPoints: null,
          pendingCreationType: null,
          pendingCreationParentId: null,
          drawingPoints: [],
        }),

      // ─── Selection actions ───
      selectNode: (id) =>
        set({
          selectedNodeId: id,
          selectedNodeIds: [id],
          sidebarMode: 'edit',
        }),

      deselectNode: () =>
        set({
          selectedNodeId: null,
          selectedNodeIds: [],
          sidebarMode: 'config',
        }),

      setHoveredNode: (id) => set({ hoveredNodeId: id }),
      clearHoveredNode: () => set({ hoveredNodeId: null }),

      setMultiSelect: (ids) =>
        set({
          selectedNodeId: ids.length === 1 ? ids[0] : null,
          selectedNodeIds: ids,
          sidebarMode: ids.length > 1 ? 'bulk' : ids.length === 1 ? 'edit' : 'config',
        }),

      toggleMultiSelect: (id) =>
        set((state) => {
          const ids = state.selectedNodeIds.includes(id)
            ? state.selectedNodeIds.filter((i) => i !== id)
            : [...state.selectedNodeIds, id];
          return {
            selectedNodeId: ids.length === 1 ? ids[0] : null,
            selectedNodeIds: ids,
            sidebarMode: ids.length > 1 ? 'bulk' : ids.length === 1 ? 'edit' : 'config',
          };
        }),

      // ─── Tool actions ───
      setActiveTool: (tool) =>
        set((state) => {
          const updates = { activeTool: tool };
          if (state.activeTool === 'pen' && tool !== 'pen') {
            updates.drawingPoints = [];
          }
          if (state.activeTool === 'rect' && tool !== 'rect') {
            updates.rectStart = null;
          }
          if (tool !== 'select') {
            updates.cloneDrag = null;
            updates.moveDrag = null;
          }
          return updates;
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
      toggleLayersPanel: () => set((s) => ({ layersPanelOpen: !s.layersPanelOpen })),
      toggleEditorTheme: () =>
        set((s) => ({ editorTheme: s.editorTheme === 'dark' ? 'light' : 'dark' })),

      // Rectangle tool
      setRectStart: (pt) => set({ rectStart: pt }),
      clearRectStart: () => set({ rectStart: null }),

      // Clone drag
      setCloneDrag: (data) => set({ cloneDrag: data }),
      clearCloneDrag: () => set({ cloneDrag: null }),

      // Move drag
      setMoveDrag: (data) => set({ moveDrag: data }),
      clearMoveDrag: () => set({ moveDrag: null }),
    }),
    { name: 'EditorStore' }
  )
);
