'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/lib/store/language-store';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Award,
  ChevronRight,
  TrendingUp,
  Activity,
  FlameKindling,
  AlertTriangle,
  Scale,
  Users,
  Search,
  MessageSquareCode,
  Newspaper,
  Compass,
  FileCheck2,
  Lock,
  ArrowUpRight,
  HelpCircle,
  Phone,
  Star,
  ShieldAlert,
  AlertOctagon,
  FileText
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function CinematicHomepage() {
  const { t, language } = useLanguageStore();
  const { workflows, isRunning, startSimulation, stopSimulation, logs } = useWorkflowStore();
  const [activeTab, setActiveTab] = useState<'bureaucracy' | 'ai_engine'>('ai_engine');
  
  // Realtime counters simulation
  const [ingestedCount, setIngestedCount] = useState(140250);
  const [consensusRate, setConsensusRate] = useState(98.7);
  const [queueDepth, setQueueDepth] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setIngestedCount(prev => prev + Math.floor(Math.random() * 2));
      setConsensusRate(prev => {
        const val = prev + (Math.random() * 0.1 - 0.05);
        return Math.min(100, Math.max(95, parseFloat(val.toFixed(1))));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const agentShowcase = [
    { name: "Planner Agent", desc: "Decomposes applications into logical verifications, scans category and urgency, and routes critical emergencies straight to the commissioner desk.", icon: Cpu, color: "text-cyber-cyan" },
    { name: "Verification Agent", desc: "Drives image-to-text OpenCV/Tesseract OCR, validates identity papers, and scans registry ledgers for duplicate coordinates fraud.", icon: ShieldCheck, color: "text-cyber-purple" },
    { name: "Rule Engine Agent", desc: "Applies UP revenue Section 104 stamp guidelines and old-age eligibility capped limits dynamically using Gemini semantic retrieval.", icon: Scale, color: "text-cyber-green" },
    { name: "Translation Agent", desc: "Synthesizes administrative records into local Awadhi, formal Hindi, Hinglish, and English dialects to maintain citizen transparency.", icon: MessageSquareCode, color: "text-cyber-blue" },
    { name: "Notification Agent", desc: "Dispatches automated real-time alerts and progress reports to the citizen via SMS and WhatsApp gateways.", icon: Activity, color: "text-cyber-orange" },
    { name: "Escalation Agent", desc: "Flags delayed workflows, alerts commissioners regarding SLA timeouts, and handles manual approval overrides securely.", icon: AlertTriangle, color: "text-cyber-pink" },
    { name: "Audit Agent", desc: "Generates cryptographic SHA256 signatures, seals verified records, and archives applications in the Municipal Revenue Vault.", icon: Lock, color: "text-cyber-cyan" }
  ];

  const platformPillars = [
    {
      title: "1. Complaint Resolution",
      desc: "Instant intake routing of civic complaints in under 2 seconds. Automatically maps issues directly to zone engineers.",
      icon: FileText,
      color: "text-cyber-cyan",
      glow: "shadow-[0_0_15px_rgba(0,240,255,0.15)]"
    },
    {
      title: "2. AI Governance",
      desc: "Stateful multi-agent orchestrator managing the workflow lifecycle via autonomous validation and task decomposition.",
      icon: Cpu,
      color: "text-cyber-purple",
      glow: "shadow-[0_0_15px_rgba(188,19,254,0.15)]"
    },
    {
      title: "3. Emergency Escalation",
      desc: "High-alert critical fast-track. Immediately bypasses regular queues, pushing progress to 90% and sounding DM alarms.",
      icon: AlertOctagon,
      color: "text-cyber-pink",
      glow: "shadow-[0_0_15px_rgba(255,42,133,0.15)]"
    },
    {
      title: "4. Smart City Intelligence",
      desc: "Direct integration with sensor networks across Hazratganj traffic grids and Janeshwar solar park eco-systems.",
      icon: Compass,
      color: "text-cyber-green",
      glow: "shadow-[0_0_15px_rgba(57,255,20,0.15)]"
    },
    {
      title: "5. AI Chat Assistant",
      desc: "Real-time token streaming dialogue copilot. Fluid i18n translation engine speaking Awadhi, Hindi, & Hinglish.",
      icon: MessageSquareCode,
      color: "text-cyber-blue",
      glow: "shadow-[0_0_15px_rgba(0,102,255,0.15)]"
    },
    {
      title: "6. Workflow Automation",
      desc: "Applies UP municipal rules and registry bylaws autonomously to verify stamps eligibility and document limits.",
      icon: Database,
      color: "text-cyber-orange",
      glow: "shadow-[0_0_15px_rgba(255,165,0,0.15)]"
    },
    {
      title: "7. Real-Time Tracking",
      desc: "Live visual status tracker connected to WebSocket telemetry, notifying citizens at every step of validation.",
      icon: Search,
      color: "text-cyber-cyan",
      glow: "shadow-[0_0_15px_rgba(0,240,255,0.15)]"
    },
    {
      title: "8. Citizen Transparency",
      desc: "Immutable ledger record seeding. Generates secure cryptographic SHA-256 certificate compliance seals.",
      icon: ShieldCheck,
      color: "text-cyber-green",
      glow: "shadow-[0_0_15px_rgba(57,255,20,0.15)]"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-navy-950 text-white relative flex flex-col overflow-x-hidden scrollbar-cyber"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(2, 3, 11, 0.78), rgba(2, 3, 11, 0.96)), url('https://images.unsplash.com/photo-1626697556642-a164998782bb?auto=format&fit=crop&w=1920&q=80')`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      {/* Cinematic Background Glow Elements */}
      <div className="absolute top-[-5%] left-[-10%] h-[700px] w-[700px] rounded-full bg-cyber-cyan/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] h-[600px] w-[600px] rounded-full bg-cyber-purple/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-cyber-pink/5 blur-[140px] pointer-events-none" />
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* Sticky top navbar */}
      <Navbar />

      {/* ================= SECTION 1: HERO EXPERIENCE ================= */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-cyan/5 border border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.08)] mb-8"
        >
          <Sparkles className="text-cyber-cyan animate-pulse" size={13} />
          <span className="text-xs font-mono font-bold tracking-widest text-cyber-cyan uppercase">
            {t('lucknowTag')}
          </span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans"
        >
          {t('heroTitle').split('—').map((part, i) => (
            <span key={i} className="block first:bg-gradient-to-r first:from-white first:via-white/90 first:to-white/60 first:bg-clip-text first:text-transparent last:bg-gradient-to-r last:from-cyber-cyan last:via-cyber-blue last:to-cyber-purple last:bg-clip-text last:text-transparent mt-2">
              {part}
            </span>
          ))}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-sm sm:text-base text-white/60 max-w-2xl leading-relaxed font-medium"
        >
          {t('heroSubtitle')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <Link 
            href="/citizen"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-blue text-navy-950 font-bold hover:opacity-90 shadow-[0_0_25px_rgba(0,240,255,0.3)] transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer font-sans"
          >
            <span>{t('startSession')}</span>
            <ArrowRight size={16} />
          </Link>
          
          <Link 
            href="/about"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Blueprint</span>
            <ChevronRight size={16} className="opacity-60" />
          </Link>
        </motion.div>

        {/* Live Telemetry preview grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 w-full glass-card p-6 rounded-2xl relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute inset-0 cyber-grid opacity-10" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10 font-mono">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Total Ingested</span>
              <span className="text-2xl font-extrabold text-cyber-cyan" suppressHydrationWarning>{ingestedCount.toLocaleString()}</span>
              <span className="text-[9px] text-cyber-green flex items-center justify-center gap-1 mt-1">
                <TrendingUp size={10} /> +12.4% / Month
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Active Run-Queue</span>
              <span className="text-2xl font-extrabold text-cyber-purple">{queueDepth} Active</span>
              <span className="text-[9px] text-cyber-cyan animate-pulse flex items-center justify-center gap-1 mt-1">
                <Activity size={10} /> Live Orchestrator
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Fraud Intercepted</span>
              <span className="text-2xl font-extrabold text-cyber-pink">1,240 Registry</span>
              <span className="text-[9px] text-cyber-pink flex items-center justify-center gap-1 mt-1">
                <Award size={10} /> DM Compliance Sealed
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Consensus Latency</span>
              <span className="text-2xl font-extrabold text-cyber-green">{consensusRate}%</span>
              <span className="text-[9px] text-white/50 mt-1">
                Across 7 Agents
              </span>
            </div>
          </div>
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink" />
        </motion.div>
      </section>

      {/* ================= SECTION 2: BEREAUCRACY PROBLEMS SECTION ================= */}
      <section className="relative z-10 border-t border-white/5 py-24 px-4 bg-navy-950/40">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-pink tracking-widest">Sovereign Friction</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">The Cost of Administrative Friction</h3>
            <p className="text-xs sm:text-sm text-white/50">
              Paper bottlenecks, manual coordinate tampering, and infinite queues stall essential citizen approvals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Bureaucratic Bottleneck Card */}
            <div className="p-6 rounded-xl border border-cyber-pink/20 bg-cyber-pink/[0.01] flex flex-col gap-4 relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 h-24 w-24 bg-cyber-pink/5 blur-xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <FlameKindling className="text-cyber-pink animate-pulse" size={18} />
                <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Legacy Red Tape</span>
              </div>
              <ul className="flex flex-col gap-3 text-xs text-white/60 font-sans mt-2">
                <li className="flex gap-2 items-start"><span className="text-cyber-pink font-bold">&bull;</span> Infinite manual registries with months of delays.</li>
                <li className="flex gap-2 items-start"><span className="text-cyber-pink font-bold">&bull;</span> Coordinate tampering and land deed registration scams.</li>
                <li className="flex gap-2 items-start"><span className="text-cyber-pink font-bold">&bull;</span> Zero tracking transparency for critical emergencies.</li>
                <li className="flex gap-2 items-start"><span className="text-cyber-pink font-bold">&bull;</span> Language isolation leaving Awadhi citizens unsupported.</li>
              </ul>
            </div>

            {/* AI Operating Solution Card */}
            <div className="p-6 rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/[0.01] flex flex-col gap-4 relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 h-24 w-24 bg-cyber-cyan/5 blur-xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <Sparkles className="text-cyber-cyan animate-pulse" size={18} />
                <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">SarkarAI OS Paradigm</span>
              </div>
              <ul className="flex flex-col gap-3 text-xs text-white/60 font-sans mt-2">
                <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-bold">&bull;</span> Autonomous Multi-Agent verification completed in under 2 seconds.</li>
                <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-bold">&bull;</span> OpenCV/Tesseract checks detecting registry frauds instantly.</li>
                <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-bold">&bull;</span> Emergency auto-escalation bypassing queues directly to commissioners.</li>
                <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-bold">&bull;</span> Dynamic local Awadhi, Hinglish, and Hindi speech synthesis.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2.5: EIGHT CORE PILLARS OF SARKARAI OS ================= */}
      <section className="relative z-10 border-t border-white/5 py-24 px-4 bg-navy-950/60">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest">Platform Core</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">The 8 Pillars of Sovereign Governance</h3>
            <p className="text-xs sm:text-sm text-white/50">
              SarkarAI operates on eight integrated technology pillars, bringing digital efficiency, local Awadhi language inclusivity, and immutable trust to Indian administration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformPillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={i} 
                  className={`glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-4 hover:border-white/10 hover:scale-[1.02] transition duration-300 relative group overflow-hidden ${pillar.glow}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/[0.01] pointer-events-none" />
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                    <Icon size={18} className={pillar.color} />
                  </div>
                  <div className="flex flex-col gap-2 z-10">
                    <h4 className="text-xs uppercase font-mono font-bold text-white tracking-wider">{pillar.title}</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed font-sans font-medium">{pillar.desc}</p>
                  </div>
                  {/* Glowing border accent on hover */}
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: AI SOLUTIONS SHOWCASE ================= */}
      <section className="relative z-10 border-t border-white/5 py-24 px-4 bg-navy-900/60">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-purple tracking-widest">Sovereign Intelligence</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">The 7 Digital Civil Servant Agents</h3>
            <p className="text-xs sm:text-sm text-white/50">
              A compiled LangGraph StateGraph of specialized digital agents verifying and auditing citizen dossiers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentShowcase.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <div key={i} className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-3 hover:border-cyber-purple/20 transition duration-300 shadow-lg">
                  <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className={agent.color} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-xs uppercase font-mono font-bold text-white tracking-wider">{agent.name}</h4>
                    <p className="text-xs text-white/50 leading-relaxed mt-2 font-sans font-medium">{agent.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: LIVE WORKFLOW DEMO ================= */}
      <section className="relative z-10 border-t border-white/5 py-24 px-4 bg-navy-950/60">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest">Live telemetry</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Interactive Workflow Simulation</h3>
            <p className="text-xs sm:text-sm text-white/50">
              Watch nodes activate, approvals route, and cryptographic seals lock in real time.
            </p>
          </div>

          {/* Interactive Simulation Frame */}
          <div className="glass-card p-6 rounded-xl border border-white/5 relative overflow-hidden max-w-3xl mx-auto w-full shadow-2xl">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4 relative z-10">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-cyber-cyan uppercase font-bold tracking-wider">Live System Logs</span>
                <span className="text-xs text-white font-extrabold mt-0.5">District DM Vault (wf-101)</span>
              </div>
              <button
                onClick={() => isRunning ? stopSimulation() : startSimulation()}
                className={`px-4 py-2 rounded text-xs font-bold font-mono transition-all duration-300 cursor-pointer ${
                  isRunning 
                    ? 'bg-cyber-pink text-white hover:bg-cyber-pink/90 animate-pulse shadow-[0_0_15px_#ff2a85]' 
                    : 'bg-cyber-cyan text-navy-950 hover:bg-cyber-cyan/90 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                }`}
              >
                {isRunning ? 'STOP TICK SIMULATOR' : 'IGNITE SIMULATOR RUN'}
              </button>
            </div>

            {/* Scrolling log console */}
            <div className="my-6 min-h-[160px] max-h-[220px] overflow-y-auto pr-1 flex flex-col gap-2.5 scrollbar-cyber relative z-10">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2.5 items-start text-xs border-b border-white/5 pb-2 font-mono">
                  <span className="text-white/40 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={`font-bold shrink-0 ${log.status === 'error' || log.status === 'warning' ? 'text-cyber-pink' : 'text-cyber-cyan'}`}>{log.agent}:</span>
                  <p className="text-white/80 font-sans leading-relaxed">{log.message}</p>
                </div>
              ))}
            </div>

            <div className="text-center text-[10px] text-white/30 font-mono border-t border-white/5 pt-3">
              ACTIVE EMBEDDED DOCKER AGENT CONTROLS &bull; SECURE CLERK ENCRYPTIONS
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: SMART LUCKNOW SHOWCASE ================= */}
      <section className="relative z-10 border-t border-white/5 py-24 px-4 bg-navy-900/60">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-purple tracking-widest">Smart Lucknow Core</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Smart City Infrastructure Hub</h3>
            <p className="text-xs sm:text-sm text-white/50">
              Modernizing Awadh through ecological green developments, sensor-based ITCS traffic grids, and digital land registries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content Column */}
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-bold text-white">Asia&apos;s largest eco-grids &amp; dynamic AI signals</h4>
              <p className="text-xs text-white/60 leading-relaxed font-sans font-medium">
                SarkarAI OS interfaces directly with telemetry from Hazratganj sensor-based Intelligent Traffic Control Systems (ITCS) and Janeshwar Mishra Park solar eco-irrigation grids. We cache, parse, and summarize civic updates instantly.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-center mt-3">
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                  <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">ITCS Traffic reduction</span>
                  <span className="text-xl font-extrabold text-cyber-cyan font-mono mt-1 block">35% Less wait</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                  <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">Property Registry Index</span>
                  <span className="text-xl font-extrabold text-cyber-purple font-mono mt-1 block">+12.4% YoY</span>
                </div>
              </div>
            </div>

            {/* Right Map Image Placeholder Column */}
            <div className="h-64 rounded-xl border border-white/10 bg-navy-950 flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-2xl group hover:border-cyber-cyan/35 transition duration-300">
              <div className="absolute inset-0 cyber-grid opacity-20" />
              <Compass className="text-cyber-cyan mb-2 animate-float-slow animate-pulse" size={32} />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">Active Lucknow Map telemetry</span>
              <span className="text-[9px] text-white/50 mt-1 font-sans">Hazratganj, Gomti Nagar, Indira Nagar coordinates cached.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: AI ASSISTANT EXPERIENCE ================= */}
      <section className="relative z-10 border-t border-white/5 py-24 px-4 bg-navy-950/40">
        <div className="max-w-5xl mx-auto flex flex-col gap-12 items-center">
          <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest">Interactive copilot</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Evolving the Citizen AI Assistant</h3>
            <p className="text-xs sm:text-sm text-white/50">
              Providing conversational multi-dialect speech synthesis in Awadhi, Hindi, Hinglish, and English.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl border border-white/5 max-w-2xl w-full flex flex-col sm:flex-row gap-6 items-center shadow-2xl">
            {/* Interactive Voice Orb placeholder */}
            <div className="relative py-4 flex flex-col items-center justify-center z-10 shrink-0">
              <div className="absolute h-28 w-28 rounded-full border border-cyber-cyan/20 blur-sm animate-pulse scale-105" />
              <button className="relative z-20 h-20 w-20 rounded-full bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-purple flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.45)] cursor-pointer select-none">
                <MessageSquareCode className="text-white animate-pulse" size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-center sm:text-left">
              <span className="text-[9px] font-mono text-cyber-purple uppercase font-bold tracking-widest">Awadh Dialect Synthesis</span>
              <h4 className="text-sm font-extrabold text-white font-sans">&ldquo;मुस्कुराइयौ भैया, आप लखनाउ मा हैं!&rdquo;</h4>
              <p className="text-xs text-white/60 leading-relaxed font-sans font-medium">
                Our custom speech models analyze document queries, explain stamp duty rules under Section 104, and verify income limits directly in the warmth of Awadh culture.
              </p>
              
              <Link 
                href="/chat"
                className="mt-1 text-[10px] text-cyber-cyan font-mono uppercase font-bold tracking-widest hover:underline flex items-center justify-center sm:justify-start gap-0.5"
              >
                Launch Dialogue Hub <ArrowUpRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: COMPLAINT TRACKING DEMO ================= */}
      <section className="relative z-10 border-t border-white/5 py-24 px-4 bg-navy-900/60">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-purple tracking-widest">Transparency Trail</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Automatic Escalation Tracking</h3>
            <p className="text-xs sm:text-sm text-white/50">
              Submit critical alerts and track as the orchestrator fast-tracks case files directly to executive desks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Timeline milestones */}
            <div className="flex flex-col gap-4 font-mono text-xs text-white/60 leading-relaxed">
              <div className="flex gap-3 items-start border-l-2 border-cyber-cyan pl-4 pb-4 relative">
                <span className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f0ff]" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-cyber-cyan uppercase font-bold">Step 1: Ingestion</span>
                  <span className="text-white font-bold mt-0.5">Citizen Pothole Photo Uploaded</span>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-cyber-cyan pl-4 pb-4 relative">
                <span className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f0ff]" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-cyber-cyan uppercase font-bold">Step 2: AI Classification</span>
                  <span className="text-white font-bold mt-0.5">Urgency Classified as CRITICAL (women_safety / fire)</span>
                </div>
              </div>
              <div className="flex gap-3 items-start pl-4 pb-4 relative">
                <span className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-cyber-pink shadow-[0_0_8px_#ff2a85] animate-ping" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-cyber-pink uppercase font-bold">Step 3: Direct Escalation bypass</span>
                  <span className="text-white font-bold mt-0.5">Bypassing Multi-Agent wait, Fast-tracked to 90%</span>
                </div>
              </div>
            </div>

            {/* Right tracker visual description */}
            <div className="p-6 rounded-xl border border-white/5 bg-navy-950 flex flex-col gap-3 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
              <ShieldAlert className="text-cyber-pink animate-bounce mb-1" size={24} />
              <h4 className="text-xs uppercase font-mono font-bold text-white tracking-wider">Zero-Delay Escalations</h4>
              <p className="text-xs text-white/50 leading-relaxed font-sans font-medium mt-1">
                Grievance alerts matching emergency templates instantly alert commissioners via Socket.IO, ensuring immediate officer dispatch and high-speed resolving within SLA bounds.
              </p>
              
              <Link
                href="/emergency"
                className="mt-2 text-[9px] text-cyber-pink flex items-center gap-0.5 hover:underline font-mono uppercase font-bold tracking-widest"
              >
                Enter Emergency Portal <ArrowUpRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: LIVE NEWS FEED ================= */}
      <section className="relative z-10 border-t border-white/5 py-24 px-4 bg-navy-950/40">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest">Daily headlines</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Smart City Gazette Feed</h3>
            <p className="text-xs sm:text-sm text-white/50">
              Real-time daily news updates, newspaper headlines, and dynamic AI summaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-3 hover:border-cyber-cyan/20 transition duration-300 shadow-md">
              <span className="text-[9px] font-mono text-cyber-cyan uppercase font-bold tracking-wider">Traffic & ITCS</span>
              <h4 className="text-xs font-extrabold text-white leading-snug">Hazratganj Smart Signal System Go Live</h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">Intelligent sensors report 35% less vehicular traffic delays near major Hazratganj limits...</p>
            </div>
            
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-3 hover:border-cyber-cyan/20 transition duration-300 shadow-md">
              <span className="text-[9px] font-mono text-cyber-cyan uppercase font-bold tracking-wider">Park ecological</span>
              <h4 className="text-xs font-extrabold text-white leading-snug">Janeshwar Eco Irrigation Grids complete</h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">Nagar Nigam deploys smart solar-powered irrigation grids to keep Asia&apos;s largest park carbon neutral...</p>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-3 hover:border-cyber-cyan/20 transition duration-300 shadow-md">
              <span className="text-[9px] font-mono text-cyber-cyan uppercase font-bold tracking-wider">LDA housing</span>
              <h4 className="text-xs font-extrabold text-white leading-snug">LDA Housing Registry growth +12% YoY</h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">Gomti Nagar Extension limits report 12.4% registration scale following digital stamps automated filings...</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 9: ANALYTICS SHOWCASE ================= */}
      <section className="relative z-10 border-t border-white/5 py-24 px-4 bg-navy-900/60">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-purple tracking-widest">Sovereign Performance</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Sovereign Analytics Dashboard</h3>
            <p className="text-xs sm:text-sm text-white/50">
              Audit global load factors, SLA met indices, and digital vault consensus parameters.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto w-full">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">Citizen Index</span>
              <span className="text-2xl font-extrabold text-cyber-cyan font-mono mt-1">4.8 ★</span>
              <span className="text-[8px] text-white/50 mt-1">Across reviews</span>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">SLA Met ratio</span>
              <span className="text-2xl font-extrabold text-cyber-purple font-mono mt-1">98.7%</span>
              <span className="text-[8px] text-white/50 mt-1">Target matched</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">Sealed Vault Deeds</span>
              <span className="text-2xl font-extrabold text-cyber-green font-mono mt-1">8,420+</span>
              <span className="text-[8px] text-white/50 mt-1">SHA256 Encrypted</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">CPU Overhead</span>
              <span className="text-2xl font-extrabold text-cyber-pink font-mono mt-1">12% Max</span>
              <span className="text-[8px] text-white/50 mt-1">Sovereign runtime</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 10: COMMUNITY & TRANSPARENCY ================= */}
      <section className="relative z-10 border-t border-white/5 py-24 px-4 bg-navy-950/40">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col gap-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest">Social Transparency</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Civic चौपाल (Chaupal) Transparency</h3>
            <p className="text-xs sm:text-sm text-white/50">
              Empowering Lucknow citizens to follow resolved cases, audit PWD reports, and build absolute community trust.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl border border-white/5 max-w-2xl mx-auto w-full flex flex-col sm:flex-row gap-6 justify-between items-center shadow-2xl">
            <div className="flex gap-4 items-start text-center sm:text-left">
              <div className="h-10 w-10 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/35 text-cyber-cyan flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-xs uppercase font-mono font-bold text-white tracking-wider">Trending Chaupal Resolutions</h4>
                <p className="text-xs text-white/60 leading-relaxed font-sans font-medium mt-1">
                  Citizen Amit Trivedi reports a dangerous Hazratganj signal pothole repair was fully resolved inside 48 hours under Nagar Nigam supervision.
                </p>
              </div>
            </div>

            <Link
              href="/feed"
              className="px-5 py-2.5 rounded-lg bg-cyber-cyan text-navy-950 font-bold text-xs hover:bg-cyber-cyan/90 transition shadow-[0_0_15px_rgba(0,240,255,0.25)] shrink-0 flex items-center gap-1 cursor-pointer font-sans"
            >
              <span>Explore Chaupal Feed</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SECTION 11: FOOTER EXPERIENCE ================= */}
      <footer className="relative z-10 border-t border-white/5 bg-navy-950 py-16 px-4 text-center sm:text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="h-2 w-2 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f0ff]" />
              <span className="font-mono text-sm font-bold text-white">SarkarAI OS</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed max-w-sm font-sans font-medium">
              SarkarAI OS is optimized for public governance and municipal service automation in Lucknow, Uttar Pradesh. Designed by top-tier Indian AI governance teams.
            </p>
            <span className="text-[10px] text-cyber-cyan font-mono italic mt-1 font-bold">{t('lucknowTag')}</span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3 text-xs">
            <span className="font-bold text-white font-mono uppercase tracking-wider text-[10px]">Governance Portals</span>
            <Link href="/citizen" className="text-white/60 hover:text-cyber-cyan transition font-medium">Citizen Portal</Link>
            <Link href="/officer" className="text-white/60 hover:text-cyber-cyan transition font-medium">Officer Desk</Link>
            <Link href="/admin" className="text-white/60 hover:text-cyber-cyan transition font-medium">Admin Console</Link>
            <Link href="/history" className="text-white/60 hover:text-cyber-cyan transition font-medium">User Activity & Memory</Link>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 text-xs">
            <span className="font-bold text-white font-mono uppercase tracking-wider text-[10px]">Developers & Legal</span>
            <Link href="/faq" className="text-white/60 hover:text-cyber-cyan transition font-medium">FAQ & Guides</Link>
            <Link href="/contact" className="text-white/60 hover:text-cyber-cyan transition font-medium">Contact Helplines</Link>
            <Link href="/feedback" className="text-white/60 hover:text-cyber-cyan transition font-medium">Feedback Desk</Link>
            <span className="text-white/40 font-mono">v1.0.0 (Production Release)</span>
          </div>

        </div>

        <div className="max-w-6xl mx-auto border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-white/40 font-mono">
          <span>&copy; 2026 SarkarAI Operating System. All Rights Reserved.</span>
          <span>Security Sealed via Lucknow DM Cryptographic Vault</span>
        </div>
      </footer>
    </div>
  );
}
