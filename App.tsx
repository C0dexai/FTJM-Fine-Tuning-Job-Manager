
import React, { useState, useEffect, useCallback } from 'react';
import { 
  listJobs,
  retrieveJob,
  createJob, 
  cancelJob, 
  pauseJob, 
  resumeJob 
} from './services/fineTuningService';
import { listVectorStores, retrieveVectorStore, createVectorStore, deleteVectorStore } from './services/vectorStoreService';
import { listContainers, retrieveContainer, createContainer, deleteContainer } from './services/containerService';
import { listTasks, retrieveTask, createTask } from './services/orchestrationService';
import { FineTuningJob, CreateJobPayload, VectorStore, CreateVectorStorePayload, OrchestrationTask, CreateOrchestrationTaskPayload, Container, CreateContainerPayload } from './types';
import FineTuningDashboard from './components/FineTuningDashboard';
import JobDetailView from './components/JobDetailView';
import CreateJobModal from './components/CreateJobModal';
import VectorStoreDashboard from './components/VectorStoreDashboard';
import VectorStoreDetailView from './components/VectorStoreDetailView';
import CreateVectorStoreModal from './components/CreateVectorStoreModal';
import ContainerDashboard from './components/ContainerDashboard';
import ContainerDetailView from './components/ContainerDetailView';
import CreateContainerModal from './components/CreateContainerModal';
import OrchestrationDashboard from './components/OrchestrationDashboard';
import OrchestrationDetailView from './components/OrchestrationDetailView';
import CreateOrchestrationModal from './components/CreateOrchestrationModal';
import FloatingNav from './components/FloatingNav';

