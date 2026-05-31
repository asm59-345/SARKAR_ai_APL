'use client';

import React from 'react';
import { useWorkflowStore, AgentStep } from '@/lib/store/workflow-store';
import { Check, Loader2, AlertCircle, Play } from 'lucide-react';

interface TimelineStep {
  id: AgentStep;
  label: string;
  desc: string;
  agent: string;
}

const steps: TimelineStep[] = [
  { id: 'input', label: 'Ingestion', desc: 'File parsing', agent: 'Ingested File' },
  { id: 'planner', label: 'Planner', desc: 'Task breakdown', agent: 'Planner Agent' },
  { id: 'ocr', label: 'OCR Extraction', desc: 'Aadhaar/PAN Parse', agent: 'Verification Agent' },
  { id: 'rules', label: 'Policy Rules', desc: 'Bylaw check', agent: 'Rule Engine Agent' },
  { id: 'translation', label: 'i18n Translation', desc: 'Dialect Normalization', agent: 'Translation Agent' },
  { id: 'officer', label: 'Officer Audit', desc: 'DM Signatures', agent: 'Officer Desk' },
  { id: 'escalation', label: 'SLA Watcher', desc: 'Delay Watcher', agent: 'Escalation Agent' },
  { id: 'audit', label: 'Vault Seal', desc: 'Immutable report', agent: 'Audit Agent' }
];

export default function WorkflowTimeline() {
  const { workflows, activeWorkflowId, currentStep, isRunning } = useWorkflowStore();
  
  if (!activeWorkflowId) return null;
  
  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId);
  if (!activeWorkflow) return null;

  const getStepStatus = (stepId: AgentStep) => {
    const stepsArray = steps.map(s => s.id);
    const activeIndex = stepsArray.indexOf(activeWorkflow.currentStep);
    const stepIndex = stepsArray.indexOf(stepId);

    if (activeWorkflow.status === 'rejected' && activeWorkflow.currentStep === stepId) {
      return 'error';
    }

    if (stepIndex < activeIndex) return 'completed';
    if (stepIndex === activeIndex) {
      if (activeWorkflow.status === 'completed') return 'completed';
      return isRunning ? 'active' : 'paused';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Active Workflow Header Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex flex-col leading-none">
          <span className="text-[10px] uppercase font-bold text-cyber-cyan font-mono tracking-widest">Active Telecom Path</span>
          <h3 className="text-sm font-bold text-white mt-1">{activeWorkflow.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
            activeWorkflow.status === 'completed' 
              ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
              : activeWorkflow.status === 'escalated'
                ? 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink'
                : activeWorkflow.status === 'rejected'
                  ? 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink'
                  : 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan animate-pulse'
          }`}>
            {activeWorkflow.status}
          </span>
          <span className="text-xs text-white/50 font-mono">Progress: <strong>{activeWorkflow.progress}%</strong></span>
        </div>
      </div>

      {/* Grid List of Timeline steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <div 
              key={step.id}
              className={`
                p-3 rounded-lg border transition-all flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden group
                ${status === 'completed'
                  ? 'bg-cyber-green/5 border-cyber-green/20 text-cyber-green/90'
                  : status === 'active'
                    ? 'bg-cyber-cyan/5 border-cyber-cyan/50 text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.08)]'
                    : status === 'error'
                      ? 'bg-cyber-pink/5 border-cyber-pink/50 text-cyber-pink shadow-[0_0_15px_rgba(255,42,133,0.08)]'
                      : status === 'paused'
                        ? 'bg-cyber-purple/5 border-cyber-purple/30 text-cyber-purple'
                        : 'bg-white/5 border-white/5 text-white/40'
                }
              `}
            >
              {/* Dynamic Step Dot Icon */}
              <div className={`
                h-7 w-7 rounded-full flex items-center justify-center text-xs font-mono font-bold
                ${status === 'completed'
                  ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/40'
                  : status === 'active'
                    ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 animate-pulse'
                    : status === 'error'
                      ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/50 animate-bounce'
                      : status === 'paused'
                        ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40'
                        : 'bg-white/5 text-white/40 border border-white/10'
                }
              `}>
                {status === 'completed' ? (
                  <Check size={12} />
                ) : status === 'active' ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : status === 'error' ? (
                  <AlertCircle size={12} />
                ) : status === 'paused' ? (
                  <Play size={10} className="fill-current ml-0.5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Labels */}
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-tight line-clamp-1">{step.label}</span>
                <span className="text-[9px] opacity-60 font-mono line-clamp-1 mt-0.5">{step.desc}</span>
              </div>

              {/* Pulse glowing edge helper between steps */}
              {index < steps.length - 1 && (
                <span className="hidden lg:block absolute top-[25px] left-[90%] w-[30%] h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
