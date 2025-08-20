
export type JobStatus = 'validating_files' | 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled' | 'paused';

export interface Hyperparameters {
  n_epochs: number | 'auto';
  batch_size: number | 'auto';
  learning_rate_multiplier: number | 'auto';
}

export interface Method {
  type: 'supervised' | 'dpo' | 'reinforcement';
  supervised?: {
    hyperparameters: Hyperparameters;
  };
}

export interface FineTuningJob {
  object: 'fine_tuning.job';
  id: string;
  model: string;
  created_at: number;
  finished_at: number | null;
  fine_tuned_model: string | null;
  organization_id: string;
  result_files: string[];
  status: JobStatus;
  validation_file: string | null;
  training_file: string;
  hyperparameters: Hyperparameters; // Deprecated but present in some responses
  trained_tokens: number | null;
  integrations: any[]; // Define more specifically if needed
  seed: number;
  estimated_finish: number | null;
  method: Method;
  metadata: Record<string, string> | null;
  error: {
    code: string;
    message: string;
    param: string;
  } | null;
}

export interface FineTuningJobEvent {
  object: 'fine_tuning.job.event';
  id: string;
  created_at: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  data: object | null;
  type: string;
}

export interface CheckpointMetrics {
  step?: number;
  train_loss?: number;
  train_mean_token_accuracy?: number;
  valid_loss?: number;
  valid_mean_token_accuracy?: number;
  full_valid_loss?: number;
  full_valid_mean_token_accuracy?: number;
}

export interface FineTuningJobCheckpoint {
  object: 'fine_tuning.job.checkpoint';
  id: string;
  created_at: number;
  fine_tuned_model_checkpoint: string;
  metrics: CheckpointMetrics;
  fine_tuning_job_id: string;
  step_number: number;
}

export interface CreateJobPayload {
  model: string;
  training_file: string;
  validation_file?: string | null;
  suffix?: string | null;
  seed?: number | null;
}

// --- Vector Store Types ---

export type VectorStoreStatus = 'expired' | 'in_progress' | 'completed';
export type VectorStoreFileStatus = 'in_progress' | 'completed' | 'failed' | 'cancelled';

export interface VectorStoreFileCounts {
  in_progress: number;
  completed: number;
  failed: number;
  cancelled: number;
  total: number;
}

export interface VectorStore {
  id: string;
  object: 'vector_store';
  created_at: number;
  name: string;
  usage_bytes: number;
  file_counts: VectorStoreFileCounts;
  status: VectorStoreStatus;
  expires_after?: {
    anchor: 'last_active_at';
    days: number;
  };
  expires_at?: number | null;
  last_active_at: number | null;
  metadata: Record<string, string> | null;
}

export interface VectorStoreFile {
    id: string;
    object: 'vector_store.file';
    created_at: number;
    vector_store_id: string;
    status: VectorStoreFileStatus;
    usage_bytes: number;
    last_error: {
        code: string;
        message: string;
    } | null;
}

export interface CreateVectorStorePayload {
  name: string;
  file_ids?: string[];
  metadata?: Record<string, string> | null;
}

// --- Container Types ---
export type ContainerStatus = 'creating' | 'running' | 'stopped';

export interface Container {
  id: string;
  object: 'container';
  created_at: number;
  status: ContainerStatus;
  expires_after: {
    anchor: 'last_active_at';
    minutes: number;
  };
  last_active_at: number;
  name: string;
}

export interface ContainerFile {
    id: string;
    object: 'container.file';
    created_at: number;
    bytes: number;
    container_id: string;
    path: string;
    source: 'user' | 'assistant';
}

export interface CreateContainerPayload {
  name: string;
}


// --- Orchestration Types ---

export type OrchestrationTaskStatus = 'pending' | 'in_progress' | 'awaiting_review' | 'completed' | 'failed' | 'vetoed';
export type AgentStatus = 'idle' | 'processing' | 'awaiting_input' | 'succeeded' | 'error';

export interface Agent {
  id: 'AlphaAgent' | 'BravoAgent' | 'TaskflowAgent';
  name: 'AlphaAgent' | 'BravoAgent' | 'TaskflowAgent';
  domain: 'Alpha' | 'Bravo' | 'Both';
  status: AgentStatus;
}

export interface HandoverEntry {
  action: string;
  by: string; // Agent name
  at: number; // timestamp
  details: Record<string, any>;
}

export interface WorkflowStep {
  step: string;
  agent: string;
}

export interface OrchestrationTask {
  id: string;
  name: string;
  description: string;
  status: OrchestrationTaskStatus;
  created_at: number;
  updated_at: number;
  agents: Agent[];
  // Handover Spec Fields
  container_id: string;
  operator: string;
  prompt: string;
  chosen_templates: {
    base: string;
    ui: string[];
    datastore: string;
  };
  history: HandoverEntry[];
  workflow: WorkflowStep[];
}

export interface CreateOrchestrationTaskPayload {
  name: string;
  description: string;
}
