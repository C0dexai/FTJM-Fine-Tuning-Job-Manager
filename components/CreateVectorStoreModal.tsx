
import React, { useState } from 'react';
import { CreateVectorStorePayload } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface CreateVectorStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateVectorStorePayload) => Promise<void>;
}

const CreateVectorStoreModal: React.FC<CreateVectorStoreModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Vector store name is required.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    await onSubmit({ name });

    setIsSubmitting(false);
    onClose();
  };
  
  const resetForm = () => {
    setName('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Vector Store">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="vs_name" className="block text-sm font-medium text-gray-300 mb-1">Vector Store Name</label>
          <input
            type="text"
            id="vs_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="e.g., Support Documents"
            required
          />
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
      <div className="flex justify-end gap-3 pt-6">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Vector Store'}
        </Button>
      </div>
    </Modal>
  );
};

export default CreateVectorStoreModal;
