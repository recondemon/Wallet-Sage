import React, { useEffect, useState } from 'react'
import { PlaidLinkButton } from '../../../UI/PlaidLinkButton'
import { useUserStore } from '../../../../stores/userStore'
import { usePlaidStore } from '../../../../stores/plaidStore';
import AccountsList from './AccountList'
import { Account } from '../../../../lib/types/AccountTypes'
import { ArrowLeftRight, MoreHorizontal, RefreshCcw, Settings } from 'lucide-react';
import Dropdown from '../../../UI/DropDown'
interface AccountsProps {
    accounts: Account[]
}
const Accounts: React.FC<AccountsProps> = ({accounts}) => {
    //* Stores
    const user = useUserStore(state => state.user)
    const refreshAccounts = usePlaidStore(state => state.refreshAccounts)

    //* Drop down state
    const [menuOpen, setMenuOpen] = useState(false)

    const handleRefresh = () => {
        console.log('refreshing accounts')
        refreshAccounts(user?.uid)
    }

  return (
    <div className='flex flex-col p-4 border-2 w-1/3 rounded-lg bg-card'>
        <div className='flex gap-2 justify-between pb-2'>
            <div
            onClick={handleRefresh}
            >
                <RefreshCcw />
            </div>
            <div className='flex justify-center items-center gap-2'>
                <ArrowLeftRight />
                <p>
                    Transfer Money
                </p>
            </div>
            <Dropdown buttonContent={<MoreHorizontal />}>
                <PlaidLinkButton userId={user?.uid}/>
                <button className='p-2 hover:cursor-pointer hover:bg-muted rounded-lg '>
                    Manage Accounts
                </button>
            </Dropdown>
        </div>
        <div className='flex justify-center py-1 border-b'>
            <h2 className='text-1vw'>
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