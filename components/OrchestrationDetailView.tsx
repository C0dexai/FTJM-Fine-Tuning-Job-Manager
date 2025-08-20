
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { OrchestrationTask, Agent, WorkflowStep } from '../types';
import { ORCHESTRATION_STATUS_COLORS } from '../constants';
import { updateTaskStatus } from '../services/orchestrationService';
import Spinner from './ui/Spinner';
import Badge from './ui/Badge';
import Card from './ui/Card';
import Button from './ui/Button';

interface OrchestrationDetailViewProps {
  task: OrchestrationTask;
  onBack: () => void;
  onTaskUpdate: () => void;
}

const AgentStatusIcon: React.FC<{ status: string }> = ({ status }) => {
    const baseClasses = "w-3 h-3 rounded-full mr-2";
    let colorClass = "bg-neon-gray";
    if (status === 'processing') colorClass = "bg-neon-blue animate-pulse";
    if (status === 'succeeded') colorClass = "bg-neon-green";
    if (status === 'error') colorClass = "bg-neon-red";
    if (status === 'awaiting_input') colorClass = "bg-neon-yellow";
    return <div className={`${baseClasses} ${colorClass}`}></div>;
};

const LogIcon: React.FC<{ action: string }> = ({ action }) => {
    let icon;
    const actionType = action.split('-')[0];
    switch (actionType) {
        case 'communication': icon = 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'; break;
        case 'ui':
        case 'service':
        case 'create':
            icon = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'; break;
        case 'suggestion': icon = 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'; break;
        default: icon = 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'; break;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>;
};

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <dt className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</dt>
    <dd className="mt-1 text-sm text-gray-200 font-mono break-words">{children || <span className="text-gray-500">N/A</span>}</dd>
  </div>
);

