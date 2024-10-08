import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase/firebase';
import { useUserStore } from '../../stores/userStore';
import { usePlaidStore } from '../../stores/plaidStore';
import { useSavingsGoalStore } from '../../stores/savingsGoalStore';
import { useTransactionStore } from '../../stores/transactionStore';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  //* stores
  const transactions = useTransactionStore((state) => state.transactions);
  const user = useUserStore((state) => state.user);
  const savingsGoals = useSavingsGoalStore((state) => state.savingsGoals);

  //* Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //* Login Function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: firebaseUser.uid }),
      });

      const userData = await response.json();

      if (!response.ok) {
        throw new Error(
          userData.error || 'Failed to fetch user data from backend'
        );
      }

      const setUser = useUserStore((state) => state.setUser);
      setUser({
        id: userData.id,
        uid: userData.uid,
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        dob: userData.dob,
      });

      console.log('Login successful');

      console.log('Refreshing accounts');
      const refreshAccounts = usePlaidStore((state) => state.refreshAccounts);
      await refreshAccounts(firebaseUser.uid);

      console.log('Fetching and updating savings goals');
      const getAndUpdateSavingsGoals = useSavingsGoalStore(
        (state) => state.getAndUpdateSavingsGoals
      );
      await getAndUpdateSavingsGoals(firebaseUser.uid);

      console.log('user:', user);
      console.log('savingsGoals:', savingsGoals);

      console.log('fetching transactions')
      const fetchAllTransactions = useTransactionStore((state) => state.fetchAllTransactions)
      await fetchAllTransactions(firebaseUser.uid)

      console.log('transactions: ', transactions)
      
      onClose();
    } catch (error) {
      setError('Login failed, please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-2vw font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-destructive">{error}</p>}
      <form onSubmit={handleLogin} className="p-4 gap-4 flex flex-col">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-primary text-foreground hover:bg-muted hover:text-mutedForeground p-2 rounded"
        >
          Login
        </button>
      </form>
      <div className="flex gap-2">
        <p>Don&apos;t have an account? </p>
        <button>Register</button>
      </div>
    </div>
  );
};

export default Login;
