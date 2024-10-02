import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Account {
  account_id: string;
  name: string;
  type: string;
  institution_name: string;
}

interface Institution {
  institution_id: string;
  name: string;
}

interface PlaidStore {
  institutions: Institution[];
  accounts: Account[];
  setInstitutions: (institutions: Institution[]) => void;
  setAccounts: (accounts: Account[]) => void;
  clearPlaidData: () => void;
}

export const usePlaidStore = create<PlaidStore>()(
  persist(
    (set) => ({
      institutions: [],
      accounts: [],
      setInstitutions: (institutions) => set(() => ({ institutions })),
      setAccounts: (accounts) => set(() => ({ accounts })),
      clearPlaidData: () => set(() => ({ institutions: [], accounts: [] })),
    }),
    {
      name: 'plaid-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
