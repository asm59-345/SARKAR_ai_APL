'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  Send
} from 'lucide-react';

interface ContactDirectoryItem {
  name: string;
  role: string;
  dept: string;
  phone: string;
  email: string;
  address: string;
}

const directContacts: ContactDirectoryItem[] = [
  {
    name: "Surya Pal Gangwar (IAS)",
    role: "District Magistrate & Collector",
    dept: "Lucknow Revenue and Administration",
    phone: "0522-2623006",
    email: "dmlko@nic.in",
    address: "DM Office, Hazratganj, Lucknow, UP - 226001"
  },
  {
    name: "Indrajit Singh (IAS)",
    role: "Municipal Commissioner",
    dept: "Lucknow Nagar Nigam (Revenue)",
    phone: "0522-2622080",
    email: "nnlko@nic.in",
    address: "Nagar Nigam Head Office, Trilokinath Marg, Lucknow - 226001"
  },
  {
    name: "S. B. Singh",
    role: "Superintending Engineer",
    dept: "Lucknow Public Works Department (PWD)",
    phone: "0522-2238421",
    email: "sepwdlko@nic.in",
    address: "PWD Office, Hazratganj, Lucknow, UP"
  }
];

export default function ContactUs() {
  const { language, t } = useLanguageStore();
  const [inquiryText, setInquiryText] = useState('');
  const [inquiryName, setInquiryName] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleAiLookup = () => {
    if (!inquiryText.trim()) return;
    
    const text = inquiryText.toLowerCase();
    let advice = "";
    if (text.includes('pothole') || text.includes('road') || text.includes('सड़क') || text.includes('मरम्मत')) {
      advice = "🔍 AI Smart Routing: Your query matches 'Lucknow PWD Road Division'. Please contact the PWD Superintending Engineer (0522-2238421) or log an official grievance in the Complaint Center. SLA window: 72 hours.";
    } else if (text.includes('tax') || text.includes('circle') || text.includes('property') || text.includes('रजिस्ट्री')) {
      advice = "🔍 AI Smart Routing: Mapped to 'Lucknow Nagar Nigam (Revenue Board)'. Reach out to the Municipal Commissioner's revenue desk or submit your property deed certificate for multi-agent check.";
    } else if (text.includes('pension') || text.includes('widow') || text.includes('पेंशन')) {
      advice = "🔍 AI Smart Routing: Mapped to the 'Uttar Pradesh Social Welfare Board (Lucknow Division)'. Verify eligibility rules in the FAQ block or consult the DM collectorate desk.";
    } else if (text.includes('bribe') || text.includes('corruption') || text.includes('रिश्वत')) {
      advice = "🚨 AI Smart Routing: CRITICAL HIGH ALERT. Direct match for 'UP Anti-Corruption Bureau & Vigilance'. Lodge your query directly in our high-priority Emergency Portal for instant bypass.";
    } else {
      advice = "🔍 AI Smart Routing: Mapped to general 'Lucknow Administrative Civic Center'. Contact the DM Office desk (dmlko@nic.in) or chat live with SarkarAI copilot in the Chat interface.";
    }
    
    setAiRecommendation(advice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setInquiryName('');
      setInquiryText('');
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto h-full overflow-y-auto pb-8 animate-in fade-in duration-300">
        
        {/* Help Directory cards */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest font-mono">Civic directory</span>
            <h2 className="text-2xl font-extrabold text-white">Lucknow Administrative Helpline</h2>
            <p className="text-xs text-white/50">Direct contact numbers, secure emails, and physical desk details of state commissioners and executive heads.</p>
          </div>

          <div className="flex flex-col gap-4">
            {directContacts.map((contact, index) => (
              <div 
                key={index}
                className="glass-card p-5 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-cyber-purple/20 transition duration-300"
              >
                <div className="flex gap-3.5 items-start">
                  <div className="h-9 w-9 rounded-lg bg-cyber-purple/10 border border-cyber-purple/25 text-cyber-purple flex items-center justify-center shrink-0">
                    <UserCheck size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-cyber-purple/80 uppercase font-semibold">{contact.dept}</span>
                    <h4 className="text-sm font-extrabold text-white mt-0.5">{contact.name}</h4>
                    <span className="text-xs text-white/40">{contact.role}</span>
                    
                    <div className="flex items-center gap-1 text-xs text-white/50 mt-3 font-sans">
                      <MapPin size={11} className="text-white/40 shrink-0" />
                      <span className="text-[11px]">{contact.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-mono w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-cyber-cyan" />
                    <span className="text-white/80">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-cyber-cyan" />
                    <span className="text-white/80">{contact.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Inquiry Form and AI lookup */}
        <div className="h-full flex flex-col gap-6">
          
          {/* Smart AI helper panel */}
          <div className="glass-card p-5 rounded-xl border border-cyber-cyan/20 bg-[#040613]/80 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-cyber-cyan/5 blur-xl pointer-events-none" />
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyber-cyan animate-pulse animate-float-slow" />
              <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">AI Support Router</span>
            </div>

            <p className="text-[11px] text-white/60 leading-relaxed font-sans">
              Type your issue or query details below, and our smart parser will analyze matching departments and suggest Helplines.
            </p>

            <div className="flex flex-col gap-2">
              <textarea 
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="e.g., Pension age verification delays or street pothole issues..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyber-cyan/50 focus:bg-white/10 transition resize-none"
                rows={3}
              />
              <button 
                onClick={handleAiLookup}
                className="w-full py-2 bg-cyber-cyan text-navy-950 font-bold text-xs rounded hover:opacity-90 transition cursor-pointer"
              >
                Scan Target Department
              </button>
            </div>

            {aiRecommendation && (
              <div className="p-3 bg-cyber-cyan/5 border border-cyber-cyan/20 rounded text-[11px] text-white/85 leading-relaxed font-mono animate-in zoom-in-95 duration-200">
                {aiRecommendation}
              </div>
            )}
          </div>

          {/* Secure Support request form */}
          <form onSubmit={handleSubmit} className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-3">
            <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Submit Inquiry Ticket</span>
            
            {submitSuccess && (
              <div className="p-2 rounded bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-[10px] font-mono uppercase text-center animate-pulse">
                Ticket submitted successfully!
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-white/40 font-mono tracking-wider">Citizen Full Name</label>
              <input 
                type="text" 
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                placeholder="Ashmit Sarkar"
                className="bg-white/5 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyber-cyan/50"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-white/40 font-mono tracking-wider">Inquiry details</label>
              <textarea 
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="Specify your inquiry or general feedback detail here..."
                className="bg-white/5 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyber-cyan/50"
                rows={3}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-gradient-to-r from-cyber-cyan to-cyber-blue text-navy-950 font-bold text-xs rounded hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer font-sans"
            >
              <Send size={11} /> <span>Submit Ticket</span>
            </button>
          </form>

        </div>

      </div>
    </DashboardLayout>
  );
}
