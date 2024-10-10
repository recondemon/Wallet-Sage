import React, { useEffect } from 'react';
import { useTransactionStore } from '../../../../stores/transactionStore';
import { useEnvelopesStore } from '../../../../stores/envelopeStore';
import { useUserStore } from '../../../../stores/userStore';
import { usePlaidStore } from '../../../../stores/plaidStore';

interface NoTransactionsProps {
  onCreateTransaction: () => void;
}

const Transactions = () => {
  //* stores
  const transactions = useTransactionStore((state) => state.transactions);
  const envelopes = useEnvelopesStore((state) => state.envelopes);
  const user = useUserStore((state) => state.user);
  const fetchAllTransactions = useTransactionStore((state) => state.fetchAllTransactions);

  //* states
  const [selectedEnvelope, setSelectedEnvelope] = React.useState({}); 
  const accounts = usePlaidStore((state) => state.accounts);

  //* Placeholder for no transactions
  const NoTransactionsPlaceholder: React.FC<NoTransactionsProps> = ({ onCreateTransaction }) => {
    if(accounts.length === 0){
      return (
        <div
          className="flex w-full p-4 rounded-lg"
          onClick={onCreateTransaction}
        >
          <div className="w-full px-4 gap-6 mt-6 flex flex-col justify-center">
            <div className="w-full h-6 bg-gray-400 rounded-md animate-pulse"></div>
            <div className="w-full h-6 bg-gray-400 rounded-md animate-pulse"></div>
            <div className="w-full h-6 bg-gray-400 rounded-md animate-pulse"></div>
            <div className="w-full h-6 bg-gray-400 rounded-md animate-pulse"></div>
          </div>
        </div>
      )
    } else {
      return (
        <div
          className="flex w-full p-4 rounded-lg"
          onClick={onCreateTransaction}
        >
          <div className='mb-4'>
            <h1 className='text-2vw'>
              Fetching Transactions...
            </h1>
          </div>
          <div className="w-full px-4 gap-6 mt-6 flex flex-col justify-center">
            <div className="w-full h-6 bg-gray-400 rounded-md animate-pulse"></div>
            <div className="w-full h-6 bg-gray-400 rounded-md animate-pulse"></div>
            <div className="w-full h-6 bg-gray-400 rounded-md animate-pulse"></div>
            <div className="w-full h-6 bg-gray-400 rounded-md animate-pulse"></div>
          </div>
        </div>
      )
    }
  }

  //* onMount get transactions if none
  useEffect(() => {
    if (user && transactions.length === 0) {
      fetchAllTransactions(user.uid);
    }
  }, [user, transactions, fetchAllTransactions]);


  const handleAssignEnvelope = async (transactionId: string, envelopeId: string, amount:number) => {
    const assignTransactionToEnvelope = useEnvelopesStore((state) => state.assignTransactionToEnvelope);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/envelope/add_transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction_id: transactionId, envelope_id: envelopeId }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign envelope');
      }
      assignTransactionToEnvelope(transactionId, envelopeId, amount);
      
      console.log('Envelope assigned successfully');
    } catch (error) {
      console.error('Error assigning envelope:', error);
    }
  };

  return (
  <div className='flex flex-col w-full'>
    <h1 className='text-2vw font-semibold mb-2'>Transactions</h1>
    <div className='grid grid-cols-5 w-full border-b border-border px-2'>
      <p className='text-left'>Transaction Name</p>
      <p className='text-center'>Category</p>
      <p className='text-center'>Merchant</p>
      <p className='text-center'>Envelope</p>
      <p className='text-right'>Amount</p>
    </div>
    <div className='w-full rounded-lg h-[50vh] overflow-y-auto'>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction.id} className='grid grid-cols-5 p-4 gap-2 hover:bg-card hover:cursor-pointer hover:text-primary'>
              <div className='flex justify-start'>
                <p>{transaction.name}</p>
              </div>
              <p className='text-center'>{transaction.category}</p>
              <p className='text-center'>{transaction.merchant_name}</p>
              {transaction.envelope_id ? (
                <p className='text-center'>{envelopes.find(e => e.id === transaction.envelope_id)?.name}</p>
              ) : (
                <div className='text-center'>
                  <select
                    value={selectedEnvelope[transaction.id] || ''}
                    onChange={(e) => {
                      setSelectedEnvelope(prev => ({ ...prev, [transaction.id]: e.target.value }));
                      handleAssignEnvelope(transaction.id, e.target.value);
                    }}
                  >
                    <option value="">Select Envelope</option>
                    {envelopes.map((envelope) => (
                      <option key={envelope.id} value={envelope.id}>
                        {envelope.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className='flex justify-end'>
                <p>{transaction.amount}</p>
                
              </div>
            </div>
          ))
        ) : (
          <NoTransactionsPlaceholder onCreateTransaction={() => console.log('Create transaction')} />
        )}
    </div>
  </div>
);
};

export default Transactions;
