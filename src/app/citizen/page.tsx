'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { useWorkflowStore, GovernanceWorkflow } from '@/lib/store/workflow-store';
import UploadDropzone from '@/components/ui/UploadDropzone';
import WorkflowTimeline from '@/components/ui/WorkflowTimeline';
import { 
  FileText, 
  MapPin, 
  Calendar, 
  Download, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Sparkles,
  RefreshCw,
  FolderOpen,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function CitizenDashboard() {
  const { t } = useLanguageStore();
  const { workflows, activeWorkflowId, selectWorkflow, isRunning, startSimulation, stopSimulation, resetWorkflow } = useWorkflowStore();

  const handleDownload = (wf: GovernanceWorkflow) => {
    // Generate a beautiful mock JSON text file and prompt download
    const reportData = {
      title: wf.title,
      id: wf.id,
      submittedBy: wf.citizenName,
      location: wf.location,
      completedAt: wf.status === 'completed' ? new Date().toISOString() : 'Pending final officer signature',
      verifications: wf.findings,
      seals: ["DM LUCKNOW OFFICE", "NAGAR NIGAM REVENUE VAULT", "SARKARAI CRYPTOGRAPHIC footprint"]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SarkarAI_Certificate_${wf.id}.json`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        
        {/* Header Title with quick telemetry controllers */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest">Digital Citizen Portal</span>
            <h2 className="text-2xl font-extrabold text-white">Citizen Workspaces Hub</h2>
            <p className="text-xs text-white/50">Submit land registry deeds, grievance pothole photos, or pension certificates for instant verification.</p>
          </div>
          <div className="flex items-center gap-2">
            {activeWorkflowId && (
              <button 
                onClick={() => {
                  const wf = workflows.find(w => w.id === activeWorkflowId);
                  if (wf) resetWorkflow(wf.id);
                }}
                className="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:border-cyber-purple/30 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={12} /> Clear Cache
              </button>
            )}
          </div>
        </div>

        {/* Dynamic active workflow timeline section */}
        {activeWorkflowId && (
          <div className="glass-card p-6 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-cyber-cyan/5 blur-xl pointer-events-none" />
            <WorkflowTimeline />
            
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => isRunning ? stopSimulation() : startSimulation()}
                className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isRunning 
                    ? 'bg-cyber-pink text-white hover:bg-cyber-pink/90' 
                    : 'bg-cyber-cyan text-navy-950 hover:bg-cyber-cyan/90'
                }`}
              >
                {isRunning ? 'Mute Sim Ticker' : 'Ignite Sim Pipeline'}
              </button>
              <Link
                href="/orchestration"
                className="px-4 py-2 rounded bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 flex items-center gap-1.5"
              >
                Launch Visual Graph <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        )}

        {/* Upload dropzone and side statistics grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Uploader Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="text-[10px] uppercase font-bold text-white/40 font-mono tracking-wider">Ingest New Documents</span>
            <UploadDropzone />
          </div>

          {/* Quick AI Advisor & Recent Activity Column */}
          <div className="flex flex-col gap-6">
            <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 cyber-grid opacity-10" />
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyber-cyan animate-pulse animate-float-slow" />
                <span className="text-xs uppercase font-bold text-white font-mono tracking-wider">SarkarAI Agent Desk</span>
              </div>
              
              <p className="text-xs text-white/60 leading-relaxed font-sans mt-1 font-medium">
                &ldquo;हमार registration काहे रुका बा?&rdquo; — Your documents are parsed and cross-matched with Nagar Nigam registry records instantly. Check active approvals below or click AI Chat on the sidebar for instant Awadhi dialect advice.
              </p>

              <Link
                href="/chat"
                className="mt-2 w-full text-center py-2.5 rounded bg-cyber-purple/20 border border-cyber-purple/30 text-white font-bold text-xs hover:bg-cyber-purple/30 transition flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <span>Chat with Awadh Agent</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Continue Where You Left Off Card */}
            <div className="glass-card p-5 rounded-xl border border-cyber-cyan/20 flex flex-col gap-4 relative overflow-hidden shadow-xl bg-cyber-cyan/[0.01]">
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-cyber-cyan animate-pulse" />
                <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Continue Where You Left Off</span>
              </div>

              <div className="flex flex-col gap-2.5 mt-1 font-sans">
                {workflows.slice(0, 2).map((wf) => (
                  <Link
                    key={wf.id}
                    href="/track"
                    className="p-2.5 rounded bg-[#030510]/60 border border-white/5 hover:border-cyber-cyan/35 flex justify-between items-center text-xs text-white/70 hover:text-white transition duration-200 cursor-pointer"
                  >
                    <div className="flex flex-col leading-none">
                      <span className="text-[9px] text-white/40 font-mono">TRACK ID: {wf.id}</span>
                      <strong className="text-xs mt-1 truncate max-w-[130px] font-semibold">{wf.title}</strong>
                    </div>
                    <span className="text-[10px] text-cyber-cyan font-mono font-bold">{wf.progress}%</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FolderOpen size={16} className="text-cyber-purple" />
            <span className="text-xs uppercase font-bold text-white font-mono tracking-widest">{t('myApplications')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((wf) => (
              <div 
                key={wf.id}
                onClick={() => selectWorkflow(wf.id)}
                className={`
                  p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col gap-4 group
                  ${activeWorkflowId === wf.id 
                    ? 'bg-cyber-cyan/5 border-cyber-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.05)]' 
                    : 'bg-white/5 border-white/5 hover:border-white/15'
                  }
                `}
              >
                {/* Title */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-mono text-white/40">{wf.id}</span>
                    <h4 className="text-xs font-bold text-white mt-1 group-hover:text-cyber-cyan transition line-clamp-1">{wf.title}</h4>
                  </div>
                  <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                    wf.status === 'completed' 
                      ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/20' 
                      : wf.status === 'escalated' 
                        ? 'bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/20'
                        : wf.status === 'rejected'
                          ? 'bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/20'
                          : 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 animate-pulse'
                  }`}>
                    {wf.status}
                  </span>
                </div>

                {/* Info block */}
                <div className="flex flex-col gap-1 text-[11px] text-white/50">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} /> <span>{wf.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} /> <span>Submitted: {wf.submittedAt}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-white/40">Task Ingestion Progress</span>
                    <span>{wf.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyber-cyan transition-all duration-300" style={{ width: `${wf.progress}%` }} />
                  </div>
                </div>

                {/* Download button for completed registries */}
                {wf.status === 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(wf);
                    }}
                    className="mt-2 w-full py-2 rounded bg-white/5 hover:bg-cyber-green/20 border border-white/10 hover:border-cyber-green/30 text-white hover:text-white transition flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold cursor-pointer"
                  >
                    <Download size={11} /> Generate sealed JSON Cert
                  </button>
                )}

                {/* Subtle side glow */}
                <span className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-cyber-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
