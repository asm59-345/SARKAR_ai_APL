'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { 
  AlertTriangle, 
  MapPin, 
  User, 
  Upload, 
  Sparkles, 
  FileText, 
  CheckCircle,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const BACKEND_URL = "http://127.0.0.1:8000";

const COMPLAINT_TYPES = [
  { value: 'road_damage', label: 'Road / Pothole Damage', dept: 'Lucknow PWD' },
  { value: 'water_leakage', label: 'Water Leakage / Drainage', dept: 'Jal Sansthan LKO' },
  { value: 'garbage', label: 'Solid Waste / Garbage Piles', dept: 'Nagar Nigam Sanitation' },
  { value: 'electricity', label: 'Power Mismatch / Streetlight Out', dept: 'MVVNL Electricity' },
  { value: 'corruption', label: 'Official Corruption / Bribe Demand', dept: 'Anti-Corruption Bureau', critical: true },
  { value: 'women_safety', label: 'Women Safety / Eve Teasing', dept: 'LKO Police Special Force', critical: true },
  { value: 'medical', label: 'Medical Emergency / Hospital Issue', dept: 'Chief Medical Office LKO', critical: true },
  { value: 'fire', label: 'Fire Outbreak / Smoke Anomaly', dept: 'Fire Services LKO', critical: true },
  { value: 'property_fraud', label: 'Property Coordinate Fraud', dept: 'Revenue Registry Audit' },
  { value: 'pension_issue', label: 'Pension Benefit Dispute', dept: 'Social Welfare Dept' }
];

