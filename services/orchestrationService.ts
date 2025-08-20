
import { 
  OrchestrationTask,
  CreateOrchestrationTaskPayload,
  OrchestrationTaskStatus
} from '../types';

const now = Date.now();

let tasks: OrchestrationTask[] = [
  {
    id: 'orch-task-1',
    name: 'Build fancy to-do app',
    description: 'Build fancy to-do app with React + Tailwind + IndexedDB',
    status: 'awaiting_review',
    created_at: now / 1000 - 86400,
    updated_at: now / 1000 - 3600,
    container_id: 'container_a1b2c3d4',
    operator: 'andoy',
    prompt: 'Build fancy to-do app with React + Tailwind + IndexedDB',
    chosen_templates: {
      base: 'REACT',
      ui: ['TAILWIND'],
      datastore: 'IndexedDB',
    },
    agents: [
      { id: 'TaskflowAgent', name: 'TaskflowAgent', domain: 'Both', status: 'succeeded' },
      { id: 'AlphaAgent', name: 'AlphaAgent', domain: 'Alpha', status: 'succeeded' },
      { id: 'BravoAgent', name: 'BravoAgent', domain: 'Bravo', status: 'awaiting_input' },
    ],
    workflow: [
      { step: 'parse_prompt', agent: 'TaskflowAgent' },
      { step: 'match_registry', agent: 'TaskflowAgent' },
      { step: 'create_container', agent: 'TaskflowAgent' },
      { step: 'build_ui', agent: 'AlphaAgent' },
      { step: 'setup_services', agent: 'BravoAgent' },
      { step: 'datastore_integration', agent: 'BravoAgent' },
      { step: 'finalize_handover', agent: 'TaskflowAgent' },
    ],
    history: [
      { action: 'create', by: 'TaskflowAgent', at: now - 86400 * 1000, details: { container: 'initialized' } },
      { action: 'ui-update', by: 'AlphaAgent', at: now - 85000 * 1000, details: { template_used: 'REACT', components_added: ['ToDoList', 'GlassCard'], notes: 'Applied Tailwind glassmorphism.' } },
      { action: 'service-setup', by: 'BravoAgent', at: now - 84000 * 1000, details: { service: 'NODE_EXPRESS', endpoint: '/api/tasks', notes: 'Express server created.' } },
      { action: 'system-event', by: 'System', at: now - 3600 * 1000, details: { message: 'Awaiting human review before datastore integration.' } }
    ],
  },
  {
    id: 'orch-task-2',
    name: 'Propagate Security Patch KB-0345',
    description: 'Distribute knowledge base article for security patch KB-0345 to all relevant system documentation.',
    status: 'in_progress',
    created_at: now / 1000 - 7200,
    updated_at: now / 1000 - 600,
    container_id: 'container_e5f6g7h8',
    operator: 'system',
    prompt: 'Distribute knowledge base article for security patch KB-0345',
    chosen_templates: { base: 'DOCS', ui: [], datastore: 'NONE' },
    agents: [
      { id: 'TaskflowAgent', name: 'TaskflowAgent', domain: 'Both', status: 'succeeded' },
      { id: 'AlphaAgent', name: 'AlphaAgent', domain: 'Alpha', status: 'processing' },
      { id: 'BravoAgent', name: 'BravoAgent', domain: 'Bravo', status: 'processing' },
    ],
     workflow: [
      { step: 'parse_prompt', agent: 'TaskflowAgent' },
      { step: 'scan_docs_alpha', agent: 'AlphaAgent' },
      { step: 'scan_docs_bravo', agent: 'BravoAgent' },
      { step: 'apply_patch_notes', agent: 'TaskflowAgent' },
    ],
    history: [
      { action: 'create', by: 'Human Operator', at: now - 7200 * 1000, details: { priority: 'high' } },
      { action: 'communication', by: 'AlphaAgent', at: now - 600 * 1000, details: { to: 'BravoAgent', message: 'I am parsing the patch notes now.' } },
      { action: 'communication', by: 'BravoAgent', at: now - 500 * 1000, details: { to: 'AlphaAgent', message: 'Acknowledged. I am scanning Domain B for affected documentation.' } },
    ],
  },
];

const mockApiCall = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export const listTasks = (): Promise<OrchestrationTask[]> => {
  return mockApiCall([...tasks].sort((a, b) => b.created_at - a.created_at));
};

export const retrieveTask = (taskId: string): Promise<OrchestrationTask | undefined> => {
  const task = tasks.find(j => j.id === taskId);
  return mockApiCall(task);
};

export const createTask = (payload: CreateOrchestrationTaskPayload): Promise<OrchestrationTask> => {
  const newTask: OrchestrationTask = {
    id: `orch-task-${Math.random().toString(36).substring(2, 8)}`,
    name: payload.name,
    description: payload.description,
    status: 'pending',
    created_at: Date.now() / 1000,
    updated_at: Date.now() / 1000,
    container_id: `container_${Math.random().toString(36).substring(2, 8)}`,
    operator: 'Human Operator',
    prompt: payload.description,
    chosen_templates: { base: 'TBD', ui: [], datastore: 'TBD' },
    agents: [
      { id: 'TaskflowAgent', name: 'TaskflowAgent', domain: 'Both', status: 'idle' },
      { id: 'AlphaAgent', name: 'AlphaAgent', domain: 'Alpha', status: 'idle' },
      { id: 'BravoAgent', name: 'BravoAgent', domain: 'Bravo', status: 'idle' },
    ],
    workflow: [
       { step: 'parse_prompt', agent: 'TaskflowAgent' }
    ],
    history: [
       { action: 'create', by: 'Human Operator', at: Date.now(), details: { message: 'Task created.' } },
    ],
  };
  tasks.push(newTask);
  return mockApiCall(newTask, 1000);
};

export const updateTaskStatus = (taskId: string, status: OrchestrationTaskStatus, message?: string): Promise<OrchestrationTask | undefined> => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex > -1) {
    tasks[taskIndex].status = status;
    tasks[taskIndex].updated_at = Date.now() / 1000;
    tasks[taskIndex].history.push({
      action: 'status-update',
      by: 'Human Operator',
      at: Date.now(),
      details: { message: message || `Task status updated to ${status}.` }
    });
    return mockApiCall(tasks[taskIndex]);
  }
  return mockApiCall(undefined);
};
