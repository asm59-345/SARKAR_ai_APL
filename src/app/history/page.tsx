'use client';
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Award,
  Lock,
  Bookmark,
  RefreshCw,
  ChevronRight,
  HelpCircle,
  Phone,
  Star
} from 'lucide-react';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  category: 'complaint' | 'workflow' | 'chat' | 'document' | 'feedback' | 'notification';
  title: string;
  description: string;
  time: string;
  status?: 'success' | 'warning' | 'info' | 'error';
  link?: string;
}

const initialHistory: HistoryItem[] = [
  {
    id: "hist-1",
    category: "workflow",
    title: "Gomti Nagar Property Registry sealed",
    description: "Multi-agent rules checking and Section 104 stamp verification complete. SHA256 sealed inside the Municipal Revenue vault.",
    time: "Today, 10:30 AM",
    status: "success",
    link: "/track"
  },
  {
    id: "hist-2",
    category: "chat",
    title: "Vocal conversation with Awadh Voice Orb",
    description: "Citizens discussed old-age pension income guidelines. Switched speech synthesis dynamically into [AWADHI] dialect.",
    time: "Today, 09:15 AM",
    status: "info",
    link: "/chat"
  },
  {
    id: "hist-3",
    category: "complaint",
    title: "Hazratganj Pothole road repair lodge",
    description: "AI auto-classifier predicted category: road_damage, department: Lucknow PWD. SLA timeline active: 72 hours.",
    time: "Yesterday, 02:40 PM",
    status: "warning",
    link: "/track"
  },
  {
    id: "hist-4",
    category: "document",
    title: "Ingested property_deed_central.pdf",
    description: "OpenCV threshold filters applied. Tesseract OCR returned 99.8% Aadhaar name cross-matching ledger records.",
    time: "Yesterday, 11:20 AM",
    status: "success",
    link: "/citizen"
  },
  {
    id: "hist-5",
    category: "feedback",
    title: "Citizen Feedback submitted",
    description: "Logged ratings: 5★ and comments: 'मुस्कुराइए, हम सच में लखनऊ में हैं!' to public quality metrics.",
    time: "3 days ago",
    status: "success",
    link: "/feedback"
  },
  {
    id: "hist-6",
    category: "notification",
    title: "Emergency Police STF alert",
    description: "Critical safety incident near Riverfront walkway bypassed normal queue checks. Dispatched officer alerts.",
    time: "4 days ago",
    status: "error",
    link: "/emergency"
  }
];

