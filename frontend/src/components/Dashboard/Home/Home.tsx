import React, { useEffect } from 'react'
import Balance from './Balance'
import Accounts from './Accounts/Accounts'
import SaveGoal from './SaveGoal'
import { usePlaidStore } from '../../../stores/plaidStore'
import { useUserStore } from '../../../stores/userStore'
import MainContent from './MainContent'
import Credit from './Credit'

const Home = () => {
  const accounts = usePlaidStore(state => state.accounts);
  const fetchPlaidData = usePlaidStore(state => state.fetchPlaidData)
  const user = useUserStore(state => state.user)

  useEffect(() => {
    fetchPlaidData(user?.uid)
    console.log('fetching plaid data')
    console.log('accounts: ', accounts)
  }, [fetchPlaidData, user?.uid])
  return (
    <div className='flex flex-col p-4 m-4 rounded-lg justify-center w-[80vw] mx-auto gap-4'>
      
      {/* top row (Balance info, Savings Goal, Credit info) */}
      <div className='flex w-full'>
        <Balance />
        <SaveGoal />
        <Credit />
      </div>
      <div className='flex w-full'>
        <MainContent />
        <Accounts accounts={accounts}/>
      </div>
    </div>
  )
}

export default Home