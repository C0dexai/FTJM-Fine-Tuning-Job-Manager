
import React, { useState } from 'react';
import { ContainerFile } from '../types';
import { deleteFileFromContainer } from '../services/containerService';
import Card from './ui/Card';
import Button from './ui/Button';
import AddFileToContainerModal from './AddFileToContainerModal';

interface ContainerFilesTabProps {
  containerId: string;
  files: ContainerFile[];
  onFilesUpdate: () => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
);

const ContainerFilesTab: React.FC<ContainerFilesTabProps> = ({ containerId, files, onFilesUpdate }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const handleDeleteFile = async (fileId: string) => {
    if (window.confirm(`Are you sure you want to remove file "${fileId}" from this container?`)) {
      await deleteFileFromContainer(containerId, fileId);
      onFilesUpdate();
    }
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Files in Container ({files.length})</h3>
            <Button variant="primary" onClick={() => setAddModalOpen(true)} leftIcon={<PlusIcon />}>Add File</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-black/30">
              <tr>
                <th scope="col" className="px-6 py-3">File ID</th>
                <th scope="col" className="px-6 py-3">Path</th>
                <th scope="col" className="px-6 py-3">Size (Bytes)</th>
                <th scope="col" className="px-6 py-3">Created At</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file.id} className="border-b border-[rgba(255,255,255,0.1)] hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-xs">{file.id}</td>
                  <td className="px-6 py-4 font-mono text-xs">{file.path}</td>
                  <td className="px-6 py-4">{file.bytes.toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(file.created_at * 1000).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="danger" onClick={() => handleDeleteFile(file.id)} title="Remove File" leftIcon={<DeleteIcon />} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {files.length === 0 && (
             <div className="text-center text-gray-400 py-8">No files found in this container.</div>
          )}
        </div>
      </Card>
      <AddFileToContainerModal 
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        containerId={containerId}
        onFileAdded={onFilesUpdate}
      />
    </>
  );
};

export default ContainerFilesTab;
