import { create } from 'zustand';
import { ThemeMode } from '@/utils/theme';

interface UIState {
  themeMode: ThemeMode;
  loading: boolean;
  error: string | null;
  toastMessage: string | null;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  themeMode: 'light',
  loading: false,
  error: null,
  toastMessage: null,

  setThemeMode: mode => set({ themeMode: mode }),

  toggleTheme: () => {
    const current = get().themeMode;
    set({ themeMode: current === 'light' ? 'dark' : 'light' });
  },

  setLoading: loading => set({ loading }),

  setError: error => set({ error }),

  showToast: message => set({ toastMessage: message }),

  hideToast: () => set({ toastMessage: null }),
}));
