
import React from 'react';
import { Container } from '../types';
import Card from './ui/Card';

interface ContainerDetailsTabProps {
  container: Container;
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <dt className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</dt>
    <dd className="mt-1 text-sm text-gray-200 font-mono break-words">{children || <span className="text-gray-500">N/A</span>}</dd>
  </div>
);

const ContainerDetailsTab: React.FC<ContainerDetailsTabProps> = ({ container }) => {
  const maskedApiKey = container.env?.API_KEY 
    ? `${container.env.API_KEY.substring(0, 4)}...${container.env.API_KEY.slice(-4)}`
    : undefined;

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Container Details</h3>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <DetailItem label="Container ID">{container.id}</DetailItem>
        <DetailItem label="Name">{container.name}</DetailItem>
        <DetailItem label="Status">{container.status}</DetailItem>
        <DetailItem label="Created At">{new Date(container.created_at * 1000).toLocaleString()}</DetailItem>
        <DetailItem label="Last Active At">{new Date(container.last_active_at * 1000).toLocaleString()}</DetailItem>
        <DetailItem label="Expires After">
          {`${container.expires_after.minutes} minutes from ${container.expires_after.anchor.replace('_', ' ')}`}
        </DetailItem>
        <DetailItem label="API Name">{container.env?.API_NAME}</DetailItem>
        <DetailItem label="API Key">{maskedApiKey}</DetailItem>
      </dl>
    </Card>
  );
};

export default ContainerDetailsTab;