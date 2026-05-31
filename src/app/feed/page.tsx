'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { io } from 'socket.io-client';
import { 
  Users, 
  MapPin, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  Loader2,
  Bell
} from 'lucide-react';
import Link from 'next/link';

interface FeedPost {
  id: string;
  author: string;
  role: 'citizen' | 'officer' | 'system';
  location: string;
  time: string;
  title: string;
  content: string;
  category: 'resolved' | 'announcement' | 'discussion';
  upvotes: number;
  commentsCount: number;
  hasUpvoted?: boolean;
}

const initialFeed: FeedPost[] = [
  {
    id: "post-1",
    author: "UP Vigilance Anti-Corruption",
    role: "system",
    location: "Gomti Nagar, Lucknow",
    time: "2 hours ago",
    title: "Property registration coordinate fraud attempt blocked",
    content: "Our Verification Anomaly scanner successfully flagged a land coordinates tampering clash in Gomti Nagar Central limits. The duplicate claim was isolated, and the case was escalated directly to the anti-corruption wing for immediate audit. Zero public funds or land duty lost.",
    category: "announcement",
    upvotes: 242,
    commentsCount: 14
  },
  {
    id: "post-2",
    author: "Municipal Commissioner Office",
    role: "officer",
    location: "Hazratganj PWD Division",
    time: "5 hours ago",
    title: "Hazratganj ITCS Smart Traffic Signals go live",
    content: "Nagar Nigam and LKO police have completed sensor-based Intelligent Traffic Signal (ITCS) calibrations at major Hazratganj intersections. Live crowd density sensors are reporting a 35% drop in wait times on the Hazratganj crossing queue. Real-time telemetry connected to our OS.",
    category: "announcement",
    upvotes: 189,
    commentsCount: 8
  },
  {
    id: "post-3",
    author: "Amit Trivedi",
    role: "citizen",
    location: "Hazratganj Road Grid",
    time: "1 day ago",
    title: "PWD Hazratganj pothole complaint fully resolved in 48 hours",
    content: "Lodge a complaint yesterday regarding the dangerous road potholes near the signals crossing. Received live tracking update from the Notification agent, and the repair crew filled it within 48 hours! Kudos to SarkarAI OS for such fast multi-agent coordination.",
    category: "resolved",
    upvotes: 312,
    commentsCount: 22,
    hasUpvoted: true
  },
  {
    id: "post-4",
    author: "Sushila Devi",
    role: "citizen",
    location: "Indira Nagar Residential",
    time: "2 days ago",
    title: "Old age pension eligibility verification pass",
    content: "My income and age verification checks were completed by the Rule Engine in under 2 seconds! Spoke with the voice orb assistant in local Awadhi dialect and it walked me through linking Aadhaar to my bank. Pension cleared successfully.",
    category: "resolved",
    upvotes: 145,
    commentsCount: 6
  }
];

