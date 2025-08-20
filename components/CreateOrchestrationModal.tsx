
import React, { useState } from 'react';
import { CreateOrchestrationTaskPayload } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface CreateOrchestrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateOrchestrationTaskPayload) => Promise<void>;
}

const CreateOrchestrationModal: React.FC<CreateOrchestrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      setError('Task Name and Description are required.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    await onSubmit({ name, description });

    setIsSubmitting(false);
    onClose();
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Orchestration Task">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="task_name" className="block text-sm font-medium text-gray-300 mb-1">Task Name</label>
          <input
            type="text"
            id="task_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="e.g., Sync Q4 Documentation"
            required
          />
        </div>
        <div>
          <label htmlFor="task_desc" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            id="task_desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            placeholder="Provide a brief summary of the task objectives."
            rows={3}
            required
          />
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
      <div className="flex justify-end gap-3 pt-6">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </Modal>
  );
};

export default CreateOrchestrationModal;
