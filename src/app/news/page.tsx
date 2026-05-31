'use client';
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguageStore } from '@/lib/store/language-store';
import { 
  Sparkles, 
  Newspaper, 
  MapPin, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Layers,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Flame,
  Building,
  Compass,
  ArrowUpRight,
  Info,
  CheckCircle2,
  ShieldCheck,
  Signal
} from 'lucide-react';

const BACKEND_URL = "http://127.0.0.1:8000";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  category: string; // Governance, Infrastructure, Smart City, Real Estate, Emergency & Safety, Tourism & Culture
  language?: string;
  tags?: string;
  created_at: string;
  source_name?: string;
  source_logo?: string;
  image_url?: string;
  article_url?: string;
  affected_areas?: string;
  importance_reason?: string;
  citizen_impact?: string;
}

interface SummaryData {
  ai_summary: string;
  citizen_impact: string;
  affected_areas: string;
  importance_reason: string;
}

interface AnalyticsData {
  trending_issues: Array<{ issue: string; count: number; trend: string; color: string }>;
  development_hotspots: Array<{ area: string; growth: string; active_projects: number }>;
  complaint_correlation: Array<{ category: string; news_hotspot: string; resolution_sla: string }>;
  growth_indicators: { metro_expansion: string; smart_irrigation: string; itcs_calibrated: string };
}

