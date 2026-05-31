'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { 
  Cpu, 
  ShieldCheck, 
  Database, 
  Languages, 
  Bell, 
  AlertTriangle, 
  FileCheck2, 
  Landmark, 
  Sparkles,
  FileText,
  MessageSquareCode,
  Search,
  AlertOctagon,
  Terminal,
  Play,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguageStore();
  interface ComplaintResult {
    category: string;
    urgency: string;
    confidence: string;
    department: string;
    tags: string[];
  }

  const [activeTab, setActiveTab] = useState<'complaints' | 'chat' | 'track' | 'emergency' | 'audit'>('complaints');

  // Simulator states
  // 1. Complaint Simulator
  const [complaintText, setComplaintText] = useState('Potholes on Hazratganj main road are causing major traffic blocks and vehicle damage.');
  const [complaintResult, setComplaintResult] = useState<ComplaintResult | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  // 2. Chat Simulator
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingLogs, setThinkingLogs] = useState<string[]>([]);

  // 3. Track Simulator
  const [trackStep, setTrackStep] = useState(1);
  const [showLogMetadata, setShowLogMetadata] = useState(false);

  // 4. Emergency Simulator
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyProgress, setEmergencyProgress] = useState(10);
  const [emergencyLogs, setEmergencyLogs] = useState<string[]>([]);

  // 5. Audit Simulator
  const [isVerifyingAudit, setIsVerifyingAudit] = useState(false);
  const [auditVerified, setAuditVerified] = useState(false);
  const [sealHash, setSealHash] = useState('0x4e652a89f345512bcd89e02c98ffc117b20349aef567d12d6a');

  const handleClassify = () => {
    setIsClassifying(true);
    setComplaintResult(null);
    setTimeout(() => {
      let category = '🏢 PWD / Public Works';
      let urgency = 'Medium';
      let confidence = '94.2%';
      let department = 'Hazratganj Road Division';
      let tags = ['Road Safety', 'Infrastructure', 'Hazratganj'];

      const text = complaintText.toLowerCase();
      if (text.includes('garbage') || text.includes('waste') || text.includes('clean') || text.includes('sanitation')) {
        category = '🧹 Sanitation & Municipal Waste';
        urgency = 'Medium';
        confidence = '97.5%';
        department = 'Nagar Nigam Zone-1 Cleanliness Wing';
        tags = ['Sanitation', 'Public Health', 'Waste'];
      } else if (text.includes('water') || text.includes('leak') || text.includes('sewage') || text.includes('drain')) {
        category = '🚰 Jal Sansthan (Water Services)';
        urgency = 'High';
        confidence = '96.1%';
        department = 'Central Awadh Hydrology Unit';
        tags = ['Water Supply', 'Sewage', 'Plumbing'];
      } else if (text.includes('woman') || text.includes('women') || text.includes('safety') || text.includes('harass') || text.includes('night')) {
        category = '🚨 Women Safety & Police Patrol';
        urgency = 'CRITICAL (Immediate Bypass)';
        confidence = '99.4%';
        department = 'Lucknow Gomti Riverfront Safety Command';
        tags = ['Women Safety', 'Police Patrol', 'Emergency'];
      } else if (text.includes('corruption') || text.includes('bribe') || text.includes('fraud') || text.includes('cheat')) {
        category = '⚖️ Anti-Corruption & Revenue Audit';
        urgency = 'CRITICAL (Immediate Bypass)';
        confidence = '98.7%';
        department = 'District DM Revenue Seal Directorate';
        tags = ['Anti-Corruption', 'Audit', 'Finance'];
      } else if (text.includes('accident') || text.includes('fire') || text.includes('burn') || text.includes('blast')) {
        category = '🔥 Fire & Emergency Operations';
        urgency = 'CRITICAL (Immediate Bypass)';
        confidence = '99.8%';
        department = 'Hazratganj Fire Station HQ';
        tags = ['Fire Rescue', 'Disaster Control', 'Immediate Rescue'];
      }

      setComplaintResult({ category, urgency, confidence, department, tags });
      setIsClassifying(false);
    }, 1200);
  };

  // Run initial simulation step to pre-fill
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClassify();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStartChatStream = (prompt: string) => {
    setChatPrompt(prompt);
    setIsStreaming(true);
    setChatResponse('');
    setThinkingLogs(['[Planner] Inspecting query intent...', '[RAG] Retrieving Lucknow schematics & bylaws...', '[RAG] Found 2 matches in UP Pension Act 2024.']);

    let fullText = '';
    if (prompt.includes('Pension')) {
      fullText = 'Based on UP Pension Guidelines 2024:\n\n1. **Eligibility**: Citizens aged 60+ with household incomes under ₹50,000/year.\n2. **Documents Required**: Aadhaar, Land records, Income Certificate.\n3. **Application Route**: Submit on SarkarAI Citizen Portal -> Auto-routed to PWD/Welfare Bureau. Approvals are sealed digitally in 48 hours.';
    } else if (prompt.includes('Bhool')) {
      fullText = 'To explore Bara Imambara & Bhool Bhulaiya:\n\n* **Aesthetics**: Iconic 18th-century structure with 1000+ interlocking passages.\n* **Access Hours**: 9:00 AM - 5:30 PM IST.\n* **Smart Governance Advantage**: Verify entry permits digitally in the Lucknow Explore Portal to get a dynamic QR code directly mapped to Gomti smart sensors!';
    } else {
      fullText = 'Welcome to SarkarAI Conversational Desk! Speak or type in Awadhi, Hindi, or Hinglish. I can analyze complaints, check scheme status, or connect you directly with district executive commissioners in real-time.';
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setChatResponse(prev => prev + fullText.charAt(i));
        i++;
        if (i % 25 === 0) {
          setThinkingLogs(prev => [...prev, `[SSE Stream] Emitting token block at offset ${i}...`]);
        }
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setThinkingLogs(prev => [...prev, '[LLM Engine] Stream completed successfully. Channel idle.']);
      }
    }, 15);
  };

  const startEmergencyBypassSim = () => {
    setEmergencyActive(true);
    setEmergencyProgress(10);
    setEmergencyLogs(['[Sensor] HIGH-ALERT: Critical complaint detected.', '[Orchestration] Initiating emergency validation sequence...']);

    let currentProg = 10;
    const interval = setInterval(() => {
      if (currentProg < 90) {
        currentProg += 10;
        setEmergencyProgress(currentProg);

        if (currentProg === 30) {
          setEmergencyLogs(prev => [...prev, '[LangGraph] Bypassing normal verification queues.']);
        } else if (currentProg === 50) {
          setEmergencyLogs(prev => [...prev, '[Planner] Rerouting task envelope directly to District Commissioner.']);
        } else if (currentProg === 70) {
          setEmergencyLogs(prev => [...prev, '[Notification] Dispatching priority SMS alerts to duty officers.']);
        } else if (currentProg === 90) {
          setEmergencyLogs(prev => [...prev, '[Seals] EMERGENCY BYPASS SUCCESSFUL: Progress locked at 90%, pending DM Audit Seal.']);
          clearInterval(interval);
        }
      }
    }, 400);
  };

  const handleVerifyAudit = () => {
    setIsVerifyingAudit(true);
    setAuditVerified(false);
    setTimeout(() => {
      setIsVerifyingAudit(false);
      setAuditVerified(true);
    }, 1500);
  };

  const agents = [
    {
      name: "1. Planner Agent",
      role: "Workflow Decomposition",
      desc: "Deconstructs raw citizen applications and complaints into verification sub-tasks. Routes tasks to respective specialists.",
      icon: Cpu,
      color: "text-cyber-cyan"
    },
    {
      name: "2. Verification Agent",
      role: "OCR & Aadhaar / PAN Verification",
      desc: "Performs high-fidelity OCR scanning. Confirms identity match criteria and validates document authenticity.",
      icon: ShieldCheck,
      color: "text-cyber-blue"
    },
    {
      name: "3. Rule Engine Agent",
      role: "Compliance & Eligibility Checks",
      desc: "Applies UP government regulations and municipal bylaws. Automates scheme limits and ceiling thresholds.",
      icon: Database,
      color: "text-cyber-purple"
    },
    {
      name: "4. Translation Agent",
      role: "Awadhi, Hindi, Hinglish i18n",
      desc: "Normalizes language barriers. Generates natural-sounding citizen correspondence and local administrative logs.",
      icon: Languages,
      color: "text-cyber-green"
    },
    {
      name: "5. Notification Agent",
      role: "Automated Citizen Telemetry Alerts",
      desc: "Dispatches SMS, WhatsApp, and dashboard triggers directly keeping the citizen informed of every single milestone.",
      icon: Bell,
      color: "text-cyber-cyan"
    },
    {
      name: "6. Escalation Agent",
      role: "SLA Monitor & Safety Audit",
      desc: "Supervises team delays. Auto-triggers alerts and re-routes approvals to higher commissioners to avoid manual delays.",
      icon: AlertTriangle,
      color: "text-cyber-pink"
    },
    {
      name: "7. Audit Agent",
      role: "Immutable Vault Sealing",
      desc: "Hashes verified data envelopes and commits them to immutable databases. Generates compliance certificate logs.",
      icon: FileCheck2,
      color: "text-cyber-orange"
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Landmark className="text-cyber-cyan animate-pulse" size={18} />
            <span className="text-xs uppercase font-mono font-bold text-cyber-cyan tracking-widest">Sovereign Blueprint & Guided Walkthrough</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">How SarkarAI Works: Interactive Blueprints</h2>
          <p className="text-xs text-white/50 max-w-2xl">
            SarkarAI OS replaces static forms and manual bureaucracy with 8 synchronized, autonomous AI digital agents. Click through the simulator categories below to test-drive core capabilities in real-time.
          </p>
        </div>

        {/* Lucknow Modernisation Section */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center border border-cyber-cyan/20">
          <div className="absolute inset-0 cyber-grid opacity-15" />
          <div className="h-14 w-14 rounded-full bg-cyber-cyan/15 border border-cyber-cyan/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Sparkles size={24} className="text-cyber-cyan animate-pulse" />
          </div>
          <div className="flex flex-col gap-1 relative z-10">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              मुस्कुराइए, आप लखनऊ में हैं — Dynamic Governance at Your Service
            </h3>
            <p className="text-xs text-white/60 leading-relaxed max-w-3xl">
              From the historical architecture of Hazratganj to the modern IT hubs of Gomti Nagar, SarkarAI maps municipal regulations directly to automated execution paths. Speak in Hindi, English, or Awadhi; our Translation layers guarantee equal dignity of access.
            </p>
          </div>
        </div>

        {/* Interactive Simulator Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold text-white/40 font-mono tracking-widest">
              Live Platform Capabilities Simulator
            </h3>
            <span className="text-[10px] text-cyber-cyan font-mono bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/20">
              Interactive Mode Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tabs sidebar */}
            <div className="lg:col-span-1 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('complaints')}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                  activeTab === 'complaints'
                    ? 'bg-gradient-to-r from-cyber-cyan/15 to-cyber-blue/5 text-cyber-cyan border-cyber-cyan/40 shadow-[0_0_10px_rgba(0,240,255,0.05)]'
                    : 'text-white/60 hover:text-white bg-white/5 border-transparent'
                }`}
              >
                <FileText size={16} />
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold">1. AI Classifier</span>
                  <span className="text-[9px] text-white/40 mt-1 uppercase font-mono">Auto Routing</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-cyber-cyan/15 to-cyber-blue/5 text-cyber-cyan border-cyber-cyan/40 shadow-[0_0_10px_rgba(0,240,255,0.05)]'
                    : 'text-white/60 hover:text-white bg-white/5 border-transparent'
                }`}
              >
                <MessageSquareCode size={16} />
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold">2. Streaming Assistant</span>
                  <span className="text-[9px] text-white/40 mt-1 uppercase font-mono">SSE Token Chat</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('track')}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                  activeTab === 'track'
                    ? 'bg-gradient-to-r from-cyber-cyan/15 to-cyber-blue/5 text-cyber-cyan border-cyber-cyan/40 shadow-[0_0_10px_rgba(0,240,255,0.05)]'
                    : 'text-white/60 hover:text-white bg-white/5 border-transparent'
                }`}
              >
                <Search size={16} />
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold">3. Milestone Tracker</span>
                  <span className="text-[9px] text-white/40 mt-1 uppercase font-mono">Agent Milestones</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('emergency')}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                  activeTab === 'emergency'
                    ? 'bg-gradient-to-r from-cyber-pink/25 to-cyber-pink/5 text-cyber-pink border-cyber-pink/40 shadow-[0_0_10px_rgba(255,42,133,0.05)] animate-pulse'
                    : 'text-white/60 hover:text-white bg-white/5 border-transparent'
                }`}
              >
                <AlertOctagon size={16} />
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold text-cyber-pink">4. Emergency Bypass</span>
                  <span className="text-[9px] text-cyber-pink/60 mt-1 uppercase font-mono">Fast-Track Node</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                  activeTab === 'audit'
                    ? 'bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/5 text-cyber-purple border-cyber-purple/40 shadow-[0_0_10px_rgba(188,19,254,0.05)]'
                    : 'text-white/60 hover:text-white bg-white/5 border-transparent'
                }`}
              >
                <ShieldCheck size={16} />
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold">5. Sovereign Seals</span>
                  <span className="text-[9px] text-white/40 mt-1 uppercase font-mono">Audit Hash Vault</span>
                </div>
              </button>
            </div>

            {/* Display Simulator Panel */}
            <div className="lg:col-span-3 glass-card p-6 rounded-xl border border-white/5 min-h-[350px] flex flex-col justify-between">
              
              {/* Tab 1: COMPLAINTS CLASSIFIER SIMULATOR */}
              {activeTab === 'complaints' && (
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="text-cyber-cyan animate-pulse" size={16} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">RAG Auto-Classifier Lab</span>
                    </div>
                    <span className="text-[9px] text-white/40 font-mono">STAGE: Citizen Intake</span>
                  </div>

                  <p className="text-xs text-white/60">
                    SarkarAI automatically routes applications to their correct department, and locks in the priority urgency. Click a preset prompt below or type your own to see it live:
                  </p>

                  <div className="flex flex-wrap gap-2 py-1">
                    <button 
                      onClick={() => setComplaintText('Garbage heaps piling up next to Bara Imambara heritage gate. Cleanliness needed urgently.')}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-2 py-1 rounded border border-white/5 transition"
                    >
                      Bara Imambara Garbage
                    </button>
                    <button 
                      onClick={() => setComplaintText('Broken sewage line leaking contaminated water into residential pipelines in Zone 3.')}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-2 py-1 rounded border border-white/5 transition"
                    >
                      Zone 3 Water Sewage
                    </button>
                    <button 
                      onClick={() => setComplaintText('Harassment incident and poor lighting reported near Gomti Riverfront bypass loop at 10 PM.')}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-2 py-1 rounded border border-white/5 transition"
                    >
                      🚨 Gomti Safety Concern
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      placeholder="Type a complaint..."
                      className="bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white flex-1 focus:outline-none focus:border-cyber-cyan font-sans"
                    />
                    <button 
                      onClick={handleClassify}
                      disabled={isClassifying}
                      className="bg-cyber-cyan hover:bg-cyber-cyan/90 text-navy-950 text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 transition shrink-0"
                    >
                      <Play size={12} className={isClassifying ? 'animate-spin' : ''} />
                      {isClassifying ? 'Analyzing...' : 'Run NLP Analysis'}
                    </button>
                  </div>

                  {/* Results Display */}
                  <div className="mt-4 flex-1 bg-black/30 border border-white/5 rounded-lg p-4 relative overflow-hidden">
                    {isClassifying ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-xs">
                        <div className="flex flex-col items-center gap-2">
                          <span className="h-5 w-5 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                          <span className="text-[10px] font-mono text-cyber-cyan uppercase tracking-widest animate-pulse">Running OCR & Vector Bylaw match...</span>
                        </div>
                      </div>
                    ) : null}

                    {complaintResult ? (
                      <div className="flex flex-col gap-3 font-mono text-[11px]">
                        <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-2">
                          <div>
                            <span className="text-white/40 uppercase block text-[9px]">Predicted Category</span>
                            <span className="text-white font-bold">{complaintResult.category}</span>
                          </div>
                          <div>
                            <span className="text-white/40 uppercase block text-[9px]">Assigned Division</span>
                            <span className="text-cyber-cyan font-bold">{complaintResult.department}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-2">
                          <div>
                            <span className="text-white/40 uppercase block text-[9px]">Bypass Urgency Level</span>
                            <span className={`font-bold ${
                              complaintResult.urgency.includes('CRITICAL') ? 'text-cyber-pink animate-pulse' : 'text-cyber-green'
                            }`}>
                              {complaintResult.urgency}
                            </span>
                          </div>
                          <div>
                            <span className="text-white/40 uppercase block text-[9px]">Agent Confidence</span>
                            <span className="text-white font-bold">{complaintResult.confidence}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-white/40 uppercase block text-[9px] mb-1">Generated Knowledge Graph Tags</span>
                          <div className="flex gap-1.5">
                            {complaintResult.tags.map((tag: string, idx: number) => (
                              <span key={idx} className="bg-white/5 px-2 py-0.5 rounded text-white/70 text-[9px] border border-white/10">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-white/30 italic">
                        Configure a complaint and click Run NLP Analysis
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: SSE CHATBOT STREAM SIMULATOR */}
              {activeTab === 'chat' && (
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquareCode className="text-cyber-cyan animate-pulse" size={16} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Server-Sent Events Token Streamer</span>
                    </div>
                    <span className="text-[9px] text-white/40 font-mono">SSE PROTOCOL (CHUNK_STREAM)</span>
                  </div>

                  <p className="text-xs text-white/60">
                    SarkarAI does not wait for complete server compile buffers. It pipes direct, real-time chunk streams onto your screen as they resolve. Click a prompt below to see the streaming typewriter effect:
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartChatStream('Pension Scheme eligibility criteria?')}
                      disabled={isStreaming}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white p-2 rounded border border-white/5 text-[10px] text-left transition"
                    >
                      📋 Pension Scheme Rule Check
                    </button>
                    <button
                      onClick={() => handleStartChatStream('How do I explore Bara Imambara digitally?')}
                      disabled={isStreaming}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white p-2 rounded border border-white/5 text-[10px] text-left transition"
                    >
                      🕌 Lucknow Bhool Bhulaiya Explorer
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                    {/* Left: Raw SSE Packets */}
                    <div className="md:col-span-1 bg-black/40 border border-white/10 rounded-lg p-3 flex flex-col font-mono text-[9px] h-48 overflow-y-auto scrollbar-cyber">
                      <div className="flex items-center gap-1.5 border-b border-white/5 pb-1 text-white/40 mb-1">
                        <Terminal size={10} />
                        <span>TELEMETRY FEED</span>
                      </div>
                      {thinkingLogs.length > 0 ? (
                        thinkingLogs.map((log, idx) => (
                          <span key={idx} className="text-cyber-cyan leading-relaxed mb-0.5">
                            {log}
                          </span>
                        ))
                      ) : (
                        <span className="text-white/20 italic">No packet telemetry active</span>
                      )}
                    </div>

                    {/* Right: Rendered HTML Chat Container */}
                    <div className="md:col-span-2 bg-black/25 border border-white/5 rounded-lg p-3 flex flex-col justify-between h-48 relative">
                      <div className="overflow-y-auto max-h-36 pr-1 flex flex-col gap-2 scrollbar-cyber">
                        <div className="text-[9px] uppercase font-bold text-cyber-cyan tracking-widest font-mono">SarkarAI Chatbot</div>
                        <p className="text-xs text-white/90 leading-relaxed font-sans whitespace-pre-line">
                          {chatResponse || (
                            <span className="text-white/30 italic">Click one of the mock prompts above to stream active tokens...</span>
                          )}
                          {isStreaming && (
                            <span className="inline-block w-1.5 h-3.5 bg-cyber-cyan ml-0.5 animate-pulse" />
                          )}
                        </p>
                      </div>

                      {isStreaming && (
                        <div className="flex items-center justify-between text-[8px] font-mono text-cyber-cyan/50 mt-2 border-t border-cyber-cyan/20 pt-1">
                          <span>STREAMING ACTIVE...</span>
                          <span className="animate-pulse">● CHUNKS RETRIEVED</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: MILESTONE TRACKER LIFE-CYCLE */}
              {activeTab === 'track' && (
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Search className="text-cyber-cyan animate-pulse" size={16} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Citizen Tracker & Agent Timeline</span>
                    </div>
                    <span className="text-[9px] text-white/40 font-mono">STAGE: {trackStep}/4 Progress</span>
                  </div>

                  <p className="text-xs text-white/60">
                    All applications trigger interactive milestone timelines. Slide or click through the lifecycle steps to see what metadata is generated by digital agents behind the scenes:
                  </p>

                  {/* Interactive Slider */}
                  <div className="flex justify-between items-center py-4 px-2 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                    <div 
                      className="absolute top-1/2 left-0 h-0.5 bg-cyber-cyan -translate-y-1/2 z-0 transition-all duration-300"
                      style={{ width: `${((trackStep - 1) / 3) * 100}%` }}
                    />

                    {[1, 2, 3, 4].map((step) => {
                      const titles = ['1. Intested', '2. Verified', '3. Officer Review', '4. Cert Sealed'];
                      const active = trackStep >= step;
                      return (
                        <button
                          key={step}
                          onClick={() => setTrackStep(step)}
                          className={`h-7 w-7 rounded-full flex items-center justify-center font-mono font-bold text-xs relative z-10 transition border duration-300 ${
                            active
                              ? 'bg-navy-950 border-cyber-cyan text-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                              : 'bg-navy-950 border-white/10 text-white/40'
                          }`}
                        >
                          {step}
                          <span className={`absolute top-8 left-1/2 -translate-x-1/2 text-[9px] font-mono whitespace-nowrap tracking-wide ${
                            trackStep === step ? 'text-cyber-cyan font-bold' : 'text-white/40'
                          }`}>
                            {titles[step - 1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Step Description Card */}
                  <div className="mt-4 flex-grow bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col justify-between">
                    <div>
                      {trackStep === 1 && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] text-cyber-cyan uppercase font-mono font-bold">Step 1: Citizen Ingestion Complete</span>
                          <p className="text-xs text-white/80 font-sans leading-relaxed">
                            Application files (PDF documents, photographs) have been received. The **Planner Agent** parses document bounds and schedules processing nodes.
                          </p>
                        </div>
                      )}
                      {trackStep === 2 && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] text-cyber-cyan uppercase font-mono font-bold">Step 2: OCR Extraction & Registry Match</span>
                          <p className="text-xs text-white/80 font-sans leading-relaxed">
                            **Verification Agent** scanned the Aadhaar numbers and land deed registries using high-fidelity optical OCR. Rule engines verify eligibility threshold constraints.
                          </p>
                        </div>
                      )}
                      {trackStep === 3 && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] text-cyber-purple uppercase font-mono font-bold">Step 3: Officer Audit Review Console</span>
                          <p className="text-xs text-white/80 font-sans leading-relaxed">
                            Routed to Hazratganj Executive Officer desk. Live citizen-officer chat triggers let the citizen answer clarifying inquiries and upload additional proof metrics instantly.
                          </p>
                        </div>
                      )}
                      {trackStep === 4 && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] text-cyber-green uppercase font-mono font-bold">Step 4: Sovereign Compliance Seals Committed</span>
                          <p className="text-xs text-white/80 font-sans leading-relaxed">
                            The **Audit Agent** compiled the finished records, hashed them into the secure local database ledger, and generated a locked PDF certificate signed digitally by Nagar Nigam officers.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                      <button
                        onClick={() => setShowLogMetadata(!showLogMetadata)}
                        className="text-[9px] text-cyber-cyan hover:underline font-mono uppercase tracking-widest"
                      >
                        {showLogMetadata ? 'Hide Cryptographic Log' : 'Show Cryptographic Log'}
                      </button>
                      <span className="text-[8px] font-mono text-white/30">AUDIT_VAULT_ACTIVE</span>
                    </div>

                    {showLogMetadata && (
                      <div className="mt-2 p-2 bg-black border border-cyber-cyan/20 rounded font-mono text-[9px] text-cyber-cyan leading-relaxed">
                        &#123;<br/>
                        &nbsp;&nbsp;&quot;step&quot;: {trackStep},<br/>
                        &nbsp;&nbsp;&quot;timestamp&quot;: &quot;2026-05-29T23:02Z&quot;,<br/>
                        &nbsp;&nbsp;&quot;agent_executor&quot;: &quot;AuditAgent_v4&quot;,<br/>
                        &nbsp;&nbsp;&quot;ledger_hash&quot;: &quot;0x00fef043ea7a2dce5123d9b0ef...&quot;,<br/>
                        &nbsp;&nbsp;&quot;status&quot;: &quot;TEMPER_PROOF_SECURED&quot;<br/>
                        &#125;
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: EMERGENCY CRITICAL BYPASS */}
              {activeTab === 'emergency' && (
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex justify-between items-center border-b border-cyber-pink/20 pb-3">
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="text-cyber-pink animate-pulse" size={16} />
                      <span className="text-xs font-bold text-cyber-pink uppercase tracking-wider font-mono">High-Alert Emergency Bypasser</span>
                    </div>
                    <span className="text-[9px] text-cyber-pink font-mono">SLA TRIGGER SEVERITY: CRITICAL</span>
                  </div>

                  <p className="text-xs text-white/60">
                    If an application is tagged under high-alert safety categories (e.g. **Women Safety**, **Fire**, **Severe Fraud**), SarkarAI locks the urgency to critical, fast-tracks progress directly to 90%, and sounds immediate alarms on commissioner panels.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div className="bg-black/40 border border-cyber-pink/20 rounded-lg p-4 flex flex-col justify-between items-center text-center">
                      <div className="flex flex-col items-center">
                        <ShieldAlert className="text-cyber-pink animate-bounce mb-2" size={32} />
                        <span className="text-xs font-bold text-white font-mono uppercase tracking-wide">Emergency Simulation Console</span>
                        <p className="text-[10px] text-white/50 mt-1 max-w-xs">
                          Launch a mock emergency bypass to see how the system bypasses rule agents and fast-tracks the approval.
                        </p>
                      </div>

                      <div className="w-full flex gap-2 justify-center mt-3">
                        <button
                          onClick={startEmergencyBypassSim}
                          disabled={emergencyActive}
                          className="bg-cyber-pink hover:bg-cyber-pink/80 text-white text-xs font-bold px-4 py-2 rounded transition shadow-[0_0_15px_rgba(255,42,133,0.3)]"
                        >
                          Trigger Mock Emergency Bypass
                        </button>
                        {emergencyActive && (
                          <button
                            onClick={() => {
                              setEmergencyActive(false);
                              setEmergencyProgress(10);
                              setEmergencyLogs([]);
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded transition"
                          >
                            <RotateCcw size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-black/30 border border-white/5 rounded-lg p-3 flex flex-col font-mono text-[9px] justify-between">
                      <div className="flex flex-col gap-1.5 h-28 overflow-y-auto scrollbar-cyber">
                        <span className="text-white/40 border-b border-white/5 pb-1 block">AGENT ESCALATION STREAM</span>
                        {emergencyLogs.map((log, index) => (
                          <span key={index} className="text-cyber-pink leading-relaxed">
                            {log}
                          </span>
                        ))}
                      </div>

                      {/* Progress Bar Display */}
                      <div className="mt-3 border-t border-white/5 pt-2">
                        <div className="flex justify-between text-[8px] text-white/40 mb-1">
                          <span>AUTO-ESCALATION PROGRESS</span>
                          <span className={emergencyProgress === 90 ? 'text-cyber-pink font-bold' : ''}>
                            {emergencyProgress}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyber-pink rounded-full transition-all duration-300"
                            style={{ width: `${emergencyProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: CRYPTOGRAPHIC AUDIT VAULT */}
              {activeTab === 'audit' && (
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex justify-between items-center border-b border-cyber-purple/20 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-cyber-purple animate-pulse" size={16} />
                      <span className="text-xs font-bold text-cyber-purple uppercase tracking-wider font-mono">Immutable Compliance Ledger</span>
                    </div>
                    <span className="text-[9px] text-cyber-purple font-mono">SECURITY: SECURE VAULT</span>
                  </div>

                  <p className="text-xs text-white/60">
                    To eliminate under-the-table bribery and registry forgery, the final certified outcomes are hashed and committed to an immutable decentralized audit database. Click below to verify document legitimacy:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                    <div className="md:col-span-2 bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col justify-between">
                      <div className="flex flex-col gap-2 font-mono text-[10px]">
                        <span className="text-white/40 block text-[9px] uppercase">Registry Document Envelope</span>
                        <div className="bg-black border border-white/15 p-2 rounded leading-relaxed text-white/80">
                          ID: LKO-77402-99<br/>
                          Applicant: Amit Sarkar<br/>
                          Verification: Aadhaar Match<br/>
                          Status: Sealed Certificate
                        </div>
                      </div>

                      <button
                        onClick={handleVerifyAudit}
                        disabled={isVerifyingAudit}
                        className="bg-cyber-purple hover:bg-cyber-purple/90 text-white text-xs font-bold py-2 rounded transition mt-3 flex items-center justify-center gap-1.5"
                      >
                        <Fingerprint size={14} className={isVerifyingAudit ? 'animate-pulse' : ''} />
                        {isVerifyingAudit ? 'Verifying Seals...' : 'Verify Ledger Integrity'}
                      </button>
                    </div>

                    <div className="md:col-span-3 bg-black/20 border border-white/5 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                      {isVerifyingAudit ? (
                        <div className="flex flex-col items-center gap-2 font-mono">
                          <span className="h-6 w-6 border-2 border-cyber-purple border-t-transparent rounded-full animate-spin" />
                          <span className="text-[10px] text-cyber-purple uppercase tracking-wider animate-pulse">Hashing blocks & matching signatures...</span>
                        </div>
                      ) : auditVerified ? (
                        <div className="flex flex-col items-center gap-2 font-mono">
                          <div className="h-10 w-10 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green text-lg animate-bounce">
                            ✓
                          </div>
                          <span className="text-xs font-bold text-cyber-green uppercase tracking-wide">Ledger Integrity 100% Intact</span>
                          <span className="text-[9px] text-white/50 max-w-xs leading-normal">
                            Hash match validated successfully against Local District Ledger at block `4,881`. Document is authentic and unaltered.
                          </span>
                          <span className="text-[8px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/40 mt-1">
                            SHA-256: {sealHash.substring(0, 16)}...
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-white/30 italic text-xs font-sans">
                          <Fingerprint size={32} className="opacity-40 mb-1" />
                          Click Verify Ledger Integrity to test seal authenticity.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Original Grid of 7 Autonomous Agents (Retained & styled beautifully for Sovereignty docs integrity) */}
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-xs uppercase font-bold text-white/40 font-mono tracking-widest border-b border-white/5 pb-2">
            The Sovereign Blueprint: 7 Autonomous Core Agents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <div key={i} className="glass-card p-5 rounded-lg flex flex-col gap-4 border border-white/5 relative group">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center ${agent.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-xs font-bold text-white">{agent.name}</span>
                      <span className="text-[9px] text-white/40 mt-1 font-mono uppercase">{agent.role}</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans mt-1">
                    {agent.desc}
                  </p>
                  {/* Subtle top indicator hover */}
                  <span className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Verification lifecycle diagram */}
        <div className="glass-card p-6 rounded-xl border border-white/5 flex flex-col gap-4">
          <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Execution Lifecycle Pipeline</span>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2">
            
            <div className="flex flex-col items-center justify-center p-3 rounded bg-white/5 border border-white/10 text-center w-full md:w-32">
              <span className="text-xs font-bold text-white">1. Citizens Ingest</span>
              <span className="text-[9px] text-white/40 font-mono mt-0.5">Deeds, ID Uploads</span>
            </div>

            <span className="hidden md:block text-cyber-cyan animate-pulse">&rarr;</span>

            <div className="flex flex-col items-center justify-center p-3 rounded bg-cyber-cyan/5 border border-cyber-cyan/20 text-center w-full md:w-32">
              <span className="text-xs font-bold text-cyber-cyan">2. Agent Check</span>
              <span className="text-[9px] text-cyber-cyan/60 font-mono mt-0.5">OCR, Bylaws Match</span>
            </div>

            <span className="hidden md:block text-cyber-purple animate-pulse">&rarr;</span>

            <div className="flex flex-col items-center justify-center p-3 rounded bg-cyber-purple/5 border border-cyber-purple/20 text-center w-full md:w-32">
              <span className="text-xs font-bold text-cyber-purple">3. Human DM Audit</span>
              <span className="text-[9px] text-cyber-purple/60 font-mono mt-0.5">DM Approvals Vault</span>
            </div>

            <span className="hidden md:block text-cyber-green animate-pulse">&rarr;</span>

            <div className="flex flex-col items-center justify-center p-3 rounded bg-cyber-green/5 border border-cyber-green/20 text-center w-full md:w-32">
              <span className="text-xs font-bold text-cyber-green">4. Sealed Registry</span>
              <span className="text-[9px] text-cyber-green/60 font-mono mt-0.5">PDF Cert Signed</span>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
