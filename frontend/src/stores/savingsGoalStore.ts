import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Account, SavingsGoal } from '../lib/types/AccountTypes';

interface SavingsGoalStore {
  savingsGoals: SavingsGoal[];
  accounts: Account[];
  addSavingsGoal: (savingsGoal: SavingsGoal) => Promise<void>;
  removeSavingsGoal: (id: string, uid: string) => Promise<void>;
  getAndUpdateSavingsGoals: (userId: string) => Promise<void>;
}

export const useSavingsGoalStore = create<SavingsGoalStore>()(
  persist(
    (set, get) => ({
      savingsGoals: [],
      accounts: [],

      addSavingsGoal: async (savingsGoal: SavingsGoal) => {
        set((state) => ({
          savingsGoals: [...state.savingsGoals, savingsGoal],
        }));

        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/savingsgoals/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(savingsGoal),
          });

          if (!response.ok) {
            throw new Error('Failed to save savings goal to the server.');
          }
        } catch (error) {
          console.error('Error saving savings goal:', error);
          set((state) => ({
            savingsGoals: state.savingsGoals.filter(
              (goal) => goal.id !== savingsGoal.id
            ),
          }));
        }
      },

      removeSavingsGoal: async (id: string, uid: string) => {
        const currentState = get().savingsGoals;

        set((state) => ({
          savingsGoals: state.savingsGoals.filter((goal) => goal.id !== id),
        }));

        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/savingsgoals/delete`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ savingsGoalId: id, uid }),
          });

          if (!response.ok) {
            throw new Error('Failed to delete savings goal from the server.');
          }
        } catch (error) {
          console.error('Error deleting savings goal:', error);

          set(() => ({
            savingsGoals: currentState,
          }));
        }
      },

      getAndUpdateSavingsGoals: async (userId: string) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/savingsgoals/get?uid=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch savings goals from the server.');
          }

          const { savingsGoals } = await response.json();

          const state = get();

          const updatedGoals = savingsGoals.map((goal: SavingsGoal) => {
            const linkedAccounts = state.accounts.filter((account: Account) =>
              goal.accounts.includes(account.account_id)
            );

            const updatedBalance = linkedAccounts.reduce(
              (total: number, account: Account) => total + account.balance,
              0
            );

            if (updatedBalance !== goal.balance) {
              return {
                ...goal,
                balance: updatedBalance,
              };
            }

            return goal;
          });

          set(() => ({
            savingsGoals: updatedGoals,
          }));
        } catch (error) {
          console.error('Error fetching or updating savings goals:', error);
        }
      },
    }),
    {
      name: 'savings-goal-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
