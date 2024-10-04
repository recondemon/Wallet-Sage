import React from 'react'
import Transactions from './Transactions/Transactions'
import SaveGoal from './SavingsGoal/SaveGoal'
import Envelopes from './Envelopes/Envelopes'

const MainContent = () => {
  return (
    <div className='flex flex-col w-full rounded-lg justify-center items-center'>

        <div className='flex'>
          <SaveGoal />
          <Envelopes />
        </div>
        <Transactions />
    </div>
  )
}

export default MainContent