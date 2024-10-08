import React, { useEffect } from 'react'
import EnvelopeProgress from './EnvelopeProgress'
import { Envelope } from '../../../../lib/types/AccountTypes'

interface EnvelopeItemProps {
envelope: Envelope
}

const EnvelopeItem: React.FC<EnvelopeItemProps> = ({envelope}) => {
    const {name, balance, limit, description} = envelope

    useEffect(() => {
        console.log('envelope: ',envelope)
    }
    , [envelope])
  return (
    <div className='flex flex-col rounded-lg p-4'>
        <div className='flex px-4 text-.8vw font-semibold'>
            {name}
        </div>
        <div className='flex py-2 px-4'>
            <EnvelopeProgress currentValue={balance} targetValue={limit} />
        </div>
        <div className='flex justify-between text-.8vw'>
            <p>
                Current: ${balance}
            </p>
            <p>
                Limit: ${limit}
            </p>
        </div>
  </div>
  )
}

export default EnvelopeItem