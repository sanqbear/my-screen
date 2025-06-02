import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';

export type Language = 'ko' | 'en' | 'ja' | 'zh';

interface AppState {
  theme: 'light' | 'dark';
  language: Language;
  apiUrl: string;
  cloudflareCookies: string;
  cloudflareReferer: string;
  phpSessionId: string | null;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: Language) => void;
  setApiUrl: (url: string) => void;
  setCloudflareAuth: (cookies: string, referer: string) => void;
  setPhpSessionId: (sessionId: string | null) => void;
}

const useStore = create<AppState>()(
  persist(
    set => ({
      theme: 'light',
      language: 'ko',
      apiUrl: 'https://api.example.com', // 기본 API URL을 설정하세요
      cloudflareCookies: '',
      cloudflareReferer: '',
      phpSessionId: null,

      setTheme: theme => set({theme}),
      setLanguage: language => {
        i18n.changeLanguage(language);
        set({language});
      },
      setApiUrl: apiUrl => set({apiUrl}),
      setCloudflareAuth: (cookies, referer) =>
        set({cloudflareCookies: cookies, cloudflareReferer: referer}),
      setPhpSessionId: phpSessionId => set({phpSessionId}),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useStore;
