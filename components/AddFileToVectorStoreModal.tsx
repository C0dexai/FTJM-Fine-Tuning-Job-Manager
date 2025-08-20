
import React, { useState } from 'react';
import { addFileToVectorStore } from '../services/vectorStoreService';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface AddFileToVectorStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileAdded: () => void;
  vectorStoreId: string;
}

const AddFileToVectorStoreModal: React.FC<AddFileToVectorStoreModalProps> = ({ isOpen, onClose, onFileAdded, vectorStoreId }) => {
  const [fileId, setFileId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileId) {
      setError('File ID is required.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
        await addFileToVectorStore(vectorStoreId, fileId);
        onFileAdded();
        handleClose();
    } catch (err) {
        setError('Failed to add file. Please check the ID and try again.');
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFileId('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add File to Vector Store">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="file_id" className="block text-sm font-medium text-gray-300 mb-1">File ID</label>
          <input
            type="text"
            id="file_id"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            className="form-input"
            placeholder="file-abc123"
            required
          />
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
      <div className="flex justify-end gap-3 pt-6">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add File'}
        </Button>
      </div>
    </Modal>
  );
};

export default AddFileToVectorStoreModal;
