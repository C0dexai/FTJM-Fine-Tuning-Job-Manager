
import React from 'react';
import { FineTuningJob } from '../types';
import JobListItem from './JobListItem';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface FineTuningDashboardProps {
  jobs: FineTuningJob[];
  isLoading: boolean;
  onSelectJob: (jobId: string) => void;
  onRefresh: () => void;
  onAction: (jobId: string, action: 'cancel' | 'pause' | 'resume') => void;
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


const FineTuningDashboard: React.FC<FineTuningDashboardProps> = ({
  jobs,
  isLoading,
  onSelectJob,
  onRefresh,
  onAction,
  onOpenCreateModal,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Fine-Tuning Jobs</h1>
          <p className="mt-1 text-gray-400">Manage and monitor your fine-tuning jobs.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={onRefresh} disabled={isLoading} leftIcon={<RefreshIcon />}>
            Refresh
          </Button>
          <Button variant="primary" onClick={onOpenCreateModal} leftIcon={<PlusIcon />}>
            Create Job
          </Button>
        </div>
      </div>

      <div className="card-base p-4">
        {isLoading && jobs.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : jobs.length > 0 ? (
          <div>
            {jobs.map(job => (
              <JobListItem
                key={job.id}
                job={job}
                onSelect={onSelectJob}
                onAction={onAction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-white">No Jobs Found</h3>
            <p className="text-gray-400 mt-2">Get started by creating your first fine-tuning job.</p>
            <Button variant="primary" onClick={onOpenCreateModal} className="mt-6" leftIcon={<PlusIcon />}>
                Create Job
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FineTuningDashboard;
