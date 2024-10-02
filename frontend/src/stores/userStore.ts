import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  uid: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user: User) => set(() => ({ user, isLoggedIn: true })),

      logout: () =>
        set(() => ({
          user: null,
          isLoggedIn: false,
        })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
