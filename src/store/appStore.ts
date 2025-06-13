import { Language, ThemeType } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
  theme: ThemeType;
  language: Language;
  apiUrl: string;
  setTheme: (theme: ThemeType) => void;
  setLanguage: (language: Language) => void;
  setApiUrl: (url: string) => void;
}

const useAppStore = create<AppState>()(
  persist(
    set => ({
      theme: 'system',
      language: 'ko',
      apiUrl: '',
      setTheme: (theme: ThemeType) => set({ theme }),
      setLanguage: (language: Language) => set({ language }),
      setApiUrl: (url: string) => set({ apiUrl: url }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        theme: state.theme,
        language: state.language,
        apiUrl: state.apiUrl,
      }),
    },
  ),
);

export default useAppStore;
