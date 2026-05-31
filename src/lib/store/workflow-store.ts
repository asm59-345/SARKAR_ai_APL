/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { useNotificationStore } from './notification-store';
import { io } from 'socket.io-client';

export type AgentStep = 
  | 'input' 
  | 'planner' 
  | 'ocr' 
  | 'rules' 
  | 'translation' 
  | 'officer' 
  | 'escalation' 
  | 'audit';

export interface WorkflowLog {
  timestamp: string;
  agent: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface GovernanceWorkflow {
  id: string;
  title: string;
  citizenName: string;
  location: string;
  type: 'property' | 'grievance' | 'pension';
  status: 'pending' | 'active' | 'completed' | 'escalated' | 'rejected';
  submittedAt: string;
  currentStep: AgentStep;
  progress: number; // 0 to 100
  documents: { name: string; size: string; status: 'uploaded' | 'verified' | 'failed' }[];
  findings: string[];
}

interface WorkflowState {
  workflows: GovernanceWorkflow[];
  activeWorkflowId: string | null;
  isRunning: boolean;
  currentStep: AgentStep;
  logs: WorkflowLog[];
  simulationSpeed: number; // in ms
  hasErrorInjected: boolean;
  telemetry: {
    cpuLoad: number;
    ramUsage: string;
    consensusRate: number;
    gasSavedEquivalent: string;
    queueDepth: number;
  };
  
  // Actions
  fetchWorkflows: () => Promise<void>;
  uploadDocument: (name: string, type: 'property' | 'grievance' | 'pension', citizenName: string, location: string) => Promise<string>;
  selectWorkflow: (id: string) => Promise<void>;
  startSimulation: () => void;
  stopSimulation: () => void;
  injectError: (val: boolean) => void;
  setSpeed: (speed: number) => void;
  approveWorkflow: (id: string) => Promise<void>;
  rejectWorkflow: (id: string) => Promise<void>;
  addManualLog: (agent: string, message: string, status: 'info' | 'success' | 'warning' | 'error') => void;
  resetWorkflow: (id: string) => void;
}

const BACKEND_URL = "http://127.0.0.1:8000";

// Establish live real-time connection to the Python backend
const socket = io(BACKEND_URL);

let simInterval: NodeJS.Timeout | null = null;

export const useWorkflowStore = create<WorkflowState>((set, get) => {
  
  // Setup real-time Socket.IO listener events bridging back-to-front
  socket.on("connect", () => {
    get().addManualLog("System", "WebSocket connection to SarkarAI backend established successfully.", "success");
  });

  socket.on("global_workflow_update", (wfData: any) => {
    set((state) => ({
      workflows: state.workflows.map(w => w.id === wfData.id ? {
        ...w,
        status: wfData.status,
        currentStep: wfData.current_step,
        progress: wfData.progress
      } : w)
    }));

    // If active workflow gets updated, sync active state values
    if (get().activeWorkflowId === wfData.id) {
      set({ currentStep: wfData.current_step });
    }
  });

  socket.on("global_agent_activity", (logData: any) => {
    // Append to logs if it belongs to active workflow
    if (get().activeWorkflowId === logData.workflow_id) {
      set((state) => ({
        logs: [...state.logs, {
          timestamp: logData.timestamp,
          agent: logData.agent,
          message: logData.message,
          status: logData.status
        }]
      }));
    }
  });

  socket.on("live_notification", (notifData: any) => {
    useNotificationStore.getState().addNotification({
      title: notifData.title,
      description: notifData.description,
      type: notifData.type
    });
  });

  // Pull initial records upon store load
  setTimeout(() => {
    get().fetchWorkflows();
  }, 1000);

  return {
    workflows: [
      {
        id: 'wf-101',
        title: 'Gomti Nagar Property Registration',
        citizenName: 'Ashmit Sarkar',
        location: 'Gomti Nagar, Lucknow',
        type: 'property',
        status: 'completed',
        submittedAt: '2026-05-28 10:30',
        currentStep: 'audit',
        progress: 100,
        documents: [{ name: 'property_deed_gomti_nagar.pdf', size: '2.4 MB', status: 'verified' }],
        findings: ['Aadhaar matching 99.8%.', 'Bylaws compliance verified.']
      },
      {
        id: 'wf-102',
        title: 'Hazratganj Road Repair Grievance',
        citizenName: 'Amit Trivedi',
        location: 'Hazratganj, Lucknow',
        type: 'grievance',
        status: 'escalated',
        submittedAt: '2026-05-28 14:15',
        currentStep: 'escalation',
        progress: 75,
        documents: [{ name: 'pothole_photo.png', size: '4.2 MB', status: 'verified' }],
        findings: ['Auto-escalated to Lucknow DM PWD office.']
      }
    ],
    activeWorkflowId: 'wf-101',
    isRunning: false,
    currentStep: 'input',
    logs: [
      { timestamp: '10:30:00 AM', agent: 'System', message: 'SarkarAI OS connected to background backend API.', status: 'info' }
    ],
    simulationSpeed: 2000,
    hasErrorInjected: false,
    telemetry: {
      cpuLoad: 12,
      ramUsage: '1.2 GB / 8.0 GB',
      consensusRate: 98.7,
      gasSavedEquivalent: '₹14,200',
      queueDepth: 1
    },

    fetchWorkflows: async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/workflows/`);
        if (res.ok) {
          const data = await res.json();
          // Map backend schemas to frontend GovernanceWorkflow structures
          const formatted: GovernanceWorkflow[] = data.map((w: any) => ({
            id: w.id,
            title: w.title,
            citizenName: w.citizen_name,
            location: w.location,
            type: w.type,
            status: w.status,
            currentStep: w.current_step,
            progress: w.progress,
            submittedAt: w.submitted_at.substring(0, 16).replace('T', ' '),
            documents: [{ name: w.type === 'property' ? 'property_deed.pdf' : 'grievance.png', size: '1.5 MB', status: 'verified' }],
            findings: w.histories.filter((h: any) => h.status === 'success').map((h: any) => h.message)
          }));
          set({ workflows: formatted });
        }
      } catch (e) {
        console.log("Database fetch failed. Falling back to local offline cache.");
      }
    },

    uploadDocument: async (name, type, citizenName, location) => {
      try {
        const formData = new FormData();
        formData.append("title", `${location.split(',')[0]} ${type.charAt(0).toUpperCase() + type.slice(1)} Ingestion`);
        formData.append("citizen_name", citizenName);
        formData.append("location", location);
        formData.append("wf_type", type);
        
        // Add fake file Blob
        const blob = new Blob(["Sealed SarkarAI document deed payload"], { type: "text/plain" });
        formData.append("file", blob, name);

        const res = await fetch(`${BACKEND_URL}/api/v1/workflows/`, {
          method: "POST",
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          await get().fetchWorkflows();
          set({ activeWorkflowId: data.id, currentStep: data.current_step });
          
          // Let Socket room listen to updates
          socket.emit("join_workflow", { workflow_id: data.id });
          return data.id;
        }
      } catch (e) {
        console.log("REST upload failed. Falling back to offline simulator.");
      }
      return "wf-mock";
    },

    selectWorkflow: async (id) => {
      set({ activeWorkflowId: id, logs: [] });
      socket.emit("join_workflow", { workflow_id: id });
      
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/workflows/${id}`);
        if (res.ok) {
          const data = await res.json();
          // Populate histories
          const parsedLogs: WorkflowLog[] = data.histories.map((h: any) => ({
            timestamp: new Date(h.timestamp).toLocaleTimeString(),
            agent: h.agent_name,
            message: h.message,
            status: h.status
          }));
          set({ 
            currentStep: data.current_step,
            logs: parsedLogs.length > 0 ? parsedLogs : [{ timestamp: new Date().toLocaleTimeString(), agent: 'System', message: 'Connected to active database logs vault.', status: 'info' }]
          });
        }
      } catch (e) {
        console.log("Failed to fetch logs from backend.");
      }
    },

