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
            <div key={transaction.id} className='grid grid-cols-4 p-4 gap-2 hover:bg-card hover:cursor-point'>
              <div className='flex justify-startS'>
                <p>{transaction.name}</p>
              </div>
              <p>{transaction.category}</p>
              <p>{transaction.merchant_name}</p>
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
