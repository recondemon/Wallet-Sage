import {create} from 'zustand';
import { Envelope } from '../lib/types/AccountTypes';

interface EnvelopesStore {
    envelopes: Envelope[];
    setEnvelopes: (envelopes: Envelope[]) => void;
    addEnvelope: (envelope: Envelope) => void;
    saveEnvelope: (newEnvelope: Omit<Envelope, 'id'>) => void;
    getEnvelopes: (userId: string) => void;
    deleteEnvelope: (id: string, uid: string) => void;
}


export const useEnvelopesStore = create<EnvelopesStore>()(
    (set, get) => ({
        envelopes: [],
        //# Set Envelope List
        setEnvelopes: (envelopes) => set(() => ({envelopes})),
        //# Add Envelope Locally
        addEnvelope: (envelope: Envelope) => set((state) => ({envelopes: [...state.envelopes, envelope]})),
        //# Store Envelope
        saveEnvelope: async (newEnvelope: Omit<Envelope, 'id'>) => {
            try {
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/envelope/create`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEnvelope),
              });
      
              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save envelope');
              }
      
              const savedEnvelope: Envelope = await response.json();
      
              set((state) => ({
                envelopes: [...state.envelopes, savedEnvelope],
              }));
      
            } catch (error) {
              console.error('Error saving envelope:', error);
            }
          },
        //# Get Envelopes
        getEnvelopes: async (user_id: string) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/envelope/get`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch envelopes');
                }

                const envelopes: Envelope[] = await response.json();
                console.log('Envelopes:', envelopes);

                set(() => ({ envelopes: envelopes.envelopes }));
            } catch (error) {
                console.error('Error fetching envelopes:', error);
            }
        },

        deleteEnvelope: async (id: string, uid: string) => {
            const currentState = get().envelopes;
    
            set((state) => ({
              envelopes: state.envelopes.filter((envelope) => envelope.id !== id),
            }));
    
            try {
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/envelope/delete`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ envelopeId: id, uid }),
              });
    
              if (!response.ok) {
                throw new Error('Failed to delete envelope from the server.');
              }
            } catch (error) {
              console.error('Error deleting envelope:', error);
    
              set(() => ({
                envelopes: currentState,
              }));
            }
          },

        })
      );