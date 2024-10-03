import React, { useState } from 'react'
import { usePlaidStore } from '../../../stores/plaidStore'

const Credit = () => {
  //* Stores
  const accounts = usePlaidStore(state => state.accounts)
  const institutions = usePlaidStore(state => state.institutions)

  //* States
  const [creditAvailable, setCreditAvailable] = useState(0)
  const [creditBalance, setCreditBalance] = useState(0)

  //* Calculate Total Balances


  return (
    <div className='flex flex-col p-4 border-2 w-full rounded-lg bg-card'>
        <div>
            <p className='text-2xl text-left my-0 py-0'>
                Available
            </p>
            <p>
                {creditAvailable}
            </p>
        </div>
        <div>
          <p>
            Balance
          </p>
          <p>
            {creditBalance}
          </p>
        </div>
    </div>
  )
}

export default Credit