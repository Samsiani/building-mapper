import { create } from 'zustand';

let _toastId = 0;

export const useToastStore = create((set) => ({
  toasts: [],

  show: (message, type = 'info', duration = 3500) => {
    const id = ++_toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
    return id;
  },

  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
