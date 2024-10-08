import React from 'react'
import { useEnvelopesStore } from '../../../../stores/envelopeStore'
import { useUserStore } from '../../../../stores/userStore'

interface NewEnvelopeProps {
    setIsOpen: (value: boolean) => void
}

const NewEnvelope: React.FC<NewEnvelopeProps> = ({setIsOpen }) => {
    //# Stores
    const user = useUserStore(state => state.user)
    const envelopesStore = useEnvelopesStore()
    const { saveEnvelope } = envelopesStore
    const { addEnvelope } = envelopesStore

    //* states
    const [name, setName] = React.useState<string>('')
    const [limit, setLimit] = React.useState<number>(0)
    const [balance, setBalance] = React.useState<number>(0)
    const [description, setDescription] = React.useState<string>('')
    const [errors, setErrors] = React.useState<string>('')


    const handleSubmit = async (e) => {
        e.preventDefault()

        const newEnvelope = {
            name,
            limit,
            balance,
            description,
            transactions: [],
            user_id: user?.uid
        }

        const savedEnvelope = await saveEnvelope(newEnvelope); 
        if (savedEnvelope) {
            envelopesStore.addEnvelope(savedEnvelope);

            setName('');
            setDescription('');
            setLimit(0);
            setBalance(0);

            setIsOpen(false);
        } else {
            setErrors('Failed to create envelope');
        }
    }

  return (
    <div className='flex flex-col p-4'>
        <h1 className='text-2vw mb-6'>Create a New Envelope</h1>
        <form 
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
        >
            <div className='flex gap-4'>
                <div>
                    <p>
                        Give your Envelope a name:
                    </p>
                    <input
                        title='envelope name'
                        type='text'
                        name='name'
                        placeholder='Ex: Groceries'
                        onChange={(e) => setName(e.target.value)}
                        className='w-full'
                    />
                </div>
                <div>
                    <p>
                        Add money to your Envelope:
                    </p>
                    <input
                        title='limit'
                        type='number'
                        name='limit'
                        placeholder='Ex: $500'
                        onChange={(e) => setLimit(parseInt(e.target.value))}
                        className='w-full'
                    />
                </div>
            </div>
            <div>
                <p>Add a description(Optional):</p>
                <textarea
                    title='description'
                    name='description'
                    placeholder='Ex: Money for groceries'
                    onChange={(e) => setDescription(e.target.value)}
                    className='bg-input p-2 rounded-lg w-full'
                />
            </div>
            <button
            type='submit'
            className='bg-primary p-2 w-full rounded-lg hover:bg-muted hover:shadow-lg shadow-shadow'
            >
                Create Envelope
            </button>
        </form>
    </div>
  )
}

export default NewEnvelope
