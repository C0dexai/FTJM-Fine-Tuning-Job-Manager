
import { 
  FineTuningJob, 
  FineTuningJobEvent, 
  FineTuningJobCheckpoint, 
  JobStatus, 
  CreateJobPayload
} from '../types';

let jobs: FineTuningJob[] = [
  {
    id: 'ftjob-abc123',
    object: 'fine_tuning.job',
    model: 'gpt-4o-mini-2024-07-18',
    created_at: Date.now() / 1000 - 3600,
    finished_at: null,
    fine_tuned_model: null,
    organization_id: 'org-123',
    result_files: [],
    status: 'running',
    validation_file: 'file-def456',
    training_file: 'file-abc123',
    hyperparameters: { n_epochs: 'auto', batch_size: 'auto', learning_rate_multiplier: 'auto' },
    trained_tokens: 15000,
    integrations: [],
    seed: 42,
    estimated_finish: Date.now() / 1000 + 1800,
    method: { type: 'supervised', supervised: { hyperparameters: { n_epochs: 'auto', batch_size: 'auto', learning_rate_multiplier: 'auto' } } },
    metadata: { user: 'test-user-1' },
    error: null,
  },
  {
    id: 'ftjob-def456',
    object: 'fine_tuning.job',
    model: 'davinci-002',
    created_at: Date.now() / 1000 - 86400,
    finished_at: Date.now() / 1000 - 82000,
    fine_tuned_model: 'ft:davinci-002:my-org:custom_suffix:7q8mpxmy',
    organization_id: 'org-123',
    result_files: ['file-res789'],
    status: 'succeeded',
    validation_file: null,
    training_file: 'file-ghi789',
    hyperparameters: { n_epochs: 4, batch_size: 1, learning_rate_multiplier: 1.0 },
    trained_tokens: 5768,
    integrations: [],
    seed: 0,
    estimated_finish: null,
    method: { type: 'supervised', supervised: { hyperparameters: { n_epochs: 4, batch_size: 1, learning_rate_multiplier: 1.0 } } },
    metadata: null,
    error: null,
  },
  {
    id: 'ftjob-ghi789',
    object: 'fine_tuning.job',
    model: 'babbage-002',
    created_at: Date.now() / 1000 - 172800,
    finished_at: Date.now() / 1000 - 170000,
    fine_tuned_model: null,
    organization_id: 'org-123',
    result_files: [],
    status: 'failed',
    validation_file: null,
    training_file: 'file-jkl012',
    hyperparameters: { n_epochs: 2, batch_size: 8, learning_rate_multiplier: 'auto' },
    trained_tokens: 2200,
    integrations: [],
    seed: 123,
    estimated_finish: null,
    method: { type: 'supervised', supervised: { hyperparameters: { n_epochs: 2, batch_size: 8, learning_rate_multiplier: 'auto' } } },
    metadata: { experiment: 'low-lr' },
    error: { code: 'invalid_data', message: 'Training data format error at line 52', param: 'training_file' },
  },
  {
    id: 'ftjob-jkl012',
    object: 'fine_tuning.job',
    model: 'gpt-3.5-turbo',
    created_at: Date.now() / 1000 - 500,
    finished_at: null,
    fine_tuned_model: null,
    organization_id: 'org-123',
    result_files: [],
    status: 'queued',
    validation_file: null,
    training_file: 'file-mno345',
    hyperparameters: { n_epochs: 'auto', batch_size: 'auto', learning_rate_multiplier: 'auto' },
    trained_tokens: null,
    integrations: [],
    seed: 999,
    estimated_finish: Date.now() / 1000 + 7200,
    method: { type: 'supervised', supervised: { hyperparameters: { n_epochs: 'auto', batch_size: 'auto', learning_rate_multiplier: 'auto' } } },
    metadata: null,
    error: null,
  },
];

const mockApiCall = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export const listJobs = (): Promise<FineTuningJob[]> => {
  return mockApiCall([...jobs].sort((a, b) => b.created_at - a.created_at));
};

export const retrieveJob = (jobId: string): Promise<FineTuningJob | undefined> => {
  const job = jobs.find(j => j.id === jobId);
  return mockApiCall(job);
};

