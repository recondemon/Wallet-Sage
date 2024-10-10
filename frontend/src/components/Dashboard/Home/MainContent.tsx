import React from 'react';
import Transactions from './Transactions/Transactions';
import SaveGoal from './SavingsGoal/SaveGoal';
import Envelopes from './Envelopes/Envelopes';
import ChatBot from './ChatBot/ChatBot';

const MainContent = () => {
  return (
    <div className="flex w-full h-screen">
      <div className="w-1/4 h-full">
        <Envelopes />
      </div>
      <div className="flex flex-col w-full h-full justify-center items-center p-4">
        <div className="flex w-full justify-start gap-4">
          <div className="w-1/2">
            <SaveGoal />
          </div>
          <div className="w-1/2">
            <ChatBot />
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
