
import React, { useState, useEffect, useCallback } from 'react';
import { VectorStore, VectorStoreFile } from '../types';
import { VECTOR_STORE_STATUS_COLORS } from '../constants';
import { listVectorStoreFiles } from '../services/vectorStoreService';
import Spinner from './ui/Spinner';
import Badge from './ui/Badge';
import Card from './ui/Card';
import VectorStoreDetailsTab from './VectorStoreDetailsTab';
import VectorStoreFilesTab from './VectorStoreFilesTab';

interface VectorStoreDetailViewProps {
  vectorStore: VectorStore;
  onBack: () => void;
  onStoreUpdate: () => void;
}

type Tab = 'Details' | 'Files';

const VectorStoreDetailView: React.FC<VectorStoreDetailViewProps> = ({ vectorStore, onBack, onStoreUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Files');
  const [files, setFiles] = useState<VectorStoreFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const filesData = await listVectorStoreFiles(id);
      setFiles(filesData);
    } catch (error) {
      console.error("Failed to fetch vector store files:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleDataRefresh = () => {
    fetchFiles(vectorStore.id);
    onStoreUpdate();
  };

  useEffect(() => {
    fetchFiles(vectorStore.id);
  }, [vectorStore.id, fetchFiles]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return <VectorStoreDetailsTab vectorStore={vectorStore} />;
      case 'Files':
        return isLoading ? 
          <div className="flex justify-center items-center py-20"><Spinner /></div> :
          <VectorStoreFilesTab vectorStoreId={vectorStore.id} files={files} onFilesUpdate={handleDataRefresh} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <button onClick={onBack} className="text-sm text-neon-blue hover:text-neon-purple mb-2 flex items-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Vector Stores
            </button>
            <h2 className="text-2xl font-bold text-white truncate">{vectorStore.name}</h2>
            <p className="text-gray-400 mt-1 font-mono text-xs">{vectorStore.id}</p>
          </div>
          <div className="flex-shrink-0">
            <Badge className={`${VECTOR_STORE_STATUS_COLORS[vectorStore.status]} text-base uppercase`}>{vectorStore.status}</Badge>
          </div>
        </div>
      </Card>

      <div>
        <div className="border-b border-[rgba(255,255,255,0.1)] mb-6">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {(['Details', 'Files'] as Tab[]).map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`tab-button whitespace-nowrap py-3 px-1 font-medium text-sm ${
                  activeTab === tabName ? 'active' : ''
                }`}
              >
                {tabName}
              </button>
            ))}
          </nav>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default VectorStoreDetailView;
