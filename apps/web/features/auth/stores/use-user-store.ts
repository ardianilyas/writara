import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserData = {
  email: string | null;
  name: string | null;
};

type UserState = {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'writara-user-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
);
