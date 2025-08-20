
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FineTuningJobCheckpoint } from '../types';
import Card from './ui/Card';

interface JobCheckpointsTabProps {
  checkpoints: FineTuningJobCheckpoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 p-3 border border-gray-600 rounded-md shadow-lg">
        <p className="label font-bold text-gray-200">{`Step ${label}`}</p>
        {payload.map((pld: any) => (
          <p key={pld.name} style={{ color: pld.color }} className="text-sm">
            {`${pld.name}: ${pld.value.toFixed(4)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const JobCheckpointsTab: React.FC<JobCheckpointsTabProps> = ({ checkpoints }) => {
  const chartData = useMemo(() => {
    return checkpoints
      .map(c => ({
        name: c.step_number,
        'Train Loss': c.metrics.train_loss,
        'Validation Loss': c.metrics.valid_loss,
        'Train Accuracy': c.metrics.train_mean_token_accuracy,
      }))
      .sort((a, b) => a.name! - b.name!);
  }, [checkpoints]);

  if (checkpoints.length === 0) {
    return <div className="text-center text-gray-400 py-8">No checkpoints available for this job yet.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Training Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="var(--text-muted-color)" tick={{ fontSize: 12 }} />
            <YAxis stroke="var(--text-muted-color)" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{fontSize: "14px", color: 'var(--text-color)'}}/>
            <Line type="monotone" dataKey="Train Loss" stroke="var(--neon-purple)" activeDot={{ r: 8 }} strokeWidth={2} />
            <Line type="monotone" dataKey="Validation Loss" stroke="var(--neon-green)" strokeWidth={2} />
            <Line type="monotone" dataKey="Train Accuracy" stroke="var(--neon-pink)" yAxisId={0} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Checkpoints List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-black/30">
              <tr>
                <th scope="col" className="px-6 py-3">Step</th>
                <th scope="col" className="px-6 py-3">Checkpoint ID</th>
                <th scope="col" className="px-6 py-3">Created At</th>
                <th scope="col" className="px-6 py-3">Train Loss</th>
                <th scope="col" className="px-6 py-3">Validation Loss</th>
              </tr>
            </thead>
            <tbody>
              {checkpoints.map(cp => (
                <tr key={cp.id} className="border-b border-[rgba(255,255,255,0.1)] hover:bg-white/5">
                  <td className="px-6 py-4 font-medium">{cp.step_number}</td>
                  <td className="px-6 py-4 font-mono text-xs">{cp.fine_tuned_model_checkpoint}</td>
                  <td className="px-6 py-4">{new Date(cp.created_at * 1000).toLocaleString()}</td>
                  <td className="px-6 py-4">{cp.metrics.train_loss?.toFixed(4) || 'N/A'}</td>
                  <td className="px-6 py-4">{cp.metrics.valid_loss?.toFixed(4) || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default JobCheckpointsTab;
