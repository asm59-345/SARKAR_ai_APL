'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Trees, 
  Activity, 
  TrendingUp, 
  Layers,
  ArrowRight,
  Info,
  Building2,
  Train,
  CheckCircle,
  Clock,
  Sparkle
} from 'lucide-react';
import Link from 'next/link';

interface Attraction {
  name: string;
  category: string;
  imgPlaceholder: string;
  smartFeature: string;
  imgUrl: string;
  desc: { en: string; hi: string; aw: string; hl: string };
  specs: string[];
  status: string;
  newsTitle?: string;
  newsSummary?: string;
}

const placesData: Attraction[] = [
  {
    name: "Janeshwar Mishra Park",
    category: "Green Eco-Park",
    imgPlaceholder: "Asia's largest ecological park with solar-powered smart irrigation grids.",
    smartFeature: "Solar Smart-Irrigation Grid",
    imgUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
    status: "Eco Solar Grid Live",
    desc: {
      en: "Spanning over 376 acres, Janeshwar Mishra Park is Asia's largest eco-park. Equipped with automated solar-powered irrigation grids and smart IoT solid waste monitoring nodes.",
      hi: "376 एकड़ में फैला, जनेश्वर मिश्र पार्क एशिया का सबसे बड़ा इको-पार्क है। यह सौर ऊर्जा संचालित सिंचाई और स्मार्ट अपशिष्ट निगरानी प्रणालियों से लैस है।",
      aw: "सुनो साहेब! ई जनेश्वर मिश्र पार्क ३७६ एकड़ मा फैला बा, पूरे एशिया कय सबसे बड़ा पार्क अहै। हियाँ एआई कय मदद से पेड़-पौधों मा पानी और सफ़ाई कय पूरा काम स्वचालित रूप से होत हय।",
      hl: "376 acres landscape. Janeshwar Mishra eco-park runs automated solar irrigation and smart trash monitoring devices."
    },
    specs: ["376 Acres green belt", "IoT Trash level telemetry", "Zero Carbon footprint"],
    newsTitle: "Smart Floating Solar Grid Installed",
    newsSummary: "Lucknow Nagar Nigam has commissioned a 500kW floating solar power array on the central eco-lake inside the park, fully powering municipal irrigation pumps."
  },
  {
    name: "Gomti Riverfront Park",
    category: "Heritage Waterfront walkway",
    imgPlaceholder: "Scenic walk, musical fountains, smart automated garbage disposal systems.",
    smartFeature: "Smart CCTV & Solar Lighting",
    imgUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    status: "24/7 AI Patrol Overlay",
    desc: {
      en: "A premium waterfront walkway featuring green lawns, musical fountains, and automated trash disposal bins synchronized with our OS telemetry. Kept secure via smart police cameras.",
      hi: "एक उत्कृष्ट नदी तट मार्ग जिसमें हरे लॉन, संगीतमय फव्वारे और स्वचालित अपशिष्ट निपटान डिब्बे हैं जो हमारे एआई नेटवर्क से जुड़े हैं।",
      aw: "गोमती नदी कय किनारा बहुतै सुंदर बा भैया! हियाँ शाम कय म्यूजिकल फ़ाउंटेन चलत हय। पूरा किनारा एआई सुरक्षा कैमरों कय पहरा मा एकदम सुरक्षित बा, परिवार के साथे घूमय जाइयो!",
      hl: "Waterfront scenic walk. Equipped with musical solar fountains and smart automated trash disposals synced to council control."
    },
    specs: ["8 km scenic path", "Musical fountains", "24/7 AI Patrol Active"],
    newsTitle: "Eco sunderikaran project launched",
    newsSummary: "Nagar Nigam initiates smart waste segregation filters along the waterfront, keeping the Gomti river basin plastic-free."
  },
  {
    name: "Bara Imambara",
    category: "Heritage & Culture",
    imgPlaceholder: "18th-century administrative marvel, famous for its gravity-defying Bhool Bhulaiya.",
    smartFeature: "AI Multilingual QR Guides",
    imgUrl: "https://images.unsplash.com/photo-1626697556642-a164998782bb?auto=format&fit=crop&w=600&q=80",
    status: "Smart QR Guides Active",
    desc: {
      en: "Constructed in 1784, this architectural marvel is famous for its gravity-defying Bhool Bhulaiya. Equipped with multilingual QR guides explaining Lucknow's administrative history.",
      hi: "1784 में निर्मित, यह ऐतिहासिक भूलभुलैया के लिए प्रसिद्ध है। पर्यटकों के लिए एआई-संचालित बहुभाषी क्यूआर गाइड उपलब्ध कराए गए हैं।",
      aw: "साहेब, ई १८वीं सदी कय नवाब आसफ़उद्दौला कय बनवाया इमामबाड़ा अहै, हियाँ भूलभुलैया मा लोग रास्ता भूल जाथें! अब हियाँ क्यूआर कोड लगा बा, मोबाइल से स्कैन कै कय अवधी मा इतिहास सुनि सकत हौ।",
      hl: "1784 Nawabi architectural monument. Famous Bhool Bhulaiya. Now integrated with multilingual smart audio QR codes."
    },
    specs: ["Built in 1784", "Gravity-defying arched hall", "Smart QR audio narration"],
    newsTitle: "Laser-Mapping Illumination Complete",
    newsSummary: "ASI and Smart City Lucknow successfully deployed non-invasive structural monitoring warm-LED grids around the monument."
  },
  {
    name: "Hazratganj commercial center",
    category: "Smart City Zone",
    imgPlaceholder: "Historical core, Hazratganj commercial center with ITCS AI camera arrays.",
    smartFeature: "ITCS Traffic AI scheduled",
    imgUrl: "https://images.unsplash.com/photo-1506501139174-099022df5260?auto=format&fit=crop&w=600&q=80",
    status: "ITCS Traffic Grid Active",
    desc: {
      en: "Lucknow's central business core, now fully automated with sensor-based Intelligent Traffic Control (ITCS) scheduled timing signals to minimize city vehicle emissions and delays.",
      hi: "लखनऊ का मुख्य व्यावसायिक केंद्र, जो अब स्वचालित इंटेलिजेंट ट्रैफिक कंट्रोल (ITCS) सेंसर से लैस है, जो वाहनों के जाम को ३५% तक कम करता है।",
      aw: "मुस्कुराइयौ, आप हज़रतगंज मा हैं! लखनऊ कय धड़कन हय ई। हियाँ एआई सिग्नलों कय मदद से जाम बहुतै कम होई गवा बा, पार्किंग कय हाल भी फोन मा लाइव दिखत हय।",
      hl: "Central heritage business market. Connected with live PWD sensor-based ITCS traffic signal schedules reducing wait times by 35%."
    },
    specs: ["ITCS Traffic AI online", "Sensor-based signal timing", "Smart street lamp sensors"],
    newsTitle: "Hazratganj ITCS Signals go live",
    newsSummary: "Nagar Nigam and police confirm sensor retiming has reduced peak vehicle congestion wait queues by 35%."
  },
  {
    name: "Vasant Kunj Corridor Extension",
    category: "Newly Developed Area / Active Project",
    imgPlaceholder: "Lucknow's rapid west expansion corridor, soon linking to metro Phase 1B.",
    smartFeature: "Metro Phase 1B Alignment",
    imgUrl: "https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&w=600&q=80",
    status: "Planning & Inception phase",
    desc: {
      en: "The newest high-growth residential corridor in West Lucknow, undergoing massive road infrastructure and mass green transit mapping to connect Alambagh grids with Vasant Kunj limits.",
      hi: "पश्चिम लखनऊ में सबसे नया उच्च विकास आवासीय गलियारा, जो चारबाग़ रेलवे ग्रिड से जुड़ेगा।",
      aw: "अरे सुनो भैया! ई बसंत कुंज कय नया इलाका अहै जो तेजी से विकसित होई रहा बा। अब हियाँ चारबाग़ से सीधे मेट्रो चले कय सरकारी मंजूरी मिल चुकी बा।",
      hl: "High-growth residential area in West LKO. Cabinet cleared Metro rail extension Phase 1B to link Vasant Kunj limits."
    },
    specs: ["₹5,800 Crore cabinet budget", "Western LKO connector", "4.5 Lakh daily transit capacity"],
    newsTitle: "Cabinet Clears DPR for Metro Phase 1B",
    newsSummary: "UP Government has cleared the detailed project report extending mass transit from Charbagh Station to Vasant Kunj via Nawazganj."
  },
  {
    name: "Aishbagh IT & AI Smart Park",
    category: "Smart Industrial Hub",
    imgPlaceholder: "Lucrative commercial project housing Lucknow's next-gen startup cells.",
    smartFeature: "Green Data Center Core",
    imgUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
    status: "Construction under progress",
    desc: {
      en: "A cutting-edge green industrial park hosting Lucknow's premium IT and AI administrative centers, designed with green-energy grid structures and high-speed fiber-optic rings.",
      hi: "एक अत्याधुनिक हरित औद्योगिक पार्क जो लखनऊ के प्रीमियम आईटी और एआई केंद्रों की मेजबानी करेगा।",
      aw: "साहेब! ई ऐशबाग मा नया एआई पार्क बनत अहै, जहाँ लखनऊ कय कंप्यूटर बाबू लोग काम करिहैं और बड़ा रोज़गार मिलिहै।",
      hl: "Upcoming smart industrial zone. Equipped with zero-emission data centers and automated power backup loops."
    },
    specs: ["150 Acres tech grid", "100Gbps optical fiber ring", "100% solar powered backups"],
    newsTitle: "AI & Startup Hub Sealed",
    newsSummary: "LDA seals property approvals for 4 major international commercial projects in Aishbagh Extension limits."
  }
];

