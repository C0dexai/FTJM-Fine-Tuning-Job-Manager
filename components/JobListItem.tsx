
import React, { useCallback } from 'react';
import { FineTuningJob } from '../types';
import { STATUS_COLORS } from '../constants';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface JobListItemProps {
  job: FineTuningJob;
  onSelect: (jobId: string) => void;
  onAction: (jobId: string, action: 'cancel' | 'pause' | 'resume') => void;
}

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
);
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
);
const CancelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
);

const JobListItem: React.FC<JobListItemProps> = ({ job, onSelect, onAction }) => {
  const handleAction = useCallback((e: React.MouseEvent, action: 'cancel' | 'pause' | 'resume') => {
    e.stopPropagation();
    onAction(job.id, action);
  }, [job.id, onAction]);

  const canCancel = ['queued', 'running'].includes(job.status);
  const canPause = job.status === 'running';
  const canResume = job.status === 'paused';

  return (
    <div 
      className="list-item-base rounded-lg p-4 mb-3 cursor-pointer"
      onClick={() => onSelect(job.id)}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4">
          <p className="font-mono text-sm text-neon-blue truncate">{job.id}</p>
          <p className="text-gray-400 text-xs">{job.model}</p>
        </div>
        <div className="md:col-span-2">
          <Badge className={`${STATUS_COLORS[job.status]} uppercase`}>{job.status.replace('_', ' ')}</Badge>
        </div>
        <div className="md:col-span-2 text-sm text-gray-400">
          {new Date(job.created_at * 1000).toLocaleString()}
        </div>
        <div className="md:col-span-2 text-sm text-gray-300">
          {job.fine_tuned_model ? (
            <p className="font-mono text-xs truncate" title={job.fine_tuned_model}>{job.fine_tuned_model}</p>
          ) : (
            <span className="text-gray-500">Not available</span>
          )}
        </div>
        <div className="md:col-span-2 flex justify-end items-center space-x-2">
          {canPause && (
            <Button size="sm" variant="secondary" onClick={(e) => handleAction(e, 'pause')} title="Pause Job" leftIcon={<PauseIcon />} />
          )}
          {canResume && (
            <Button size="sm" variant="secondary" onClick={(e) => handleAction(e, 'resume')} title="Resume Job" leftIcon={<PlayIcon />} />
          )}
          {canCancel && (
            <Button size="sm" variant="danger" onClick={(e) => handleAction(e, 'cancel')} title="Cancel Job" leftIcon={<CancelIcon />} />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListItem;
