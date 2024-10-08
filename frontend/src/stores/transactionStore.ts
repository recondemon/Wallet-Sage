import { create } from 'zustand';
import { Transaction } from "../lib/types/AccountTypes";

interface useTransactionStore {
    transactions: Transaction[];
    setTransactions: (transactions: Transaction[]) => void;
    addTransaction: (transaction: Transaction) => void;
    fetchAllTransactions: (user_id: string) => Promise<void>;
}

export const useTransactionStore = create<useTransactionStore>((set) => ({
    transactions: [],

    //# Set Transaction List
    setTransactions: (transactions: Transaction[]) => set(() => ({ transactions })),

    //# Add Transaction Locally
    addTransaction: (transaction: Transaction) =>
        set((state) => ({ transactions: [...state.transactions, transaction] })),

    //# Get Transactions
    fetchAllTransactions: async (user_id: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plaid/fetch_transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            
            const { transactions }: { transactions: Transaction[] } = await response.json();
            console.log('Fetched Transactions:', transactions);

            set(() => ({ transactions }));
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    },
}));