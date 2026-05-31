'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNotificationStore, AlertNotification } from '@/lib/store/notification-store';
import { 
  Bell, 
  Trash2, 
  CheckCheck, 
  ShieldAlert, 
  CheckCircle, 
  Activity,
  ChevronRight
} from 'lucide-react';

export default function NotificationsCenter() {
  const { notifications, markAsRead, clearAll } = useNotificationStore();
  const [filter, setFilter] = useState<'all' | 'escalation' | 'success' | 'warning' | 'info'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'escalation': return <ShieldAlert size={16} className="text-cyber-pink" />;
      case 'success': return <CheckCircle size={16} className="text-cyber-green" />;
      case 'warning': return <ShieldAlert size={16} className="text-cyber-orange" />;
      default: return <Activity size={16} className="text-cyber-cyan" />;
    }
  };

  const getBorderColor = (n: AlertNotification) => {
    if (!n.read) {
      return n.type === 'escalation' 
        ? 'border-cyber-pink/35 bg-cyber-pink/5' 
        : 'border-cyber-cyan/35 bg-cyber-cyan/5';
    }
    return 'border-white/5 bg-white/5';
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Bell className="text-cyber-cyan animate-pulse" size={18} />
              <span className="text-xs uppercase font-mono font-bold text-cyber-cyan tracking-widest">Administrative Alert Inbox</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Notifications Center</h2>
            <p className="text-xs text-white/50">Review system warnings, OCR failures, automated officer escalations, and DM audit registry milestones.</p>
          </div>

          {/* Quick actions buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={12} /> Clear System Log Bin
            </button>
          </div>
        </div>

        {/* Severity Filter layers buttons */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
          {(['all', 'escalation', 'success', 'warning', 'info'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono uppercase tracking-widest cursor-pointer transition ${
                filter === type
                  ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_10px_rgba(0,240,255,0.05)]'
                  : 'bg-white/5 border-white/5 text-white/50 hover:text-white hover:border-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Notifications list queue */}
        <div className="flex flex-col gap-3">
          {filteredNotifications.length === 0 ? (
            <div className="glass-card py-20 text-center text-white/30 text-xs font-mono flex flex-col gap-2 items-center rounded-xl border border-white/5">
              <Bell size={24} className="opacity-30" />
              <span>No telemetry alerts matched filter selection</span>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`
                  p-4 rounded-xl border flex gap-4 items-start cursor-pointer transition relative overflow-hidden group
                  ${getBorderColor(n)}
                `}
              >
                {/* Visual severity icon wrapper */}
                <div className={`
                  h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0
                  ${!n.read ? 'animate-pulse' : ''}
                `}>
                  {getAlertIcon(n.type)}
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold text-white ${!n.read ? 'text-cyber-cyan font-extrabold' : ''}`}>
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="text-[7px] uppercase font-bold tracking-widest bg-cyber-cyan text-navy-950 px-1 rounded leading-none py-0.5">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/60 leading-relaxed mt-1 font-sans">
                      {n.description}
                    </span>
                  </div>

                  <div className="flex flex-col text-left sm:text-right shrink-0">
                    <span className="text-[10px] text-white/30 font-mono">{n.timestamp}</span>
                    <span className="text-[8px] uppercase tracking-widest font-mono font-bold text-cyber-purple mt-1">
                      {n.type} LOG
                    </span>
                  </div>
                </div>

                {/* Left hover strip indicator */}
                <span className="absolute top-0 bottom-0 left-0 w-[2.5px] bg-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
