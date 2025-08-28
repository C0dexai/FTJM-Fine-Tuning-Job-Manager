import React, { useCallback } from 'react';
import { Container } from '../types';
import { CONTAINER_STATUS_COLORS } from '../constants';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface ContainerListItemProps {
  container: Container;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAction: (id: string, action: 'start' | 'stop') => void;
}

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
);

const ContainerListItem: React.FC<ContainerListItemProps> = ({ container, onSelect, onDelete, onAction }) => {
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete container "${container.name}"?`)) {
      onDelete(container.id);
    }
  }, [container.id, container.name, onDelete]);

  const handleAction = useCallback((e: React.MouseEvent, action: 'start' | 'stop') => {
    e.stopPropagation();
    onAction(container.id, action);
  }, [container.id, onAction]);

  const canStart = container.status === 'stopped';
  const canStop = container.status === 'running';

  return (
    <div 
      className="list-item-base rounded-lg p-4 mb-3 cursor-pointer"
      onClick={() => onSelect(container.id)}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4">
          <p className="font-semibold text-base text-gray-100 truncate">{container.name}</p>
          <p className="font-mono text-xs text-neon-blue truncate">{container.id}</p>
        </div>
        <div className="md:col-span-2">
          <Badge className={`${CONTAINER_STATUS_COLORS[container.status]} uppercase`}>{container.status}</Badge>
        </div>
        <div className="md:col-span-3 text-sm text-gray-400">
          Last active: {new Date(container.last_active_at * 1000).toLocaleString()}
        </div>
        <div className="md:col-span-3 flex justify-end items-center space-x-2">
            {canStart && (
              <Button size="sm" variant="secondary" onClick={(e) => handleAction(e, 'start')} title="Start Container" leftIcon={<PlayIcon />} />
            )}
            {canStop && (
              <Button size="sm" variant="secondary" onClick={(e) => handleAction(e, 'stop')} title="Stop Container" leftIcon={<StopIcon />} />
            )}
            <Button size="sm" variant="danger" onClick={handleDelete} title="Delete Container" leftIcon={<DeleteIcon />} />
        </div>
      </div>
    </div>
  );
};

export default ContainerListItem;
