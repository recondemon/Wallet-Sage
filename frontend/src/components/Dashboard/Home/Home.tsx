import React, { useEffect } from 'react'
import Balance from './Balance'
import Accounts from './Accounts/Accounts'
import SaveGoal from './SavingsGoal/SaveGoal'
import { usePlaidStore } from '../../../stores/plaidStore'
import { User, useUserStore } from '../../../stores/userStore'
import MainContent from './MainContent'
import Credit from './Credit'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const accounts = usePlaidStore(state => state.accounts);
  const fetchPlaidData = usePlaidStore(state => state.fetchPlaidData)
  const user = useUserStore(state => state.user)
  const navigate = useNavigate(); 
  const auth = getAuth();

  useEffect(() => {
    console.log(user)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if(!currentUser) {
        navigate('/');
      }
    })

    return () => unsubscribe()
  }, [auth, user, accounts, navigate, fetchPlaidData, user?.uid])

  return (
    <div className='flex flex-col p-4 m-4 rounded-lg justify-center items-center w-[80vw] h-[95vh] mx-auto gap-4'>
      <div className='flex flex-col'>

      </div>
      {/* top row (Balance info, Savings Goal, Credit info) */}
      <div className='flex w-full h-[30vh] gap-4'>
        <div className='flex gap-4 w-2/3'>
          <Balance />
          <SaveGoal />          
        </div>
        <div className='flex w-1/3'>
          <Credit />
        </div>
      </div>
      <div className='flex w-full h-[60vh]'>
        <MainContent />
        <Accounts accounts={accounts}/>
      </div>
    </div>
  )
}

export default Home