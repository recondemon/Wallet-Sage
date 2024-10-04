import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
}

interface SavingsGoalStore {
    savingsGoals: SavingsGoal[];
    addSavingsGoal: (savingsGoal: SavingsGoal) => Promise<void>;
    removeSavingsGoal: (id: string) => void;
    updateSavingsGoal: (id: string, updatedGoal: SavingsGoal) => void;
}

export const useSavingsGoalStore = create<SavingsGoalStore>()(
    persist(
        (set) => ({
            savingsGoals: [],

            addSavingsGoal: async (savingsGoal: SavingsGoal) => {
                set((state) => ({
                    savingsGoals: [...state.savingsGoals, savingsGoal],
                }));

                try {
                    const response = await fetch('/api/savingsGoals', {
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
                        savingsGoals: state.savingsGoals.filter((goal) => goal.id !== savingsGoal.id),
                    }));
                }
            },

            removeSavingsGoal: (id: string) => set((state) => ({
                savingsGoals: state.savingsGoals.filter((goal) => goal.id !== id),
            })),

            updateSavingsGoal: (id: string, updatedGoal: SavingsGoal) => set((state) => ({
                savingsGoals: state.savingsGoals.map((goal) =>
                    goal.id === id ? updatedGoal : goal
                ),
            })),
        }),
        {
            name: 'savings-goal-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
