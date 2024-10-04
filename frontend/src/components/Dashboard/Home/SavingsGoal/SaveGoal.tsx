
import React from 'react';
import Chart from './ChartComponent';
import ChartComponent from './ChartComponent';
import { useSavingsGoalStore } from '../../../../stores/savingsGoalStore';
import GoalDetails from './GoalDetails';
import { Plus } from 'lucide-react';
import UniversalModal from '../../../Modals/UniversalModal';
import NewSavingsGoal from './NewSAvingsGoal';

const SaveGoal = () => {
//* Stores
const savingsGoals = useSavingsGoalStore(state => state.savingsGoals);

//* Modal State
const [isOpen, setIsOpen] = React.useState(false);

const handleOpenNewGoal = () => {
  setIsOpen(true);
}

  return (
    <div className="flex p-4 w-1/2 bg-card border-2 rounded-lg">
      <div className='flex justify-between w-full'>
        <h1 className='text-xl font-bold'>Savings Goals</h1>
        <div onClick={handleOpenNewGoal}>
          <Plus className='w-6 h-6 ml-2' />
        </div>
      </div>
      {savingsGoals.map((goal) => (
        <div key={goal.id} className="flex w-full">
          <div className='w-1/2 h-full'>
            <ChartComponent goal={goal} />
          </div>
          <div className='w-1/2'>
            <GoalDetails goal={goal} />
          </div>
        </div>
      ))}
      { isOpen && (
        <UniversalModal  onClose={() => setIsOpen(false)} >
          <NewSavingsGoal />
        </UniversalModal>
      )}
    </div>
  );
};

export default SaveGoal;
