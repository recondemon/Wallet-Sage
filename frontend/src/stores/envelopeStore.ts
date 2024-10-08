import {create} from 'zustand';
import { Envelope } from '../lib/types/AccountTypes';

interface PlaidStoreenvelopeStore {
    envelopes: Envelope[];
}


export const usePlaidStoreenvelopeStore = create<PlaidStoreenvelopeStore>()(
    (set) => ({
        envelopes: [],
        setEnvelopes: (envelopes) => set(() => ({envelopes})),
        addEnvelope: (envelope: Envelope) => set((state) => ({envelopes: [...state.envelopes, envelope]})),
    })
);