export default function CommunityFeed() {
  const { language } = useLanguageStore();
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(initialFeed);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'announcement' | 'resolved'>('all');
  
  // States for Infinite Scroll & Auto-Refresh
  const [loadingMore, setLoadingMore] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState<string | null>(null);

  // Auto-Refresh: simulate live community activity and announcements periodically
  useEffect(() => {
    // Connect to real-time socket
    const socket = io("http://127.0.0.1:8000");
    
    socket.on("smart_city_update", (data: any) => {
      setLiveAlerts(`🚨 Live Breaking: ${data.message || data.title}`);
    });

    const alertTimer = setTimeout(() => {
      setLiveAlerts("🚨 Live Alert: Hazratganj ITCS sensors report high vehicle density. Signals automatically retimed.");
    }, 6000);

    const refreshTimer = setInterval(() => {
      // Periodic simulated upvote adjustments
      setFeedPosts(prev => prev.map(post => {
        if (Math.random() > 0.6) {
          return { ...post, upvotes: post.upvotes + Math.floor(Math.random() * 3) };
        }
        return post;
      }));
    }, 5000);

    return () => {
      clearTimeout(alertTimer);
      clearInterval(refreshTimer);
      socket.disconnect();
    };
  }, []);

  const handleUpvote = (id: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          upvotes: post.hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          hasUpvoted: !post.hasUpvoted
        };
      }
      return post;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: FeedPost = {
      id: `post-${Math.random().toString(36).substr(2, 5)}`,
      author: "Ashmit Sarkar",
      role: "citizen",
      location: "Gomti Nagar, Lucknow",
      time: "Just now",
      title: newPostTitle,
      content: newPostContent,
      category: "discussion",
      upvotes: 1,
      commentsCount: 0,
      hasUpvoted: true
    };

    setFeedPosts(prev => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  // Simulated infinite scroll trigger loading older complaints
  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const historicalPosts: FeedPost[] = [
        {
          id: `post-${Math.random().toString(36).substr(2, 5)}`,
          author: "Jal Sansthan Lucknow",
          role: "system",
          location: "Indira Nagar Main Route",
          time: "4 days ago",
          title: "Water pipe leakage repaired under 24 hours",
          content: "Grievance tracking ID wf-402 flagged water pipe leakage in Sector 12 Indira Nagar. Multi-agent PWD routing automatically scheduled repairs crew. Zero delays reported.",
          category: "resolved",
          upvotes: 94,
          commentsCount: 2
        },
        {
          id: `post-${Math.random().toString(36).substr(2, 5)}`,
          author: "LDA Registry Desk",
          role: "officer",
          location: "Gomti Nagar Extension",
          time: "5 days ago",
          title: "LDA Property Circle rate validation updates",
          content: "UP stamp guidelines Section 104 applied successfully across Gomti residential blocks. 1,240 digital land registry deeds securely sealed in municipal revenue vaults.",
          category: "resolved",
          upvotes: 112,
          commentsCount: 4
        }
      ];
      setFeedPosts(prev => [...prev, ...historicalPosts]);
      setLoadingMore(false);
    }, 1500);
  };

  const filteredPosts = feedPosts.filter(post => 
    activeTab === 'all' || post.category === activeTab
  );

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto h-[calc(100vh-120px)] overflow-y-auto pb-8 scrollbar-cyber animate-in fade-in duration-300">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-y-auto pr-1 scrollbar-cyber">
          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest font-mono">Civic Chaupal</span>
            <h2 className="text-2xl font-extrabold text-white">Community Engagement Feed</h2>
            <p className="text-xs text-white/50">Follow trending complaints, public administrative news, green space initiatives, and resolved road repairs.</p>
          </div>

          {/* Live Alert Banner */}
          {liveAlerts && (
            <div className="p-3 bg-cyber-pink/15 border border-cyber-pink/35 text-cyber-pink text-xs font-mono rounded-lg flex items-center justify-between animate-in zoom-in-95 duration-200 shadow-md">
              <span className="flex items-center gap-2"><Bell size={14} className="animate-bounce" /> {liveAlerts}</span>
              <button onClick={() => setLiveAlerts(null)} className="font-bold text-white/60 hover:text-white">&times;</button>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex gap-2 border-b border-white/5 pb-1 shrink-0">
            {['all', 'announcement', 'resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`
                  px-3 py-1.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider cursor-pointer border transition duration-200
                  ${activeTab === tab 
                    ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan' 
                    : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {tab === 'all' ? 'All chaupal' : tab === 'resolved' ? 'Resolved Issues' : 'Official Notices'}
              </button>
            ))}
          </div>

          {/* Posts list */}
          <div className="flex flex-col gap-5 flex-1 pr-1">
            {filteredPosts.map((post) => (
              <div 
                key={post.id}
                className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-cyber-purple/20 transition duration-300 shadow-lg"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-cyber-purple/5 blur-xl pointer-events-none" />
                
                {/* Header */}
                <div className="flex justify-between items-start shrink-0">
                  <div className="flex gap-2.5 items-start">
                    <div className={`
                      h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-mono font-bold border
                      ${post.role === 'system' 
                        ? 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink animate-pulse' 
                        : post.role === 'officer' 
                          ? 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan' 
                          : 'bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple'
                      }
                    `}>
                      {post.role === 'system' ? 'SYS' : post.role === 'officer' ? 'OFF' : 'CIT'}
                    </div>
                    <div className="flex flex-col leading-none">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white tracking-wide">{post.author}</span>
                        <span className="text-white/30">&bull;</span>
                        <span className="text-[9px] text-white/40">{post.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-white/50 font-mono mt-1">
                        <MapPin size={10} className="text-cyber-cyan shrink-0" />
                        <span>{post.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[8px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                    post.category === 'resolved' 
                      ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/20' 
                      : post.category === 'announcement'
                        ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20'
                        : 'bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20'
                  }`}>
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-xs font-extrabold text-white group-hover:text-cyber-cyan transition tracking-wide leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed font-sans mt-0.5">
                    {post.content}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="border-t border-white/5 pt-3 flex justify-between items-center shrink-0 text-xs font-mono text-white/50">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleUpvote(post.id)}
                      className={`flex items-center gap-1.5 hover:text-white transition cursor-pointer ${post.hasUpvoted ? 'text-cyber-cyan font-bold' : ''}`}
                    >
                      <ThumbsUp size={12} className={post.hasUpvoted ? 'fill-cyber-cyan text-cyber-cyan' : ''} />
                      <span>{post.upvotes}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare size={12} />
                      <span>{post.commentsCount} comments</span>
                    </div>
                  </div>

                  <span className="text-[9px] uppercase font-bold tracking-wider text-cyber-purple/80 font-mono">SEALED SYSTEM LOG</span>
                </div>
              </div>
            ))}

            {/* Infinite Scroll trigger loader */}
            <div className="mt-4 flex justify-center pb-6">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 hover:border-cyber-cyan/30 transition flex items-center gap-2 cursor-pointer font-sans"
              >
                {loadingMore ? (
                  <>
                    <Loader2 size={12} className="animate-spin text-cyber-cyan" />
                    <span>Syncing older Chaupal ledgers...</span>
                  </>
                ) : (
                  <>
                    <span>Load older announcements</span>
                    <ArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Create post side column */}
        <div className="h-full flex flex-col gap-6">
          
          <form onSubmit={handleCreatePost} className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-3 shrink-0 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 h-16 w-16 bg-cyber-purple/5 blur-xl pointer-events-none" />
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cyber-purple" />
              <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Share Civic Update</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-white/40 font-mono tracking-wider">Title</label>
              <input 
                type="text" 
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Topic of discussion or update..."
                className="bg-white/5 border border-white/10 rounded p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyber-purple/50"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-white/40 font-mono tracking-wider">Content details</label>
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Write detail updates here for the city..."
                className="bg-white/5 border border-white/10 rounded p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyber-purple/50 resize-none font-sans leading-relaxed"
                rows={4}
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white font-bold text-xs rounded hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer font-sans"
            >
              <span>Broadcast to Chaupal</span>
            </button>
          </form>

          {/* Smart recommendation card */}
          <div className="glass-card p-5 rounded-xl border border-cyber-cyan/20 flex flex-col gap-3.5 relative overflow-hidden shadow-lg bg-cyber-cyan/[0.01]">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyber-cyan animate-pulse" />
              <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Governance Suggestion</span>
            </div>

            <p className="text-xs text-white/60 leading-relaxed font-sans font-medium">
              Based on trending complaints in Hazratganj, LNN is scheduling pothole audits across ward limits. Lodge your reports today to ensure SLA repair scheduling.
            </p>

            <Link
              href="/complaints"
              className="w-full text-center py-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-cyber-cyan/30 text-xs font-bold rounded transition flex items-center justify-center gap-1.5"
            >
              <span>Lodge Grievance</span>
              <ArrowRight size={12} />
            </Link>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