export default function SmartLucknowNews() {
  const { language, t } = useLanguageStore();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [officialUpdates, setOfficialUpdates] = useState<NewsArticle[]>([]);
  const [generalNews, setGeneralNews] = useState<NewsArticle[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const [summarizingId, setSummarizingId] = useState<number | null>(null);
  const [summaries, setSummaries] = useState<Record<number, SummaryData>>({});

  async function fetchNewsHub() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/smart-city/hub`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.lucknow_news || []);
        setOfficialUpdates(data.official_updates || []);
        setGeneralNews(data.general_news || []);
        setAnalytics(data.smart_city_analytics || null);
      }
    } catch (e) {
      // Fallback preseeded offline data
      setTimeout(() => {
        const fallbackNews: NewsArticle[] = [
          {
            id: 1,
            title: "LDA Hazratganj Pedestrianization & ITCS Alignment Approved",
            summary: "The Lucknow Development Authority (LDA) has approved a ₹45 Crore master plan to pedestrianize core parts of Hazratganj. The project will integrate smart sensor-driven Intelligent Traffic Control Systems (ITCS) to reroute traffic smoothly and reduce vehicle idling emissions by 40%.",
            category: "Smart City",
            source_name: "LDA Lucknow Official",
            source_logo: "🏛️ LDA",
            article_url: "https://www.ldalucknow.in/news/hazratganj-itcs",
            image_url: "https://images.unsplash.com/photo-1506501139174-099022df5260?auto=format&fit=crop&w=800&q=80",
            tags: "lda,hazratganj,itcs,smart_city",
            affected_areas: "Hazratganj, Chowk, Raj Bhavan Route",
            importance_reason: "It marks a historical shift towards clean, walkable spaces in Lucknow's central business district, backed by AI-driven transit rerouting.",
            citizen_impact: "Citizens will experience 35% less traffic delays and a cleaner walking environment around Hazratganj's heritage corridors.",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            title: "Lucknow Metro Phase 1B Extension to Charbagh & Vasant Kunj Cleared",
            summary: "The Uttar Pradesh Cabinet has cleared the detailed project report (DPR) for Lucknow Metro Phase 1B, extending connectivity from Charbagh Station to Vasant Kunj via Nawazganj. The ₹5,800 Crore project will benefit over 4.5 Lakh daily commuters.",
            category: "Infrastructure",
            source_name: "Times of India",
            source_logo: "📰 TOI",
            article_url: "https://timesofindia.indiatimes.com/city/lucknow/metro-phase-1b-cleared",
            image_url: "https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&w=800&q=80",
            tags: "metro,infrastructure,transit,charbagh",
            affected_areas: "Charbagh, Vasant Kunj, Nawazganj, Chowk",
            importance_reason: "This major metro expansion directly addresses Lucknow's growing west-side congestion, linking dense residential areas to the central rail hub.",
            citizen_impact: "Commute times from Vasant Kunj to Charbagh will drop from 55 minutes to just 18 minutes, with fully air-conditioned green transport.",
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            title: "UP Government Announces Electronic Vehicle Subsidies for Awadh Region",
            summary: "To combat municipal emissions, the UP State Government has launched a 15% road tax waiver and direct subsidies for commercial electric vehicles purchased in Lucknow, Kanpur, and Ayodhya regions.",
            category: "Governance",
            source_name: "Dainik Jagran",
            source_logo: "📰 JGR",
            article_url: "https://www.jagran.com/uttar-pradesh/lucknow-city-ev-subsidy",
            image_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
            tags: "governance,ev,subsidy,pollution",
            affected_areas: "Lucknow Municipal Limits, Alambagh, Gomti Nagar",
            importance_reason: "Direct financial incentives are being deployed to speed up green transition in municipal transport and public auto fleets.",
            citizen_impact: "Commercial drivers save up to ₹40,000 on EV registrations, and citizens gain cleaner air and lower sound levels.",
            created_at: new Date().toISOString()
          }
        ];
        setArticles(fallbackNews);
        setOfficialUpdates([fallbackNews[0]]);
        setGeneralNews([fallbackNews[1], fallbackNews[2]]);
        setAnalytics({
          trending_issues: [
            {"issue": "Hazratganj Traffic waiting times", "count": 35, "trend": "downward due to ITCS", "color": "cyber-cyan"},
            {"issue": "PWD road repair response", "count": 98, "trend": "stable under 48h SLA", "color": "cyber-green"},
            {"issue": "Gomti Nagar EV transition", "count": 120, "trend": "surging (+15% YoY)", "color": "cyber-purple"}
          ],
          development_hotspots: [
            {"area": "Gomti Nagar Extension", "growth": "12.4%", "active_projects": 3},
            {"area": "Hazratganj Core Hub", "growth": "5.8%", "active_projects": 2},
            {"area": "Vasant Kunj Corridor", "growth": "8.5%", "active_projects": 4}
          ],
          complaint_correlation: [
            {"category": "road_damage", "news_hotspot": "Hazratganj", "resolution_sla": "98.2%"},
            {"category": "water_leakage", "news_hotspot": "Gomti Nagar", "resolution_sla": "95.4%"}
          ],
          growth_indicators: {
            "metro_expansion": "Phase 1B Cleared by Cabinet",
            "smart_irrigation": "Active Solar Grids in Janeshwar Eco-Park",
            "itcs_calibrated": "35% delay drop registered in Hazratganj"
          }
        });
      }, 0);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 0);
    }
  }

  useEffect(() => {
    fetchNewsHub();
  }, []);

  const handleAiSummarize = async (articleId: number) => {
    setSummarizingId(articleId);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/smart-city/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: articleId,
          lang: language
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSummaries(prev => ({
          ...prev,
          [articleId]: {
            ai_summary: data.ai_summary,
            citizen_impact: data.citizen_impact,
            affected_areas: data.affected_areas,
            importance_reason: data.importance_reason
          }
        }));
      }
    } catch (err) {
      // Offline fallback summarization matrix matching ai_engine.py logic
      const fallbacks: Record<number, Record<string, SummaryData>> = {
        1: {
          aw: {
            ai_summary: "साहेब सुनो! तोहार लखनऊ मा नया स्मार्ट ट्रैफ़िक कैमरा लगाय जात अहै। अब सब चौराहों पर सेंसर कय मदद से जाम तुरंतै हट जाई, हज़रतगंज और गोमती नगर मा गाड़ी आराम से चलि सकिहै। पुलिस बाबू भी लाइव नज़र रखिहैं!",
            citizen_impact: "भैया! एसे तोहार बहुतै फायदा होई। हज़रतगंज कय गलियों मा घूमे मा आराम रही और तोहार समय बची, चाट मजे से खायो!",
            affected_areas: "Hazratganj, Chowk, Raj Bhavan Area",
            importance_reason: "साहेब! इ काम बहुतै ज़रूरी रहा काहे कि लखनऊ कय दिल हज़रतगंज कय प्रदूषण से बचावे मा बड़ा काम होई।"
          },
          hi: {
            ai_summary: "लखनऊ स्मार्ट सिटी के अंतर्गत एकीकृत यातायात नियंत्रण प्रणाली (ITCS) लागू की जा रही है। सेंसर-आधारित सिग्नलों से चौराहों पर लगने वाले जाम में ३५% तक की कमी आएगी। हज़रतगंज एवं चौक क्षेत्रों के नागरिकों को त्वरित राहत मिलेगी।",
            citizen_impact: "नागरिकों को सुगम मार्ग मिलेगा, यात्रा समय में ३५% की बचत होगी तथा ईंधन खपत में कमी आएगी।",
            affected_areas: "हज़रतगंज, चौक क्षेत्र, राजभवन मार्ग",
            importance_reason: "लखनऊ की हृदयस्थली में विहंगम स्मार्ट यातायात कॉरिडोर एवं पैदल पथ के एकीकरण हेतु विधिक पहल।"
          },
          hl: {
            ai_summary: "Smart Lucknow Updates: Integrated smart traffic system set up ho raha hai. Isse realtime sensor timings se traffic congestion automatic schedule and resolve ho jayega, direct PWD control room active.",
            citizen_impact: "Citizens ka transport smooth ho jayega and Hazratganj side clean air index maintain rahega.",
            affected_areas: "Hazratganj, Chowk Corridor",
            importance_reason: "SarkarAI high-speed ITCS planning is now approved to decrease peak traffic waiting index."
          },
          en: {
            ai_summary: "Lucknow Smart City installs sensor-based Intelligent Traffic Control Systems (ITCS) across major Hazratganj junctions, reducing congestion times by 35% via dynamic AI-scheduled signal timings.",
            citizen_impact: "Travelers will enjoy 35% shorter waiting queues and lower carbon monoxide levels in heritage markets.",
            affected_areas: "Hazratganj, Chowk Core, Raj Bhavan Corridor",
            importance_reason: "A significant step to pedestrianize Hazratganj core, reducing city vehicle congestion metrics."
          }
        },
        2: {
          aw: {
            ai_summary: "साहेब सुनो! तोहार लखनऊ मेट्रो कय नया मार्ग मंजूर होई गवा बा। अब चारबाग़ से बसंत कुंज कय दूरी चुटकी बजावत कटिहै, ४.५ लाख भैया लोगन कय आराम होई!",
            citizen_impact: "भैया! मेट्रो कय सवारी मा गर्मी नाहीं लागी, और ५५ मिनट कय सफ़र केवल १८ मिनट मा पूरा होई जाई, जय अवध!",
            affected_areas: "Charbagh, Chowk, Vasant Kunj",
            importance_reason: "साहेब! लखनऊ कय पश्चिमी हिस्से मा जाम से राहत खातिर मेट्रो रेल कय विस्तार अत्यंत आवश्यक रहा।"
          },
          hi: {
            ai_summary: "उत्तर प्रदेश कैबिनेट ने लखनऊ मेट्रो फेज 1B परियोजना (चारबाग़ से बसंत कुंज) को मंजूरी दे दी है। यह ₹5,800 करोड़ की लागत से बनेगा तथा दैनिक यात्रियों को पर्यावरण-अनुकूल यातायात सेवा प्रदान करेगा।",
            citizen_impact: "प्रतिदिन ४.५ लाख यात्रियों को तीव्र, सुरक्षित एवं वातानुकूलित यातायात की सुविधा मिलेगी।",
            affected_areas: "चारबाग़, बसंत कुंज, नवाजगंज, चौक",
            importance_reason: "मेट्रो गलियारे के विस्तार से शहर के सघन आबादी वाले पश्चिमी क्षेत्रों में यातायात दबाव कम होगा।"
          },
          hl: {
            ai_summary: "Lucknow Metro Phase 1B project approved from Charbagh to Vasant Kunj via Nawazganj. Cost of 5,800 Crores cleared, direct connectivity ready.",
            citizen_impact: "Massive drop in travel time from 55 min to 18 min for over 4.5 lakh daily users.",
            affected_areas: "Charbagh Railway Hub, Vasant Kunj Sector",
            importance_reason: "Cabinet clears mega funds to provide green mass transit in western suburban lines."
          },
          en: {
            ai_summary: "The Uttar Pradesh Cabinet has cleared the detailed project report (DPR) for Lucknow Metro Phase 1B, extending connectivity from Charbagh Station to Vasant Kunj via Nawazganj. The ₹5,800 Crore project will benefit over 4.5 Lakh daily commuters.",
            citizen_impact: "Enables fast, air-conditioned green transit, reducing Vasant Kunj commuting delays by 70%.",
            affected_areas: "Charbagh Station, Nawazganj, Vasant Kunj, Chowk",
            importance_reason: "A massive capital injection of ₹5,800 Crore to scale clean mass-transit corridors in West Lucknow."
          }
        }
      };

      const art = articles.find(a => a.id === articleId);
      const artFallback = fallbacks[articleId] || {
        aw: {
          ai_summary: "साहेब सुनो! तोहार लखनऊ मा ई बहुतै बढ़िया खबर अहै, विकास कय पहिया तेज़ी से घूम रहा बा!",
          citizen_impact: "लखनऊ वासियों कय जीवन मा एसे आराम आई और काम तुरंतै पूरा होई जाई!",
          affected_areas: art?.affected_areas || "Lucknow Municipal Limits",
          importance_reason: "विकास कय काम लखनऊ मा एआई कय निगरानी मा तेजी से पूरा होई।"
        },
        hi: {
          ai_summary: "प्रस्तुत समाचार का विधिक विश्लेषण पूर्ण हो चुका है। लखनऊ विकास प्राधिकरण द्वारा यह प्रशासनिक कदम जन-कल्याण में सहायक होगा।",
          citizen_impact: "समग्र विकास के परिणामस्वरूप नागरिक सुविधाओं एवं विधिक सेवाओं का लाभ त्वरित गति से प्राप्त होगा।",
          affected_areas: art?.affected_areas || "लखनऊ महानगरीय सीमा",
          importance_reason: "स्मार्ट सिटी मिशन के अंतर्गत लखनऊ प्रशासनिक ढांचे को सुदृढ़ करने हेतु नीतिगत सुधार।"
        },
        hl: {
          ai_summary: "SarkarAI Live Update: This development update has been classified successfully, direct citizen benefits registered.",
          citizen_impact: "High impact on local development and infrastructure growth parameters.",
          affected_areas: art?.affected_areas || "Lucknow Municipal Limits",
          importance_reason: "Administrative smart guidelines applied successfully to resolve local grievances."
        },
        en: {
          ai_summary: art?.summary || "Welcome to Smart Lucknow updates. This administrative announcement marks another major step forward in Lucknow's digital-first public infrastructure blueprint.",
          citizen_impact: art?.citizen_impact || "Standard SLA benefits applied for all residents in municipal zones.",
          affected_areas: art?.affected_areas || "Lucknow Municipal Limits",
          importance_reason: art?.importance_reason || "Ensures compliance with standard Smart City Lucknow blueprints."
        }
      };

      setSummaries(prev => ({
        ...prev,
        [articleId]: artFallback[language] || artFallback['en']
      }));
    } finally {
      setSummarizingId(null);
    }
  };

  const filteredArticles = articles.filter(art => 
    activeCategory === 'all' || art.category === activeCategory
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 h-[calc(100vh-120px)] overflow-y-auto pb-8 scrollbar-cyber animate-in fade-in duration-300">
        
        {/* Dynamic Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between shrink-0 gap-4 p-5 rounded-2xl glass-card border border-white/5 relative overflow-hidden bg-gradient-to-r from-navy-950 via-navy-950/80 to-cyber-cyan/5">
          <div className="absolute top-0 right-0 h-32 w-32 bg-cyber-cyan/5 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan animate-pulse">
              <Signal size={20} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase font-mono font-bold text-cyber-cyan tracking-widest font-mono flex items-center gap-1">
                ● Live Lucknow Newsroom <span className="h-1.5 w-1.5 rounded-full bg-cyber-green animate-ping" />
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Lucknow Live Intelligence Feed</h2>
            </div>
          </div>
          <p className="text-[11px] text-white/50 max-w-md font-sans">
            AI-Scraped real-time updates from Times of India, Dainik Jagran, Amar Ujala, Aaj Tak, Indian Express, and LDA. Dialect analysis & citizen impact generated on-the-fly.
          </p>
        </div>

        {/* Smart City Analytics Grid */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0">
            {/* Trending Issues */}
            <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-3 relative overflow-hidden bg-navy-950/40">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-white">
                <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-cyber-cyan" /> Trending City Issues</span>
                <span className="text-[9px] text-cyber-cyan bg-cyber-cyan/15 px-2 py-0.5 rounded">Live Telemetry</span>
              </div>
              <div className="flex flex-col gap-2.5 mt-2">
                {analytics.trending_issues.map((issue, idx) => (
                  <div key={idx} className="flex flex-col gap-1 text-[11px]">
                    <div className="flex justify-between items-center text-white/80">
                      <span className="font-sans font-medium">{issue.issue}</span>
                      <span className="font-mono font-bold">{issue.count} cases</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${
                          issue.color === 'cyber-cyan' ? 'from-cyber-cyan to-cyber-blue' :
                          issue.color === 'cyber-green' ? 'from-cyber-green to-emerald-500' :
                          'from-cyber-purple to-cyber-pink'
                        }`}
                        style={{ width: `${Math.min(100, issue.count * 1.5)}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-white/40 italic font-mono mt-0.5">{issue.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure Growth Hotspots */}
            <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-3 relative overflow-hidden bg-navy-950/40">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-white">
                <span className="flex items-center gap-1.5"><Building size={14} className="text-cyber-purple" /> Development Hotspots</span>
                <span className="text-[9px] text-cyber-purple bg-cyber-purple/15 px-2 py-0.5 rounded">LDA Registry</span>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                {analytics.development_hotspots.map((spot, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-cyber-purple" />
                      <div className="flex flex-col leading-none">
                        <span className="text-xs font-bold text-white">{spot.area}</span>
                        <span className="text-[9px] text-white/40 mt-1 font-mono">{spot.active_projects} active projects</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end leading-none">
                      <span className="text-xs font-mono font-bold text-cyber-green">{spot.growth}</span>
                      <span className="text-[8px] text-white/30 font-mono mt-1">Growth Index</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Governance Indicators */}
            <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-3 relative overflow-hidden bg-navy-950/40">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-white">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-cyber-green" /> Smart City Indicators</span>
                <span className="text-[9px] text-cyber-green bg-cyber-green/15 px-2 py-0.5 rounded">Consensus</span>
              </div>
              <div className="flex flex-col gap-2.5 mt-2 text-[11px] font-sans">
                <div className="flex justify-between items-start pb-2 border-b border-white/5">
                  <span className="text-white/60">Metro Transit expansion</span>
                  <span className="font-bold text-white text-right max-w-[180px]">{analytics.growth_indicators.metro_expansion}</span>
                </div>
                <div className="flex justify-between items-start pb-2 border-b border-white/5">
                  <span className="text-white/60">Smart Park solar irrigation</span>
                  <span className="font-bold text-cyber-green text-right">{analytics.growth_indicators.smart_irrigation}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-white/60">Hazratganj ITCS optimization</span>
                  <span className="font-bold text-cyber-cyan text-right">{analytics.growth_indicators.itcs_calibrated}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Category Tabs */}
        <div className="flex gap-2 shrink-0 overflow-x-auto pb-1 border-b border-white/5">
          {['all', 'Governance', 'Infrastructure', 'Smart City', 'Real Estate', 'Emergency & Safety', 'Tourism & Culture'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-3 py-1.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider cursor-pointer border transition duration-200 shrink-0
                ${activeCategory === cat 
                  ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan shadow-[0_0_12px_rgba(0,240,255,0.15)]' 
                  : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {cat === 'all' ? 'All Live updates' : cat}
            </button>
          ))}
        </div>

        {/* Live Official Announcements Banner */}
        {activeCategory === 'all' && officialUpdates.length > 0 && (
          <div className="flex flex-col gap-3 shrink-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyber-pink px-1">🏛️ Official Governance Announcements</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {officialUpdates.slice(0, 2).map((art) => {
                const hasSummary = !!summaries[art.id];
                return (
                  <div 
                    key={art.id}
                    className="glass-card p-5 rounded-xl border border-cyber-pink/20 bg-cyber-pink/[0.01] flex flex-col gap-4 relative overflow-hidden group hover:border-cyber-pink/40 transition duration-300"
                  >
                    {/* Floating badge */}
                    <div className="absolute top-0 right-0 h-24 w-24 bg-cyber-pink/5 blur-xl pointer-events-none" />
                    
                    <div className="flex justify-between items-center text-[9px] font-mono shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="uppercase font-bold tracking-widest text-cyber-pink bg-cyber-pink/10 px-2 py-0.5 rounded border border-cyber-pink/20">
                          {art.category}
                        </span>
                        <span className="text-white/60 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                          {art.source_logo && <span className="text-xs">{art.source_logo}</span>} {art.source_name || "Official Source"}
                        </span>
                      </div>
                      <span className="text-white/30 flex items-center gap-1">
                        <Calendar size={10} /> {new Date(art.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-sm font-extrabold text-white group-hover:text-cyber-pink transition tracking-wide leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed font-sans mt-0.5">
                        {art.summary}
                      </p>
                    </div>

                    {/* AI Summarized Dialect Tab */}
                    {hasSummary && (
                      <div className="p-4 rounded-lg bg-cyber-pink/5 border border-cyber-pink/20 flex flex-col gap-2 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase font-bold text-cyber-pink tracking-wider">
                          <Sparkles size={11} className="animate-bounce" /> Dialect Summarization ({language.toUpperCase()}):
                        </div>
                        <p className="text-xs text-white font-medium font-sans leading-relaxed">
                          {summaries[art.id].ai_summary}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[11px] font-sans">
                          <div className="flex flex-col gap-0.5 bg-white/5 p-2 rounded">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyber-cyan flex items-center gap-1">
                              <MapPin size={10} /> Affected Zone:
                            </span>
                            <span className="text-white/80 font-bold mt-0.5">{summaries[art.id].affected_areas}</span>
                          </div>
                          <div className="flex flex-col gap-0.5 bg-white/5 p-2 rounded">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyber-green flex items-center gap-1">
                              <CheckCircle2 size={10} /> Citizen Benefit:
                            </span>
                            <span className="text-white/85 font-medium mt-0.5 leading-snug">{summaries[art.id].citizen_impact}</span>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 p-2.5 rounded mt-1 text-[11px] font-sans flex flex-col gap-0.5">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyber-purple flex items-center gap-1">
                            <Info size={10} /> Why it matters:
                          </span>
                          <span className="text-white/70 italic mt-0.5 leading-relaxed">{summaries[art.id].importance_reason}</span>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-white/5 pt-3 flex justify-between items-center shrink-0">
                      <button
                        onClick={() => handleAiSummarize(art.id)}
                        disabled={summarizingId === art.id}
                        className="px-3.5 py-1.5 rounded bg-cyber-pink text-navy-950 font-bold font-mono text-[9px] tracking-wider uppercase hover:shadow-[0_0_12px_rgba(255,0,240,0.4)] hover:scale-[1.02] cursor-pointer flex items-center gap-1 transition-all duration-300"
                      >
                        {summarizingId === art.id ? (
                          <><Loader2 size={10} className="animate-spin" /> Analyzing...</>
                        ) : (
                          <><Sparkles size={10} /> Analyze Citizen Impact</>
                        )}
                      </button>
                      
                      {art.article_url && (
                        <a 
                          href={art.article_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyber-pink font-mono hover:text-white flex items-center gap-0.5 transition duration-200"
                        >
                          Read Official Notice <ArrowUpRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Live News Main Feed List */}
        <div className="flex flex-col gap-3 flex-1 pr-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyber-cyan px-1">📰 Live Aggregated Headlines & Dialect analysis</span>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-cyber-cyan" size={32} />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-8 rounded-xl border border-white/5 glass-card text-center text-white/40 text-xs">
              No articles registered under this category. Checking Live RSS sync grids...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredArticles.map((art) => {
                const hasSummary = !!summaries[art.id];
                return (
                  <div 
                    key={art.id}
                    className="glass-card p-5 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-cyber-cyan/20 transition duration-300"
                  >
                    {/* Visual Unsplash Background Overlay */}
                    {art.image_url && (
                      <div className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none group-hover:scale-105 transition-transform duration-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={art.image_url} 
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="absolute top-0 right-0 h-24 w-24 bg-cyber-cyan/5 blur-xl pointer-events-none" />
                    
                    <div className="flex justify-between items-center text-[9px] font-mono shrink-0 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="uppercase font-bold tracking-widest text-cyber-cyan bg-cyber-cyan/5 px-2 py-0.5 rounded border border-cyber-cyan/20">
                          {art.category}
                        </span>
                        <span className="text-white/60 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                          {art.source_logo && <span className="text-xs">{art.source_logo}</span>} {art.source_name || "News Source"}
                        </span>
                      </div>
                      <span className="text-white/30 flex items-center gap-1">
                        <Calendar size={10} /> {new Date(art.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 relative z-10">
                      <h3 className="text-sm font-extrabold text-white group-hover:text-cyber-cyan transition tracking-wide leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-white/60 leading-relaxed font-sans mt-0.5">
                        {art.summary}
                      </p>
                    </div>

                    {/* AI Summarized Dialect Tab */}
                    {hasSummary && (
                      <div className="p-4 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20 flex flex-col gap-2.5 animate-in zoom-in-95 duration-200 relative z-10">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase font-bold text-cyber-cyan tracking-wider">
                          <Sparkles size={11} className="animate-bounce" /> SarkarAI Dialect Summary ({language.toUpperCase()}):
                        </div>
                        <p className="text-xs text-white leading-relaxed font-medium font-sans">
                          {summaries[art.id].ai_summary}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[11px] font-sans">
                          <div className="flex flex-col gap-0.5 bg-navy-950 p-2 rounded border border-white/5">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyber-cyan flex items-center gap-1">
                              <MapPin size={10} /> Affected Zone:
                            </span>
                            <span className="text-white/80 font-bold mt-0.5">{summaries[art.id].affected_areas}</span>
                          </div>
                          <div className="flex flex-col gap-0.5 bg-navy-950 p-2 rounded border border-white/5">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyber-green flex items-center gap-1">
                              <CheckCircle2 size={10} /> Citizen Benefit:
                            </span>
                            <span className="text-white/85 font-medium mt-0.5 leading-snug">{summaries[art.id].citizen_impact}</span>
                          </div>
                        </div>
                        
                        <div className="bg-navy-950 p-2.5 rounded mt-1 text-[11px] font-sans flex flex-col gap-0.5 border border-white/5">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyber-purple flex items-center gap-1">
                            <Info size={10} /> Why it matters:
                          </span>
                          <span className="text-white/70 italic mt-0.5 leading-relaxed">{summaries[art.id].importance_reason}</span>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-white/5 pt-3 flex justify-between items-center shrink-0 relative z-10 mt-auto">
                      <button
                        onClick={() => handleAiSummarize(art.id)}
                        disabled={summarizingId === art.id}
                        className="px-3.5 py-1.5 rounded bg-cyber-cyan text-navy-950 font-bold font-mono text-[9px] tracking-wider uppercase hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] hover:scale-[1.02] cursor-pointer flex items-center gap-1 transition-all duration-300"
                      >
                        {summarizingId === art.id ? (
                          <><Loader2 size={10} className="animate-spin" /> Analyzing...</>
                        ) : (
                          <><Sparkles size={10} /> Analyze Citizen Impact</>
                        )}
                      </button>
                      
                      {art.article_url && (
                        <a 
                          href={art.article_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyber-cyan font-mono hover:text-white flex items-center gap-0.5 transition duration-200"
                        >
                          Read Article <ArrowUpRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
