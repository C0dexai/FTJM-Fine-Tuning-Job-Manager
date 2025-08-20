
import { JobStatus, VectorStoreStatus, OrchestrationTaskStatus, ContainerStatus } from './types';

export const SUPPORTED_MODELS: string[] = [
  'gpt-4o-mini-2024-07-18',
  'davinci-002',
  'babbage-002',
  'gpt-3.5-turbo',
];

export const STATUS_COLORS: Record<JobStatus, string> = {
  validating_files: 'bg-neon-yellow text-black',
  queued: 'bg-neon-blue text-black',
  running: 'bg-neon-purple text-black animate-pulse',
  succeeded: 'bg-neon-green text-black',
  failed: 'bg-neon-red text-black',
  cancelled: 'bg-neon-gray text-black',
  paused: 'bg-neon-yellow text-black',
};

export const VECTOR_STORE_STATUS_COLORS: Record<VectorStoreStatus, string> = {
  in_progress: 'bg-neon-yellow text-black animate-pulse',
  completed: 'bg-neon-green text-black',
  expired: 'bg-neon-gray text-black',
};

export const CONTAINER_STATUS_COLORS: Record<ContainerStatus, string> = {
  creating: 'bg-neon-yellow text-black animate-pulse',
  running: 'bg-neon-green text-black',
  stopped: 'bg-neon-gray text-black',
};

export const ORCHESTRATION_STATUS_COLORS: Record<OrchestrationTaskStatus, string> = {
  pending: 'bg-neon-gray text-black',
  in_progress: 'bg-neon-blue text-black animate-pulse',
  awaiting_review: 'bg-neon-yellow text-black',
  completed: 'bg-neon-green text-black',
  failed: 'bg-neon-red text-black',
  vetoed: 'bg-neon-pink text-black',
};
