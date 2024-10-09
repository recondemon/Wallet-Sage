import React from 'react';
import Transactions from './Transactions/Transactions';
import SaveGoal from './SavingsGoal/SaveGoal';
import Envelopes from './Envelopes/Envelopes';

const MainContent = () => {
  return (
    <div className="flex w-full h-full justify-start items-start">
      {/* Envelopes section on the left */}
      <div className="w-1/3 h-full">
        <Envelopes />
      </div>

      {/* SaveGoal and other content */}
      <div className="flex flex-col flex-grow h-full justify-start items-start p-4">
        <div className="flex w-full justify-start gap-4">
          <div className="w-3/4">
            <SaveGoal />
          </div>
          {/* Placeholder for another component, which will take the rest of the space */}
          <div className="w-1/4">
            {/* Other component goes here */}
          </div>
        </div>
        <div className="w-full mt-4">
          <Transactions />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
