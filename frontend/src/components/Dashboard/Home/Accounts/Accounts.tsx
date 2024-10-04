import React, { useEffect, useState } from 'react'
import { PlaidLinkButton } from '../../../UI/PlaidLinkButton'
import { useUserStore } from '../../../../stores/userStore'
import { usePlaidStore } from '../../../../stores/plaidStore';
import AccountsList from './AccountList'
import { Account } from '../../../../lib/types/AccountTypes'
import { ArrowLeftRight, MoreHorizontal, RefreshCcw, Settings } from 'lucide-react';
import Dropdown from '../../../UI/DropDown'
import { useSavingsGoalStore } from '../../../../stores/savingsGoalStore';
import Balance from './Balance';
interface AccountsProps {
    accounts: Account[]
}
const Accounts: React.FC<AccountsProps> = ({accounts}) => {
    //* Stores
    const user = useUserStore(state => state.user)
    const refreshAccounts = usePlaidStore(state => state.refreshAccounts)
    const savingsGoals = useSavingsGoalStore(state => state.savingsGoals)
    const getAndUpdateSavingsGoals = useSavingsGoalStore(state => state.getAndUpdateSavingsGoals)

    //* Drop down state
    const [menuOpen, setMenuOpen] = useState(false)

    const handleRefresh = () => {
        console.log('refreshing accounts')
        refreshAccounts(user?.uid ?? '');
        console.log('accounts:', accounts)

        console.log('refreshing savings goals')
        getAndUpdateSavingsGoals(user?.uid ?? '');
        console.log('savings goals:', savingsGoals)
        
    }

  return (
    <div className='flex flex-col p-4 w-full rounded-lg pt-8'>
        <div className='flex gap-2 justify-between pb-2'>
            <div
            onClick={handleRefresh}
            className='hover:cursor-pointer hover:text-primary transition duration-300'
            >
                <RefreshCcw />
            </div>
            <div className='hover:cursor-pointer hover:text-primary transition duration-300'>
                <ArrowLeftRight />
            </div>
            <Dropdown buttonContent={
                <MoreHorizontal 
                className='hover:text-primary transition duration-300 hover:cursor-pointer'
                size={30}
                />
            }>
                <PlaidLinkButton userId={user?.uid}/>
                <button className='p-2 hover:cursor-pointer hover:bg-muted rounded-lg '>
                    Manage Accounts
                </button>
            </Dropdown>
        </div>
        <div className='my-4'>
            <Balance />
        </div>
        <div className='flex justify-center py-1 border-b'>
            <h2 className='text-1.vw'>
                Accounts
            </h2>
        </div>
        <div>
            {accounts && accounts.length > 0 ? (
                <AccountsList accounts={accounts} />
            ) : (
                <p>No accounts available. Please connect your bank.</p>
            )}
        </div>
    </div>
  )
}

export default Accounts