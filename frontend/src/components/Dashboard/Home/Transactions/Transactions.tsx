import React from 'react';

const Transactions = () => {
  return (
  <div className='border border-border w-full'>
    <div className='flex justify-between items-center p-4'>
      <h1 className='text-2xl font-semibold'>Transactions</h1>
      <button className='text-primary'>View All</button>
    </div>
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
          <div className='bg-primary w-10 h-10 rounded-lg'></div>
          <div>
            <h1 className='text-lg font-semibold'>Netflix</h1>
            <p className='text-sm text-secondary'>Subscription</p>
          </div>
        </div>
        <div>
          <h1 className='text-lg font-semibold'>-$15.00</h1>
          <p className='text-sm text-secondary'>12:00 PM</p>
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
          <div className='bg-primary w-10 h-10 rounded-lg'></div>
          <div>
            <h1 className='text-lg font-semibold'>Netflix</h1>
            <p className='text-sm text-secondary'>Subscription</p>
          </div>
        </div>
        <div>
          <h1 className='text-lg font-semibold'>-$15.00</h1>
          <p className='text-sm text-secondary'>12:00 PM</p>
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
          <div className='bg-primary w-10 h-10 rounded-lg'></div>
          <div>
            <h1 className='text-lg font-semibold'>Netflix</h1>
            <p className='text-sm text-secondary'>Subscription</p>
          </div>
        </div>
        <div>
          <h1 className='text-lg font-semibold'>-$15.00</h1>
          <p className='text-sm text-secondary'>12:00 PM</p>
        </div>
      </div>
    </div>
  </div>
);
};

export default Transactions;
