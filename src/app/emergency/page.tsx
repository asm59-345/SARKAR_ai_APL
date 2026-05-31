'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { 
  AlertOctagon, 
  MapPin, 
  Activity, 
  Sparkles, 
  Send, 
  CheckCircle, 
  ShieldAlert,
  Loader2,
  ShieldCheck,
  ArrowRight,
  FlameKindling
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const BACKEND_URL = "http://127.0.0.1:8000";

const EMERGENCY_CHANNELS = [
  { value: 'women_safety', label: '👮 Women Harassment Helpline (1090)', dept: 'Police Special Task Force' },
  { value: 'medical', label: '🚑 Cardiac / Medical Trauma Core (108)', dept: 'CMO Emergency Response Core' },
  { value: 'fire', label: '🔥 Fire & Smoke Anomaly Dispatch (101)', dept: 'UP Fire Services division' },
  { value: 'corruption', label: '⚖️ Anti-Corruption / Bribe Demand', dept: 'ACB Vigilance Directorate' }
];

export default function EmergencyHelp() {
  const { language } = useLanguageStore();
  const { fetchWorkflows, startSimulation } = useWorkflowStore();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Hazratganj, Lucknow');
  const [category, setCategory] = useState('women_safety');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emergencyResult, setEmergencyResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setEmergencyResult(null);

    try {
      const formData = new FormData();
      formData.append("title", `🚨 EMERGENCY: ${title}`);
      formData.append("citizen_name", "Ashmit Sarkar");
      formData.append("location", location);
      formData.append("wf_type", "grievance");
      formData.append("category", category);
      formData.append("urgency", "critical"); // locked critical urgency for instant bypass!
      
      const blob = new Blob(["Emergency report payload"], { type: "text/plain" });
      formData.append("file", blob, "emergency_report.txt");

      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/`, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        
        // Populate Emergency clasification feed
        setEmergencyResult({
          workflowId: data.id,
          assignedDept: EMERGENCY_CHANNELS.find(c => c.value === category)?.dept || 'Lucknow STF',
          escalationTarget: 'Hazratganj Commissioner Division Executive Desk',
          status: 'ESCALATED FOR DISPATCH'
        });

        // Trigger simulation run & update global state
        await fetchWorkflows();
        
        setTimeout(() => {
          setIsSubmitting(false);
          // Set active ID to watch simulation jump live to 90%
          useWorkflowStore.setState({ activeWorkflowId: data.id });
          startSimulation();
          router.push('/track');
        }, 3000);

      } else {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const loadPresetEmergency = (name: string, cat: string, loc: string, desc: string) => {
    setTitle(name);
    setCategory(cat);
    setLocation(loc);
    setDescription(desc);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto h-full overflow-y-auto pb-8 animate-in fade-in duration-300">
        
        {/* Input emergency form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyber-pink animate-ping shadow-[0_0_8px_#ff2a85]" />
              <span className="text-[10px] uppercase font-mono font-bold text-cyber-pink tracking-widest">High-Alert Core</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Emergency Governance Dispatch</h2>
            <p className="text-xs text-white/50">Submit urgent critical complaints. Immediate queue bypass triggers anti-corruption or police helplines within seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl border border-cyber-pink/20 bg-cyber-pink/[0.02] flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
            
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-cyber-pink/80 font-mono tracking-wider">Emergency Incident Title</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Harassment incident near riverfront walkway"
                className="bg-white/5 border border-cyber-pink/20 focus:border-cyber-pink rounded-lg py-2.5 px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:bg-white/10 transition"
                required
              />
            </div>

            {/* Category and location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-cyber-pink/80 font-mono tracking-wider">Emergency Channel</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-navy-950 border border-cyber-pink/20 focus:border-cyber-pink rounded-lg py-2.5 px-3 text-xs text-white/80 focus:outline-none cursor-pointer"
                >
                  {EMERGENCY_CHANNELS.map(ch => (
                    <option key={ch.value} value={ch.value}>{ch.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-cyber-pink/80 font-mono tracking-wider">Location Incident Zone</label>
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Gomti Nagar, Lucknow"
                  className="bg-white/5 border border-cyber-pink/20 focus:border-cyber-pink rounded-lg py-2.5 px-4 text-xs text-white/80 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-cyber-pink/80 font-mono tracking-wider">Emergency details</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Detail the urgent incident. Be specific about timing, safety levels, or bribe amount demanded..."
                className="bg-white/5 border border-cyber-pink/20 focus:border-cyber-pink rounded-lg py-2.5 px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:bg-white/10 transition leading-relaxed font-sans"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-cyber-pink via-cyber-purple to-cyber-orange text-white font-extrabold text-xs rounded-lg transition duration-300 shadow-[0_0_20px_rgba(255,42,133,0.3)] flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin text-white" size={14} />
                  <span>Activating Emergency Bypass...</span>
                </>
              ) : (
                <>
                  <AlertOctagon size={14} className="animate-pulse" />
                  <span>Activate High-Priority Dispatch</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Status analysis column */}
        <div className="h-full flex flex-col gap-6">
          
          {/* AI dispatch console */}
          <div className="glass-card p-5 rounded-xl border border-cyber-pink/20 bg-cyber-pink/[0.01] flex flex-col gap-4 relative overflow-hidden group min-h-[220px]">
            <div className="absolute inset-0 cyber-grid opacity-10" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon size={16} className="text-cyber-pink animate-pulse" />
                <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">STF Dispatch Console</span>
              </div>
            </div>

            {emergencyResult ? (
              <div className="flex flex-col gap-3.5 animate-in zoom-in-95 duration-200">
                <div className="p-3 bg-cyber-pink/10 border border-cyber-pink/30 rounded-lg flex items-start gap-2.5">
                  <ShieldAlert size={16} className="text-cyber-pink mt-0.5 shrink-0 animate-bounce" />
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] uppercase font-bold text-white font-mono">Bypass Locked</span>
                    <span className="text-[9px] text-cyber-pink mt-1">ID: {emergencyResult.workflowId}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/40">Division:</span>
                    <span className="text-white font-sans">{emergencyResult.assignedDept}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/40">Escalated To:</span>
                    <span className="text-white font-sans text-right max-w-[130px] truncate">{emergencyResult.escalationTarget}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/40">Urgency classification:</span>
                    <span className="text-cyber-pink uppercase font-bold">CRITICAL (LEVEL 1)</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-white/40">SLA Status:</span>
                    <span className="text-cyber-green uppercase font-bold">IMMEDIATE ACTIONS ACTIVE</span>
                  </div>
                </div>
              </div>
            ) : isSubmitting ? (
              <div className="flex flex-col items-center justify-center text-center gap-3 py-10">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border border-cyber-pink/30 border-t-cyber-pink animate-spin flex items-center justify-center text-cyber-pink" />
                  <AlertOctagon size={16} className="text-cyber-pink absolute top-4 left-4 animate-ping" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold text-white uppercase font-mono">Initiating Bypass Protocols...</span>
                  <span className="text-[9px] text-white/50 mt-1.5">Bypassing standard multi-agent wait lines...</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 gap-2">
                <ShieldCheck size={24} className="text-white/10" />
                <span className="text-xs text-white/35 font-mono">Awaiting emergency dispatch trigger. Secure Clerk Sandbox active.</span>
              </div>
            )}
          </div>

          {/* Quick preset trigger buttons */}
          <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-3">
            <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Preset Emergency Helplines</span>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => loadPresetEmergency("Women safety patrol dispatch near Gomti Riverfront walkway", "women_safety", "Gomti Nagar, Lucknow", "Harassment reporting near riverfront walk. Group of eve teasers misbehaving with children and girls. Dispatch STF patrol crew instantly.")}
                className="w-full text-left p-2.5 rounded bg-white/5 border border-white/5 hover:border-cyber-pink/30 hover:bg-white/10 text-[10px] text-white/70 hover:text-white transition duration-200 cursor-pointer font-mono"
              >
                👮 Women Safety Harassment STF Patrol
              </button>
              <button 
                onClick={() => loadPresetEmergency("Official corruption bribe demand Hazratganj revenue registration", "corruption", "Hazratganj, Lucknow", "Administrative clerk in land registry desk demanding 10,000 INR cash bribe to process property registration certificates. Circle rate 7% already paid.")}
                className="w-full text-left p-2.5 rounded bg-white/5 border border-white/5 hover:border-cyber-pink/30 hover:bg-white/10 text-[10px] text-white/70 hover:text-white transition duration-200 cursor-pointer font-mono"
              >
                ⚖️ Bribe Demand - UP anti-corruption dispatch
              </button>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
