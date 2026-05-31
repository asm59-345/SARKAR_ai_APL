'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import FloatingVoiceAssistant from '../ui/FloatingVoiceAssistant';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Trigger rapid optimistic loading feedbacks when route changes
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsTransitioning(true);
    }, 0);
    const endTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 200);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [pathname]);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarCollapsed(prev => !prev);
    } else {
      setSidebarOpen(prev => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white relative flex flex-col">
      {/* Background Neon Gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyber-cyan/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-cyber-purple/10 blur-[150px] pointer-events-none" />
      
      {/* Background Cyber Grid lines */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Top Navigation Navbar */}
      <Navbar onToggleSidebar={handleToggleSidebar} />

      {/* Top-level neon visual transition progress bar */}
      <div className={`
        fixed top-[52px] left-0 right-0 h-0.5 z-[999] bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink transition-all duration-300 origin-left pointer-events-none
        ${isTransitioning ? 'opacity-100 translate-y-0 scale-x-100' : 'opacity-0 -translate-y-1 scale-x-0'}
      `} style={{ transformOrigin: 'left' }} />

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content Workspace Main Box */}
        <main className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
          <div className={`
            flex-1 p-4 md:p-6 lg:p-8 relative transition-all duration-300 ease-out
            ${isTransitioning ? 'opacity-40 blur-[0.5px] translate-y-0.5' : 'opacity-100 blur-0 translate-y-0'}
          `}>
            {children}
          </div>
        </main>
      </div>

      {/* Floating global AI voice agent calling widget */}
      <FloatingVoiceAssistant />
    </div>
  );
}
