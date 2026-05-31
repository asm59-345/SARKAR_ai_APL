'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertOctagon,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  category: 'governance' | 'technical' | 'tracking' | 'emergency';
  question: { en: string; hi: string; aw: string; hl: string };
  answer: { en: string; hi: string; aw: string; hl: string };
  dept?: string;
}

const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'governance',
    dept: 'Lucknow Development Authority (LDA)',
    question: {
      en: "How does the Gomti Nagar Property Registration work?",
      hi: "गोमती नगर संपत्ति पंजीकरण कैसे काम करता है?",
      aw: "गोमती नगर खतौनी रजिस्ट्री कय काम कैसे होत हय भैया?",
      hl: "Gomti Nagar property registration process kya hai?"
    },
    answer: {
      en: "Under UP Revenue Code Section 104, property deeds are uploaded directly. The Ingestion Layer runs OCR checks against state ledgers. Stamp duty must match 7% of circle rates for male and 6% for female applicants. Verified cases are sealed in the revenue vault.",
      hi: "यूपी राजस्व संहिता धारा 104 के तहत, विलेख सीधे अपलोड किए जाते हैं। सत्यापन प्रणाली ओसीआर जांच चलाती है। स्टांप शुल्क पुरुषों के लिए 7% और महिलाओं के लिए 6% होना चाहिए। स्वीकृत मामलों को सुरक्षित राजस्व तिजोरी में बंद किया जाता है।",
      aw: "सुनो साहेब! धारा 104 कय तहत खतौनी अपलोड करा जात हय। एआई बाबू तोहार नाम और कागज़ कय जांच तुरंतै कइ देथें। पुरुषों बरे ७% और महिलन बरे ६% स्टांप शुल्क लागत हय। जांच पूरी होते ही कागज़ सरकारी लॉकर मा बंद होइ जाई।",
      hl: "Deed documents direct upload hote hain. Ingestion system OCR check run karke circle rate stamp rules cross-verify karta hai. Valid files direct Revenue administrative vault mein lock ho jati hain."
    }
  },
  {
    id: 'faq-2',
    category: 'governance',
    dept: 'Social Welfare Department',
    question: {
      en: "Who is eligible for the Old Age Pension scheme?",
      hi: "वृद्धावस्था पेंशन योजना के लिए कौन पात्र है?",
      aw: "अम्मा, ओल्ड एज पेंशन कय लाभ केका-केका मिलि सकत हय?",
      hl: "Old age pension scheme ki eligibility check criteria kya hai?"
    },
    answer: {
      en: "Lucknow residents aged 60 or above are eligible. The household income ceiling must be strictly under ₹56,460 annually in urban limits (e.g. Indira Nagar, Hazratganj) and ₹46,080 in rural areas. Verification checks age and income certificates.",
      hi: "60 वर्ष या उससे अधिक आयु के लखनऊ निवासी पात्र हैं। शहरी क्षेत्रों में वार्षिक आय ₹56,460 और ग्रामीण क्षेत्रों में ₹46,080 से कम होनी चाहिए। आयु और आय प्रमाण पत्र का सत्यापन किया जाता है।",
      aw: "अम्मा परेशान ना हुओ! ६० साल या ऊपर कय सब बुजुर्ग एकर पात्र अहैं। सालाना आमदनी सहर मा ५६,४६० रुपिया और गाँव मा ४६,०८० रुपिया से कम होय का चाही। एआई बाबू तोहार परचा चेक कै कय पेंशन तुरंतै पास कइ देथें।",
      hl: "Age limit strictly 60+ age groups. Annual household income limit is max ₹56,460 inside Lucknow municipal zones. Documents verified via state welfare registry indices."
    }
  },
  {
    id: 'faq-3',
    category: 'tracking',
    dept: 'Public Works Department (PWD)',
    question: {
      en: "What is the standard SLA for Hazratganj road repair complaints?",
      hi: "हजरतगंज सड़क मरम्मत शिकायतों के लिए मानक समाधान समय (SLA) क्या है?",
      aw: "हज़रतगंज सड़क गडढा भराई कय अर्ज़ी कय समाधान केत्ते दिन मा होत हय?",
      hl: "Hazratganj road repair complaint ka standard SLA timeline kya hai?"
    },
    answer: {
      en: "Public Works Department road repairs (Grade A pothole severity) have a strict 72-hour (3 days) Service Level Agreement. Delays beyond this window trigger automatic escalation to the Municipal Commissioner's office.",
      hi: "लोक निर्माण विभाग (Grade A pothole) शिकायतों के लिए 72 घंटे का कड़ा समय निर्धारित है। इससे अधिक देरी होने पर मामला सीधे नगर आयुक्त कार्यालय को अग्रेषित कर दिया जाता है।",
      aw: "साहेब सुनो! हज़रतगंज PWD सड़क कय काम ७२ घंटा मा पूरा करय कय नियम बा। अगर ३ दिन मा सड़क दुरुस्त ना भई, तौ अर्ज़ी बड़े नगर आयुक्त हाकिम कय दफ़्तर मा तुरंतै भेज दीन जात हय।",
      hl: "Grade A road repair complaints have a strict 72-hour SLA. Agar timeline complete nahi hui, toh automatic escalation to Lucknow Nagar Nigam commissioner office."
    }
  },
  {
    id: 'faq-4',
    category: 'technical',
    question: {
      en: "What should I do if my document upload fails?",
      hi: "दस्तावेज़ अपलोड विफल होने पर मुझे क्या करना चाहिए?",
      aw: "कागज़ जमा करय मा अगर कोई गड़बड़ी आवय तौ का करी भैया?",
      hl: "Agr file upload failure show kare toh what is the immediate step?"
    },
    answer: {
      en: "Ensure your document is a clear PDF or JPG image below 10MB. Verify that the Aadhaar or PAN number is legible, as the OpenCV preprocessors require minimum 150 DPI contrast for proper OCR validation.",
      hi: "सुनिश्चित करें कि फ़ाइल 10MB से कम की स्पष्ट पीडीएफ या जेपीजी है। सुनिश्चित करें कि आधार या पैन संख्या स्पष्ट है, क्योंकि ओसीआर सत्यापन के लिए स्पष्टता आवश्यक है।",
      aw: "साहेब, चिंता न करा! देखि लेव कि फोटो साफ़ अहै और १० एमबी से छोट बा। आधार या पैन कय नंबर एकदम साफ़ दिखय का चाही, ताकि कंप्यूटर बाबू आसानी से पढ़ि सकें।",
      hl: "Image check karein. Clear JPG/PDF size limit below 10MB formats. DPI contrast legible hona chahiye for successful Aadhaar/PAN OCR processing."
    }
  },
  {
    id: 'faq-5',
    category: 'emergency',
    dept: 'Special Task Force / Police',
    question: {
      en: "How are critical emergency complaints handled?",
      hi: "आपातकालीन शिकायतों का निपटान कैसे किया जाता है?",
      aw: "हमार तुरंतै मदद कय अर्ज़ी एआई बाबू कैसे निपटावत हैं?",
      hl: "Critical/Emergency complaints route system bypass kaise karta hai?"
    },
    answer: {
      en: "Grievances flagged with 'critical' urgency or tagged under 'women_safety', 'fire', 'medical', or 'corruption' instantly bypass standard multi-agent queue times. They fast-track straight to the Escalation Agent node (90% progress) and trigger live officer alerts.",
      hi: "गंभीर तात्कालिकता या 'महिला सुरक्षा', 'आग', 'चिकित्सा' या 'भ्रष्टाचार' श्रेणियों वाली शिकायतों का त्वरित निस्तारण होता है। ये सीधे एस्केलेशन एजेंट को भेजी जाती हैं और अधिकारियों को सचेत करती हैं।",
      aw: "भैया सुनो! अगर अर्ज़ी 'महिला सुरक्षा', 'आग', 'डॉक्टर' या 'रिश्वत' कय बरे अहै, तौ एआई बाबू सब कागज़ी कतार बाईपास कइ देथें। ३ सेकेंड मा अर्ज़ी एस्केलेशन हाकिम कय मेज़ पर पहुँचत अहै और पुलिस लाइव एक्टिव होई जाई!",
      hl: "Women safety, corruption, or medical critical issues instantly bypass all agent pipelines. Auto-route is locked to the Escalation desk with live alarms dispatched via WebSockets."
    }
  }
];