const OrchestrationDetailView: React.FC<OrchestrationDetailViewProps> = ({ task, onBack, onTaskUpdate }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisError, setAnalysisError] = useState('');

  const handleAction = async (status: 'completed' | 'vetoed') => {
    const message = status === 'completed' ? 'Task approved and completed by human operator.' : 'Task vetoed by human operator.';
    await updateTaskStatus(task.id, status, message);
    onTaskUpdate();
  };

  const handleGetAnalysis = useCallback(async () => {
    if (!process.env.API_KEY) {
      setAnalysisError("API_KEY environment variable not set.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult('');
    setAnalysisError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const historyText = task.history.map(log => `- [${new Date(log.at).toISOString()}] ${log.by}: ${log.action} - ${JSON.stringify(log.details)}`).join('\n');
      
      const prompt = `You are a cross-domain AI orchestration supervisor. Given the following task details and handover history, provide a concise summary and a recommended next action for the human operator. Format your response clearly.

Task Name: ${task.name}
Status: ${task.status}
Prompt: ${task.prompt}
Container ID: ${task.container_id}
Operator: ${task.operator}

Handover History:
${historyText}

Your analysis:`;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });

      setAnalysisResult(response.text);

    } catch (error) {
        console.error("Gemini API call failed:", error);
        setAnalysisError("Failed to get analysis from Gemini API. See console for details.");
    } finally {
        setIsAnalyzing(false);
    }
  }, [task]);


  return (
    <div className="space-y-6" style={{ animation: 'fade-in 0.5s ease-out' }}>
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <button onClick={onBack} className="text-sm text-neon-blue hover:text-neon-purple mb-2 flex items-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Orchestration List
            </button>
            <h2 className="text-2xl font-bold text-white truncate">{task.name}</h2>
            <p className="text-gray-400 mt-1 font-mono text-xs">{task.id}</p>
          </div>
          <div className="flex-shrink-0">
            <Badge className={`${ORCHESTRATION_STATUS_COLORS[task.status]} text-base uppercase`}>{task.status.replace('_',' ')}</Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Meta-Intelligence Supervisor</h3>
                 <div className="space-y-4">
                    <p className="text-gray-400 text-sm">Request an AI-powered analysis of the current task state and history to determine the best next step.</p>
                    <Button onClick={handleGetAnalysis} disabled={isAnalyzing} leftIcon={isAnalyzing ? <Spinner className="w-4 h-4" /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>}>
                        {isAnalyzing ? 'Analyzing...' : 'Get AI Analysis'}
                    </Button>
                    {analysisResult && (
                        <div className="p-4 bg-black/30 rounded-lg border border-neon-blue/30 mt-4">
                            <h4 className="font-semibold text-neon-blue mb-2">Gemini Analysis</h4>
                            <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{analysisResult}</p>
                        </div>
                    )}
                    {analysisError && <p className="text-red-400 text-sm">{analysisError}</p>}
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Handover History</h3>
                 <ul className="space-y-4">
                    {task.history.slice().reverse().map((log, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <div className={`mt-1 p-2 rounded-full bg-gray-800/50 text-neon-blue`}>
                                <LogIcon action={log.action} />
                            </div>
                            <div>
                               <p className="text-sm text-gray-200">
                                <span className={`font-bold ${log.by === 'Human Operator' ? 'text-neon-green' : 'text-gray-200'}`}>{log.by}</span>
                                <span className="text-gray-400 mx-1">performed</span>
                                <span className="font-semibold text-neon-purple">{log.action}</span>
                               </p>
                               <div className="text-xs text-gray-400 mt-1 bg-black/20 p-2 rounded-md font-mono">{JSON.stringify(log.details)}</div>
                               <p className="text-xs text-gray-500 mt-1">{new Date(log.at).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                 </ul>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                 <h3 className="text-lg font-semibold text-white mb-4">Task Configuration</h3>
                 <dl className="space-y-4">
                     <DetailItem label="Operator">{task.operator}</DetailItem>
                     <DetailItem label="Container ID">{task.container_id}</DetailItem>
                     <DetailItem label="Prompt">{task.prompt}</DetailItem>
                     <DetailItem label="Templates">
                        {`Base: ${task.chosen_templates.base}, UI: ${task.chosen_templates.ui.join(', ')}, DB: ${task.chosen_templates.datastore}`}
                     </DetailItem>
                 </dl>
            </Card>
            <Card>
                 <h3 className="text-lg font-semibold text-white mb-4">Workflow</h3>
                 <ol className="relative border-l border-gray-700">
                    {task.workflow.map((step, index) => (
                        <li key={index} className="mb-4 ml-4">
                            <div className="absolute w-3 h-3 bg-gray-700 rounded-full mt-1.5 -left-1.5 border border-gray-900 "></div>
                            <h4 className="text-sm font-semibold text-gray-200">{step.step}</h4>
                            <p className="text-xs text-gray-400">{step.agent}</p>
                        </li>
                    ))}
                 </ol>
            </Card>
             <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Agent Status</h3>
                <ul className="space-y-3">
                    {task.agents.map(agent => (
                        <li key={agent.id} className="flex items-center">
                            <AgentStatusIcon status={agent.status} />
                            <span className="font-semibold text-gray-200">{agent.name}</span>
                            <span className="ml-auto text-sm text-gray-400 capitalize">{agent.status.replace('_', ' ')}</span>
                        </li>
                    ))}
                </ul>
             </Card>
              {task.status === 'awaiting_review' && (
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-4">Human Review</h3>
                    <p className="text-sm text-gray-400 mb-4">This task requires your approval to proceed.</p>
                    <div className="flex flex-col space-y-3">
                        <Button variant="primary" onClick={() => handleAction('completed')}>Approve & Complete</Button>
                        <Button variant="danger" onClick={() => handleAction('vetoed')}>Veto Task</Button>
                    </div>
                </Card>
             )}
        </div>
      </div>
    </div>
  );
};

export default OrchestrationDetailView;
