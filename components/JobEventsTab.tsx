
import React from 'react';
import { FineTuningJobEvent } from '../types';
import Card from './ui/Card';

interface JobEventsTabProps {
  events: FineTuningJobEvent[];
}

const getLevelTextColor = (level: 'info' | 'warn' | 'error') => {
  switch (level) {
    case 'info': return 'text-neon-blue';
    case 'warn': return 'text-neon-yellow';
    case 'error': return 'text-neon-red';
    default: return 'text-gray-400';
  }
};

const getLevelBgColor = (level: 'info' | 'warn' | 'error') => {
  switch (level) {
    case 'info': return 'bg-neon-blue';
    case 'warn': return 'bg-neon-yellow';
    case 'error': return 'bg-neon-red';
    default: return 'bg-gray-400';
  }
};


const JobEventsTab: React.FC<JobEventsTabProps> = ({ events }) => {
  if (events.length === 0) {
    return <div className="text-center text-gray-400 py-8">No events to display.</div>;
  }

  return (
    <Card padding="p-0">
        <div className="flow-root">
            <ul role="list" className="divide-y divide-[rgba(255,255,255,0.1)]">
                {events.map((event) => (
                    <li key={event.id} className="p-4 sm:p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 pt-1">
                                <span className={`inline-block h-2.5 w-2.5 rounded-full ${getLevelBgColor(event.level)}`}></span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-200 truncate">{event.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className={`font-semibold ${getLevelTextColor(event.level)}`}>{event.level.toUpperCase()}</span>
                                    <span className="mx-2">·</span>
                                    <span>{new Date(event.created_at * 1000).toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </Card>
  );
};

export default JobEventsTab;
