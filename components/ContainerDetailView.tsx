
import React, { useState, useEffect, useCallback } from 'react';
import { Container, ContainerFile } from '../types';
import { CONTAINER_STATUS_COLORS } from '../constants';
import { listContainerFiles } from '../services/containerService';
import Spinner from './ui/Spinner';
import Badge from './ui/Badge';
import Card from './ui/Card';
import ContainerDetailsTab from './ContainerDetailsTab';
import ContainerFilesTab from './ContainerFilesTab';

interface ContainerDetailViewProps {
  container: Container;
  onBack: () => void;
  onContainerUpdate: () => void;
}

type Tab = 'Details' | 'Files';

const ContainerDetailView: React.FC<ContainerDetailViewProps> = ({ container, onBack, onContainerUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Files');
  const [files, setFiles] = useState<ContainerFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const filesData = await listContainerFiles(id);
      setFiles(filesData);
    } catch (error) {
      console.error("Failed to fetch container files:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleDataRefresh = () => {
    fetchFiles(container.id);
    onContainerUpdate();
  };

  useEffect(() => {
    fetchFiles(container.id);
  }, [container.id, fetchFiles]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return <ContainerDetailsTab container={container} />;
      case 'Files':
        return isLoading ? 
          <div className="flex justify-center items-center py-20"><Spinner /></div> :
          <ContainerFilesTab containerId={container.id} files={files} onFilesUpdate={handleDataRefresh} />;
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
              Back to Containers
            </button>
            <h2 className="text-2xl font-bold text-white truncate">{container.name}</h2>
            <p className="text-gray-400 mt-1 font-mono text-xs">{container.id}</p>
          </div>
          <div className="flex-shrink-0">
            <Badge className={`${CONTAINER_STATUS_COLORS[container.status]} text-base uppercase`}>{container.status}</Badge>
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

export default ContainerDetailView;
