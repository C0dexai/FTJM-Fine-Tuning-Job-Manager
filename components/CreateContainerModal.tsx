
import React, { useState } from 'react';
import { CreateContainerPayload } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface CreateContainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateContainerPayload) => Promise<void>;
}

const CreateContainerModal: React.FC<CreateContainerModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [apiName, setApiName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Container name is required.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    await onSubmit({
      name,
      env: {
        API_NAME: apiName || undefined,
        API_KEY: apiKey || undefined,
      }
    });

    setIsSubmitting(false);
    onClose();
  };
  
  const resetForm = () => {
    setName('');
    setApiName('');
    setApiKey('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Container">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="container_name" className="block text-sm font-medium text-gray-300 mb-1">Container Name</label>
          <input
            type="text"
            id="container_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="e.g., My Project Environment"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="api_name" className="block text-sm font-medium text-gray-300 mb-1">API Name (Optional)</label>
            <input
              type="text"
              id="api_name"
              value={apiName}
              onChange={(e) => setApiName(e.target.value)}
              className="form-input"
              placeholder="e.g., OPENAI_API_KEY"
            />
          </div>
          <div>
            <label htmlFor="api_key" className="block text-sm font-medium text-gray-300 mb-1">API Key (Optional)</label>
            <input
              type="password"
              id="api_key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="form-input"
              placeholder="Enter your API key"
            />
          </div>
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
      <div className="flex justify-end gap-3 pt-6">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Container'}
        </Button>
      </div>
    </Modal>
  );
};

export default CreateContainerModal;