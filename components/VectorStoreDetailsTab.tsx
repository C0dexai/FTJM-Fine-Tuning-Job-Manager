
import React from 'react';
import { VectorStore } from '../types';
import Card from './ui/Card';

interface VectorStoreDetailsTabProps {
  vectorStore: VectorStore;
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <dt className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</dt>
    <dd className="mt-1 text-sm text-gray-200 font-mono break-words">{children || <span className="text-gray-500">N/A</span>}</dd>
  </div>
);

const VectorStoreDetailsTab: React.FC<VectorStoreDetailsTabProps> = ({ vectorStore }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <h3 className="text-lg font-semibold text-white mb-4">Store Details</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <DetailItem label="Vector Store ID">{vectorStore.id}</DetailItem>
          <DetailItem label="Name">{vectorStore.name}</DetailItem>
          <DetailItem label="Status">{vectorStore.status}</DetailItem>
          <DetailItem label="Usage (Bytes)">{vectorStore.usage_bytes.toLocaleString()}</DetailItem>
          <DetailItem label="Created At">{new Date(vectorStore.created_at * 1000).toLocaleString()}</DetailItem>
          <DetailItem label="Last Active At">{vectorStore.last_active_at ? new Date(vectorStore.last_active_at * 1000).toLocaleString() : 'Never'}</DetailItem>
          <DetailItem label="Expires At">{vectorStore.expires_at ? new Date(vectorStore.expires_at * 1000).toLocaleString() : 'Never'}</DetailItem>
          <DetailItem label="Metadata">{vectorStore.metadata ? JSON.stringify(vectorStore.metadata) : 'None'}</DetailItem>
        </dl>
      </Card>

       <Card className="lg:col-span-1">
        <h3 className="text-lg font-semibold text-white mb-4">File Counts</h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem label="Completed">{vectorStore.file_counts.completed}</DetailItem>
            <DetailItem label="In Progress">{vectorStore.file_counts.in_progress}</DetailItem>
            <DetailItem label="Failed">{vectorStore.file_counts.failed}</DetailItem>
            <DetailItem label="Cancelled">{vectorStore.file_counts.cancelled}</DetailItem>
            <DetailItem label="Total">{vectorStore.file_counts.total}</DetailItem>
        </dl>
      </Card>
    </div>
  );
};

export default VectorStoreDetailsTab;
