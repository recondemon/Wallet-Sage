import { Plus } from "lucide-react";
import { useState } from "react";
import UniversalModal from "../../../Modals/UniversalModal";
import NewEnvelope from "./NewEnvelope";

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
        {/* Placeholder for Envelope Details */}
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
  const [isOpen, setIsOpen] = useState(false);
  const [envelopes, setEnvelopes] = useState([]);  // Placeholder for envelopes state

  const handleOpenNewEnvelope = () => {
    setIsOpen(true);
  };

  // If no envelopes exist, display the placeholder and button
  if (envelopes.length === 0) {
    return (
      <div className='flex flex-col p-4 min-w-[30vw] w-full rounded-lg'>
        <div className="flex justify-between w-full mb-4">
          <h1 className='text-2vw font-semibold'>
            Envelopes
          </h1>
          <div onClick={handleOpenNewEnvelope}>
            <Plus className="w-6 h-6 ml-2" />
          </div>
        </div>
        <NoEnvelopesPlaceholder onCreateEnvelope={handleOpenNewEnvelope} />
        {isOpen && (
          <UniversalModal onClose={() => setIsOpen(false)}>
            <NewEnvelope />
          </UniversalModal>
        )}
      </div>
    );
  }

  return(
    <div className='flex flex-col p-4 min-w-[30vw] w-full rounded-lg'>
      <div className="flex justify-between">
        <h1 className='text-2vw font-semibold'>
          Envelopes
        </h1>
      </div>
      <div className='grid grid-cols-2 gap-2 border border-border rounded-lg'>

      </div>
    </div>
  )
  
};

export default Envelopes;
