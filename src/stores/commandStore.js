import { create } from 'zustand';

export const useCommandStore = create((set) => ({
  isOpen: false,
  commands: [],

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  registerCommand: (command) =>
    set((s) => ({
      commands: [...s.commands.filter((c) => c.id !== command.id), command],
    })),

  registerCommands: (commands) =>
    set((s) => {
      const ids = new Set(commands.map((c) => c.id));
      return {
        commands: [
          ...s.commands.filter((c) => !ids.has(c.id)),
          ...commands,
        ],
      };
    }),
}));