type View = 'jobs' | 'vector_stores' | 'containers' | 'orchestration';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('orchestration');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fine-tuning state
  const [jobs, setJobs] = useState<FineTuningJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<FineTuningJob | null>(null);
  const [isCreateJobModalOpen, setCreateJobModalOpen] = useState<boolean>(false);

  // Vector store state
  const [vectorStores, setVectorStores] = useState<VectorStore[]>([]);
  const [selectedVectorStore, setSelectedVectorStore] = useState<VectorStore | null>(null);
  const [isCreateVSModalOpen, setCreateVSModalOpen] = useState<boolean>(false);
  
  // Container state
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [isCreateContainerModalOpen, setCreateContainerModalOpen] = useState<boolean>(false);

  // Orchestration state
  const [orchestrationTasks, setOrchestrationTasks] = useState<OrchestrationTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<OrchestrationTask | null>(null);
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState<boolean>(false);

  // --- Data Loading ---
  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const jobList = await listJobs();
      setJobs(jobList);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadVectorStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const vsList = await listVectorStores();
      setVectorStores(vsList);
    } catch (error) {
      console.error("Failed to load vector stores:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const loadContainers = useCallback(async () => {
    setIsLoading(true);
    try {
      const containerList = await listContainers();
      setContainers(containerList);
    } catch (error) {
      console.error("Failed to load containers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadOrchestrationTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const taskList = await listTasks();
      setOrchestrationTasks(taskList);
    } catch (error) {
      console.error("Failed to load orchestration tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    if (activeView === 'jobs') loadJobs();
    else if (activeView === 'vector_stores') loadVectorStores();
    else if (activeView === 'containers') loadContainers();
    else if (activeView === 'orchestration') loadOrchestrationTasks();
  }, [activeView, loadJobs, loadVectorStores, loadContainers, loadOrchestrationTasks]);

  // --- Handlers ---
  const handleNavigate = (view: View) => {
    setSelectedJob(null);
    setSelectedVectorStore(null);
    setSelectedContainer(null);
    setSelectedTask(null);
    setActiveView(view);
  };

  const handleSelectJob = async (jobId: string) => {
    setIsLoading(true);
    const job = await retrieveJob(jobId);
    if (job) setSelectedJob(job);
    setIsLoading(false);
  };

  const handleBackToJobDashboard = () => {
    setSelectedJob(null);
    loadJobs();
  };

  const handleJobAction = async (jobId: string, action: 'cancel' | 'pause' | 'resume') => {
    const actionFunc = { cancel: cancelJob, pause: pauseJob, resume: resumeJob }[action];
    const updatedJob = await actionFunc(jobId);
    if (updatedJob) {
      if (selectedJob?.id === jobId) setSelectedJob(updatedJob);
      setJobs(prev => prev.map(j => (j.id === jobId ? updatedJob : j)));
    }
  };

  const handleCreateJob = async (payload: CreateJobPayload) => {
    await createJob(payload);
    loadJobs();
  };
  
  const handleSelectVectorStore = async (id: string) => {
    setIsLoading(true);
    const store = await retrieveVectorStore(id);
    if (store) setSelectedVectorStore(store);
    setIsLoading(false);
  };

  const handleBackToVSDashboard = () => {
    setSelectedVectorStore(null);
    loadVectorStores();
  };
  
  const handleCreateVectorStore = async (payload: CreateVectorStorePayload) => {
    await createVectorStore(payload);
    loadVectorStores();
  };

  const handleDeleteVectorStore = async (id: string) => {
    await deleteVectorStore(id);
    loadVectorStores();
  };

  const handleSelectContainer = async (id: string) => {
    setIsLoading(true);
    const container = await retrieveContainer(id);
    if (container) setSelectedContainer(container);
    setIsLoading(false);
  };

  const handleBackToContainerDashboard = () => {
    setSelectedContainer(null);
    loadContainers();
  };
  
  const handleCreateContainer = async (payload: CreateContainerPayload) => {
    await createContainer(payload);
    loadContainers();
  };

  const handleDeleteContainer = async (id: string) => {
    await deleteContainer(id);
    loadContainers();
  };

  const handleSelectTask = async (taskId: string) => {
    setIsLoading(true);
    const task = await retrieveTask(taskId);
    if(task) setSelectedTask(task);
    setIsLoading(false);
  };

  const handleCreateTask = async (payload: CreateOrchestrationTaskPayload) => {
    await createTask(payload);
    loadOrchestrationTasks();
  };

  const handleBackToOrchestrationDashboard = () => {
    setSelectedTask(null);
    loadOrchestrationTasks();
  };
  
  const NavButton: React.FC<{view: View, label: string}> = ({ view, label }) => (
    <button
      onClick={() => handleNavigate(view)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 transform hover:scale-105 ${
        activeView === view
          ? 'bg-neon-blue text-black shadow-md shadow-neon-blue/40'
          : 'text-gray-300 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    if (activeView === 'jobs') {
      return selectedJob ? (
        <JobDetailView job={selectedJob} onBack={handleBackToJobDashboard} />
      ) : (
        <FineTuningDashboard
          jobs={jobs}
          isLoading={isLoading}
          onSelectJob={handleSelectJob}
          onRefresh={loadJobs}
          onAction={handleJobAction}
          onOpenCreateModal={() => setCreateJobModalOpen(true)}
        />
      );
    }
    
    if (activeView === 'vector_stores') {
       return selectedVectorStore ? (
        <VectorStoreDetailView 
          vectorStore={selectedVectorStore} 
          onBack={handleBackToVSDashboard} 
          onStoreUpdate={loadVectorStores}
        />
      ) : (
        <VectorStoreDashboard
          vectorStores={vectorStores}
          isLoading={isLoading}
          onSelectStore={handleSelectVectorStore}
          onRefresh={loadVectorStores}
          onDeleteStore={handleDeleteVectorStore}
          onOpenCreateModal={() => setCreateVSModalOpen(true)}
        />
      );
    }
    
    if (activeView === 'containers') {
       return selectedContainer ? (
        <ContainerDetailView 
          container={selectedContainer} 
          onBack={handleBackToContainerDashboard} 
          onContainerUpdate={loadContainers}
        />
      ) : (
        <ContainerDashboard
          containers={containers}
          isLoading={isLoading}
          onSelectContainer={handleSelectContainer}
          onRefresh={loadContainers}
          onDeleteContainer={handleDeleteContainer}
          onOpenCreateModal={() => setCreateContainerModalOpen(true)}
        />
      );
    }

    if (activeView === 'orchestration') {
      return selectedTask ? (
        <OrchestrationDetailView
          task={selectedTask}
          onBack={handleBackToOrchestrationDashboard}
          onTaskUpdate={() => {
            handleBackToOrchestrationDashboard();
          }}
        />
      ) : (
        <OrchestrationDashboard
          tasks={orchestrationTasks}
          isLoading={isLoading}
          onSelectTask={handleSelectTask}
          onRefresh={loadOrchestrationTasks}
          onOpenCreateModal={() => setCreateTaskModalOpen(true)}
        />
      );
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
            <div className="card-base p-2 inline-flex items-center space-x-2 flex-wrap">
                <NavButton view="orchestration" label="Orchestration" />
                <NavButton view="containers" label="Containers" />
                <NavButton view="jobs" label="Fine-Tuning Jobs" />
                <NavButton view="vector_stores" label="Vector Stores" />
            </div>
        </header>

        <main>
            {renderContent()}
        </main>
      </div>

      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => setCreateJobModalOpen(false)}
        onSubmit={handleCreateJob}
      />
      <CreateVectorStoreModal
        isOpen={isCreateVSModalOpen}
        onClose={() => setCreateVSModalOpen(false)}
        onSubmit={handleCreateVectorStore}
      />
      <CreateContainerModal
        isOpen={isCreateContainerModalOpen}
        onClose={() => setCreateContainerModalOpen(false)}
        onSubmit={handleCreateContainer}
      />
      <CreateOrchestrationModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
      <FloatingNav activeView={activeView} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
