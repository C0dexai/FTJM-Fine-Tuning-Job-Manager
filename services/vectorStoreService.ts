
import { 
  VectorStore, 
  VectorStoreFile,
  CreateVectorStorePayload
} from '../types';

let vectorStores: VectorStore[] = [
  {
    id: 'vs_abc123',
    object: 'vector_store',
    created_at: Date.now() / 1000 - 86400,
    name: "Customer Support FAQ",
    usage_bytes: 125000,
    file_counts: { in_progress: 0, completed: 3, failed: 0, cancelled: 0, total: 3 },
    status: 'completed',
    last_active_at: Date.now() / 1000 - 3600,
    metadata: { project: 'frontend-docs' },
    expires_at: null,
  },
  {
    id: 'vs_def456',
    object: 'vector_store',
    created_at: Date.now() / 1000 - 600,
    name: "Internal Knowledge Base",
    usage_bytes: 45000,
    file_counts: { in_progress: 1, completed: 1, failed: 0, cancelled: 0, total: 2 },
    status: 'in_progress',
    last_active_at: Date.now() / 1000 - 300,
    metadata: null,
    expires_at: null,
  },
];

let vectorStoreFiles: Record<string, VectorStoreFile[]> = {
  'vs_abc123': [
    { id: 'file-1', object: 'vector_store.file', created_at: Date.now() / 1000 - 86300, vector_store_id: 'vs_abc123', status: 'completed', usage_bytes: 50000, last_error: null },
    { id: 'file-2', object: 'vector_store.file', created_at: Date.now() / 1000 - 86200, vector_store_id: 'vs_abc123', status: 'completed', usage_bytes: 40000, last_error: null },
    { id: 'file-3', object: 'vector_store.file', created_at: Date.now() / 1000 - 86100, vector_store_id: 'vs_abc123', status: 'completed', usage_bytes: 35000, last_error: null },
  ],
  'vs_def456': [
    { id: 'file-4', object: 'vector_store.file', created_at: Date.now() / 1000 - 500, vector_store_id: 'vs_def456', status: 'completed', usage_bytes: 45000, last_error: null },
    { id: 'file-5', object: 'vector_store.file', created_at: Date.now() / 1000 - 400, vector_store_id: 'vs_def456', status: 'in_progress', usage_bytes: 0, last_error: null },
  ],
};

const mockApiCall = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export const listVectorStores = (): Promise<VectorStore[]> => {
  return mockApiCall([...vectorStores].sort((a, b) => b.created_at - a.created_at));
};

export const retrieveVectorStore = (id: string): Promise<VectorStore | undefined> => {
  const store = vectorStores.find(vs => vs.id === id);
  return mockApiCall(store);
};

export const createVectorStore = (payload: CreateVectorStorePayload): Promise<VectorStore> => {
  const newStore: VectorStore = {
    id: `vs_${Math.random().toString(36).substring(2, 8)}`,
    object: 'vector_store',
    name: payload.name,
    created_at: Date.now() / 1000,
    usage_bytes: 0,
    file_counts: { in_progress: 0, completed: 0, failed: 0, cancelled: 0, total: 0 },
    status: 'completed',
    last_active_at: Date.now() / 1000,
    metadata: payload.metadata || null,
    expires_at: null,
  };
  vectorStores.push(newStore);
  vectorStoreFiles[newStore.id] = [];
  return mockApiCall(newStore, 1000);
};

export const deleteVectorStore = (id: string): Promise<{ id: string; deleted: boolean }> => {
  vectorStores = vectorStores.filter(vs => vs.id !== id);
  delete vectorStoreFiles[id];
  return mockApiCall({ id, deleted: true });
};

export const listVectorStoreFiles = (vectorStoreId: string): Promise<VectorStoreFile[]> => {
  const files = vectorStoreFiles[vectorStoreId] || [];
  return mockApiCall([...files].sort((a, b) => b.created_at - a.created_at));
};

export const addFileToVectorStore = (vectorStoreId: string, fileId: string): Promise<VectorStoreFile> => {
    const store = vectorStores.find(vs => vs.id === vectorStoreId);
    if (!store) throw new Error("Vector store not found");

    const newFile: VectorStoreFile = {
        id: fileId,
        object: 'vector_store.file',
        created_at: Date.now() / 1000,
        vector_store_id: vectorStoreId,
        status: 'completed',
        usage_bytes: Math.floor(Math.random() * (50000 - 10000) + 10000),
        last_error: null,
    };

    if (!vectorStoreFiles[vectorStoreId]) {
        vectorStoreFiles[vectorStoreId] = [];
    }
    vectorStoreFiles[vectorStoreId].push(newFile);
    
    store.file_counts.completed++;
    store.file_counts.total++;
    store.usage_bytes += newFile.usage_bytes;

    return mockApiCall(newFile);
}

export const deleteFileFromVectorStore = (vectorStoreId: string, fileId: string): Promise<{ id: string; deleted: boolean }> => {
    const store = vectorStores.find(vs => vs.id === vectorStoreId);
    if (store && vectorStoreFiles[vectorStoreId]) {
        const file = vectorStoreFiles[vectorStoreId].find(f => f.id === fileId);
        if (file) {
            store.file_counts.completed--;
            store.file_counts.total--;
            store.usage_bytes -= file.usage_bytes;
        }
        vectorStoreFiles[vectorStoreId] = vectorStoreFiles[vectorStoreId].filter(f => f.id !== fileId);
    }
    return mockApiCall({ id: fileId, deleted: true });
}
