'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useWorkflowStore, GovernanceWorkflow } from '@/lib/store/workflow-store';
import { useLanguageStore } from '@/lib/store/language-store';
import { 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  ChevronRight,
  TrendingDown,
  Scale
} from 'lucide-react';

export default function OfficerDashboard() {
  const { t } = useLanguageStore();
  const { workflows, activeWorkflowId, selectWorkflow, approveWorkflow, rejectWorkflow, injectError, hasErrorInjected } = useWorkflowStore();

  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId) || workflows[0];

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      approveWorkflow(id);
    } else {
      rejectWorkflow(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        
        {/* Header and simulation actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-purple tracking-widest font-mono">Commissioner review portal</span>
            <h2 className="text-2xl font-extrabold text-white">Officer Approval Desk</h2>
            <p className="text-xs text-white/50">Perform human-in-the-loop audits. Review AI OCR matching confidence and issue state seals.</p>
          </div>
          
          {/* Error Injection Switch */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10 z-10 shrink-0">
            <span className="text-[10px] font-mono text-white/60">SIMULATE DOCUMENT TAMPERING:</span>
            <button 
              onClick={() => injectError(!hasErrorInjected)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition cursor-pointer ${
                hasErrorInjected 
                  ? 'bg-cyber-pink text-white shadow-[0_0_10px_#ff2a85]' 
                  : 'bg-white/10 text-white/50 hover:bg-white/15'
              }`}
            >
              {hasErrorInjected ? 'FAIL OCR NAME MATCH' : 'NORMAL INGESTION'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cases Queue sidebar (Left) */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <span className="text-[10px] uppercase font-bold text-white/40 font-mono tracking-wider">Assigned Audit Queue</span>
            
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[550px]">
              {workflows.map((wf) => {
                const isActive = activeWorkflow?.id === wf.id;
                return (
                  <div
                    key={wf.id}
                    onClick={() => selectWorkflow(wf.id)}
                    className={`
                      p-4 rounded-xl border cursor-pointer transition flex flex-col gap-3 relative overflow-hidden group
                      ${isActive 
                        ? 'bg-cyber-purple/5 border-cyber-purple/40 shadow-[0_0_15px_rgba(171,60,255,0.05)]' 
                        : 'bg-white/5 border-white/5 hover:border-white/15'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono text-white/40">{wf.id}</span>
                      <span className={`text-[8px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                        wf.status === 'completed' 
                          ? 'bg-cyber-green/10 text-cyber-green' 
                          : wf.status === 'rejected'
                            ? 'bg-cyber-pink/10 text-cyber-pink animate-pulse'
                            : 'bg-cyber-cyan/10 text-cyber-cyan'
                      }`}>
                        {wf.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-tight group-hover:text-cyber-cyan transition line-clamp-1">{wf.title}</h4>
                    
                    <div className="flex justify-between text-[10px] text-white/50">
                      <span>Citizen: {wf.citizenName}</span>
                      <span className="font-mono">{wf.progress}% Checked</span>
                    </div>

                    {/* Quick Risk Indicator inside queue card */}
                    <div className="flex items-center gap-1 mt-1 text-[9px] font-mono">
                      <span className="text-white/40">RISK FACTOR:</span>
                      {wf.status === 'rejected' ? (
                        <span className="text-cyber-pink font-bold">100% FRAUD ANOMALY</span>
                      ) : wf.type === 'grievance' ? (
                        <span className="text-cyber-cyan">0% low priority</span>
                      ) : (
                        <span className="text-cyber-green">1.2% secure</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Case Audit Details (Right) */}
          {activeWorkflow ? (
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="glass-card p-6 rounded-xl border border-white/5 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute inset-0 cyber-grid opacity-10" />
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-cyber-cyan uppercase font-bold tracking-wider">Active case file review</span>
                    <h3 className="text-sm font-extrabold text-white mt-1">{activeWorkflow.title}</h3>
                  </div>
                  <span className="text-xs text-white/50 font-mono">TRACK: {activeWorkflow.id}</span>
                </div>

                {/* comparative visual interface - Aadhaar Detail vs Municipal Record */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {/* Column 1: Document OCR Extracted */}
                  <div className="p-4 rounded-lg bg-navy-950 border border-white/5 flex flex-col gap-3">
                    <span className="text-[10px] font-mono uppercase font-bold text-cyber-cyan border-b border-white/5 pb-1">AI OCR Extractions</span>
                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/40">Citizen Name:</span>
                        <strong className="text-white font-mono">{activeWorkflow.citizenName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Parcel Bounds:</span>
                        <strong className="text-white font-mono">Gata No: 402 / Lucknow Central</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Submitted Location:</span>
                        <strong className="text-white font-mono">{activeWorkflow.location}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">OCR Confidence:</span>
                        <strong className="text-cyber-green font-mono">99.8% Perfect</strong>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Government Ledger Records */}
                  <div className="p-4 rounded-lg bg-navy-950 border border-white/5 flex flex-col gap-3">
                    <span className="text-[10px] font-mono uppercase font-bold text-cyber-purple border-b border-white/5 pb-1">Government Record Match</span>
                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/40">Ledger Registry Name:</span>
                        <strong className="text-white font-mono">
                          {activeWorkflow.status === 'rejected' ? 'REVENUE DISPUTED RECORD' : activeWorkflow.citizenName}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Survey Bounds Status:</span>
                        <strong className="text-cyber-green font-mono">Validated Survey Map</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Taxes / Fees Status:</span>
                        <strong className="text-cyber-cyan font-mono">Clear (Zero Arrears)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Fraud Threat Alert:</span>
                        <strong className={activeWorkflow.status === 'rejected' ? 'text-cyber-pink font-mono' : 'text-cyber-green font-mono'}>
                          {activeWorkflow.status === 'rejected' ? '100% DISPUTED CLASH' : '0.00% SECURE'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk and Bylaws validation audit report findings */}
                <div className="flex flex-col gap-2.5 relative z-10">
                  <span className="text-[10px] font-mono uppercase font-bold text-white/40 tracking-wider">Verifications Audit Log:</span>
                  <div className="p-3.5 rounded-lg bg-navy-950/60 border border-white/5 flex flex-col gap-2">
                    {activeWorkflow.findings.length === 0 ? (
                      <div className="py-4 text-center text-xs text-white/40 font-mono">Initializing Agent checks... Ingestion active.</div>
                    ) : (
                      activeWorkflow.findings.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 size={13} className="text-cyber-green mt-0.5 shrink-0" />
                          <span className="text-white/80 font-sans leading-tight">{f}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Active Action Panel (dm bypass sliders) */}
                {activeWorkflow.status === 'completed' ? (
                  <div className="p-4 rounded-lg bg-cyber-green/5 border border-cyber-green/30 text-cyber-green flex items-center justify-center gap-2 text-xs font-bold font-mono uppercase relative z-10 animate-pulse">
                    <CheckCircle2 size={16} /> Workflow complete. Audit Certificate Hash Sealed.
                  </div>
                ) : activeWorkflow.status === 'rejected' ? (
                  <div className="p-4 rounded-lg bg-cyber-pink/5 border border-cyber-pink/30 text-cyber-pink flex items-center justify-center gap-2 text-xs font-bold font-mono uppercase relative z-10 animate-pulse">
                    <XCircle size={16} /> Case flagged and rejected. Threat telemetry logs compiled.
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/5 relative z-10 shrink-0">
                    <button
                      onClick={() => handleAction(activeWorkflow.id, 'approve')}
                      className="flex-1 py-3 rounded-lg bg-cyber-green text-navy-950 font-bold hover:bg-cyber-green/90 transition flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-[0_0_15px_rgba(0,255,135,0.2)]"
                    >
                      <CheckCircle2 size={14} /> Approve & Issue Seal
                    </button>
                    <button
                      onClick={() => handleAction(activeWorkflow.id, 'reject')}
                      className="flex-1 py-3 rounded-lg bg-cyber-pink text-white font-bold hover:bg-cyber-pink/90 transition flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-[0_0_15px_rgba(255,42,133,0.2)]"
                    >
                      <XCircle size={14} /> Flag & Reject Application
                    </button>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 glass-card py-20 text-center text-white/30 text-xs font-mono">
              Select case from the assigned queue to audit
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
