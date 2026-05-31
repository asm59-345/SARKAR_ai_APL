'use client';
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useLanguageStore, Language } from '@/lib/store/language-store';
import { useNotificationStore } from '@/lib/store/notification-store';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { 
  Globe, 
  Bell, 
  Cpu, 
  Database, 
  CheckCircle, 
  ShieldAlert, 
  Activity,
  Menu,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { language, setLanguage, t } = useLanguageStore();
  const { notifications, toast, clearToast, markAsRead } = useNotificationStore();
  const { telemetry, isRunning } = useWorkflowStore();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const isLightMode = document.documentElement.classList.contains('light') || !document.documentElement.classList.contains('dark');
    setTimeout(() => {
      setTheme(isLightMode ? 'light' : 'dark');
    }, 0);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
      case 'en': return 'English';
      case 'hi': return 'हिन्दी';
      case 'aw': return 'अवधी';
      case 'hl': return 'Hinglish';
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden text-white/70 hover:text-white p-1 hover:bg-white/5 rounded-md transition"
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_#00f0ff]" />
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-mono">
              SarkarAI <span className="text-[10px] uppercase font-bold tracking-widest text-cyber-purple px-1.5 py-0.5 rounded bg-cyber-purple/10 border border-cyber-purple/20">OS v1.0</span>
            </h1>
          </div>
          <span className="text-[9px] text-white/50 tracking-wider font-sans leading-none mt-1">
            {t('lucknowTag')}
          </span>
        </Link>
      </div>

      {/* Telemetry Status (Desktop) */}
      <div className="hidden xl:flex items-center gap-6 text-[11px] font-mono text-white/60">
        <div className="flex items-center gap-1.5">
          <Activity size={12} className={`text-cyber-cyan ${isRunning ? 'animate-pulse' : ''}`} />
          <span>SYS OVERHEAD: <strong className="text-white">{telemetry.cpuLoad}%</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu size={12} className="text-cyber-purple" />
          <span>RAM: <strong className="text-white">{telemetry.ramUsage}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Database size={12} className="text-cyber-green" />
          <span>CONSENSUS: <strong className="text-white">{telemetry.consensusRate}%</strong></span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 relative">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition cursor-pointer flex items-center justify-center select-none"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun size={15} className="text-cyber-cyan animate-pulse" />
          ) : (
            <Moon size={15} className="text-cyber-purple" />
          )}
        </button>
        {/* Language Switcher */}
        <div className="relative">
          <button 
            onClick={() => { setShowLangMenu(!showLangMenu); setShowNotifications(false); }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition cursor-pointer font-medium"
          >
            <Globe size={13} className="text-cyber-cyan" />
            <span>{getLanguageLabel(language)}</span>
            <ChevronDown size={12} className="opacity-60" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1.5 w-36 rounded-md bg-navy-950 border border-white/10 p-1 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              {(['en', 'hi', 'aw', 'hl'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={`w-full text-left text-xs px-2.5 py-2 rounded transition cursor-pointer ${
                    language === lang 
                      ? 'bg-cyber-cyan/15 text-cyber-cyan font-bold border-l-2 border-cyber-cyan' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {getLanguageLabel(lang)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Tray */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowLangMenu(false); }}
            className="p-2 rounded-md bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition relative cursor-pointer"
          >
            <Bell size={15} />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyber-pink shadow-[0_0_8px_#ff2a85]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-80 rounded-lg bg-navy-950 border border-white/10 shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                <span className="text-xs font-bold text-white font-mono">Telemetry Alert Inbox</span>
                <span className="text-[9px] text-white/40">{notifications.length} total</span>
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-white/40">No warning flags logged</div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`p-2.5 border-b border-white/5 hover:bg-white/5 transition cursor-pointer flex gap-2 items-start ${!n.read ? 'bg-cyber-blue/5' : ''}`}
                    >
                      {n.type === 'escalation' && <ShieldAlert size={14} className="text-cyber-pink shrink-0 mt-0.5" />}
                      {n.type === 'success' && <CheckCircle size={14} className="text-cyber-green shrink-0 mt-0.5" />}
                      {n.type === 'warning' && <ShieldAlert size={14} className="text-cyber-orange shrink-0 mt-0.5" />}
                      {n.type === 'info' && <Activity size={14} className="text-cyber-cyan shrink-0 mt-0.5" />}
                      
                      <div className="flex flex-col">
                        <span className={`text-xs font-medium text-white ${!n.read ? 'font-bold' : ''}`}>{n.title}</span>
                        <span className="text-[10px] text-white/60 leading-tight mt-0.5">{n.description}</span>
                        <span className="text-[8px] text-white/30 mt-1 font-mono">{n.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-white/5 text-center">
                <Link 
                  href="/notifications" 
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] text-cyber-cyan hover:underline font-mono"
                >
                  View All Alerts System Logs &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Toast Overlay */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg bg-navy-950 border border-cyber-cyan/30 text-white shadow-2xl flex gap-3 items-start max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300 neon-border-cyan">
          <div className="mt-0.5">
            {toast.type === 'success' && <CheckCircle className="text-cyber-green" size={18} />}
            {toast.type === 'escalation' && <ShieldAlert className="text-cyber-pink" size={18} />}
            {toast.type === 'warning' && <ShieldAlert className="text-cyber-orange" size={18} />}
            {toast.type === 'info' && <Activity className="text-cyber-cyan" size={18} />}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white font-mono">{toast.title}</span>
            <span className="text-[11px] text-white/70 leading-normal mt-0.5">{toast.description}</span>
          </div>
          <button onClick={clearToast} className="text-white/40 hover:text-white text-xs cursor-pointer select-none">
            &times;
          </button>
        </div>
      )}
    </nav>
  );
}
