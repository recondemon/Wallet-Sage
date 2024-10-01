import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-card rounded-lg shadow-lg p-6 relative">
        {children}
        <button
          title='Close Modal'
          className="absolute p-0 m-0 top-1 right-1 text-foreground text-1vw hover:text-destructive"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default Modal;
