import React from 'react';
import ProgressBar from '../../../UI/ProgressBsr';

interface StartingProgressProps {
  startingBalance: number;
  goalTarget: number;
}

const StartingProgress: React.FC<StartingProgressProps> = ({
  startingBalance,
  goalTarget,
}) => {
  return (
    <div className="flex flex-col">
      <ProgressBar currentValue={startingBalance} targetValue={goalTarget} />
      <div className="flex justify-between">
        <p>{startingBalance}</p>
        <p>{goalTarget}</p>
      </div>
    </div>
  );
};

export default StartingProgress;
