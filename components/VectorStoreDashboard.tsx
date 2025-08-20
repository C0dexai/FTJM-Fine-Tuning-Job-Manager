
import React from 'react';
import { VectorStore } from '../types';
import VectorStoreListItem from './VectorStoreListItem';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface VectorStoreDashboardProps {
  vectorStores: VectorStore[];
  isLoading: boolean;
  onSelectStore: (id: string) => void;
  onRefresh: () => void;
  onDeleteStore: (id: string) => void;
  onOpenCreateModal: () => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

const VectorStoreDashboard: React.FC<VectorStoreDashboardProps> = ({
  vectorStores,
  isLoading,
  onSelectStore,
  onRefresh,
  onDeleteStore,
  onOpenCreateModal,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Vector Stores</h1>
          <p className="mt-1 text-gray-400">Manage your collections of processed files.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={onRefresh} disabled={isLoading} leftIcon={<RefreshIcon />}>
            Refresh
          </Button>
          <Button variant="primary" onClick={onOpenCreateModal} leftIcon={<PlusIcon />}>
            Create Store
          </Button>
        </div>
      </div>

      <div className="card-base p-4">
        {isLoading && vectorStores.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : vectorStores.length > 0 ? (
          <div>
            {vectorStores.map(vs => (
              <VectorStoreListItem
                key={vs.id}
                vectorStore={vs}
                onSelect={onSelectStore}
                onDelete={onDeleteStore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-white">No Vector Stores Found</h3>
            <p className="text-gray-400 mt-2">Get started by creating your first vector store.</p>
            <Button variant="primary" onClick={onOpenCreateModal} className="mt-6" leftIcon={<PlusIcon />}>
                Create Store
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VectorStoreDashboard;
