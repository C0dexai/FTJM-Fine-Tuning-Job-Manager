
import React, { useCallback } from 'react';
import { VectorStore } from '../types';
import { VECTOR_STORE_STATUS_COLORS } from '../constants';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface VectorStoreListItemProps {
  vectorStore: VectorStore;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
);

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h2a2 2 0 002-2V4a2 2 0 00-2-2H9z" /><path d="M4 5a2 2 0 012-2h1.5a.5.5 0 010 1H6a1 1 0 00-1 1v7a1 1 0 001 1h1.5a.5.5 0 010 1H6a2 2 0 01-2-2V5z" /></svg>
);

const VectorStoreListItem: React.FC<VectorStoreListItemProps> = ({ vectorStore, onSelect, onDelete }) => {
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete vector store "${vectorStore.name}"?`)) {
      onDelete(vectorStore.id);
    }
  }, [vectorStore.id, vectorStore.name, onDelete]);

  return (
    <div 
      className="list-item-base rounded-lg p-4 mb-3 cursor-pointer"
      onClick={() => onSelect(vectorStore.id)}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4">
          <p className="font-semibold text-base text-gray-100 truncate">{vectorStore.name}</p>
          <p className="font-mono text-xs text-neon-blue truncate">{vectorStore.id}</p>
        </div>
        <div className="md:col-span-2">
          <Badge className={`${VECTOR_STORE_STATUS_COLORS[vectorStore.status]} uppercase`}>{vectorStore.status}</Badge>
        </div>
        <div className="md:col-span-3 text-sm text-gray-300 flex items-center">
            <FileIcon />
            {vectorStore.file_counts.completed} completed files ({vectorStore.file_counts.total} total)
        </div>
        <div className="md:col-span-3 flex justify-end items-center space-x-2">
            <Button size="sm" variant="danger" onClick={handleDelete} title="Delete Store" leftIcon={<DeleteIcon />} />
        </div>
      </div>
    </div>
  );
};

export default VectorStoreListItem;
