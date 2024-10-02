import React from 'react'

const Balance = () => {
    const balance = 5433.67
    const checking = 4533.64
    const savings = 1000.03

  return (
    <div className='flex flex-col p-4'>
        <h2 className='text-1vw'>Total</h2>
        <p className='text-2vw'>${balance}</p>
        <p>
            Checking
        </p>
        <p>
            ${checking}
        </p>
        <p>
            Savings
        </p>
        <p>
            ${savings}
        </p>
    </div>
  )
}

export default Balance