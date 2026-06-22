import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types/game';
import type { Locale } from '../i18n/translations';

interface SettingsStore {
  theme: Theme;
  locale: Locale;
  soundEnabled: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      locale: 'en',
      soundEnabled: true,

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),

      setLocale: (locale) => set({ locale }),

      toggleLocale: () =>
        set({ locale: get().locale === 'en' ? 'zh' : 'en' }),

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
    }),
    { name: 'deal-or-no-deal-settings' },
  ),
);