export default function FAQPage() {
  const { language, t } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFAQs = faqData.filter(item => {
    const questionText = item.question[language].toLowerCase();
    const answerText = item.answer[language].toLowerCase();
    const matchesSearch = questionText.includes(searchQuery.toLowerCase()) || answerText.includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full animate-in fade-in duration-300">
        
        {/* Title */}
        <div className="flex flex-col gap-1.5 relative">
          <span className="text-[10px] uppercase font-mono font-bold text-cyber-cyan tracking-widest">Sovereign Helpdesk</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">FAQ & Citizen Help Center</h2>
          <p className="text-xs text-white/50">Find quick details on municipal circle rates, social welfare schemes, road SLAs, or ask our general AI assistant.</p>
        </div>

        {/* Top Search bar & Categories grid */}
        <div className="flex flex-col md:flex-row gap-4 items-center shrink-0">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 text-white/40" size={16} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policies, departments, technical questions..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyber-cyan/50 focus:bg-white/10 transition"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto shrink-0 pb-1">
            {['all', 'governance', 'technical', 'tracking', 'emergency'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-3 py-1.5 rounded text-[11px] font-mono uppercase font-bold tracking-wider cursor-pointer border transition duration-200
                  ${activeCategory === cat 
                    ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {cat === 'all' ? 'All Guides' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion Panel */}
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16 bg-[#040613]/40 rounded-xl border border-white/5 flex flex-col items-center gap-3">
              <HelpCircle className="text-white/20" size={40} />
              <span className="text-xs text-white/40">No matching guides found in our database index.</span>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className={`
                    glass-card rounded-xl border transition-all duration-300
                    ${isExpanded ? 'border-cyber-cyan/30 bg-[#060a22]/80 shadow-[0_4px_25px_rgba(0,240,255,0.03)]' : 'border-white/5 bg-[#030510]/50'}
                  `}
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        h-7 w-7 rounded-full flex items-center justify-center shrink-0 border
                        ${faq.category === 'emergency' 
                          ? 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink animate-pulse' 
                          : 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan'}
                      `}>
                        {faq.category === 'emergency' ? <AlertOctagon size={13} /> : <HelpCircle size={13} />}
                      </div>
                      <div className="flex flex-col">
                        {faq.dept && (
                          <span className="text-[9px] font-mono text-cyber-cyan/70 font-semibold uppercase">{faq.dept}</span>
                        )}
                        <h4 className="text-xs font-bold text-white mt-0.5 tracking-wide leading-relaxed">
                          {faq.question[language]}
                        </h4>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="text-white/40 shrink-0" size={14} /> : <ChevronDown className="text-white/40 shrink-0" size={14} />}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-xs text-white/70 leading-relaxed border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
                      <p className="font-sans">{faq.answer[language]}</p>
                      
                      {faq.category === 'emergency' && (
                        <div className="mt-3 p-3 rounded bg-cyber-pink/5 border border-cyber-pink/20 flex gap-2.5 items-start">
                          <AlertOctagon className="text-cyber-pink shrink-0" size={14} />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] uppercase font-bold text-white font-mono tracking-wider">Critical Override Portal Available</span>
                            <span className="text-[10px] text-white/50">This claim can instantly bypass normal queue delays via the Emergency route.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* AI Action CTA Trigger Card */}
        <div className="p-5 rounded-xl border border-cyber-purple/20 bg-gradient-to-r from-cyber-purple/10 to-cyber-cyan/5 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shrink-0 shadow-lg">
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
          <div className="flex gap-4 items-start relative z-10">
            <div className="h-10 w-10 rounded-lg bg-cyber-purple/20 border border-cyber-purple/35 text-cyber-purple flex items-center justify-center shrink-0 animate-float-slow">
              <Sparkles size={18} />
            </div>
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="text-[10px] uppercase font-mono font-bold text-cyber-purple tracking-widest">Still need assistance?</span>
              <h4 className="text-sm font-extrabold text-white font-sans">Would you like to create an official complaint?</h4>
              <p className="text-xs text-white/50">Our AI engine will instantly prefill the department, classify issues, and dispatch the LangGraph agents.</p>
            </div>
          </div>
          <Link
            href="/complaints"
            className="px-6 py-2.5 rounded-lg bg-cyber-purple text-white font-bold text-xs hover:bg-cyber-purple/90 hover:shadow-[0_0_15px_rgba(171,60,255,0.4)] transition duration-300 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Lodge Official Complaint</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}
