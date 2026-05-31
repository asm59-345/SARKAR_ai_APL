'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore, Language } from '@/lib/store/language-store';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { Sliders, Globe, RefreshCw, AlertTriangle, Cpu, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguageStore();
  const { 
    simulationSpeed, 
    setSpeed, 
    hasErrorInjected, 
    injectError, 
    addManualLog 
  } = useWorkflowStore();

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
      case 'en': return 'English (Global)';
      case 'hi': return 'हिन्दी (राजभाषा)';
      case 'aw': return 'अवधी (लखनऊ लोकल)';
      case 'hl': return 'Hinglish (Conversational)';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Sliders className="text-cyber-cyan animate-pulse" size={18} />
            <span className="text-xs uppercase font-mono font-bold text-cyber-cyan tracking-widest">Global Telemetry Config</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">System Settings</h2>
          <p className="text-xs text-white/50">Configure simulated server latency thresholds, global state localizer switches, and uploader rulesets.</p>
        </div>

        {/* Global Settings Panel Cards */}
        <div className="flex flex-col gap-6">
          
          {/* Card 1: Language Switcher */}
          <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Globe size={15} className="text-cyber-cyan" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">i18n Global Language Switcher</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {(['en', 'hi', 'aw', 'hl'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    addManualLog('System Configuration', `Switched global locale context to ${lang.toUpperCase()}`, 'info');
                  }}
                  className={`p-3 rounded-lg border text-left text-xs transition cursor-pointer flex justify-between items-center ${
                    language === lang 
                      ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_10px_rgba(0,240,255,0.05)]' 
                      : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="font-sans font-medium">{getLanguageLabel(lang)}</span>
                  {language === lang && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Simulator speed controller & OCR disputed injection */}
          <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Cpu size={15} className="text-cyber-purple" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">WebSocket Simulator Control Board</span>
            </div>

            {/* Ingestion speed switcher */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/70">Autonomous Agent Heartbeat Frequency</label>
              <p className="text-[10px] text-white/40 leading-normal mb-1">Set the heartbeat duration speed. Controls how fast different agents verify land coordinates or Aadhaar documents.</p>
              
              <div className="flex bg-navy-950 p-1 rounded-lg border border-white/10 font-mono text-xs max-w-sm">
                <button 
                  onClick={() => setSpeed(1000)}
                  className={`flex-1 py-2 text-center rounded transition cursor-pointer ${simulationSpeed === 1000 ? 'bg-cyber-cyan text-navy-950 font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  High (1.0s)
                </button>
                <button 
                  onClick={() => setSpeed(2000)}
                  className={`flex-1 py-2 text-center rounded transition cursor-pointer ${simulationSpeed === 2000 ? 'bg-cyber-cyan text-navy-950 font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  Normal (2.0s)
                </button>
                <button 
                  onClick={() => setSpeed(4500)}
                  className={`flex-1 py-2 text-center rounded transition cursor-pointer ${simulationSpeed === 4500 ? 'bg-cyber-cyan text-navy-950 font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  Relaxed (4.5s)
                </button>
              </div>
            </div>

            {/* Disputed Bypass switch */}
            <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <label className="text-xs font-bold text-white/70 flex items-center gap-1.5">
                    <AlertTriangle size={13} className="text-cyber-pink animate-pulse" /> Document Mismatch Simulation
                  </label>
                  <p className="text-[10px] text-white/40 leading-relaxed max-w-md">
                    Force the uploader to inject a name-mismatch dispute during verification scanning. Triggers warning alert logs and prompts immediate Officer Desk review bypass states.
                  </p>
                </div>

                <button 
                  onClick={() => injectError(!hasErrorInjected)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer shrink-0 ${
                    hasErrorInjected 
                      ? 'bg-cyber-pink text-white shadow-[0_0_10px_#ff2a85]' 
                      : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {hasErrorInjected ? 'ACTIVE FAILURE' : 'INACTIVE'}
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Help / FAQ */}
          <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-cyber-purple/5 blur-xl" />
            <div className="flex items-center gap-1.5">
              <HelpCircle size={14} className="text-cyber-purple" />
              <span className="text-xs uppercase font-bold text-white font-mono tracking-wider">Lucknow Telemetry Signature FAQ</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed mt-1">
              Need to test the entire ecosystem? Go to **Citizen Portal**, drag and drop one of the pre-seeded document templates, then switch to the **Live Graph** page. You can watch each agent node execute step-by-step and inspect logs as they compile in real time!
            </p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