export const createJob = (payload: CreateJobPayload): Promise<FineTuningJob> => {
  const newJob: FineTuningJob = {
    id: `ftjob-${Math.random().toString(36).substring(2, 8)}`,
    object: 'fine_tuning.job',
    model: payload.model,
    created_at: Date.now() / 1000,
    finished_at: null,
    fine_tuned_model: null,
    organization_id: 'org-123',
    result_files: [],
    status: 'queued',
    validation_file: payload.validation_file || null,
    training_file: payload.training_file,
    hyperparameters: { n_epochs: 'auto', batch_size: 'auto', learning_rate_multiplier: 'auto' },
    trained_tokens: null,
    integrations: [],
    seed: payload.seed || Math.floor(Math.random() * 10000),
    estimated_finish: Date.now() / 1000 + 3600,
    method: { type: 'supervised', supervised: { hyperparameters: { n_epochs: 'auto', batch_size: 'auto', learning_rate_multiplier: 'auto' } } },
    metadata: { suffix: payload.suffix || 'none' },
    error: null,
  };
  jobs.push(newJob);
  return mockApiCall(newJob, 1000);
};

const updateJobStatus = (jobId: string, status: JobStatus): Promise<FineTuningJob | undefined> => {
  const jobIndex = jobs.findIndex(j => j.id === jobId);
  if (jobIndex > -1) {
    const job = jobs[jobIndex];
    job.status = status;
    if (status === 'cancelled' || status === 'failed' || status === 'succeeded') {
        job.finished_at = Date.now() / 1000;
        job.estimated_finish = null;
    }
    return mockApiCall({ ...job });
  }
  return mockApiCall(undefined);
};

export const cancelJob = (jobId: string) => updateJobStatus(jobId, 'cancelled');
export const pauseJob = (jobId: string) => updateJobStatus(jobId, 'paused');
export const resumeJob = (jobId: string) => updateJobStatus(jobId, 'running');

export const listEvents = (jobId: string): Promise<FineTuningJobEvent[]> => {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return mockApiCall([]);

  const events: FineTuningJobEvent[] = [
    { id: `ftevent-${Math.random().toString(36).substring(2, 8)}`, object: 'fine_tuning.job.event', created_at: job.created_at, level: 'info', message: 'Created fine-tuning job', data: {}, type: 'message' },
    { id: `ftevent-${Math.random().toString(36).substring(2, 8)}`, object: 'fine_tuning.job.event', created_at: job.created_at + 1, level: 'info', message: 'Validating training file...', data: {}, type: 'message' },
  ];

  if (job.status !== 'queued' && job.status !== 'validating_files') {
    events.push({ id: `ftevent-${Math.random().toString(36).substring(2, 8)}`, object: 'fine_tuning.job.event', created_at: job.created_at + 10, level: 'info', message: `Fine-tuning job started`, data: {}, type: 'message' });
  }
  if (job.status === 'succeeded') {
    events.push({ id: `ftevent-${Math.random().toString(36).substring(2, 8)}`, object: 'fine_tuning.job.event', created_at: job.finished_at!, level: 'info', message: `New fine-tuned model created: ${job.fine_tuned_model}`, data: {}, type: 'message' });
    events.push({ id: `ftevent-${Math.random().toString(36).substring(2, 8)}`, object: 'fine_tuning.job.event', created_at: job.finished_at!, level: 'info', message: 'Fine tuning job successfully completed', data: {}, type: 'message' });
  }
  if (job.status === 'failed') {
     events.push({ id: `ftevent-${Math.random().toString(36).substring(2, 8)}`, object: 'fine_tuning.job.event', created_at: job.finished_at!, level: 'error', message: job.error?.message || 'Job failed unexpectedly', data: {}, type: 'message' });
  }
  
  return mockApiCall(events.sort((a,b) => b.created_at - a.created_at));
};

export const listCheckpoints = (jobId: string): Promise<FineTuningJobCheckpoint[]> => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || job.status === 'queued' || job.status === 'validating_files') return mockApiCall([]);

    const checkpoints: FineTuningJobCheckpoint[] = [];
    const steps = (job.status === 'succeeded' || job.status === 'failed') ? 10 : 5;
    for (let i = 1; i <= steps; i++) {
        const step = i * 100;
        checkpoints.push({
            id: `ftckpt-${job.id}-${step}`,
            object: 'fine_tuning.job.checkpoint',
            created_at: job.created_at + (i * 300),
            fine_tuned_model_checkpoint: `ft:${job.model}:my-org::${job.id.slice(6)}:ckpt-step-${step}`,
            fine_tuning_job_id: jobId,
            step_number: step,
            metrics: {
                step: step,
                train_loss: 2.5 - i * 0.18,
                train_mean_token_accuracy: 0.6 + i * 0.03,
                valid_loss: 2.6 - i * 0.15,
                valid_mean_token_accuracy: 0.58 + i * 0.035,
            }
        });
    }

    return mockApiCall(checkpoints.sort((a, b) => b.step_number - a.step_number));
};