export default function ComplaintCenter() {
  const { language, t } = useLanguageStore();
  const { fetchWorkflows, startSimulation } = useWorkflowStore();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Hazratganj, Lucknow');
  const [category, setCategory] = useState('road_damage');
  const [urgency, setUrgency] = useState('medium');
  const [file, setFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const loadPresetTemplate = (name: string, cat: string, loc: string, urg: string, desc: string) => {
    setTitle(name);
    setCategory(cat);
    setLocation(loc);
    setUrgency(urg);
    setDescription(desc);
    
    // create virtual file mock
    const mockFile = new File(['mock data'], `${cat}_evidence.png`, { type: 'image/png' });
    setFile(mockFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("citizen_name", "Ashmit Sarkar"); // default citizen
      formData.append("location", location);
      formData.append("wf_type", "grievance");
      formData.append("category", category);
      formData.append("urgency", urgency);
      
      const fileToUpload = file || new File(['mock evidence payload'], 'complaint_attachment.png', { type: 'image/png' });
      formData.append("file", fileToUpload);

      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/`, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        
        // Dynamic AI Classification Feedback simulation
        setAnalysisResult({
          workflowId: data.id,
          assignedDept: COMPLAINT_TYPES.find(c => c.value === category)?.dept || 'Lucknow Nagar Nigam',
          detectedUrgency: data.urgency || urgency,
          estimatedTime: (data.urgency === 'critical' || urgency === 'critical') ? '4 Hours (Emergency Dispatch)' : '72 Hours (Standard SLA)',
          officer: 'S. K. Singh (IPS Executive Officer)'
        });

        // Trigger simulation run & update state
        await fetchWorkflows();
        
        setTimeout(() => {
          setIsSubmitting(false);
          // Set tracking ID inside store and run
          useWorkflowStore.setState({ activeWorkflowId: data.id });
          startSimulation();
          router.push('/track');
        }, 3500);

      } else {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-in fade-in duration-300">
        
        {/* Input Form Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest">Sovereign Grievance Console</span>
            <h2 className="text-2xl font-extrabold text-white">Lodge Official Citizen Complaint</h2>
            <p className="text-xs text-white/50">Submit grievance records, potholes photographs, or report administrative delays for instant AI routing.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
            
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-white/50 font-mono tracking-wider">Complaint Title</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., PWD Pothole hazard near Hazratganj crossing"
                className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyber-cyan/50 focus:bg-white/10 transition"
                required
              />
            </div>

            {/* Category, Location & Urgency Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-white/50 font-mono tracking-wider">Issue Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-navy-950 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white/80 focus:outline-none focus:border-cyber-cyan/50 transition cursor-pointer"
                >
                  {COMPLAINT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-white/50 font-mono tracking-wider">Location Zone</label>
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hazratganj, Lucknow"
                  className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white/80 placeholder-white/30 focus:outline-none focus:border-cyber-cyan/50 transition"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-white/50 font-mono tracking-wider">Citizen Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="bg-navy-950 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white/80 focus:outline-none focus:border-cyber-cyan/50 transition cursor-pointer"
                >
                  <option value="low">Low (Standard SLA)</option>
                  <option value="medium">Medium (Priority Checked)</option>
                  <option value="high">High (Auto-routed)</option>
                  <option value="critical">Critical (Immediate Bypass)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-white/50 font-mono tracking-wider">Detailed Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the complaint in detail. (e.g. Exact landmarks, time of delay, corrupt demands details)..."
                className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyber-cyan/50 focus:bg-white/10 transition leading-relaxed"
                required
              />
            </div>

            {/* Document upload box */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-white/50 font-mono tracking-wider">Attach Image or Report Details</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-white/10 rounded-lg p-4 bg-white/5 hover:bg-white/10 hover:border-cyber-cyan/25 flex items-center justify-center flex-col gap-2 transition cursor-pointer"
              >
                <input 
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,application/pdf"
                />
                <Upload size={18} className="text-white/40 group-hover:text-cyber-cyan" />
                <span className="text-xs text-white/60 font-medium">
                  {file ? file.name : 'Upload photographic proof or certificate (Max 10MB)'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue hover:opacity-95 text-navy-950 font-extrabold text-xs rounded-lg transition duration-300 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:scale-[1.005] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <Activity className="animate-spin text-navy-950" size={14} />
                  <span>Processing Governance Ingestion...</span>
                </>
              ) : (
                <>
                  <span>File Official Complaint</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Status Analysis Column */}
        <div className="h-full flex flex-col gap-6">
          
          {/* Live Ingestion AI Tracker Console */}
          <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group min-h-[220px]">
            <div className="absolute inset-0 cyber-grid opacity-10" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyber-purple animate-pulse" />
                <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">AI Analysis Output</span>
              </div>
              {isSubmitting && (
                <span className="h-2 w-2 rounded-full bg-cyber-pink animate-ping" />
              )}
            </div>

            {analysisResult ? (
              <div className="flex flex-col gap-3.5 animate-in zoom-in-95 duration-200">
                <div className="p-3 bg-cyber-green/5 border border-cyber-green/30 rounded-lg flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-cyber-green mt-0.5 shrink-0" />
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] uppercase font-bold text-white font-mono">Ingested Successfully</span>
                    <span className="text-[10px] text-cyber-green mt-1">ID: {analysisResult.workflowId}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/40">Target Division:</span>
                    <span className="text-white font-sans">{analysisResult.assignedDept}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/40">Urgency Classification:</span>
                    <span className="text-cyber-pink uppercase font-bold">{analysisResult.detectedUrgency}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/40">SLA Resolution Time:</span>
                    <span className="text-cyber-cyan">{analysisResult.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-white/40">Assigned Officer:</span>
                    <span className="text-white font-sans">{analysisResult.officer}</span>
                  </div>
                </div>
              </div>
            ) : isSubmitting ? (
              <div className="flex flex-col items-center justify-center text-center gap-3 py-10">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border border-cyber-cyan/30 border-t-cyber-cyan animate-spin flex items-center justify-center text-cyber-cyan" />
                  <Sparkles size={16} className="text-cyber-cyan absolute top-4 left-4 animate-ping" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold text-white uppercase font-mono">Scanning Evidence Data...</span>
                  <span className="text-[9px] text-white/50 mt-1.5">Checking circle boundaries & verifying Aadhaar signature</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 gap-2">
                <Zap size={24} className="text-white/20" />
                <span className="text-xs text-white/35 font-mono">Awaiting complaint submission to fire smart classification pipelines.</span>
              </div>
            )}
          </div>

          {/* Quick Mock templates */}
          <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-3">
            <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Quick Templates</span>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => loadPresetTemplate("Hazratganj Main crossing road pothole repair request", "road_damage", "Hazratganj, Lucknow", "medium", "There are three massive potholes near the Hazratganj main crossing signal, causing vehicle congestion and road safety hazards for two-wheelers. Need immediate fixing.")}
                className="w-full text-left p-2.5 rounded bg-white/5 border border-white/5 hover:border-cyber-cyan/25 hover:bg-white/10 text-[10px] text-white/70 hover:text-white transition duration-200 cursor-pointer font-mono"
              >
                🚨 Hazratganj Pothole Road repair
              </button>
              <button 
                onClick={() => loadPresetTemplate("Immediate police dispatch women safety eve teasing Gomti Riverfront", "women_safety", "Gomti Nagar, Lucknow", "critical", "Report of harassment incident. Group of youngsters misbehaving with girls near Gomti Riverfront walkway. Request immediate police patrolling dispatch.")}
                className="w-full text-left p-2.5 rounded bg-white/5 border border-white/5 hover:border-cyber-pink/25 hover:bg-white/10 text-[10px] text-white/70 hover:text-white transition duration-200 cursor-pointer font-mono"
              >
                👮 Women safety hazard Gomti Riverfront
              </button>
              <button 
                onClick={() => loadPresetTemplate("Electricity clerk bribe demand for Gomti meter installation", "corruption", "Gomti Nagar, Lucknow", "critical", "Electricity meter inspector demanding a cash bribe of 5000 INR to clear Gomti meter registration duty fee. Verification deed already submitted.")}
                className="w-full text-left p-2.5 rounded bg-white/5 border border-white/5 hover:border-cyber-purple/25 hover:bg-white/10 text-[10px] text-white/70 hover:text-white transition duration-200 cursor-pointer font-mono"
              >
                ⚖️ Clerk Bribe demand (Anti-Corruption)
              </button>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
