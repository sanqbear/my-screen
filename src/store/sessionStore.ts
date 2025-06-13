import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";



interface SessionState {
  phpSession: string;
  cloudflareSession: {
    cookie: string;
    referer: string;
  }
  setPhpSession: (session: string) => void;
  setCloudflareSession: (session: {
    cookie: string;
    referer: string;
  }) => void;
}

const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      phpSession: '',
      cloudflareSession: { cookie: '', referer: '' },
      setPhpSession: (session: string) => set({ phpSession: session }),
      setCloudflareSession: (session: {
        cookie: string;
        referer: string;
      }) => set({ cloudflareSession: session }),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        phpSession: state.phpSession,
        cloudflareSession: state.cloudflareSession,
      }),
    },
  ),
);

export default useSessionStore;
