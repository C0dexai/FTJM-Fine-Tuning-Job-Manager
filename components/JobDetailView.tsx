
import React, { useState, useEffect, useCallback } from 'react';
import { FineTuningJob, FineTuningJobEvent, FineTuningJobCheckpoint } from '../types';
import { STATUS_COLORS } from '../constants';
import { listEvents, listCheckpoints } from '../services/fineTuningService';
import Spinner from './ui/Spinner';
import Badge from './ui/Badge';
import Card from './ui/Card';
import JobDetailsTab from './JobDetailsTab';
import JobEventsTab from './JobEventsTab';
import JobCheckpointsTab from './JobCheckpointsTab';

interface JobDetailViewProps {
  job: FineTuningJob;
  onBack: () => void;
}

type Tab = 'Details' | 'Events' | 'Checkpoints';

const JobDetailView: React.FC<JobDetailViewProps> = ({ job, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Details');
  const [events, setEvents] = useState<FineTuningJobEvent[]>([]);
  const [checkpoints, setCheckpoints] = useState<FineTuningJobCheckpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (jobId: string) => {
    setIsLoading(true);
    try {
      const [eventsData, checkpointsData] = await Promise.all([
        listEvents(jobId),
        listCheckpoints(jobId)
      ]);
      setEvents(eventsData);
      setCheckpoints(checkpointsData);
    } catch (error) {
      console.error("Failed to fetch job data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(job.id);
  }, [job.id, fetchData]);

  const renderTabContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center py-20"><Spinner /></div>;
    }
    switch (activeTab) {
      case 'Details':
        return <JobDetailsTab job={job} />;
      case 'Events':
        return <JobEventsTab events={events} />;
      case 'Checkpoints':
        return <JobCheckpointsTab checkpoints={checkpoints} />;
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
              Back to Jobs List
            </button>
            <h2 className="text-2xl font-bold text-white truncate">{job.id}</h2>
            <p className="text-gray-400 mt-1">{job.model}</p>
          </div>
          <div className="flex-shrink-0">
            <Badge className={`${STATUS_COLORS[job.status]} text-base uppercase`}>{job.status.replace('_',' ')}</Badge>
          </div>
        </div>
      </Card>

      <div>
        <div className="border-b border-[rgba(255,255,255,0.1)] mb-6">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {(['Details', 'Events', 'Checkpoints'] as Tab[]).map((tabName) => (
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

export default JobDetailView;
