'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AgentActivityFeed from '@/components/ui/AgentActivityFeed';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Settings, 
  TrendingUp, 
  Cpu, 
  Database,
  ArrowUpRight,
  Server
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { telemetry } = useWorkflowStore();

  const mockDepartmentMetrics = [
    { name: "Lucknow Nagar Nigam (Revenue)", activeQueue: 4, latency: "1.2s", consensus: 99.4, load: 45 },
    { name: "Lucknow Public Works Division", activeQueue: 2, latency: "2.4s", consensus: 98.1, load: 30 },
    { name: "UP Land Registry Department", activeQueue: 1, latency: "1.8s", consensus: 99.1, load: 60 },
    { name: "Indira Nagar Pension Audit Vault", activeQueue: 1, latency: "1.1s", consensus: 98.9, load: 20 }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-mono font-bold text-cyber-purple tracking-widest font-mono">System Superuser Console</span>
          <h2 className="text-2xl font-extrabold text-white">Admin Dashboard</h2>
          <p className="text-xs text-white/50">Manage global node configurations, active department telemetry pools, and multi-agent consensus limits.</p>
        </div>

        {/* Global System Overhead Counters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-mono text-white/40">API Service Uptime</span>
              <span className="text-xl font-bold text-white font-mono">99.999% Perfect</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-cyber-green/10 border border-cyber-green/20 flex items-center justify-center text-cyber-green">
              <Server size={14} />
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-mono text-white/40">Zustand Telemetry Cache</span>
              <span className="text-xl font-bold text-white font-mono">Synced (0.8ms)</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center text-cyber-cyan">
              <Database size={14} />
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-mono text-white/40">Active Nodes Latency</span>
              <span className="text-xl font-bold text-white font-mono">256ms Target</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center text-cyber-purple">
              <Cpu size={14} />
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-mono text-white/40">Consensus Rate</span>
              <span className="text-xl font-bold text-white font-mono">{telemetry.consensusRate}% Approved</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center text-cyber-cyan">
              <Activity size={14} />
            </div>
          </div>

        </div>

        {/* Console Activity logs widget */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-white/40 font-mono tracking-wider">Multi-Agent Console Stream</span>
            <Link href="/orchestration" className="text-[10px] text-cyber-cyan hover:underline flex items-center gap-0.5 font-mono">
              Visualise React Flow &rarr;
            </Link>
          </div>
          <AgentActivityFeed />
        </div>

        {/* Department efficiency & performance table */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] uppercase font-bold text-white/40 font-mono tracking-widest">Linked Nagar Nigam Departments</span>

          <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-navy-950/80 border-b border-white/5 font-mono text-white/40 text-[9px] uppercase tracking-wider">
                    <th className="p-4 font-bold">Department Name</th>
                    <th className="p-4 font-bold">Queue Depth</th>
                    <th className="p-4 font-bold">Average Latency</th>
                    <th className="p-4 font-bold">Consensus Accuracy</th>
                    <th className="p-4 font-bold">Linked CPU Overhead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockDepartmentMetrics.map((dep, i) => (
                    <tr key={i} className="hover:bg-white/5 transition">
                      <td className="p-4 font-bold text-white">{dep.name}</td>
                      <td className="p-4 font-mono text-cyber-cyan">{dep.activeQueue} Pending</td>
                      <td className="p-4 font-mono">{dep.latency}</td>
                      <td className="p-4 font-mono text-cyber-green">{dep.consensus}%</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-cyber-purple" style={{ width: `${dep.load}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-white/50">{dep.load}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