    startSimulation: () => {
      const { activeWorkflowId, isRunning } = get();
      if (!activeWorkflowId || isRunning) return;

      set({ isRunning: true });

      const tick = async () => {
        const { activeWorkflowId, hasErrorInjected } = get();
        if (!activeWorkflowId) return;

        try {
          const res = await fetch(`${BACKEND_URL}/api/v1/workflows/${activeWorkflowId}/advance?inject_error=${hasErrorInjected}`, {
            method: "POST"
          });
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'completed' || data.status === 'rejected') {
              get().stopSimulation();
            }
          }
        } catch (e) {
          console.log("Simulation sync tick failed.");
          get().stopSimulation();
        }
      };

      simInterval = setInterval(tick, get().simulationSpeed);
    },

    stopSimulation: () => {
      if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
      }
      set({ isRunning: false });
    },

    injectError: (val) => {
      set({ hasErrorInjected: val });
    },

    setSpeed: (speed) => {
      set({ simulationSpeed: speed });
      if (get().isRunning) {
        get().stopSimulation();
        get().startSimulation();
      }
    },

    approveWorkflow: async (id) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/workflows/${id}/approve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ remarks: "Manual DM override approval signed." })
        });
        if (res.ok) {
          await get().fetchWorkflows();
          await get().selectWorkflow(id);
        }
      } catch (e) {
        console.log("Manual approval failed.");
      }
    },

    rejectWorkflow: async (id) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/workflows/${id}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ remarks: "Flagged and rejected by Hazratganj Officer review." })
        });
        if (res.ok) {
          await get().fetchWorkflows();
          await get().selectWorkflow(id);
        }
      } catch (e) {
        console.log("Manual rejection failed.");
      }
    },

    addManualLog: (agent, message, status) => set((state) => ({
      logs: [...state.logs, { timestamp: new Date().toLocaleTimeString(), agent, message, status }]
    })),

    resetWorkflow: async (id) => {
      get().stopSimulation();
      // Reset locally
      set((state) => ({
        logs: [{ timestamp: new Date().toLocaleTimeString(), agent: 'System', message: `Reset workflow cache. Ingestion buffers purged.`, status: 'info' }]
      }));
    }
  };
});
