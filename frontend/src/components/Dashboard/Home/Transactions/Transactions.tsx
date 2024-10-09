import React from 'react';
import { useTransactionStore } from '../../../../stores/transactionStore';

const Transactions = () => {
  //# stores
  const transactions = useTransactionStore((state) => state.transactions);
  
  return (
  <div className='flex flex-col w-full'>
    <h1 className='text-2vw font-semibold'>Transactions</h1>
    <div className='border border-border w-full rounded-lg h-[50vh] overflow-y-auto'>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction.id} className='grid grid-cols-5 p-4 gap-2 hover:bg-card hover:cursor-pointer hover:text-primary'>
              <div className='flex justify-start'>
                <p>{transaction.name}</p>
              </div>
              <p className='text-center'>{transaction.category}</p>
              <p className='text-center'>{transaction.merchant_name}</p>
              {transaction.envelope_id ? (
                <p className='text-center'>{/* Show Envelope Name here */}</p>
              ) : (
                <p className='text-center'>
                  {/* this will be a button to open envelope */}

                  Assign
                </p>
              )}
              <div className='flex justify-end'>
                <p>{transaction.amount}</p>
                
              </div>
            </div>
          ))
        ) : (
          <p>No transactions available</p>
        )}
    </div>
  </div>
);
};

export default Transactions;
