'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageStore } from '@/lib/store/language-store';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { 
  Home, 
  BookOpen, 
  MessageSquareCode, 
  User, 
  Briefcase, 
  Settings, 
  GitMerge, 
  BarChart3, 
  Bell, 
  Sliders,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  Search,
  Phone,
  Star,
  Newspaper,
  Users,
  Compass,
  AlertOctagon,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  History,
  FileCheck2,
  Award
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  highlight?: boolean;
  isEmergency?: boolean;
  badge?: string;
}

interface SidebarGroup {
  id: string;
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isOpen, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguageStore();
  const { isRunning } = useWorkflowStore();

  // Collapsible groups open/close status store
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    main: true,
    governance: true,
    smartcity: true,
    citizen: true,
    community: true
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const groups: SidebarGroup[] = [
    {
      id: 'main',
      title: t('groupMain'),
      items: [
        { name: t('home'), path: '/', icon: Home },
        { name: t('howItWorks'), path: '/about', icon: BookOpen },
        { name: t('chat'), path: '/chat', icon: MessageSquareCode, highlight: true },
        { name: t('citizen'), path: '/citizen', icon: User },
      ]
    },
    {
      id: 'governance',
      title: t('groupGovernance'),
      items: [
        { name: t('complaints'), path: '/complaints', icon: AlertTriangle },
        { name: t('track'), path: '/track', icon: Search },
        { name: t('emergency'), path: '/emergency', icon: AlertOctagon, isEmergency: true },
        { name: t('orchestration'), path: '/orchestration', icon: GitMerge, badge: isRunning ? 'active' : undefined },
        { name: t('analytics'), path: '/analytics', icon: BarChart3 },
      ]
    },
    {
      id: 'smartcity',
      title: t('groupSmartCity'),
      items: [
        { name: t('news'), path: '/news', icon: Newspaper },
        { name: t('feed'), path: '/feed', icon: Users },
        { name: t('explore'), path: '/explore', icon: Compass },
      ]
    },
    {
      id: 'citizen',
      title: t('groupCitizen'),
      items: [
        { name: t('propertyServices'), path: '/complaints', icon: ShieldCheck },
        { name: t('pensionServices'), path: '/complaints', icon: Award },
        { name: t('docVerification'), path: '/citizen', icon: FileCheck2 },
      ]
    },
    {
      id: 'community',
      title: t('groupCommunity'),
      items: [
        { name: t('faq'), path: '/faq', icon: HelpCircle },
        { name: t('feedback'), path: '/feedback', icon: Star },
        { name: t('contact'), path: '/contact', icon: Phone },
        { name: t('history'), path: '/history', icon: History, highlight: true },
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 bg-navy-950/95 lg:bg-navy-950/80 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-16 lg:p-2 p-4 w-64' : 'lg:w-64 lg:p-4 p-4 w-64'}
      `}>
        <div className="flex flex-col gap-5 overflow-hidden h-full">
          {/* DM Shield Label */}
          <div className={`flex items-center gap-2.5 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20 shrink-0 transition-all duration-300 ${isCollapsed ? 'justify-center p-2' : 'px-2 py-3'}`}>
            <ShieldCheck className="text-cyber-cyan shrink-0" size={18} />
            {!isCollapsed && (
              <div className="flex flex-col leading-none animate-in fade-in duration-200">
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyber-cyan">NAGAR NIGAM SEALS</span>
                <span className="text-[9px] text-white/50 font-mono mt-0.5 font-bold">District DM Verified</span>
              </div>
            )}
          </div>

          {/* Collapsible Smart Scrolling Navigation menu */}
          <nav className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 scrollbar-cyber">
            {groups.map((group) => {
              const isExpanded = expandedGroups[group.id];
              return (
                <div key={group.id} className="flex flex-col gap-1">
                  {/* Group Header */}
                  {!isCollapsed && (
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-white/40 hover:text-white/70 font-mono transition text-left cursor-pointer select-none"
                    >
                      <span>{group.title}</span>
                      {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                    </button>
                  )}

                  {/* Group items (with smooth reveal transitions) */}
                  {(isExpanded || isCollapsed) && (
                    <div className="flex flex-col gap-0.5 animate-in slide-in-from-top-1 duration-150">
                      {group.items.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.name}
                            href={item.path}
                            onClick={onClose}
                            className={`
                              group flex items-center justify-between rounded-md transition text-xs font-semibold relative overflow-hidden cursor-pointer border
                              ${isCollapsed ? 'justify-center px-0 h-9 w-9 mx-auto' : 'px-3 py-2'}
                              ${isActive 
                                ? 'bg-gradient-to-r from-cyber-cyan/15 to-cyber-purple/5 text-cyber-cyan border-cyber-cyan/35 shadow-[0_0_8px_rgba(0,240,255,0.05)]' 
                                : item.isEmergency
                                  ? 'text-cyber-pink border border-cyber-pink/20 bg-cyber-pink/5 hover:bg-cyber-pink/10 hover:border-cyber-pink/40 shadow-[0_0_10px_rgba(255,42,133,0.03)]'
                                  : 'text-white/60 hover:text-white hover:bg-white/5 border-transparent'
                              }
                            `}
                            title={isCollapsed ? item.name : undefined}
                          >
                            <div className={`flex items-center gap-2.5 relative z-10 ${isCollapsed ? 'justify-center' : ''}`}>
                              <Icon 
                                size={14} 
                                className={`
                                  transition-transform group-hover:scale-110 
                                  ${isActive ? 'text-cyber-cyan' : item.isEmergency ? 'text-cyber-pink' : 'text-white/40 group-hover:text-white/80'}
                                `} 
                              />
                              {!isCollapsed && <span className="animate-in fade-in duration-200">{item.name}</span>}
                            </div>

                            {/* Badge */}
                            {item.badge && !isCollapsed && (
                              <span className="relative z-10 text-[8px] uppercase font-bold tracking-widest bg-cyber-pink text-white px-1 py-0.5 rounded leading-none animate-pulse">
                                {item.badge}
                              </span>
                            )}

                            {/* Dot for active state */}
                            {item.highlight && !isActive && (
                              <span className="h-1.5 w-1.5 rounded-full bg-cyber-purple animate-ping shrink-0" />
                            )}

                            {/* Glass shimmer background layer on hover */}
                            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Lucknow Decorative Signature Footer */}
        <div className="mt-4 flex flex-col gap-3 shrink-0">
          {!isCollapsed && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 relative overflow-hidden group animate-in fade-in duration-200">
              {/* Background Grid */}
              <div className="absolute inset-0 cyber-grid opacity-20" />
              <div className="relative z-10 flex flex-col">
                <div className="flex items-center gap-1">
                  <Sparkles size={11} className="text-cyber-purple animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-white font-mono tracking-wider">Awadh Engine</span>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed mt-1 font-sans">
                  &ldquo;मुस्कुराइए, आप लखनऊ में हैं&rdquo; is active. Natural Dialect Conversational models initialized.
                </p>
                <a 
                  href="/chat"
                  className="mt-2 text-[9px] text-cyber-cyan flex items-center gap-0.5 hover:underline font-mono uppercase font-bold tracking-widest"
                >
                  Launch Voice Orb <ArrowUpRight size={10} />
                </a>
              </div>
              {/* Corner glowing border */}
              <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-cyber-cyan rounded-bl-sm animate-ping" />
            </div>
          )}

          {!isCollapsed && (
            <div className="text-center text-[9px] text-white/30 font-mono border-t border-white/5 pt-2 animate-in fade-in duration-200">
              SARKARAI OS &copy; 2026<br/>
              INDIAN AI GOVERNANCE DEV
            </div>
          )}

          {/* Collapsible toggle arrow button at the bottom (Desktop only) */}
          <div className="hidden lg:flex justify-center border-t border-white/5 pt-3 select-none">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-cyber-cyan cursor-pointer transition-all duration-300"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
