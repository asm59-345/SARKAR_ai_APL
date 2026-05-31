'use client';

import React, { useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useWorkflowStore, AgentStep } from '@/lib/store/workflow-store';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Node, 
  Edge,
  Handle,
  Position,
  BaseEdge,
  getSmoothStepPath
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Play, 
  Pause, 
  Cpu, 
  ShieldCheck, 
  Database, 
  Languages, 
  Bell, 
  AlertTriangle, 
  FileCheck2,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface AgentNodeProps {
  data: {
    label: string;
    role: string;
    status: string;
    stepId: string;
  };
}

// Custom Agent Node Component
const AgentNode = ({ data }: AgentNodeProps) => {
  const { label, role, status, stepId } = data;
  
  const getIcon = () => {
    switch (stepId) {
      case 'input': return <FolderOpen size={16} />;
      case 'planner': return <Cpu size={16} />;
      case 'ocr': return <ShieldCheck size={16} />;
      case 'rules': return <Database size={16} />;
      case 'translation': return <Languages size={16} />;
      case 'officer': return <Cpu size={16} />;
      case 'escalation': return <AlertTriangle size={16} />;
      case 'audit': return <FileCheck2 size={16} />;
      default: return <Cpu size={16} />;
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'completed': return 'border-cyber-green/50 bg-cyber-green/5 shadow-[0_0_15px_rgba(0,255,135,0.05)]';
      case 'active': return 'border-cyber-cyan bg-cyber-cyan/5 shadow-[0_0_20px_rgba(0,240,255,0.15)] animate-pulse neon-border-cyan';
      case 'error': return 'border-cyber-pink bg-cyber-pink/5 shadow-[0_0_20px_rgba(255,42,133,0.15)] animate-bounce';
      case 'paused': return 'border-cyber-purple/40 bg-cyber-purple/5';
      default: return 'border-white/5 bg-navy-950/80';
    }
  };

  const getBadgeColor = () => {
    switch (status) {
      case 'completed': return 'text-cyber-green bg-cyber-green/10';
      case 'active': return 'text-cyber-cyan bg-cyber-cyan/10 animate-pulse';
      case 'error': return 'text-cyber-pink bg-cyber-pink/10 font-bold';
      default: return 'text-white/40 bg-white/5';
    }
  };

  return (
    <div className={`p-4 rounded-xl border w-56 flex flex-col gap-3 relative transition-all duration-300 ${getBorderColor()}`}>
      {/* Node handles for connecting edges */}
      <Handle type="target" position={Position.Top} className="!bg-cyber-cyan" />
      
      {/* Node header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <div className={`h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 ${status === 'active' ? 'text-cyber-cyan' : 'text-white/60'}`}>
            {getIcon()}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-bold text-white tracking-tight">{label}</span>
            <span className="text-[8px] text-white/40 mt-1 uppercase font-mono">{role}</span>
          </div>
        </div>
      </div>

      {/* Node status label */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-white/40">Status:</span>
        <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[8px] tracking-wider leading-none ${getBadgeColor()}`}>
          {status}
        </span>
      </div>

      {status === 'active' && (
        <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-cyber-cyan rounded-bl-sm animate-ping" />
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-cyber-cyan" />
    </div>
  );
};

export default function LiveOrchestrationPage() {
  const { 
    workflows, 
    activeWorkflowId, 
    currentStep, 
    isRunning, 
    startSimulation, 
    stopSimulation, 
    simulationSpeed, 
    setSpeed,
    hasErrorInjected,
    logs
  } = useWorkflowStore();

  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId) || workflows[0];

  // Define dynamic node statuses
  const nodeStatuses = useMemo(() => {
    const steps: AgentStep[] = ['input', 'planner', 'ocr', 'rules', 'translation', 'officer', 'escalation', 'audit'];
    const activeStepIndex = steps.indexOf(activeWorkflow?.currentStep || 'input');
    
    return steps.reduce((acc, step, index) => {
      let status: 'upcoming' | 'completed' | 'active' | 'paused' | 'error' = 'upcoming';
      
      if (activeWorkflow?.status === 'rejected' && activeWorkflow.currentStep === step) {
        status = 'error';
      } else if (index < activeStepIndex) {
        status = 'completed';
      } else if (index === activeStepIndex) {
        if (activeWorkflow?.status === 'completed') {
          status = 'completed';
        } else {
          status = isRunning ? 'active' : 'paused';
        }
      }
      
      acc[step] = status;
      return acc;
    }, {} as Record<AgentStep, 'upcoming' | 'completed' | 'active' | 'paused' | 'error'>);
  }, [activeWorkflow, isRunning]);

  // Dynamic React Flow Nodes
  const nodes: Node[] = useMemo(() => {
    const defaultData = [
      { id: 'input', label: '1. Ingestion Desk', role: 'Deed/ID Ingestion', x: 250, y: 30 },
      { id: 'planner', label: '2. Planner Agent', role: 'Task breakdown', x: 250, y: 140 },
      { id: 'ocr', label: '3. Verification Agent', role: 'OCR Extraction', x: 250, y: 250 },
      { id: 'rules', label: '4. Rule Engine Agent', role: 'Eligibility bylaws', x: 250, y: 360 },
      { id: 'translation', label: '5. Translation Agent', role: 'Awadhi & Hindi i18n', x: 250, y: 470 },
      { id: 'officer', label: '6. Officer Approval Desk', role: 'DM Signatures Check', x: 250, y: 580 },
      { id: 'escalation', label: '7. Escalation Agent', role: 'SLA Watcher', x: 250, y: 690 },
      { id: 'audit', label: '8. Audit Agent', role: 'Vault sealing archive', x: 250, y: 800 }
    ];

    return defaultData.map(node => ({
      id: node.id,
      type: 'agentNode',
      position: { x: node.x, y: node.y },
      data: { 
        label: node.label, 
        role: node.role, 
        stepId: node.id,
        status: nodeStatuses[node.id as AgentStep] 
      }
    }));
  }, [nodeStatuses]);

  // Dynamic React Flow Edges with animated pulse flows
  const edges: Edge[] = useMemo(() => {
    const connectionPairs = [
      { source: 'input', target: 'planner' },
      { source: 'planner', target: 'ocr' },
      { source: 'ocr', target: 'rules' },
      { source: 'rules', target: 'translation' },
      { source: 'translation', target: 'officer' },
      { source: 'officer', target: 'escalation' },
      { source: 'escalation', target: 'audit' }
    ];

    return connectionPairs.map((pair, index) => {
      const isSourceCompleted = nodeStatuses[pair.source as AgentStep] === 'completed';
      const isTargetActive = nodeStatuses[pair.target as AgentStep] === 'active';
      
      const animateEdge = isSourceCompleted || isTargetActive;
      const strokeColor = nodeStatuses[pair.target as AgentStep] === 'error' 
        ? '#ff2a85' 
        : nodeStatuses[pair.source as AgentStep] === 'completed' 
          ? '#00ff87' 
          : nodeStatuses[pair.source as AgentStep] === 'active' 
            ? '#00f0ff' 
            : '#151d4f';

      return {
        id: `e-${pair.source}-${pair.target}`,
        source: pair.source,
        target: pair.target,
        animated: animateEdge && isRunning,
        style: { stroke: strokeColor, strokeWidth: animateEdge ? 3 : 1.5 },
      };
    });
  }, [nodeStatuses, isRunning]);

  const nodeTypes = useMemo(() => ({ agentNode: AgentNode }), []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 h-[calc(100vh-120px)] max-w-6xl mx-auto overflow-hidden">
        
        {/* Top controls dashboard header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest">Autonomous Telemetry Map</span>
            <h2 className="text-2xl font-extrabold text-white">Live Orchestration Graph</h2>
            <p className="text-xs text-white/50">Watch AI Agents execute verify protocols, pass state bylaws compliance, and archive results in the cryptovault.</p>
          </div>

          {/* Controls button actions */}
          <div className="flex items-center gap-3">
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 text-xs font-mono items-center gap-1.5">
              <span className="text-white/40 pl-2">SIM SPEED:</span>
              <button 
                onClick={() => setSpeed(1000)}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${simulationSpeed === 1000 ? 'bg-cyber-cyan text-navy-950 font-bold' : 'text-white/60 hover:text-white'}`}
              >
                1x
              </button>
              <button 
                onClick={() => setSpeed(2000)}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${simulationSpeed === 2000 ? 'bg-cyber-cyan text-navy-950 font-bold' : 'text-white/60 hover:text-white'}`}
              >
                2x
              </button>
              <button 
                onClick={() => setSpeed(4500)}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${simulationSpeed === 4500 ? 'bg-cyber-cyan text-navy-950 font-bold' : 'text-white/60 hover:text-white'}`}
              >
                0.5x
              </button>
            </div>

            <button
              onClick={() => isRunning ? stopSimulation() : startSimulation()}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)] ${
                isRunning 
                  ? 'bg-cyber-pink text-white shadow-[0_0_15px_rgba(255,42,133,0.2)]' 
                  : 'bg-cyber-cyan text-navy-950 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              }`}
            >
              {isRunning ? <Pause size={12} /> : <Play size={12} />}
              <span>{isRunning ? 'Pause Sim' : 'Run Sim'}</span>
            </button>
          </div>
        </div>        {/* React Flow Split Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">
          
          {/* React Flow Canvas Wrapper (Left Pane) */}
          <div className="lg:col-span-2 rounded-xl border border-white/5 bg-[#02030b]/60 overflow-hidden relative shadow-2xl h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.5}
              maxZoom={1.5}
              fitViewOptions={{ padding: 0.15 }}
            >
              <Background color="#ffffff" style={{ opacity: 0.03 }} gap={24} size={1} />
              <Controls className="!bg-navy-950 !border-white/10 !text-white" />
            </ReactFlow>

            {/* DM seal label */}
            <div className="absolute top-4 right-4 p-3 rounded-lg bg-navy-950/80 border border-cyber-cyan/35 text-white z-20 flex gap-2 items-center leading-none text-xs font-mono font-bold select-none backdrop-blur animate-pulse shadow-[0_0_15px_rgba(0,240,255,0.05)]">
              <span className="h-2 w-2 rounded-full bg-cyber-green animate-ping" />
              <span>LUCKNOW VAULT LINKED</span>
            </div>
          </div>

          {/* AI Orchestrator & Live Agent Telemetry Console (Right Pane) */}
          <div className="lg:col-span-1 glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden h-full">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            
            {/* Telemetry Header */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 shrink-0">
              <Cpu size={14} className="text-cyber-cyan animate-pulse" />
              <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Agent Telemetry Logs</span>
            </div>

            {/* Active Workflow Parameters */}
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-navy-950 border border-white/5 text-[10px] font-mono shrink-0 leading-relaxed">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">Active File:</span>
                <span className="text-white truncate max-w-[120px]">{activeWorkflow?.title || "None"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">Workflow ID:</span>
                <span className="text-cyber-cyan font-bold">{activeWorkflow?.id || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">Active Step:</span>
                <span className="text-cyber-purple font-bold uppercase">{activeWorkflow?.currentStep || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Progression State:</span>
                <span className="text-cyber-green font-bold">{activeWorkflow?.progress || 0}% Completed</span>
              </div>
            </div>

            {/* Real-time Agent Log Feed */}
            <div className="flex flex-col gap-2 flex-1 overflow-hidden min-h-0">
              <span className="text-[9px] uppercase font-bold text-white/40 font-mono tracking-widest shrink-0">Agent Execution Timeline</span>
              
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 font-mono text-[10px] leading-relaxed scrollbar-cyber">
                {logs.length === 0 ? (
                  <div className="text-center py-10 text-white/30 italic">No logs ingested yet. Ignite the simulation pipeline.</div>
                ) : (
                  [...logs].reverse().map((log, i) => (
                    <div key={i} className="p-2.5 rounded bg-white/5 border border-white/5 flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex justify-between items-center text-[8px] opacity-75">
                        <span className="text-cyber-cyan font-bold uppercase">{log.agent}</span>
                        <span className="text-white/40">{log.timestamp}</span>
                      </div>
                      <p className="text-white/80 text-[10px] leading-normal">{log.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
