import React, { useState } from 'react';
import Chart from './ChartComponent';
import ChartComponent from './ChartComponent';
import { useSavingsGoalStore } from '../../../../stores/savingsGoalStore';
import GoalDetails from './GoalDetails';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import UniversalModal from '../../../Modals/UniversalModal';
import NewSavingsGoal from './NewSavingsGoal';

interface NoGoalsProps {
  onCreateGoal: () => void;
}

const NoGoalsPlaceholder: React.FC<NoGoalsProps> = ({ onCreateGoal }) => {
  return (
    <div
      className="flex w-full p-4 rounded-lg h-[30vh] hover:bg-altBackground transition duration-300"
      onClick={onCreateGoal}
    >
      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="w-40 h-40 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div className="w-1/2 px-4 flex flex-col justify-center">
        <div className="w-full h-6 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
        <div className="w-2/3 h-4 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
        <div className="w-full flex justify-center mt-4">
          <button
            className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
            onClick={onCreateGoal}
          >
            Create New Goal
          </button>
        </div>
      </div>
    </div>
  );
};

const SaveGoal = () => {
  //* Stores
  const savingsGoals = useSavingsGoalStore((state) => state.savingsGoals);

  //* Modal State
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = React.useState(false);
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(0);

  const handleOpenNewGoal = () => {
    setIsOpen(true);
  };

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
    return (
      <div className="flex flex-col p-4 w-full min-h-[30vh] max-h-[30vh] rounded-lg">
        <div className="flex justify-between w-full mb-4">
          <h1 className="text-2vw font-semibold">Savings Goals</h1>
          <div onClick={handleOpenNewGoal} className='flex justify-center items-center'>
            <Plus className="w-6 h-6 ml-2 hover:cursor-pointer hover:text-primary h-10 w-10" />
          </div>
        </div>
        <NoGoalsPlaceholder onCreateGoal={handleOpenNewGoal} />
        {isOpen && (
          <UniversalModal onClose={() => setIsOpen(false)}>
            <NewSavingsGoal />
          </UniversalModal>
        )}
      </div>
    );
  }

  const currentGoal = savingsGoals[selectedGoalIndex];

  return (
    <div className="flex flex-col p-4 w-full min-h-[30vh] max-h-[30vh] rounded-lg">
      <div className="flex justify-between w-full mb-4">
        <h1 className="text-2vw font-semibold">Savings Goals</h1>
        <div onClick={handleOpenNewGoal} className='flex justify-center items-center'>
          <Plus className="w-6 h-6 ml-2 hover:cursor-pointer hover:text-primary h-10 w-10" />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-lg p-4">
        <div
          className="flex w-full p-4 justify-center items-center rounded-lg hover:bg-altBackground hover:cursor-pointer transition duration-300"
          onClick={handleOpenGoalModal}
        >
          <ChevronLeft
            className="w-10 h-10 hover:cursor-pointer hover:text-primary"
            onClick={handlePreviousGoal}
          />
          <div className="w-1/2 h-full">
            <ChartComponent goal={currentGoal} />
          </div>
          <div className="w-1/2 px-4">
            <GoalDetails goal={currentGoal} />
          </div>
          <ChevronRight
            className="w-10 h-10 hover:cursor-pointer hover:text-primary"
            onClick={handleNextGoal}
          />
        </div>
        <div className="flex justify-between">
        </div>
      </div>
      {isOpen && (
        <UniversalModal onClose={() => setIsOpen(false)}>
          <NewSavingsGoal />
        </UniversalModal>
      )}
    </div>
  );
};

export default SaveGoal;
