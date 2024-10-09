import React, { useEffect } from 'react';
import { SavingsGoal } from '../../../../lib/types/AccountTypes';
import { useSavingsGoalStore } from '../../../../stores/savingsGoalStore';

interface GoalDetailsProps {
  goal: SavingsGoal;
}

const GoalDetails: React.FC<GoalDetailsProps> = ({ goal }) => {
  const { name, goal: goalAmount, balance } = goal;
  const remaining = goalAmount - balance;

  useEffect(() => {
    console.log('Goal:', goal);
  }, [goal]);

  return (
    <div className='flex flex-col gap-2'>
      <h1 className="text-1.2vw font-bold">{name}</h1>
      <p className="text-1vw">Target: {goalAmount}</p>
      <p className="text-1vw">Saved: {balance}</p>
      <p className="text-18vw">Remaining: {remaining}</p>
    </div>
  );
};

export default GoalDetails;
