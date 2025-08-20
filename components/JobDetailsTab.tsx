
import React from 'react';
import { FineTuningJob } from '../types';
import Card from './ui/Card';

interface JobDetailsTabProps {
  job: FineTuningJob;
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={className}>
    <dt className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</dt>
    <dd className="mt-1 text-sm text-gray-200 font-mono break-words">{children || <span className="text-gray-500">N/A</span>}</dd>
  </div>
);

const JobDetailsTab: React.FC<JobDetailsTabProps> = ({ job }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <h3 className="text-lg font-semibold text-white mb-4">Job Configuration</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <DetailItem label="Job ID" className="md:col-span-2">{job.id}</DetailItem>
          <DetailItem label="Base Model">{job.model}</DetailItem>
          <DetailItem label="Fine-Tuned Model">{job.fine_tuned_model}</DetailItem>
          <DetailItem label="Training File ID">{job.training_file}</DetailItem>
          <DetailItem label="Validation File ID">{job.validation_file}</DetailItem>
          <DetailItem label="Organization ID">{job.organization_id}</DetailItem>
          <DetailItem label="Trained Tokens">{job.trained_tokens?.toLocaleString()}</DetailItem>
          <DetailItem label="Seed">{job.seed}</DetailItem>
        </dl>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Timestamps</h3>
        <dl className="space-y-6">
          <DetailItem label="Created At">{new Date(job.created_at * 1000).toLocaleString()}</DetailItem>
          <DetailItem label="Finished At">{job.finished_at ? new Date(job.finished_at * 1000).toLocaleString() : 'In progress'}</DetailItem>
          <DetailItem label="Estimated Finish">{job.estimated_finish ? new Date(job.estimated_finish * 1000).toLocaleString() : 'N/A'}</DetailItem>
        </dl>
      </Card>
      
      {job.error && (
        <Card className="lg:col-span-3 !border-neon-red">
          <h3 className="text-lg font-semibold text-neon-red mb-2">Error Details</h3>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
            <DetailItem label="Code"><span className="text-red-400">{job.error.code}</span></DetailItem>
            <DetailItem label="Parameter"><span className="text-red-400">{job.error.param}</span></DetailItem>
            <DetailItem label="Message"><span className="text-red-400">{job.error.message}</span></DetailItem>
          </dl>
        </Card>
      )}

      <Card className="lg:col-span-3">
        <h3 className="text-lg font-semibold text-white mb-4">Hyperparameters</h3>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <DetailItem label="Epochs">{job.method.supervised?.hyperparameters.n_epochs}</DetailItem>
          <DetailItem label="Batch Size">{job.method.supervised?.hyperparameters.batch_size}</DetailItem>
          <DetailItem label="Learning Rate Multiplier">{job.method.supervised?.hyperparameters.learning_rate_multiplier}</DetailItem>
        </dl>
      </Card>
    </div>
  );
};

export default JobDetailsTab;
