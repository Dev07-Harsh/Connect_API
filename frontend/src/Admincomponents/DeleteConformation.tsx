import React from "react";

interface DeleteConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-3">Confirm Deletion</h3>
          <p className="text-gray-300">{message}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onCancel} 
            className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-full transition-all duration-300 hover:bg-red-500/30 backdrop-blur-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
