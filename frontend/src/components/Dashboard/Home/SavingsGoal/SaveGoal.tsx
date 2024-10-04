
import React, { useState } from 'react';
import Chart from './ChartComponent';
import ChartComponent from './ChartComponent';
import { useSavingsGoalStore } from '../../../../stores/savingsGoalStore';
import GoalDetails from './GoalDetails';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import UniversalModal from '../../../Modals/UniversalModal';
import NewSavingsGoal from './NewSavingsGoal';


const SaveGoal = () => {
  //* Stores
  const savingsGoals = useSavingsGoalStore(state => state.savingsGoals);

  //* Modal State
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = React.useState(false);
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(0);

  const handleOpenNewGoal = () => {
    setIsOpen(true);
  }

  //* Navigate between goals
  const handlePreviousGoal = () => {
    setSelectedGoalIndex((prevIndex) =>
      prevIndex === 0 ? savingsGoals.length - 1 : prevIndex - 1
    );
  };

  const handleNextGoal = () => {
    setSelectedGoalIndex((prevIndex) =>
      prevIndex === savingsGoals.length - 1 ? 0 : prevIndex + 1
    );
  };

  //* Handle clicking on goal to open modal
  const handleOpenGoalModal = () => {
    setIsGoalModalOpen(true);
  };

  //* No goals fallback
  if (savingsGoals.length === 0) {
    return <p>No savings goals available.</p>;
  }

  const currentGoal = savingsGoals[selectedGoalIndex]; 

  return (
    <div className="flex flex-col p-4 w-full rounded-lg ">
      <div className='flex justify-between w-full mb-4'>
        <h1 className='text-xl font-bold'>Savings Goals</h1>
        <div onClick={handleOpenNewGoal}>
          <Plus className='w-6 h-6 ml-2' />
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <div
        className="flex w-full p-4 bg-card rounded-lg hover:bg-altBackground hover:cursor-pointer transition duration-300"
        onClick={handleOpenGoalModal}
        >
          <div className="w-1/2 h-full">
            <ChartComponent goal={currentGoal} />
          </div>
          <div className="w-1/2 px-4">
            <GoalDetails goal={currentGoal} />
          </div>
        </div>
        <div className='flex justify-between'>
          <ArrowLeft 
          className="w-6 h-6 hover:cursor-pointer" 
          onClick={handlePreviousGoal} 
          />
          <ArrowRight 
          className="w-6 h-6 hover:cursor-pointer" 
          onClick={handleNextGoal}
          />
        </div>
      </div>
      { isOpen && (
        <UniversalModal onClose={() => setIsOpen(false)}>
          <NewSavingsGoal />
        </UniversalModal>
      )}
    </div>
  );
};

export default SaveGoal;
