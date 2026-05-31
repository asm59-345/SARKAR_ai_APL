'use client';

import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '@/lib/store/language-store';
import { Mic, MicOff, Volume2, Sparkles, Play, Pause, ChevronRight } from 'lucide-react';

interface VoiceQueryPreset {
  text: { en: string; hi: string; aw: string; hl: string };
}

const BACKEND_URL = "http://127.0.0.1:8000";

const presetQueries: VoiceQueryPreset[] = [
  {
    text: {
      en: "Where is my Gomti Nagar property registration stuck?",
      hi: "मेरी गोमती नगर संपत्ति पंजीकरण कहाँ फंसा हुआ है?",
      aw: "हमार गोमती नगर खतौनी रजिस्ट्री काहे रुका बा?",
      hl: "Mera Gomti Nagar property registration kahan stuck hai?"
    }
  },
  {
    text: {
      en: "Is my Indira Nagar pension application processed?",
      hi: "क्या मेरी इंदिरा नगर पेंशन आवेदन प्रक्रिया पूरी हो गई है?",
      aw: "हमार इंदिरा नगर पेंशन अर्ज़ी पास होई गवा का?",
      hl: "Kya mera Indira Nagar pension application process ho gaya?"
    }
  }
];

export default function VoiceAssistantOrb() {
  const { language, t } = useLanguageStore();
  const [isRecording, setIsRecording] = useState(false);
  const [activePreset, setActivePreset] = useState<VoiceQueryPreset | null>(null);
  const [isPlayingReply, setIsPlayingReply] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [audioProgress, setAudioProgress] = useState(0);
  const [activeAudioElement, setActiveAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    if (isPlayingReply) {
      progressTimer = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingReply(false);
            return 0;
          }
          return prev + 3.3; // matches ~3 seconds audio playback duration
        });
      }, 100);
    }
    return () => clearInterval(progressTimer);
  }, [isPlayingReply]);

  const triggerRecordingPreset = async (preset: VoiceQueryPreset) => {
    setIsRecording(true);
    setActivePreset(preset);
    setTranscriptText(preset.text[language]);
    setIsPlayingReply(false);
    setAudioProgress(0);
    
    // Stop currently playing audio if any
    if (activeAudioElement) {
      activeAudioElement.pause();
      setActiveAudioElement(null);
    }

    try {
      // Connect to the real backend Voice AI pipeline
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/voice-assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: preset.text[language],
          lang: language
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Wait briefly to simulate recording/processing latency
        setTimeout(() => {
          setIsRecording(false);
          setReplyText(data.response_text);
          setIsPlayingReply(true);

          // Real Speech synthesis: Play synthesized audio response returned from backend
          if (data.audio_base64) {
            try {
              const audio = new Audio(data.audio_base64);
              audio.play().catch(err => console.log("Audio playback blocked by browser security policy. Click orb to play."));
              setActiveAudioElement(audio);
            } catch (audioErr) {
              console.log("Audio engine exception:", audioErr);
            }
          }
        }, 1500);
        return;
      }
    } catch (e) {
      console.log("Realtime Voice Assistant failed, falling back to local simulation.");
    }

    // Fallback if backend offline
    setTimeout(() => {
      setIsRecording(false);
      
      const offlineReplies: Record<string, Record<string, string>> = {
        "property": {
          en: "Your Gomti Nagar Registry application (wf-101) has successfully passed all Verification Agent checks. Cross-matched with municipal parcel bounds. Awaiting commissioner DM signature.",
          hi: "आपके गोमती नगर संपत्ति पंजीकरण आवेदन (wf-101) की जाँच सत्यापन एजेंट द्वारा सफलतापूर्वक पूरी कर ली गई है। राजस्व विभाग के रिकॉर्ड से मिलान कर लिया गया है। वर्तमान में डीएम कार्यालय की अंतिम स्वीकृति लंबित है।",
          aw: "सुनो भैया, तोहार गोमती नगर खतौनी (wf-101) कय नियम जांच पूरा होई गवा बा। अब हाकिम साहेब के दफ़्तर मा मंजूरी बरे धरा बा, तुरंतै होइ जाई!",
          hl: "Gomti Nagar registration wf-101 ka Rule check complete ho gaya hai. Ab decision DM registry office ke paas approval ke liye pending hai."
        },
        "pension": {
          en: "Verification Agent is currently parsing your Income certificate. Matching age limits with database records.",
          hi: "सत्यापन एजेंट वर्तमान में आपके आय प्रमाण पत्र का विश्लेषण कर रहा है। डेटाबेस रिकॉर्ड के साथ आयु सीमा का मिलान किया जा रहा है।",
          aw: "अम्मा परेशान ना हुओ, एआई बाबू तोहार आय परचा (income certificate) जांचत अहैं। उमर मिलान होते ही बैंक खाता मा पेंशन तुरंतै आई!",
          hl: "Verification Agent abhi aapka Income certificate check kar raha hai. Records confirm hote hi pension pass ho jayegi."
        }
      };

      const isProperty = preset.text.en.toLowerCase().includes("property");
      const key = isProperty ? "property" : "pension";
      
      setReplyText(offlineReplies[key][language]);
      setIsPlayingReply(true);
    }, 2000);
  };

  const handleOrbToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setActivePreset(null);
    } else {
      const randomPreset = presetQueries[Math.floor(Math.random() * presetQueries.length)];
      triggerRecordingPreset(randomPreset);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl flex flex-col gap-6 items-center relative overflow-hidden group shadow-xl">
      {/* Background glow visual element */}
      <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-cyber-cyan/5 blur-xl pointer-events-none" />
      
      {/* Header */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cyber-cyan animate-pulse" />
          <span className="text-xs uppercase font-extrabold text-white tracking-widest font-mono">SarkarAI Voice Assistant</span>
        </div>
        <span className="text-[9px] uppercase font-bold text-cyber-purple px-1.5 py-0.5 rounded bg-cyber-purple/10 border border-cyber-purple/20 tracking-wider">REALTIME GEMINI AUDIO</span>
      </div>

      {/* Orb Visual Element */}
      <div className="relative py-6 flex flex-col items-center justify-center z-10">
        {/* Glow Rings */}
        <div className={`
          absolute h-40 w-40 rounded-full border border-cyber-cyan/20 blur-sm transition-transform duration-1000
          ${isRecording ? 'animate-ping scale-110' : 'animate-orbit'}
        `} />
        <div className={`
          absolute h-32 w-32 rounded-full border border-cyber-purple/20 blur-md transition-transform duration-700
          ${isRecording ? 'scale-105 border-cyber-pink/40 animate-pulse' : 'animate-pulse'}
        `} />

        {/* Dynamic Waveform SVG (glowing audio nodes) */}
        {isRecording && (
          <div className="absolute flex gap-1.5 h-32 w-48 justify-center items-center pointer-events-none z-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <span 
                key={i} 
                className="w-1.5 bg-gradient-to-t from-cyber-cyan to-cyber-purple rounded-full origin-center animate-wave"
                style={{ 
                  height: `${((i * 13 + 7) % 30) + 20}px`,
                  animationDelay: `${i * 0.08}s`,
                  animationDuration: `${((i * 7 + 5) % 6) * 0.1 + 0.7}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Central Orb Ball Button */}
        <button
          onClick={handleOrbToggle}
          className={`
            relative z-20 h-24 w-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.6)] hover:scale-105
            ${isRecording 
              ? 'bg-gradient-to-tr from-cyber-pink via-cyber-purple to-cyber-orange border-2 border-white shadow-[0_0_35px_rgba(255,42,133,0.7)]' 
              : isPlayingReply
                ? 'bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-purple border-2 border-cyber-cyan/40 shadow-[0_0_35px_rgba(0,240,255,0.5)] animate-pulse'
                : 'bg-navy-900 hover:bg-navy-800 border-2 border-white/10 hover:border-cyber-cyan/35'
            }
          `}
        >
          {isRecording ? (
            <Mic className="text-white animate-bounce" size={28} />
          ) : isPlayingReply ? (
            <Volume2 className="text-white animate-pulse" size={28} />
          ) : (
            <MicOff className="text-white/60 group-hover:text-white transition" size={28} />
          )}
        </button>
      </div>

      {/* Helper label status */}
      <span className="text-xs text-white/50 tracking-wide font-sans text-center leading-none z-10">
        {isRecording ? t('voiceOrbActive') : t('voiceOrbIdle')}
      </span>

      {/* Transcript Console (Speech to Text & Response cards) */}
      <div className="w-full flex flex-col gap-3 z-10">
        {/* User Speech Transcript */}
        {transcriptText && (
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
            <span className="text-[9px] uppercase font-bold text-cyber-cyan font-mono tracking-wider">Citizen Voice Input:</span>
            <p className="text-xs text-white/80 italic">&ldquo;{transcriptText}&rdquo;</p>
          </div>
        )}

        {/* AI Audio Response Card */}
        {isPlayingReply && replyText && (
          <div className="p-4 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20 flex flex-col gap-3 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-cyber-cyan font-mono tracking-wider flex items-center gap-1.5">
                <Volume2 size={12} className="animate-bounce" /> SarkarAI Voice Output:
              </span>
              <button 
                onClick={() => setIsPlayingReply(!isPlayingReply)}
                className="text-white/60 hover:text-cyber-cyan transition p-1 hover:bg-white/5 rounded"
              >
                {isPlayingReply ? <Pause size={12} /> : <Play size={12} />}
              </button>
            </div>
            
            {/* Audio Seekbar slider */}
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] text-white/40 font-mono">0:0{Math.floor(audioProgress/33)}</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-100 ease-linear shadow-[0_0_8px_#00f0ff]"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-cyber-cyan font-mono">0:03</span>
            </div>

            <p className="text-xs text-white leading-relaxed font-medium bg-navy-950/60 p-2.5 rounded border border-white/5">
              {replyText}
            </p>
          </div>
        )}
      </div>

      {/* Preset interactive triggers */}
      <div className="w-full flex flex-col gap-2 z-10">
        <span className="text-[9px] uppercase font-bold text-white/40 font-mono tracking-wider">Speak to Lucknow AI Agent:</span>
        <div className="flex flex-col gap-2">
          {presetQueries.map((preset, index) => (
            <button
              key={index}
              disabled={isRecording}
              onClick={() => triggerRecordingPreset(preset)}
              className="w-full text-left p-2.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition flex items-center justify-between group cursor-pointer text-xs text-white/80 hover:text-white"
            >
              <span className="truncate pr-4 font-sans font-medium">{preset.text[language]}</span>
              <ChevronRight size={14} className="text-white/40 group-hover:text-cyber-cyan transition shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
