import React, { useEffect } from 'react';
import Balance from './Accounts/Balance';
import Accounts from './Accounts/Accounts';
import SaveGoal from './SavingsGoal/SaveGoal';
import { usePlaidStore } from '../../../stores/plaidStore';
import { User, useUserStore } from '../../../stores/userStore';
import MainContent from './MainContent';
import Credit from './Credit';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Envelopes from './Envelopes/Envelopes';

const Home = () => {
  const accounts = usePlaidStore((state) => state.accounts);
  const fetchPlaidData = usePlaidStore((state) => state.fetchPlaidData);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    console.log(user);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [auth, user, accounts, navigate, fetchPlaidData, user?.uid]);

  return (
    <div className="flex rounded-lg justify-between items-center w-full h-screen gap-4">
      <div className="flex flex-col gap-4 w-[50vw] h-full">
        <MainContent />
      </div>
      <div className="flex flex-col w-[20vw] h-full border-l-2 bg-card">
        <Accounts accounts={accounts} />
      </div>
    </div>
  );
};

export default Home;
