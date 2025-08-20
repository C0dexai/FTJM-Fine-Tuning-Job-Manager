
import React, { useState } from 'react';
import { CreateJobPayload } from '../types';
import { SUPPORTED_MODELS } from '../constants';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateJobPayload) => Promise<void>;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [model, setModel] = useState(SUPPORTED_MODELS[0]);
  const [trainingFile, setTrainingFile] = useState('');
  const [validationFile, setValidationFile] = useState('');
  const [suffix, setSuffix] = useState('');
  const [seed, setSeed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingFile) {
      setError('Training File ID is required.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    await onSubmit({
      model,
      training_file: trainingFile,
      validation_file: validationFile || null,
      suffix: suffix || null,
      seed: seed ? parseInt(seed, 10) : null,
    });

    setIsSubmitting(false);
    onClose();
  };
  
  const resetForm = () => {
    setModel(SUPPORTED_MODELS[0]);
    setTrainingFile('');
    setValidationFile('');
    setSuffix('');
    setSeed('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Fine-Tuning Job">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-1">Base Model</label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="form-input"
          >
            {SUPPORTED_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="training_file" className="block text-sm font-medium text-gray-300 mb-1">Training File ID</label>
          <input
            type="text"
            id="training_file"
            value={trainingFile}
            onChange={(e) => setTrainingFile(e.target.value)}
            className="form-input"
            placeholder="file-abc123"
            required
          />
        </div>

        <div>
          <label htmlFor="validation_file" className="block text-sm font-medium text-gray-300 mb-1">Validation File ID (Optional)</label>
          <input
            type="text"
            id="validation_file"
            value={validationFile}
            onChange={(e) => setValidationFile(e.target.value)}
            className="form-input"
            placeholder="file-def456"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="suffix" className="block text-sm font-medium text-gray-300 mb-1">Suffix (Optional)</label>
            <input
              type="text"
              id="suffix"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              className="form-input"
              placeholder="my-custom-model"
              maxLength={64}
            />
          </div>
          <div>
            <label htmlFor="seed" className="block text-sm font-medium text-gray-300 mb-1">Seed (Optional)</label>
            <input
              type="number"
              id="seed"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              className="form-input"
              placeholder="e.g., 42"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
      <div className="flex justify-end gap-3 pt-6">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Job'}
        </Button>
      </div>
    </Modal>
  );
};

export default CreateJobModal;
