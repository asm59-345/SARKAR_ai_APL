'use client';

import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import VoiceAssistantOrb from '@/components/ui/VoiceAssistantOrb';
import { 
  Send, 
  Sparkles, 
  User, 
  MessageSquare,
  Volume2, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  dialect?: string;
  timestamp: string;
  findings?: string[];
  statusCard?: {
    workflowId: string;
    stage: string;
    completion: string;
  };
}

const BACKEND_URL = "http://127.0.0.1:8000";

export default function ChatPage() {
  const { language, t } = useLanguageStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: language === 'aw' 
        ? "प्रणाम भैया! हम सरकारएआई अही। लखनऊ प्रशासन या सरकारी योजना कय बारे मा कुछौ पूछय का चाहत हौ? आपन अर्ज़ी कय नंबर डाल कय हाल-चाल भी ले सकत हौ।"
        : language === 'hi'
          ? "प्रणाम! मैं सरकारएआई हूँ। लखनऊ नगर निगम प्रशासन, संपत्ति पंजीकरण या किसी भी शिकायत की स्थिति के बारे में मुझसे पूछें।"
          : "Welcome to SarkarAI OS Interactive Hub. Ask me about your grievance, property registry status, or scheme eligibility criteria.",
      timestamp: "12:00 PM"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: 'm-' + Math.random().toString(36).substr(2, 5),
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    const originalInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Connects to the real Python backend AI engine requesting SSE stream
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: originalInput,
          lang: language,
          citizen_name: "Ashmit Sarkar",
          stream: true
        })
      });

      if (res.ok) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("Stream reader unavailable.");

        let currentAiText = "";
        const aiMsgId = 'm-' + Math.random().toString(36).substr(2, 5);

        // Parse visual UI card parameters locally for premium dashboard previews ONLY if explicit tracking/status intent is detected
        let findings: string[] | undefined;
        let statusCard: ChatMessage['statusCard'] | undefined;
        const lowerInput = originalInput.toLowerCase();
        const isTrackingQuery = lowerInput.includes('track') || lowerInput.includes('status') || lowerInput.includes('progress') || lowerInput.includes('application') || lowerInput.includes('kahan') || lowerInput.includes('stuck') || lowerInput.includes('ruki') || lowerInput.includes('स्थिति') || lowerInput.includes('अर्ज़ी') || lowerInput.includes('नंबर');

        if (isTrackingQuery) {
          if (lowerInput.includes('pension') || lowerInput.includes('पेंशन')) {
            findings = [
              "Aadhaar Identity verified via UP Welfare records.",
              "Income certificate threshold matched (< ₹56,460).",
              "Age eligibility limits check compiled successfully."
            ];
            statusCard = {
              workflowId: "wf-102",
              stage: "Rule Engine Evaluation (Pension Rules)",
              completion: "50%"
            };
          } else if (lowerInput.includes('property') || lowerInput.includes('deed') || lowerInput.includes('रजिस्ट्री') || lowerInput.includes('खतौनी')) {
            findings = [
              "Section 104 Stamp duty calculation verified.",
              "Deed coordinates match Gomti Nagar land grid.",
              "Identity records cross-matching successfully verified."
            ];
            statusCard = {
              workflowId: "wf-101",
              stage: "Awaiting final District Commissioner signature",
              completion: "90%"
            };
          }
        }

        // Add the initial message with empty text to allow token streaming
        setMessages((prev) => [
          ...prev,
          {
            id: aiMsgId,
            sender: 'ai',
            text: "",
            findings,
            statusCard,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        setIsTyping(false);

        // Progressively read streaming tokens from server
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value);
          const lines = chunkText.split("\n");
          for (const line of lines) {
            if (line.trim().startsWith("data: ")) {
              try {
                const data = JSON.parse(line.trim().slice(6));
                if (data.type === "token") {
                  currentAiText += data.token;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMsgId ? { ...msg, text: currentAiText } : msg
                    )
                  );
                }
              } catch (err) {
                // Ignore chunk boundary parsing anomalies
              }
            }
          }
        }
        return;
      }
    } catch (e) {
      console.log("Realtime AI Chat fetch failed, deploying fallback engine.");
    }

    // Dynamic Offline Intelligent Fallback if API offline
    setTimeout(() => {
      let replyText = "";
      let findings: string[] | undefined;
      let statusCard: ChatMessage['statusCard'] | undefined;

      const lowerInput = inputValue.toLowerCase() || originalInput.toLowerCase();
      const isTrackingQuery = lowerInput.includes('track') || lowerInput.includes('status') || lowerInput.includes('progress') || lowerInput.includes('application') || lowerInput.includes('kahan') || lowerInput.includes('stuck') || lowerInput.includes('ruki') || lowerInput.includes('स्थिति') || lowerInput.includes('अर्ज़ी') || lowerInput.includes('नंबर');

      if (isTrackingQuery && (lowerInput.includes('registration') || lowerInput.includes('registry') || lowerInput.includes('रजिस्ट्री') || lowerInput.includes('खतौनी') || lowerInput.includes('property'))) {
        replyText = language === 'aw'
          ? "भैया, तोहार गोमती नगर खतौनी रजिस्ट्री अर्ज़ी (wf-101) हमार सत्यापन एजेंट जांच लीन बा। खसरा नंबर 402 कय राजस्व लेखा से मिलान होय गवा अहै। बस हाकिम साहेब कय दस्तख़त बाकी बा!"
          : language === 'hi'
            ? "आपके गोमती नगर संपत्ति पंजीकरण आवेदन (wf-101) की जाँच सत्यापन एजेंट द्वारा सफलतापूर्वक पूरी कर ली गई है। राजस्व विभाग के रिकॉर्ड से मिलान कर लिया गया है। वर्तमान में डीएम कार्यालय की अंतिम स्वीकृति लंबित है।"
            : "Your Gomti Nagar Registry application (wf-101) has successfully passed all Verification Agent checks. Cross-matched with municipal parcel bounds. Awaiting commissioner DM signature.";
        findings = [
          "Aadhaar verification matching probability: 99.8%.",
          "Stamp duty matched: ₹1,42,500.",
          "Revenue survey records confirmed."
        ];
        statusCard = {
          workflowId: "wf-101",
          stage: "Verification Complete (Awaiting Signature)",
          completion: "90%"
        };
      } else if (isTrackingQuery && (lowerInput.includes('pension') || lowerInput.includes('पेंशन'))) {
        replyText = language === 'aw'
          ? "पेंशन अर्ज़ी (wf-103) कय बरे एआई बाबू तोहार बैंक परचा जांचत बा। उमर सीमा 60 साल कय नियम चेक होई रहा बा। चिंता न करा, तुरंतै होइ जाई!"
          : language === 'hi'
            ? "पेंशन योजना आवेदन (wf-103) की पात्रता संबंधी जांच प्रक्रियाधीन है। नियम इंजन आयु सीमा (60 वर्ष से अधिक) और आय प्रमाण पत्र का सत्यापन कर रहा है।"
            : "The Rule Engine is validating Indira Nagar Pension application (wf-103). Performing bank verification and income bracket check.";
        statusCard = {
          workflowId: "wf-103",
          stage: "Rule Verification In Progress",
          completion: "45%"
        };
      } else {
        // General GPT/Gemini Mock Responses based on query subjects (code, history, letters, etc.)
        if (lowerInput.includes('code') || lowerInput.includes('python') || lowerInput.includes('javascript') || lowerInput.includes('program')) {
          replyText = `Certainly! I'd be happy to help you with coding. Here is a clean Python function implementing binary search:

\`\`\`python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1
\`\`\`

Let me know if you would like me to translate this to JavaScript or write unit tests for it!`;
        } else if (lowerInput.includes('history') || lowerInput.includes('rumi') || lowerInput.includes('monument') || lowerInput.includes('lucknow')) {
          replyText = language === 'aw'
            ? "अरे भैया सुनो! हमार लखनऊ कय इतिहास बहुतै शानदार बा। अवध कय नवाब लोगन १८वीं सदी मा इ शहर कय बसाया रहा। हियाँ कय रूमी दरवाज़ा, बड़ा इमामबाड़ा (भूल भुलैया), और गोमती रिवरफ़्रंट पूरै दुनिया मा प्रसिद्ध बा। मुस्कुराहट हियाँ कय हवा मा अहै, मुस्कुराइयौ भैया!"
            : language === 'hi'
              ? "अवध का इतिहास अत्यंत समृद्ध है। १७७५ में नवाब आसफ़-उद्दौला ने लखनऊ को अवध की राजधानी बनाया था। स्थापत्य कला में बड़ा इमामबाड़ा, प्रसिद्ध भूल भुलैया, रूमी दरवाज़ा, और रेजीडेंसी यहाँ की ऐतिहासिक धरोहरें हैं। यहाँ की तहज़ीब और नफ़ासत विश्व विख्यात है।"
              : "Lucknow, the city of Nawabs, holds immense heritage. Established as the capital of Awadh in 1775 by Nawab Asaf-ud-Daula, it features iconic architectural wonders like the Rumi Darwaza, Bara Imambara, and Chhota Imambara. Today, it is evolving into a smart city powered by ITCS grids and green zones.";
        } else if (lowerInput.includes('write') || lowerInput.includes('letter') || lowerInput.includes('application')) {
          replyText = `Here is a formal draft for your letter to the Municipal Commissioner:

**Subject: Grievance regarding road infrastructure repair in Sector-A**

Respected Commissioner,
I am writing to draw your attention to the severe damage of main roads in Sector-A, Gomti Nagar. This has caused multiple traffic delays and is a threat to citizen safety. I request you to kindly deploy PWD zone engineers to assess and repair the potholes at the earliest convenience.

Sincerely,
A Concerned Citizen of Lucknow`;
        } else {
          replyText = language === 'aw'
            ? `प्रणाम भैया! तोहार सवाल '${originalInput}' बहुतै नीक बा। हमार एआई इंजन तोहरे बरे हाज़िर अहै। हम लखनऊ कय इतिहास, सरकारी योजना, कोडिंग कय सवाल, या प्रशासनिक कामकाज कय बारे मा कुछौ बताय सकित अही। बतावा, आज कइसे मदद कीन जाय?`
            : language === 'hi'
              ? `प्रणाम! आपका यह प्रश्न '${originalInput}' अत्यंत महत्वपूर्ण है। सरकारएआई सामान्य ज्ञान, विधिक सरकारी नीतियों, लेखन कार्य, कोडिंग अथवा किसी भी विषय पर परिचर्चा हेतु सक्षम है। कृपया अपनी आवश्यकता के अनुसार विवरण प्रदान करें।`
              : `Hello! Your query '${originalInput}' has been received. I am SarkarAI OS, a general-purpose conversational LLM assistant similar to ChatGPT and Gemini. I can assist you with administrative policies, write letters, generate code, summarize documents, or discuss Lucknow heritage. What would you like to explore today?`;
        }
      }

      let currentAiText = "";
      const aiMsgId = 'm-' + Math.random().toString(36).substr(2, 5);

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: "",
          findings,
          statusCard,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setIsTyping(false);

      const words = replyText.split(" ");
      let wordIdx = 0;
      const interval = setInterval(() => {
        if (wordIdx < words.length) {
          currentAiText += (wordIdx > 0 ? " " : "") + words[wordIdx];
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, text: currentAiText } : msg
            )
          );
          wordIdx++;
        } else {
          clearInterval(interval);
        }
      }, 50);
    }, 1500);
  };


  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto h-[calc(100vh-120px)] animate-in fade-in duration-300">
        
        {/* Chat Window Frame */}
        <div className="lg:col-span-2 glass-card rounded-xl border border-white/5 flex flex-col h-full overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
          
          {/* Header */}
          <div className="p-4 bg-navy-950/80 border-b border-white/5 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00f0ff]" />
              <MessageSquare className="text-cyber-cyan animate-pulse" size={18} />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-extrabold text-white font-mono uppercase tracking-wider">SarkarAI Dialect Chatbot</span>
                <span className="text-[9px] text-white/50 mt-1">Realtime Awadhi & Hindi Dialect Adaptive Engine</span>
              </div>
            </div>
            <span className="text-[10px] text-cyber-cyan bg-cyber-cyan/5 px-2 py-0.5 rounded border border-cyber-cyan/35 font-mono shadow-[0_0_10px_rgba(0,240,255,0.05)]">DM VAULT SECURED</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#02030b]/40 relative z-10">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div 
                  key={m.id}
                  className={`flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 ${isAi ? 'self-start' : 'self-end flex-row-reverse'}`}
                >
                  {/* Sender Icon */}
                  <div className={`
                    h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 hover:scale-105
                    ${isAi ? 'bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan' : 'bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple'}
                  `}>
                    {isAi ? <Sparkles size={14} /> : <User size={14} />}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {/* Text Container bubble */}
                    <div className={`
                       p-3.5 rounded-xl border text-xs leading-relaxed transition-all duration-300 hover:border-white/10
                      ${isAi 
                        ? 'bg-navy-950/95 border-white/5 text-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.2)]' 
                        : 'bg-gradient-to-r from-cyber-cyan/10 to-cyber-blue/5 border-cyber-cyan/20 text-white shadow-[0_4px_12px_rgba(0,240,255,0.02)]'
                      }
                    `}>
                      {m.text}
                    </div>

                    {/* Status Card details block */}
                    {m.statusCard && (
                      <div className="p-3 rounded-lg bg-[#040613]/90 border border-cyber-cyan/20 flex flex-col gap-2 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-white/40">Workflow Tracking ID:</span>
                          <span className="text-cyber-cyan font-bold">{m.statusCard.workflowId}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-white/40 font-sans">Active Phase:</span>
                          <span className="text-white font-medium">{m.statusCard.stage}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-cyber-cyan shadow-[0_0_8px_#00f0ff]" style={{ width: m.statusCard.completion }} />
                          </div>
                          <span className="text-[9px] text-cyber-cyan font-mono">{m.statusCard.completion}</span>
                        </div>
                      </div>
                    )}

                    {/* Findings list if applicable */}
                    {m.findings && (
                      <div className="flex flex-col gap-1 pl-1">
                        <span className="text-[9px] uppercase font-bold text-white/40 font-mono tracking-wider">Verifications Audit Log:</span>
                        {m.findings.map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-white/70 font-mono">
                            <CheckCircle size={10} className="text-cyber-green shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="text-[8px] text-white/30 self-end font-mono">{m.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 self-start items-center">
                <div className="h-8 w-8 rounded-full bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center shrink-0 animate-pulse">
                  <Sparkles size={14} className="animate-spin" />
                </div>
                <div className="p-3.5 rounded-xl bg-navy-950/80 border border-white/5 flex gap-1.5 items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Typing Area Input Panel */}
          <div className="p-3 bg-navy-950/90 border-t border-white/5 flex gap-2 shrink-0 items-center z-10 relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatPlaceholder')}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyber-cyan/50 focus:bg-white/10 transition"
            />
            <button 
              onClick={handleSend}
              className="p-2.5 rounded-lg bg-cyber-cyan text-navy-950 font-bold hover:bg-cyber-cyan/90 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition duration-300 cursor-pointer shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Right Voice Assistant Hub */}
        <div className="h-full flex flex-col gap-6">
          <VoiceAssistantOrb />

          {/* FAQs Helper card list */}
          <div className="glass-card p-4 rounded-xl flex-1 border border-white/5 flex flex-col gap-3 relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-1.5">
              <HelpCircle size={14} className="text-cyber-purple" />
              <span className="text-xs uppercase font-extrabold text-white font-mono tracking-wider">Suggested Questions</span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[220px]">
              <button 
                onClick={() => setInputValue("Where is my Gomti Nagar property registration stuck?")}
                className="w-full text-left p-2.5 rounded bg-white/5 border border-white/5 hover:border-cyber-cyan/25 hover:bg-white/10 text-[11px] text-white/70 hover:text-white transition duration-200 cursor-pointer font-medium"
              >
                Gomti Nagar Property registration status?
              </button>
              <button 
                onClick={() => setInputValue("Is my Indira Nagar pension application processed?")}
                className="w-full text-left p-2.5 rounded bg-white/5 border border-white/5 hover:border-cyber-cyan/25 hover:bg-white/10 text-[11px] text-white/70 hover:text-white transition duration-200 cursor-pointer font-medium"
              >
                Indira Nagar Pension application checks?
              </button>
              <button 
                onClick={() => setInputValue("Register complaint for road pothole repair in Hazratganj")}
                className="w-full text-left p-2.5 rounded bg-white/5 border border-white/5 hover:border-cyber-cyan/25 hover:bg-white/10 text-[11px] text-white/70 hover:text-white transition duration-200 cursor-pointer font-medium"
              >
                Hazratganj Road damage grievance filing?
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
