import React, { useEffect } from 'react'
import { Envelope } from '../../../../lib/types/AccountTypes'
import EnvelopeItem from './EnvelopeItem'
import { Pencil, Trash2 } from 'lucide-react'
import { useEnvelopesStore } from '../../../../stores/envelopeStore'
import { useUserStore } from '../../../../stores/userStore'


interface EnvelopeDetailsProps {
    envelope: Envelope
}

const EnvelopeDetails: React.FC<EnvelopeDetailsProps> = ({envelope}) => {
    //* Stores
    const deleteEnvelope = useEnvelopesStore((state) => state.deleteEnvelope)
    const user = useUserStore((state) => state.user)

    const {name, balance, limit, description, transactions, id} = envelope

    const handleEdit = () => {
        console.log('Edit Envelope')
    }

    const handleDelete = () => {
        const envelope_id = id
        const user_id = user?.id
        if(user){
            deleteEnvelope(envelope_id, user.id)
        }
    }

  return (
    <div className='flex flex-col gap-4 w-[30vw]'>
        <div className='flex justify-between mt-4'>
            <h1 className='text-1.2vw font-semibold'>
                {name} 
            </h1>
            <div className='flex gap-4'>
                <div
                onClick={handleEdit}
                >
                    <Pencil className='hover:text-yellow-500 hover:cursor-pointer'/>
                </div>
                <div
                onClick={handleDelete}
                >
                    <Trash2 className='hover:text-destructive hover:cursor-pointer'/>
                </div>
             </div>
        </div>
      <div>
        <EnvelopeItem envelope={envelope} />
      </div>
      <div>
        {description? (
            <p>{description}</p>
        ): (
            <div>
                <button
                className='hover:underline hover:text-primary'
                >
                    Set A Description
                </button>
            </div>
        )}
      </div>
      <div>
        <p className='text-1vw'>Transactions: </p>
        {/* Transactions will go here*/}
      </div>
    </div>
  )
}

export default EnvelopeDetails
