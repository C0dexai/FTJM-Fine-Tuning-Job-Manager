
import { 
  Container, 
  ContainerFile,
  CreateContainerPayload,
  ContainerStatus
} from '../types';

let containers: Container[] = [
  {
    id: 'cntr_abc123',
    object: 'container',
    created_at: Date.now() / 1000 - 3600,
    name: "Staging Environment - Web App",
    status: 'running',
    last_active_at: Date.now() / 1000 - 60,
    expires_after: { anchor: 'last_active_at', minutes: 20 },
  },
  {
    id: 'cntr_def456',
    object: 'container',
    created_at: Date.now() / 1000 - 86400,
    name: "Data Analysis Task - Q2",
    status: 'stopped',
    last_active_at: Date.now() / 1000 - 43200,
    expires_after: { anchor: 'last_active_at', minutes: 20 },
  },
   {
    id: 'cntr_ghi789',
    object: 'container',
    created_at: Date.now() / 1000 - 600,
    name: "New Project Bootstrap",
    status: 'creating',
    last_active_at: Date.now() / 1000 - 300,
    expires_after: { anchor: 'last_active_at', minutes: 20 },
  },
];

let containerFiles: Record<string, ContainerFile[]> = {
  'cntr_abc123': [
    { id: 'cfile_1', object: 'container.file', created_at: Date.now() / 1000 - 3500, container_id: 'cntr_abc123', path: '/mnt/data/index.html', source: 'user', bytes: 1500 },
    { id: 'cfile_2', object: 'container.file', created_at: Date.now() / 1000 - 3400, container_id: 'cntr_abc123', path: '/mnt/data/app.js', source: 'user', bytes: 120500 },
    { id: 'cfile_3', object: 'container.file', created_at: Date.now() / 1000 - 3300, container_id: 'cntr_abc123', path: '/mnt/data/output.log', source: 'assistant', bytes: 880 },
  ],
  'cntr_def456': [
    { id: 'cfile_4', object: 'container.file', created_at: Date.now() / 1000 - 86300, container_id: 'cntr_def456', path: '/mnt/data/dataset.csv', source: 'user', bytes: 5450000 },
  ],
  'cntr_ghi789': [],
};

const mockApiCall = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export const listContainers = (): Promise<Container[]> => {
  return mockApiCall([...containers].sort((a, b) => b.created_at - a.created_at));
};

export const retrieveContainer = (id: string): Promise<Container | undefined> => {
  const container = containers.find(c => c.id === id);
  return mockApiCall(container);
};

export const createContainer = (payload: CreateContainerPayload): Promise<Container> => {
  const newContainer: Container = {
    id: `cntr_${Math.random().toString(36).substring(2, 8)}`,
    object: 'container',
    name: payload.name,
    created_at: Date.now() / 1000,
    status: 'running',
    last_active_at: Date.now() / 1000,
    expires_after: { anchor: 'last_active_at', minutes: 20 },
  };
  containers.push(newContainer);
  containerFiles[newContainer.id] = [];
  return mockApiCall(newContainer, 1000);
};

export const deleteContainer = (id: string): Promise<{ id: string; deleted: boolean }> => {
  containers = containers.filter(c => c.id !== id);
  delete containerFiles[id];
  return mockApiCall({ id, deleted: true });
};

export const listContainerFiles = (containerId: string): Promise<ContainerFile[]> => {
  const files = containerFiles[containerId] || [];
  return mockApiCall([...files].sort((a, b) => b.created_at - a.created_at));
};

export const addFileToContainer = (containerId: string, fileId: string): Promise<ContainerFile> => {
    const container = containers.find(c => c.id === containerId);
    if (!container) throw new Error("Container not found");

    const newFile: ContainerFile = {
        id: fileId,
        object: 'container.file',
        created_at: Date.now() / 1000,
        container_id: containerId,
        path: `/mnt/data/${fileId}.tmp`,
        source: 'user',
        bytes: Math.floor(Math.random() * (50000 - 10000) + 10000),
    };

    if (!containerFiles[containerId]) {
        containerFiles[containerId] = [];
    }
    containerFiles[containerId].push(newFile);
    
    return mockApiCall(newFile);
}

export const deleteFileFromContainer = (containerId: string, fileId: string): Promise<{ id: string; deleted: boolean }> => {
    if (containerFiles[containerId]) {
        containerFiles[containerId] = containerFiles[containerId].filter(f => f.id !== fileId);
    }
    return mockApiCall({ id: fileId, deleted: true });
}