export default function UserHistoryTimeline() {
  const { language } = useLanguageStore();
  const { workflows, fetchWorkflows } = useWorkflowStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const historyItems = useMemo(() => {
    const dbHistoryItems: HistoryItem[] = workflows.map(wf => {
      let desc = "";
      let status: HistoryItem['status'] = "info";
      
      if (wf.status === 'completed') {
        desc = `All automated checks complete. Cryptographic seal active. Final District Commissioner signoff verified.`;
        status = "success";
      } else if (wf.status === 'escalated') {
        desc = `Critical bypass triggered. Fast-tracked straight to the Escalation Agent node due to emergency severity.`;
        status = "error";
      } else if (wf.status === 'rejected') {
        desc = `Registry application mismatch or coordinate fraud flagged by Rule Engine verification checks.`;
        status = "error";
      } else {
        desc = `Active workflow progression running. Currently at step: [${wf.currentStep.toUpperCase()}]. Progress: ${wf.progress}%.`;
        status = "warning";
      }

      return {
        id: `db-hist-${wf.id}`,
        category: wf.type === 'grievance' ? 'complaint' : 'workflow',
        title: wf.title,
        description: desc,
        time: wf.submittedAt || "Just now",
        status: status,
        link: "/track"
      };
    });

    const combined = [...dbHistoryItems, ...initialHistory];
    const unique: HistoryItem[] = [];
    const titles = new Set<string>();
    for (const item of combined) {
      if (!titles.has(item.title)) {
        titles.add(item.title);
        unique.push(item);
      }
    }
    return unique;
  }, [workflows]);

  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto h-[calc(100vh-120px)] animate-in fade-in duration-300">
        
        {/* Left Timeline Panel */}
        <div className="lg:col-span-2 flex flex-col gap-5 h-full overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest font-mono">Citizen Vault History</span>
            <h2 className="text-2xl font-extrabold text-white">Activity & AI Memory Timeline</h2>
            <p className="text-xs text-white/50">Search historic applications, past chatbot dialog archives, uploaded files, and feedback rating telemetry logs.</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center shrink-0">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 text-white/40" size={14} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history, logs, verifications..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-white/35 focus:outline-none focus:border-cyber-cyan/50"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1">
              {['all', 'complaint', 'workflow', 'chat', 'document'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-2.5 py-1.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider cursor-pointer border transition duration-200
                    ${activeCategory === cat 
                      ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan' 
                      : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {cat === 'all' ? 'All Activities' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Scroll list */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 relative pl-3 scrollbar-cyber">
            
            {/* Main line helper */}
            <span className="absolute left-5 top-2 bottom-4 w-0.5 bg-white/5" />

            {filteredHistory.length === 0 ? (
              <div className="text-center py-16 bg-[#040613]/40 rounded-xl border border-white/5 flex flex-col items-center gap-3">
                <History className="text-white/20" size={32} />
                <span className="text-xs text-white/45 font-mono">No matching activities archived.</span>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 relative group"
                >
                  {/* Timeline bullet dot */}
                  <span className={`
                    absolute left-1 top-2 h-2.5 w-2.5 rounded-full border border-navy-950 transition-all duration-300 group-hover:scale-125
                    ${item.status === 'success' ? 'bg-cyber-green shadow-[0_0_6px_#00ff87]' : 
                      item.status === 'error' ? 'bg-cyber-pink shadow-[0_0_6px_#ff2a85] animate-pulse' : 
                      item.status === 'warning' ? 'bg-cyber-orange shadow-[0_0_6px_#ff9900]' : 'bg-cyber-cyan shadow-[0_0_6px_#00f0ff]'}
                  `} />

                  <div className="flex-1 ml-6 p-4 rounded-xl border border-white/5 bg-[#030510]/50 hover:border-cyber-purple/20 transition duration-300 flex flex-col gap-2 relative">
                    
                    <div className="flex justify-between items-center text-[10px] font-mono shrink-0">
                      <span className="text-cyber-cyan uppercase font-bold tracking-wider">{item.category}</span>
                      <span className="text-white/30 flex items-center gap-1"><Calendar size={9} /> {item.time}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-cyber-cyan transition tracking-wide leading-tight mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-white/50 leading-relaxed font-sans font-medium">
                      {item.description}
                    </p>

                    {item.link && (
                      <Link 
                        href={item.link}
                        className="mt-1 text-[9px] text-cyber-purple flex items-center gap-0.5 hover:underline font-mono uppercase font-bold tracking-widest self-end"
                      >
                        Inspect Ledger <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Continue panels and AI memory */}
        <div className="h-full flex flex-col gap-5 overflow-hidden">
          
          {/* Recent Activity: Continue Where You Left Off */}
          <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden shrink-0 shadow-lg">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="text-cyber-cyan animate-spin" />
              <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Continue Where You Left Off</span>
            </div>

            <div className="flex flex-col gap-2.5 mt-1 font-sans">
              {workflows.slice(0, 2).map((wf) => (
                <Link
                  key={wf.id}
                  href="/track"
                  className="p-2.5 rounded bg-white/5 border border-white/5 hover:border-cyber-cyan/30 flex justify-between items-center text-xs text-white/70 hover:text-white transition duration-200 cursor-pointer"
                >
                  <div className="flex flex-col leading-none">
                    <span className="text-[9px] text-white/40 font-mono">TRACK: {wf.id}</span>
                    <strong className="text-xs mt-1 truncate max-w-[130px] font-semibold">{wf.title}</strong>
                  </div>
                  <span className="text-[10px] text-cyber-cyan font-mono font-bold">{wf.progress}%</span>
                </Link>
              ))}
            </div>
          </div>

          {/* AI Memory panel */}
          <div className="glass-card p-5 rounded-xl border border-cyber-purple/20 bg-[#040613]/85 flex-1 flex flex-col gap-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-cyber-purple/5 blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-2 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyber-purple animate-pulse" />
                <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">AI Copilot Memory Vault</span>
              </div>
              <span className="text-[8px] uppercase font-mono bg-cyber-purple/10 border border-cyber-purple/25 text-cyber-purple px-1.5 py-0.5 rounded leading-none">Persistent</span>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 text-[11px] leading-relaxed font-sans text-white/70 scrollbar-cyber">
              <div className="p-2.5 rounded bg-navy-950 border border-white/5 flex flex-col gap-1.5">
                <span className="text-[9px] uppercase font-bold text-cyber-cyan font-mono tracking-wider">KYC Identity cached</span>
                <p className="font-medium font-sans">Aadhaar verified: 5420 1204 9876. Associated full name: 'Ashmit Sarkar' (Gomti Nagar registry records confirmed).</p>
              </div>

              <div className="p-2.5 rounded bg-navy-950 border border-white/5 flex flex-col gap-1.5">
                <span className="text-[9px] uppercase font-bold text-cyber-cyan font-mono tracking-wider">User Dialect Preference</span>
                <p className="font-medium font-sans">Language index lock: Awadhi (warm local cultural dialect toggled). Mixing Hinglish conversationally during portal queries.</p>
              </div>

              <div className="p-2.5 rounded bg-navy-950 border border-white/5 flex flex-col gap-1.5">
                <span className="text-[9px] uppercase font-bold text-cyber-cyan font-mono tracking-wider">Frequent Searches</span>
                <p className="font-medium font-sans">Hazratganj ITCS traffic reduction schedules, Janeshwar park eco irrigation IoT nodes, Old Age pension urban caps.</p>
              </div>
            </div>

            <div className="text-center text-[8px] text-white/30 font-mono border-t border-white/5 pt-2 shrink-0">
              SECURE CLERK SANDBOX ENCRYPTION VAULT
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
