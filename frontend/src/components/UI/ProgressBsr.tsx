import React from 'react';

interface ProgressBarProps {
    currentValue: number;
    targetValue: number;
    progressColor?: string;
    borderColor?: string;
    backgroundColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentValue, 
  targetValue, 
  progressColor, 
  borderColor, 
  backgroundColor
}) => {

  const percentage = (currentValue / targetValue) * 100;

  if(!progressColor) progressColor = 'primary';
  if(!borderColor) borderColor = 'border';
  if(!backgroundColor) backgroundColor = 'input';

  return (
    <div className={`w-full bg-${backgroundColor} rounded-full h-6 overflow-hidden border border-${borderColor}`}>
      <div
        className={`bg-${progressColor} h-full rounded-full text-center text-sm text-black font-bold flex items-center justify-center`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      >
        <span>{`${Math.min(percentage, 100).toFixed(0)}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
