'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@/lib/store/language-store';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  Volume2, 
  Sparkles, 
  X, 
  ChevronRight, 
  Activity,
  Maximize2
} from 'lucide-react';

interface VoiceQueryPreset {
  text: { en: string; hi: string; aw: string; hl: string };
}

interface ExtendedWindow {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

interface ISpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onerror: (err: ISpeechRecognitionError) => void;
  onend: () => void;
}

interface ISpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionError {
  error: string;
  message?: string;
}

function getRandomPreset(): VoiceQueryPreset {
  return presetQueries[Math.floor(Math.random() * presetQueries.length)];
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
  },
  {
    text: {
      en: "What is the status of the PWD road repairs in Hazratganj?",
      hi: "हज़रतगंज में पीडब्ल्यूडी सड़क मरम्मत की क्या स्थिति है?",
      aw: "हज़रतगंज PWD सड़क मरम्मत कय का हाल बा साहेब?",
      hl: "Hazratganj road repairs ka current status kya chal raha hai?"
    }
  }
];

export default function FloatingVoiceAssistant() {
  const { language, t } = useLanguageStore();
  const { workflows } = useWorkflowStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingReply, setIsPlayingReply] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activePreset, setActivePreset] = useState<VoiceQueryPreset | null>(null);
  const [activeAudioElement, setActiveAudioElement] = useState<HTMLAudioElement | null>(null);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'aw' | 'hl'>('en');

  // Sync language with standard app store on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const langMap: Record<string, 'en' | 'hi' | 'aw' | 'hl'> = {
        en: 'en',
        hi: 'hi',
        aw: 'aw',
        hl: 'hl'
      };
      const validatedLang = langMap[language as string] || 'en';
      setSelectedLang(validatedLang);
    }, 0);
    return () => clearTimeout(timer);
  }, [language]);

  const fetchVoiceResponse = async (text: string) => {
    setIsPlayingReply(false);
    
    // Stop currently playing audio if any
    if (activeAudioElement) {
      activeAudioElement.pause();
      setActiveAudioElement(null);
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/voice-assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          lang: selectedLang
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        setReplyText(data.response_text);
        setIsPlayingReply(true);

        if (data.audio_base64) {
          try {
            const audio = new Audio(data.audio_base64);
            audio.play().catch(() => console.log("Audio playback blocked by browser security. Click orb to play."));
            setActiveAudioElement(audio);
          } catch (audioErr) {
            console.log("Audio engine exception:", audioErr);
          }
        }
        return;
      }
    } catch (e) {
      console.log("Floating Voice Assistant failed, falling back to local simulation.");
    }

    // High fidelity offline simulation
    setTimeout(() => {
      const offlineReplies: Record<string, Record<string, string>> = {
        "property": {
          en: "Your Gomti Nagar Registry application (wf-101) has successfully passed all Verification Agent checks. Cross-matched with parcel boundaries. Awaiting final signature from the District Magistrate.",
          hi: "आपके गोमती नगर संपत्ति पंजीकरण आवेदन (wf-101) की जाँच सत्यापन एजेंट द्वारा पूरी कर ली गई है। वर्तमान में जिलाधिकारी कार्यालय की अंतिम स्वीकृति प्रक्रियाधीन है।",
          aw: "सुनो भैया, तोहार गोमती नगर खतौनी रजिस्ट्री (wf-101) कय नियम जांच पूरा होई गवा बा। अब हाकिम साहेब के दफ़्तर मा मंजूरी कय इंतज़ार बा, फिकर न करा!",
          hl: "Gomti Nagar registration (wf-101) ka Verification checks complete ho gaya hai. Ab file District Magistrate office ke paas final signature ke liye pending hai."
        },
        "pension": {
          en: "The rule matching process for your pension application is complete. Age thresholds verified, awaiting bank linkages.",
          hi: "आपके वृद्धावस्था पेंशन आवेदन का नियम सत्यापन पूर्ण हो चुका है। पात्रता सुनिश्चित हो गई है, शीघ्र ही बैंक खाता लिंक कर दिया जाएगा।",
          aw: "अम्मा परेशान ना हुओ, एआई बाबू तोहार ओल्ड ऐज पेंशन जांच लीन अहैं। उमर मिलान पूरा बा, जल्द ही पेंशन चालू होई जाई!",
          hl: "Aapki Indira Nagar Pension application ka verification rules match ho gaya hai. Abhi final bank linkages audit ho raha hai."
        },
        "road": {
          en: "The Hazratganj PWD road repairs are currently in the verification stage. The standard SLA window is 72 hours, with PWD road crews scheduled.",
          hi: "हज़रतगंज सड़क मरम्मत शिकायत पीडब्ल्यूडी विंग को प्रेषित की गई है। मानक निवारण समय ७२ घंटे का है, सुधार कार्य जारी है।",
          aw: "साहेब सुनो! हज़रतगंज PWD विभाग कय काम ७२ घंटा कय बा। आज रात तक काम पूरा कराव बरे टीम हज़रतगंज रवाना होई चुकी बा!",
          hl: "Hazratganj road repairs grievance standard SLA stage (72 hours) me active hai. PWD road team assigned ho chuki hai."
        }
      };

      const lowerText = text.toLowerCase();
      let key = "road";
      if (lowerText.includes("property") || lowerText.includes("deed") || lowerText.includes("रजिस्ट्री")) key = "property";
      if (lowerText.includes("pension") || lowerText.includes("पेंशन")) key = "pension";

      setReplyText(offlineReplies[key][selectedLang]);
      setIsPlayingReply(true);
    }, 1500);
  };

  const startVoiceCapture = () => {
    const SpeechRecognition = (window as unknown as ExtendedWindow).SpeechRecognition || (window as unknown as ExtendedWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback presets if browser speech is blocked/unsupported
      const randomPreset = getRandomPreset();
      triggerRecordingPreset(randomPreset);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang === 'hi' ? 'hi-IN' : selectedLang === 'aw' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);
    setTranscriptText('');
    setReplyText('');
    setIsPlayingReply(false);

    recognition.start();

    recognition.onresult = async (event: ISpeechRecognitionEvent) => {
      const speechToText = event.results[0][0].transcript;
      setTranscriptText(speechToText);
      setIsRecording(false);
      await fetchVoiceResponse(speechToText);
    };

    recognition.onerror = (err: ISpeechRecognitionError) => {
      console.log("Speech recognition failed:", err.error, err.message);
      setIsRecording(false);
      // fallback
      const randomPreset = getRandomPreset();
      triggerRecordingPreset(randomPreset);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const triggerRecordingPreset = async (preset: VoiceQueryPreset) => {
    const text = preset.text[selectedLang];
    setTranscriptText(text);
    setIsRecording(true);
    setTimeout(async () => {
      setIsRecording(false);
      await fetchVoiceResponse(text);
    }, 1200);
  };

  const handleToggleOpen = () => {
    if (isOpen) {
      if (activeAudioElement) {
        activeAudioElement.pause();
      }
      setIsOpen(false);
      setIsRecording(false);
      setIsPlayingReply(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* 1. Floating bottom-right ORB calling button */}
      <div className="fixed bottom-6 right-6 z-[9999] font-mono">
        <button
          onClick={handleToggleOpen}
          className={`
            h-14 w-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] border relative group
            ${isOpen 
              ? 'bg-cyber-pink border-cyber-pink hover:bg-cyber-pink/90 text-white rotate-135' 
              : 'bg-gradient-to-tr from-cyber-cyan to-cyber-blue border-cyber-cyan/40 text-navy-950 hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:scale-105'
            }
          `}
          title="SarkarAI Voice Agent"
        >
          {/* Glowing pulse ring */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full border-2 border-cyber-cyan/50 animate-ping opacity-75 pointer-events-none scale-105" />
          )}

          {isOpen ? (
            <PhoneOff size={22} />
          ) : (
            <Phone size={22} className="animate-pulse" />
          )}
        </button>
      </div>

      {/* 2. Expanded Call Console Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9999] w-80 glass-card rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(2,3,11,0.9)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 font-mono">
          <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
          
          {/* Header */}
          <div className="p-4 bg-navy-950/90 border-b border-white/5 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyber-pink animate-pulse shadow-[0_0_8px_#ff2a85]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">AI Voice calling Assistant</span>
                <span className="text-[8px] text-cyber-cyan font-bold uppercase mt-0.5 tracking-widest flex items-center gap-1">
                  <Activity size={10} className="animate-pulse" /> Realtime Link Active
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleToggleOpen}
              className="p-1 rounded hover:bg-white/5 text-white/50 hover:text-white transition cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4 max-h-[360px] bg-navy-950/20 relative z-10 select-none">
            {/* Lang Dialect Selectors */}
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-1.5 border border-white/5 text-[9px] font-bold">
              <span className="text-white/40 uppercase pl-1.5 font-sans">Dialect:</span>
              <div className="flex gap-1">
                {(['en', 'hi', 'aw', 'hl'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setSelectedLang(l)}
                    className={`px-2 py-1 rounded text-center transition cursor-pointer ${
                      selectedLang === l 
                        ? 'bg-cyber-cyan text-navy-950' 
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Vocal Orb Ripples */}
            <div className="py-8 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Animated pulsating circular shapes */}
              <div className={`
                absolute h-36 w-36 rounded-full border border-cyber-cyan/15 blur-sm transition-transform duration-1000
                ${isRecording ? 'animate-ping scale-110' : 'animate-orbit'}
              `} />
              <div className={`
                absolute h-28 w-28 rounded-full border border-cyber-purple/15 blur-md transition-transform duration-700
                ${isPlayingReply ? 'scale-105 border-cyber-pink/30 animate-pulse' : 'animate-pulse'}
              `} />

              {/* Dynamic waveform visualizer equalizers */}
              {isRecording && (
                <div className="absolute flex gap-1 h-20 w-44 justify-center items-center pointer-events-none z-10">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span 
                      key={i} 
                      className="w-1 bg-gradient-to-t from-cyber-cyan to-cyber-purple rounded-full origin-center animate-wave"
                      style={{ 
                        height: `${((i * 11 + 3) % 25) + 15}px`,
                        animationDelay: `${i * 0.07}s`,
                        animationDuration: `${((i * 5 + 3) % 5) * 0.1 + 0.6}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Main Button */}
              <button
                onClick={startVoiceCapture}
                className={`
                  relative z-20 h-20 w-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] border
                  ${isRecording
                    ? 'bg-gradient-to-tr from-cyber-pink via-cyber-purple to-cyber-orange border-white text-white shadow-[0_0_25px_rgba(255,42,133,0.5)]'
                    : isPlayingReply
                      ? 'bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-purple border-cyber-cyan/40 text-white shadow-[0_0_25px_rgba(0,240,255,0.4)] animate-pulse'
                      : 'bg-navy-900 hover:bg-navy-800 border-white/10 hover:border-cyber-cyan/35 text-white/70 hover:text-white'
                  }
                `}
              >
                {isRecording ? (
                  <Mic size={24} className="animate-bounce" />
                ) : isPlayingReply ? (
                  <Volume2 size={24} className="animate-pulse" />
                ) : (
                  <Mic size={24} />
                )}
              </button>
            </div>

            {/* Speaking instructions label */}
            <span className="text-[10px] text-white/40 text-center leading-none tracking-wide select-none font-sans font-medium">
              {isRecording 
                ? 'AI is listening... speak clearly' 
                : isPlayingReply 
                  ? 'AI is speaking now' 
                  : 'Click the microphone or select a preset below to start'
              }
            </span>

            {/* Conversational Speech Transcript output cards */}
            {transcriptText && (
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1">
                <span className="text-[8px] uppercase font-bold text-cyber-cyan font-mono tracking-wider flex items-center gap-1">
                  <span>●</span> Citizen Speech Transcript:
                </span>
                <p className="text-[11px] text-white/80 italic font-sans leading-relaxed">&ldquo;{transcriptText}&rdquo;</p>
              </div>
            )}

            {replyText && (
              <div className="p-3.5 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20 flex flex-col gap-2 animate-in zoom-in-95 duration-200">
                <span className="text-[8px] uppercase font-bold text-cyber-cyan font-mono tracking-wider flex items-center gap-1.5">
                  <Volume2 size={10} className="animate-bounce" /> SarkarAI vocal reply:
                </span>
                <p className="text-[11px] text-white/90 leading-relaxed font-sans font-medium bg-navy-950/60 p-2 rounded border border-white/5">
                  {replyText}
                </p>
              </div>
            )}

            {/* Presets suggestions list */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] uppercase font-bold text-white/40 font-mono tracking-wider">Fast preset queries:</span>
              <div className="flex flex-col gap-1.5">
                {presetQueries.map((preset, index) => (
                  <button
                    key={index}
                    disabled={isRecording}
                    onClick={() => triggerRecordingPreset(preset)}
                    className="w-full text-left p-2.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition flex items-center justify-between group cursor-pointer text-[10px] text-white/70 hover:text-white"
                  >
                    <span className="truncate pr-4 font-sans font-medium">{preset.text[selectedLang]}</span>
                    <ChevronRight size={12} className="text-white/30 group-hover:text-cyber-cyan transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
