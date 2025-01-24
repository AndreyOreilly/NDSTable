import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void; 
  children: React.ReactNode;
}

const NdsModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded shadow-lg p-4 max-w-md w-full mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default NdsModal;
