
import React from 'react';
import { OrchestrationTask, Agent } from '../types';
import { ORCHESTRATION_STATUS_COLORS } from '../constants';
import Badge from './ui/Badge';

interface OrchestrationListItemProps {
  task: OrchestrationTask;
  onSelect: (taskId: string) => void;
}

const AgentIcon: React.FC<{ name: Agent['name'] }> = ({ name }) => {
    let colorClass = 'bg-gray-500';
    if (name === 'AlphaAgent') colorClass = 'bg-blue-500';
    if (name === 'BravoAgent') colorClass = 'bg-purple-500';
    if (name === 'TaskflowAgent') colorClass = 'bg-green-500';

    return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${colorClass}`}>
        {name[0]}
        </div>
    );
};

const OrchestrationListItem: React.FC<OrchestrationListItemProps> = ({ task, onSelect }) => {

  return (
    <div 
      className="list-item-base rounded-lg p-4 mb-3 cursor-pointer"
      onClick={() => onSelect(task.id)}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-5">
          <p className="font-semibold text-gray-100 truncate">{task.name}</p>
          <p className="font-mono text-xs text-neon-blue truncate">{task.id}</p>
        </div>
        <div className="md:col-span-2">
          <Badge className={`${ORCHESTRATION_STATUS_COLORS[task.status]} uppercase`}>{task.status.replace('_', ' ')}</Badge>
        </div>
        <div className="md:col-span-3 text-sm text-gray-400 flex items-center">
          {task.agents.map(agent => (
              <AgentIcon key={agent.id} name={agent.name} />
          ))}
        </div>
        <div className="md:col-span-2 text-sm text-gray-400 text-right">
          {new Date(task.updated_at * 1000).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default OrchestrationListItem;
