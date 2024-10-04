import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Account } from '../lib/types/AccountTypes';


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
  fetchPlaidData: (userId: string) => Promise<void>;
}

export const usePlaidStore = create<PlaidStore>()(
  persist(
    (set) => ({
      institutions: [],
      accounts: [],
      setInstitutions: (institutions) => set(() => ({ institutions })),
      setAccounts: (accounts) => set(() => ({ accounts })),
      clearPlaidData: () => set(() => ({ institutions: [], accounts: [] })),

      fetchPlaidData: async (userId) => {
        try {
          const response = await fetch('/api/plaid/fetch_accounts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch accounts from Plaid');
          }

          const data = await response.json();
          console.log('data: ', data);
          set({ institutions: data.institutions });
          set({ accounts: data.accounts });

        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      },
    }),
    {
      name: 'plaid-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
