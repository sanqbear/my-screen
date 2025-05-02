import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

export type Theme = 'light' | 'dark';
export type Language = 'ko' | 'en' | 'ja' | 'zh';

interface AppState {
  theme: Theme;
  language: Language;
  apiUrl: string;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setApiUrl: (url: string) => void;
}

const useStore = create<AppState>()(
  persist(
    set => ({
      theme: 'light',
      language: 'ko',
      apiUrl: 'https://api.example.com', // 기본 API URL을 설정하세요

      setTheme: theme => set({theme}),
      setLanguage: language => {
        i18n.changeLanguage(language);
        set({language});
      },
      setApiUrl: apiUrl => set({apiUrl}),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useStore;
