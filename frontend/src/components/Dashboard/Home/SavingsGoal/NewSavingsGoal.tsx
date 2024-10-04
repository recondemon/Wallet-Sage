import React, { useEffect } from 'react'
import SavingAccounts from './SavingAccounts';
import { usePlaidStore } from '../../../../stores/plaidStore';
import { ArrowLeft, Plus } from 'lucide-react';
import ProgressBar from '../../../UI/ProgressBsr';
import { Account } from '../../../../lib/types/AccountTypes';
import StartingProgress from './StartingProgress';

const NewSavingsGoal = () => {
    //* Stores
    const accounts = usePlaidStore(state => state.accounts);

    //* States
    const [goalName, setGoalName] = React.useState('');
    const [goalTarget, setGoalTarget] = React.useState<number>(5000);
    const [startingBalance, setStartingBalance] = React.useState<number>(0);
    const [goalAccounts, setGoalAccounts] = React.useState<Account[]>([]);

    //* Account Selection Conditional
    const [isSelectingAccounts, setIsSelectingAccounts] = React.useState(false);

    //* Style Variables
    const isSelectinStyle = 'border p-2'

    useEffect(() => {
        if (goalAccounts.length > 0) {
          const totalBalance = goalAccounts.reduce((acc, account) => acc + account.balance, 0);
          setStartingBalance(totalBalance);
        } else {
          setStartingBalance(0);
        }
      }, [goalAccounts]);

    const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setGoalTarget(isNaN(value) ? 0 : value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

    }

  return (
    <div className='flex flex-col p-4'>
        <h1 className='text-2vw mb-6'>
            Create a new Savings Goal
        </h1>
        <form 
        className='grid grid-cols-2 gap-4'
        onSubmit={() => handleSubmit}
        >
            <div className='flex flex-col gap-4'>
                <div>
                    <p>Give your Goal a name:</p>
                    <input 
                    title='Goal Name'
                    type="text" 
                    name="name" 
                    placeholder='Ex: Vacation Fund'
                    onChange={(e) => setGoalName(e.target.value)}
                    />
                </div>
                <div>
                    <p>Set your Target:</p>
                    <input 
                    title='Goal Target'
                    type="number"
                    name="target"
                    placeholder='Ex: $5000'
                    onChange={handleTargetChange}
                    />
                </div>
            </div>
            <div className='flex flex-col justify-between'>
                <div>
                    {isSelectingAccounts ? (
                        <ArrowLeft 
                        onClick={() => setIsSelectingAccounts(false)}
                        className='hover:text-primary hover:cursor-pointer' 
                        />
                    ) : (
                        <button
                        className='hover:tect-primary hover:cursor-pointer'
                        onClick={() => setIsSelectingAccounts(true)}
                        >
                            <p 
                            className='flex gap-2 text-1vw justify-center items-center hover:text-primary'>
                                <Plus />
                                Add Accounts
                            </p>
                        </button>
                    )}
                </div>
                <div>
                    <SavingAccounts 
                    accounts={accounts}
                    setGoalAccounts={setGoalAccounts}
                    goalAccounts={goalAccounts}
                    isSelectingAccounts={isSelectingAccounts}
                    setIsSelectingAccounts={setIsSelectingAccounts}
                    />
                </div>
                {!isSelectingAccounts && (
                    <StartingProgress 
                    goalTarget={goalTarget}
                    startingBalance={startingBalance}
                    progressColor='altBackground'
                    borderColor='primary'
                    backgroundColor='input'
                    />
                )}
            </div>
            {isSelectingAccounts && (
                <div className='col-span-2 mt-2'>
                    <StartingProgress
                    goalTarget={goalTarget}
                    startingBalance={startingBalance}
                    />
                </div>
            )}
            <div className='col-span-2 flex justify-center mt-4'>
                <button 
                type="submit"
                className='bg-muted hover:bg-primary hover:text-black hover:font-bold p-2 rounded-lg hover:bg-primary-dark'
                >
                    Submit
                </button>
            </div>
        </form>
    </div>
  )
}

export default NewSavingsGoal