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
  refreshAccounts: (userId: string) => Promise<void>;
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
          const checkResponse = await fetch('/api/plaid/check_accounts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
          });

          if (!checkResponse.ok) {
            throw new Error('Failed to check accounts in the database');
          }

          const checkData = await checkResponse.json();

          if (checkData.hasAccounts) {
            const refreshResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plaid/refresh_accounts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user_id: userId }),
            });

            if (!refreshResponse.ok) {
              throw new Error('Failed to refresh accounts from Plaid');
            }

            const refreshData = await refreshResponse.json();
            set({ institutions: refreshData.institutions });
            set({ accounts: refreshData.accounts });
          } else {
            const newResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plaid/fetch_accounts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user_id: userId }),
            });

            if (!newResponse.ok) {
              throw new Error('Failed to fetch new accounts from Plaid');
            }

            const newData = await newResponse.json();
            set({ institutions: newData.institutions });
            set({ accounts: newData.accounts });
          }
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      },

      refreshAccounts: async (userId: string) => {
        try {
          set(() => ({
            institutions: [],
            accounts: [],
          }));

          const refreshResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plaid/refresh_accounts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
          });

          if (!refreshResponse.ok) {
            throw new Error('Failed to refresh accounts from Plaid');
          }

          const refreshData = await refreshResponse.json();
          set({ institutions: refreshData.institutions });
          set({ accounts: refreshData.accounts });
        } catch (error) {
          console.error('Error refreshing accounts:', error);
        }
      },
    }),
    {
      name: 'plaid-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
