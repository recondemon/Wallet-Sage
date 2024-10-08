import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import UniversalModal from "../../../Modals/UniversalModal";
import NewEnvelope from "./NewEnvelope";
import { useEnvelopesStore } from "../../../../stores/envelopeStore";
import EnvelopeItem from "./EnvelopeItem";
import { useUserStore } from "../../../../stores/userStore";
import EnvelopeDetails from "./EnvelopeDetails";

const NoEnvelopesPlaceholder = ({ onCreateEnvelope }) => {
  return (
    <div
      className="flex w-full p-4 bg-card h-[30vh] rounded-lg hover:bg-altBackground transition duration-300"
      onClick={onCreateEnvelope}
    >
      <div className="w-1/2 h-full flex flex-col justify-center">
        <div className="w-full h-6 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
        <div className="w-2/3 h-4 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
      </div>
      <div className="w-1/2 px-4 flex flex-col justify-center">
        <div className="w-full h-6 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
        <div className="w-2/3 h-4 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
        <div className="w-full flex justify-center mt-4">
          <button
            className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
            onClick={onCreateEnvelope}
          >
            Create New Envelope
          </button>
        </div>
      </div>
    </div>
  );
};

const Envelopes = () => {
  //# Stores
  const envelopes = useEnvelopesStore((state) => state.envelopes);
  const getEnvelopes = useEnvelopesStore((state) => state.getEnvelopes);
  const user = useUserStore((state) => state.user);

  const [isOpen, setIsOpen] = useState(false);
  const [openEnvelope, setOpenEnvelope] = useState(false);
  const [envelopeView, setEnvelopeView] = useState(null);

  useEffect(() => {
    if(user){
      getEnvelopes(user.uid);
    }
  }, [user]); 


  const handleOpenNewEnvelope = () => {
    setIsOpen(true);
  };

  const handleOpenEnvelope = (envelope) => {
    setOpenEnvelope(true);
    setEnvelopeView(envelope);
  };

  // If no envelopes exist, display the placeholder and button
  if (envelopes.length === 0) {
    return (
      <div className='flex flex-col p-4 min-w-[30vw] w-full rounded-lg'>
        <div className="flex justify-between w-full mb-4">
          <h1 className='text-2vw font-semibold'>
            Envelopes
          </h1>
          <div onClick={handleOpenNewEnvelope} className="flex justify-center items-center"> 
            <Plus className="w-6 h-6 ml-2 hover:cursor-pointer hover:text-primary" />
          </div>
        </div>
        <NoEnvelopesPlaceholder onCreateEnvelope={handleOpenNewEnvelope} />
        {isOpen && (
          <UniversalModal onClose={() => setIsOpen(false)}>
            <NewEnvelope setIsOpen={setIsOpen} /> 
          </UniversalModal>
        )}
      </div>
    );
  }

  return(
    <div className='flex flex-col p-4 h-full w-[20vw] rounded-lg bg-card py-4 px-2 border-r'>
      <div className="flex justify-between items-center mb-4 px-2">
        <div onClick={handleOpenNewEnvelope} className="flex justify-center items-center">
          <h1 className='text-2vw font-semibold'>
            Envelopes
          </h1>
        </div>
          <Plus className="w-6 h-6 ml-2 h-10 w-10 hover:cursor-pointer hover:text-primary" />
      </div>
      <div className='flex flex-col gap-2 rounded-lg h-[95vh] overflow-y-auto'>
        {envelopes.map((envelope) => (
          <div 
          key={envelope.id} 
          className='flex flex-col p-2 w-full hover:bg-altBackground hover:cursor-pointer hover:text-primary rounded-lg transition duration-300'
          onClick={() => handleOpenEnvelope(envelope)}
          >
            <EnvelopeItem envelope={envelope} />
          </div>
        ))}
      </div>
      {isOpen && (
          <UniversalModal onClose={() => setIsOpen(false)}>
            <NewEnvelope setIsOpen={setIsOpen}/>
          </UniversalModal>
        )}
        {openEnvelope && (
          <UniversalModal onClose={() => setOpenEnvelope(false)}>
            <EnvelopeDetails envelope={envelopeView} />
          </UniversalModal>
        )}
    </div>
  )
  
};

export default Envelopes;
