import React from 'react'
import EnvelopeProgress from './EnvelopeProgress'

interface EnvelopeItemProps {
    name: string;
    currentValue: number;
    targetValue: number;
}

const EnvelopeItem: React.FC<EnvelopeItemProps> = ({
    name,
    currentValue,
    targetValue,
}) => {

  return (
    <div className='flex flex-col rounded-lg p-4'>
        <div className='flex px-4 text-.8vw font-semibold'>
            {name}
        </div>
        <div className='flex py-2 px-4'>
            <EnvelopeProgress currentValue={100} targetValue={200} />
        </div>
        <div className='flex justify-between text-.8vw'>
            <p>
                Current: ${currentValue}
            </p>
            <p>
                Limit: ${targetValue}
            </p>
        </div>
  </div>
  )
}

export default EnvelopeItem