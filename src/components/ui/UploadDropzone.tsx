'use client';

import React, { useState, useRef } from 'react';
import { useLanguageStore } from '@/lib/store/language-store';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { UploadCloud, FileText, Check, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadDropzone() {
  const { t } = useLanguageStore();
  const { uploadDocument, startSimulation } = useWorkflowStore();
  const router = useRouter();
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setUploadingFile(file.name);
    setUploadSuccess(false);

    // Determine type based on name
    let type: 'property' | 'grievance' | 'pension' = 'property';
    if (file.name.toLowerCase().includes('pension') || file.name.toLowerCase().includes('income')) {
      type = 'pension';
    } else if (file.name.toLowerCase().includes('grievance') || file.name.toLowerCase().includes('complain') || file.name.toLowerCase().includes('road')) {
      type = 'grievance';
    }

    // Simulate 2 seconds upload delay
    setTimeout(() => {
      setUploadSuccess(true);
      
      // Auto register workflow in store
      const id = uploadDocument(
        file.name, 
        type, 
        'Sarkar Citizen', 
        type === 'property' 
          ? 'Gomti Nagar, Lucknow' 
          : type === 'grievance' 
            ? 'Hazratganj, Lucknow' 
            : 'Indira Nagar, Lucknow'
      );
      
      // Stop previous simulation and run new one
      setTimeout(() => {
        startSimulation();
        // Redirect to orchestration view to watch the react flow nodes execute LIVE
        router.push('/orchestration');
      }, 1000);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`
          w-full py-10 px-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all cursor-pointer select-none relative overflow-hidden group
          ${isDragActive 
            ? 'border-cyber-cyan bg-cyber-cyan/5 shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
            : 'border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/10'
          }
        `}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          onChange={handleFileInput}
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        />

        {/* Floating gradient orb in card background */}
        <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-cyber-cyan/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

        {uploadingFile ? (
          <div className="flex flex-col items-center justify-center text-center gap-3 py-4 animate-in fade-in">
            <div className={`
              h-12 w-12 rounded-full flex items-center justify-center
              ${uploadSuccess ? 'bg-cyber-green/20 border border-cyber-green/40 text-cyber-green animate-pulse' : 'bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan animate-spin'}
            `}>
              {uploadSuccess ? <Check size={20} /> : <UploadCloud size={20} />}
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold text-white max-w-xs truncate">{uploadingFile}</span>
              <span className="text-[10px] text-white/50 mt-1">
                {uploadSuccess ? 'Ingestion successful! Opening Live Orchestration...' : 'Uploading to multi-agent verify vault...'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <UploadCloud 
              size={32} 
              className="text-white/40 group-hover:text-cyber-cyan transition-transform group-hover:-translate-y-1 duration-300" 
            />
            <span className="text-sm font-bold text-white font-sans">{t('uploadDoc')}</span>
            <p className="text-xs text-white/50 max-w-xs leading-relaxed font-medium">
              {t('dragDrop')}
            </p>
            <span className="text-[9px] uppercase font-bold font-mono text-cyber-cyan mt-2 px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/20 tracking-wider">
              Supports Aadhaar, PAN, Land Registry PDFs
            </span>
          </div>
        )}
      </div>

      {/* Mock template upload helpers */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest mr-1">Pre-Seeded Templates:</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            processFile(new File([''], 'property_registry_gomti_nagar.pdf'));
          }}
          className="px-2.5 py-1 rounded bg-white/5 border border-white/5 hover:border-cyber-cyan/30 text-white/70 hover:text-white text-[10px] font-mono transition flex items-center gap-1.5 cursor-pointer"
        >
          <FileText size={10} className="text-cyber-cyan" /> property_deed.pdf
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            processFile(new File([''], 'pension_eligibility_indira_nagar.pdf'));
          }}
          className="px-2.5 py-1 rounded bg-white/5 border border-white/5 hover:border-cyber-cyan/30 text-white/70 hover:text-white text-[10px] font-mono transition flex items-center gap-1.5 cursor-pointer"
        >
          <FileText size={10} className="text-cyber-cyan" /> pension_income.pdf
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            processFile(new File([''], 'road_repair_hazratganj.png'));
          }}
          className="px-2.5 py-1 rounded bg-white/5 border border-white/5 hover:border-cyber-cyan/30 text-white/70 hover:text-white text-[10px] font-mono transition flex items-center gap-1.5 cursor-pointer"
        >
          <FileText size={10} className="text-cyber-cyan" /> road_grievance.png
        </button>
      </div>
    </div>
  );
}