export default function ExploreLucknow() {
  const { language, t } = useLanguageStore();
  const [places, setPlaces] = useState<Attraction[]>(placesData);

  // Periodic visual analytics update simulation
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate live smart telemetries
      setPlaces(prev => prev.map(place => {
        if (Math.random() > 0.8) {
          const specIdx = Math.floor(Math.random() * place.specs.length);
          // Modulate spec readings
          if (place.specs[specIdx].includes("Aadhaar") || place.specs[specIdx].includes("CCTV") || place.specs[specIdx].includes("intensity")) {
            return place;
          }
        }
        return place;
      }));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 h-[calc(100vh-120px)] overflow-y-auto pb-8 scrollbar-cyber animate-in fade-in duration-300">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between shrink-0 gap-4 p-5 rounded-2xl glass-card border border-white/5 relative overflow-hidden bg-gradient-to-r from-navy-950 via-navy-950/80 to-cyber-cyan/5">
          <div className="absolute top-0 right-0 h-32 w-32 bg-cyber-green/5 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green animate-pulse">
              <Compass size={20} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase font-mono font-bold text-cyber-green tracking-widest font-mono flex items-center gap-1">
                ● Lucknow Civic Landmarks <span className="h-1.5 w-1.5 rounded-full bg-cyber-green animate-ping" />
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Explore Smart Lucknow & Heritage</h2>
            </div>
          </div>
          <p className="text-[11px] text-white/50 max-w-md font-sans">
            Navigate through Lucknow&apos;s architectural marvels, newly developed smart extensions, mass transit lines, and IoT-driven ecological grid systems in real time.
          </p>
        </div>

        {/* Tourist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-1">
          {places.map((place, index) => (
            <div 
              key={index}
              className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-cyber-green/20 transition duration-300 shadow-lg"
            >
              {/* Background gradient orb */}
              <div className="absolute top-0 right-0 h-24 w-24 bg-cyber-green/5 blur-xl pointer-events-none" />
              
              {/* Image visual block with real Unsplash Visual Pipeline */}
              <div className="h-44 rounded-lg bg-navy-950/80 border border-white/5 flex flex-col items-center justify-center p-4 text-center text-xs relative overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={place.imgUrl} 
                  alt={place.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                />
                {/* Dark overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent pointer-events-none" />
                
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider bg-cyber-green/10 border border-cyber-green/20 text-cyber-green flex items-center gap-1 z-10">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyber-green animate-pulse" /> {place.status}
                </div>

                <div className="absolute top-3 right-3 text-[9px] font-mono text-cyber-cyan tracking-widest z-10 bg-navy-950/80 px-2 py-0.5 rounded border border-white/5">
                  {place.smartFeature}
                </div>
                
                <div className="mt-auto relative z-10 flex flex-col items-center">
                  <Trees className="text-cyber-green mb-1 animate-pulse" size={20} />
                  <span className="font-mono text-white text-sm font-bold uppercase tracking-wide">{place.name}</span>
                  <span className="text-[10px] text-white/50 mt-1 font-sans font-medium">{place.imgPlaceholder}</span>
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex flex-col gap-1 shrink-0">
                <span className="text-[9px] font-mono text-cyber-green uppercase font-bold tracking-wider">{place.category}</span>
                <h3 className="text-sm font-extrabold text-white tracking-wide mt-0.5">{place.name}</h3>
                <p className="text-xs text-white/70 font-sans leading-relaxed mt-1.5">
                  {place.desc[language] || place.desc['en']}
                </p>
              </div>

              {/* Connected Live News Segment */}
              {place.newsTitle && (
                <div className="p-3.5 rounded-lg bg-cyber-green/[0.02] border border-cyber-green/10 flex flex-col gap-1.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-cyber-green/5 blur-xl pointer-events-none" />
                  <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase font-bold text-cyber-green tracking-wider">
                    <Sparkle size={10} className="animate-spin text-cyber-green" /> Connected Live Update:
                  </div>
                  <h4 className="text-[11px] font-bold text-white tracking-wide leading-none">{place.newsTitle}</h4>
                  <p className="text-[10px] text-white/50 font-sans leading-relaxed">{place.newsSummary}</p>
                </div>
              )}

              {/* Specs pill list */}
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-white/5 shrink-0">
                {place.specs.map((spec, sIdx) => (
                  <span 
                    key={sIdx}
                    className="text-[9px] font-mono text-white/50 px-2.5 py-1 rounded bg-white/5 border border-white/10"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
