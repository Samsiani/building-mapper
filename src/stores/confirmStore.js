import { create } from 'zustand';

export const useConfirmStore = create((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  variant: 'danger', // 'danger' | 'warning'
  _resolve: null,

  confirm: ({ title, message, confirmLabel, cancelLabel, variant } = {}) =>
    new Promise((resolve) => {
      set({
        isOpen: true,
        title: title || 'Are you sure?',
        message: message || '',
        confirmLabel: confirmLabel || 'Delete',
        cancelLabel: cancelLabel || 'Cancel',
        variant: variant || 'danger',
        _resolve: resolve,
      });
    }),

  accept: () =>
    set((state) => {
      state._resolve?.(true);
      return { isOpen: false, _resolve: null };
    }),

  dismiss: () =>
    set((state) => {
      state._resolve?.(false);
      return { isOpen: false, _resolve: null };
    }),
}));
