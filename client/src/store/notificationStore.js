import { create } from "zustand";

const CLEAR_TIMEOUT = 3000;

export const useNotificationStore = create((set) => ({
  message: null,
  type: null, // 'success' | 'error' | 'loading'
  show: false,
  setNotification: (type, message) => {
    set({ type, message, show: true });
    setTimeout(
      () => set({ message: null, type: null, show: false }),
      CLEAR_TIMEOUT
    );
  },
  clearNotification: () => set({ message: null, type: null, show: false }),
}));
