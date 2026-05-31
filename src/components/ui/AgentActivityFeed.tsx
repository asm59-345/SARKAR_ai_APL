'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { Terminal, ShieldAlert, Sparkles, Filter, Trash2, CheckCircle } from 'lucide-react';

export default function AgentActivityFeed() {
  const { logs, isRunning, currentStep } = useWorkflowStore();
  const [filter, setFilter] = useState<'all' | 'success' | 'warning' | 'error'>('all');
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = logs.filter(l => {
    if (filter === 'all') return true;
    return l.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-cyber-green';
      case 'error': return 'text-cyber-pink font-bold';
      case 'warning': return 'text-cyber-orange';
      default: return 'text-cyber-cyan';
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden border border-white/5 flex flex-col h-[350px] relative">
      {/* Background Matrix/Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Terminal Title Bar */}
      <div className="bg-navy-950 px-4 py-2.5 border-b border-white/5 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-cyber-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider text-white">SARKARAI ENGINE TELEMETRY CONSOLE</span>
          {isRunning && (
            <span className="h-2 w-2 rounded-full bg-cyber-pink animate-ping shadow-[0_0_10px_#ff2a85] ml-1" />
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 p-0.5 rounded border border-white/10 text-[10px] font-mono">
            {(['all', 'success', 'warning', 'error'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2 py-0.5 rounded transition uppercase tracking-widest cursor-pointer ${
                  filter === type 
                    ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs lines body container */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed flex flex-col gap-2 bg-[#02030b]/90 scrollbar-thin">
        {filteredLogs.length === 0 ? (
          <div className="m-auto text-white/30 text-center flex flex-col gap-2 items-center py-10">
            <Terminal size={24} className="opacity-30" />
            <span>No console logs matches filter</span>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="flex gap-3 hover:bg-white/5 p-1 rounded transition group">
              {/* Line numbering */}
              <span className="text-white/20 select-none w-6 text-right font-light shrink-0">
                {String(index + 1).padStart(3, '0')}
              </span>
              
              {/* Timestamp */}
              <span className="text-white/30 select-none shrink-0 font-light">
                [{log.timestamp}]
              </span>

              {/* Agent Badge Name */}
              <span className="text-cyber-purple font-semibold shrink-0 select-none">
                [{log.agent}]
              </span>

              {/* Log Message content */}
              <span className={`flex-1 break-words ${getStatusColor(log.status)}`}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={feedEndRef} />
      </div>

      {/* Code Status Indicator Footer bar */}
      <div className="bg-navy-950 px-4 py-2 border-t border-white/5 flex items-center justify-between z-10 shrink-0 text-[10px] font-mono text-white/50">
        <span>Active Agent State: <strong className="text-cyber-cyan uppercase">{currentStep}</strong></span>
        <span>Consensus: <strong className="text-cyber-green">ONLINE (256ms)</strong></span>
      </div>
    </div>
  );
}
