import React, { useEffect, useState } from 'react'
import { usePlaidStore } from '../../../stores/plaidStore'
import { ChevronDown , ChevronUp } from 'lucide-react'

const Balance = () => {
    //* Stores
    const accounts = usePlaidStore(state => state.accounts)
    const institutions = usePlaidStore(state => state.institutions)

    //* States
    const [totalBalance, setTotalBalance] = useState(0)
    const [totalChecking, setTotalChecking] = useState(0)
    const [totalSavings, setTotalSavings] = useState(0)
    const [totalInvestments, setTotalInvestments] = useState(0)

    //* Conditional Drop Down States
    const [checkingExpanded, setCheckingExpanded] = useState(false)
    const [savingsExpanded, setSavingsExpanded] = useState(false)
    const [investmentsExpanded, setInvestmentsExpanded] = useState(false)

    //* Calculate Total Balances
    useEffect(() => {

        setTotalBalance(accounts.reduce((acc, account) => {
            return acc + account.balance
        }, 0))

        setTotalChecking(accounts.reduce((acc, account) => {
            if (account.type === 'checking') {
                return acc + account.balance
            }
            return acc
        }, 0))

        setTotalSavings(accounts.reduce((acc, account) => {
            if (account.type === 'savings') {
                return acc + account.balance
            }
            return acc
        }, 0))

        setTotalInvestments(accounts.reduce((acc, account) => {
            if (account.type === 'investment') {
                return acc + account.balance
            }
            return acc
        }, 0))
        
    }
    , [accounts, institutions])

  return (
    <div className='flex flex-col p-4  w-full rounded-lg'>
        <div className='flex flex-col'>
            <p className='text-3vw text-center my-0 py-0'>
                ${totalBalance}
            </p>
        </div>
        <div className='flex flex-col gap-2 mt-2'>
            <div className='flex justify-between gap-2 p-2 border-b'>
                <div 
                className='flex justify-between gap-2 hover:cursor-pointer'
                onClick={() => setCheckingExpanded(!checkingExpanded)}
                >
                    <p className='text-1vw'>
                        Checking
                    </p>
                    {checkingExpanded ? (
                        <ChevronUp size={24} />  
                    ) : (
                        <ChevronDown size={24} />
                    )}
                </div>
                <p>
                    ${totalChecking}
                </p>
            </div>
            <div className='flex justify-between gap-2 p-2 border-b'>
                <div
                className='flex justify-between gap-2 hover:cursor-pointer'
                onClick={() => setSavingsExpanded(!savingsExpanded)}
                >
                    <p className='text-1vw'>
                        Savings
                    </p>
                    {savingsExpanded ? (
                        <ChevronUp size={24} />  
                    ) : (
                        <ChevronDown size={24} />
                    )}
                </div>
                <p>
                    ${totalSavings}
                </p>
            </div>
            <div className='flex justify-between gap-2 p-2 border-b'>
                <div
                className='flex justify-between gap-2 hover:cursor-pointer'
                onClick={() => setInvestmentsExpanded(!investmentsExpanded)}
                >
                    <p>
                        Investments
                    </p>
                    {investmentsExpanded ? (
                        <ChevronUp size={24} />  
                    ) : (
                        <ChevronDown size={24} />
                    )}
                </div>
                <p>
                    ${totalInvestments}
                </p>
            </div>
        </div>
    </div>
  )
}

export default Balance