import React from 'react'
import Balance from './Balance'
import Accounts from './Accounts'

const Home = () => {
  return (
    <div className='flex flex-col p-4'>
        <div>
            <Balance />
            <Accounts />
        </div>
    </div>
  )
}

export default Home