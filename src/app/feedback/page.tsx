'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { 
  Star, 
  Sparkles, 
  Send, 
  BarChart3, 
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  ThumbsUp
} from 'lucide-react';

interface DeptRating {
  name: string;
  code: string;
  rating: number;
  totalReviews: number;
  complianceScore: number;
}

const deptData: DeptRating[] = [
  { name: "Lucknow Nagar Nigam (Revenue)", code: "LNN-REV", rating: 4.8, totalReviews: 8420, complianceScore: 99.4 },
  { name: "UP Social Welfare Board", code: "UPSWB", rating: 4.7, totalReviews: 3240, complianceScore: 98.7 },
  { name: "Lucknow Public Works Dept", code: "LKPWD", rating: 4.4, totalReviews: 12400, complianceScore: 95.2 },
  { name: "Lucknow Commissioner Police", code: "LKCP", rating: 4.9, totalReviews: 1420, complianceScore: 100 }
];

export default function FeedbackPage() {
  const { language, t } = useLanguageStore();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedDept, setSelectedDept] = useState('LNN-REV');
  const [commentText, setCommentText] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setCommentText('');
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto h-full overflow-y-auto pb-8 animate-in fade-in duration-300">
        
        {/* Rating Submission form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest font-mono">Citizen review portal</span>
            <h2 className="text-2xl font-extrabold text-white">Rate Administrative Services</h2>
            <p className="text-xs text-white/50">Submit satisfaction scores, review department SLA durations, and suggest smart city workflow improvements.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl border border-white/5 flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
            
            {submitSuccess && (
              <div className="p-3 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-xs font-mono uppercase text-center rounded-lg animate-pulse">
                Feedback successfully sealed in Nagar Nigam registry! Thank you.
              </div>
            )}

            {/* Department selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-white/50 font-mono tracking-wider">Select Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-navy-950 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white/80 focus:outline-none focus:border-cyber-cyan/50 cursor-pointer"
              >
                {deptData.map(dept => (
                  <option key={dept.code} value={dept.code}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Star Rating select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-white/50 font-mono tracking-wider">Service Rating</label>
              <div className="flex items-center gap-2.5 pt-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starVal = i + 1;
                  const isGold = (hoverRating !== null ? hoverRating : rating) >= starVal;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 rounded hover:bg-white/5 transition cursor-pointer"
                    >
                      <Star 
                        size={24} 
                        className={`transition-colors duration-200 ${isGold ? 'fill-cyber-orange text-cyber-orange drop-shadow-[0_0_8px_rgba(255,153,0,0.4)]' : 'text-white/20'}`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs text-white/40 font-mono ml-2">({rating} / 5 stars selected)</span>
              </div>
            </div>

            {/* Comments */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-white/50 font-mono tracking-wider">Review comments</label>
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                placeholder="Share your satisfaction report or suggestions (e.g. OCR speed was amazing, Hazratganj road filled in 2 days)..."
                className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyber-cyan/50 focus:bg-white/10 transition leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue hover:opacity-95 text-navy-950 font-extrabold text-xs rounded-lg transition duration-300 shadow-[0_0_20px_rgba(0,240,255,0.2)] flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <Send size={12} />
              <span>Submit Review</span>
            </button>
          </form>
        </div>

        {/* Executive Analytics sidebar dashboard */}
        <div className="h-full flex flex-col gap-6">
          
          {/* General Analytics indicators */}
          <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute inset-0 cyber-grid opacity-10" />
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-cyber-cyan" />
              <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Citizen Satisfaction Analytics</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center mt-2 relative z-10">
              <div className="flex flex-col p-2.5 rounded bg-navy-950 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">Global Index</span>
                <span className="text-xl font-extrabold text-cyber-cyan font-mono mt-1">4.82 ★</span>
                <span className="text-[8px] text-cyber-green mt-1 flex items-center justify-center gap-0.5"><TrendingUp size={8} /> +0.4% YoY</span>
              </div>
              <div className="flex flex-col p-2.5 rounded bg-navy-950 border border-white/5">
                <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">SLA Met Ratio</span>
                <span className="text-xl font-extrabold text-cyber-purple font-mono mt-1">98.7%</span>
                <span className="text-[8px] text-cyber-cyan mt-1 flex items-center justify-center gap-0.5"><CheckCircle size={8} /> Target Met</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/5 pt-3 text-white/50">
              <span>Avg Verification Latency:</span>
              <strong className="text-white">1.84s (AI Autotrail)</strong>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
              <span>Total Sealed Certificates:</span>
              <strong className="text-white">8,420 Vault Deeds</strong>
            </div>
          </div>

          {/* Department breakdown reviews */}
          <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-3">
            <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Department Performance Breakdown</span>
            <div className="flex flex-col gap-3 mt-1.5">
              {deptData.map((d, i) => (
                <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-2 last:border-b-0 last:pb-0 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-white/80 truncate pr-4 max-w-[160px]">{d.name}</span>
                    <span className="text-cyber-orange font-mono font-bold">{d.rating} ★</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-white/50 font-mono">
                    <span suppressHydrationWarning>{d.totalReviews.toLocaleString()} reviews</span>
                    <span className="text-cyber-cyan">{d.complianceScore}% Compliance</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
