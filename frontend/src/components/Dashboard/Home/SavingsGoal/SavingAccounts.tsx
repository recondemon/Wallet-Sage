import React, { useEffect } from 'react'
import { Account } from '../../../../lib/types/AccountTypes';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface SavingAccountsProps {
    accounts: Account[];
    setGoalAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
    goalAccounts: Account[];
    isSelectingAccounts: boolean;
    setIsSelectingAccounts: React.Dispatch<React.SetStateAction<boolean>>;
}

const SavingAccounts: React.FC<SavingAccountsProps> = ({
    accounts, 
    setGoalAccounts, 
    goalAccounts,
    isSelectingAccounts,
    setIsSelectingAccounts
}) => {
    const savingsAccounts = accounts.filter(account => account.type === 'savings')
    
    const selectedStyle = 'bg-muted flex justify-between gap-4 rounded-lg hover:bg-muted hover:cursor-pointer'
    const notSelectedStyle = 'flex justify-between gap-4 rounded-lg hover:bg-muted hover:cursor-pointer'

    const handleSelection = (account: Account) => {
        if(goalAccounts.includes(account)){
            setGoalAccounts(goalAccounts.filter((acc) => acc.id !== account.id))
        } else {
            setGoalAccounts([...goalAccounts, account])
        }
    }

  return (
    <div className=''>
        {isSelectingAccounts ? (
            <div className='mb-4'>
            <p className='text.8vw mt-2'>
                {savingsAccounts.length} Savings Found
            </p>
            {savingsAccounts.map((account) => (
                <div
                key={account.id}
                onClick={() => handleSelection(account)}
                className={clsx(goalAccounts.includes(account) ? selectedStyle : notSelectedStyle, 'p-4')}
                >
                    <p>{account.name}</p>
                    <p>{account.institution_name}</p>
                    <p>${account.balance}</p>
                </div>

            ))}
            </div>
        ): (
            <div className='flex flex-col gap-2'>
            {goalAccounts.length > 0 ? (
                goalAccounts.map((account) => (
                <div 
                key={account.id}
                className='flex justify-between gap-4 p-4 rounded-lg'
                >
                    {/* TODO: add remove button on hover */}
                    {/* <button>
                        <X onClick={() => handleSelection(account)} />
                    </button> */}
                    <p>{account.name}</p>
                    <p>{account.balance}</p>
                </div>
                ))
            ) : (
                <p>No Accounts Selected</p>
            )} 
            </div>
        )}
    </div>
  )
}

export default SavingAccounts