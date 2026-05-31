import { create } from 'zustand';

export type Language = 'en' | 'hi' | 'aw' | 'hl';

interface TranslationDictionary {
  [key: string]: {
    [locale in Language]: string;
  };
}

export const translations: TranslationDictionary = {
  // Common Elements
  tagline: {
    en: "Autonomous AI Workflow Operating System for Indian Governance",
    hi: "भारतीय शासन के लिए स्वायत्त एआई कार्यप्रवाह ऑपरेटिंग सिस्टम",
    aw: "मुस्कुराइए, आप लखनऊ में हैं — सरकारी कामकाज का एआई सारथी",
    hl: "Indian Governance ka autonomous AI Workflow Operating System"
  },
  lucknowTag: {
    en: "Smile, you are in Lucknow",
    hi: "मुस्कुराइए, आप लखनऊ में हैं",
    aw: "मुस्कुराइयौ, आप लखनाउ मा हैं!",
    hl: "Muskuraiye, aap Lucknow mein hain"
  },
  home: { en: "Home", hi: "मुख्य पृष्ठ", aw: "घर", hl: "Home" },
  about: { en: "About", hi: "हमारे बारे में", aw: "परिचय", hl: "About Us" },
  chat: { en: "AI Chat", hi: "एआई वार्तालाप", aw: "एआई बात-चीत", hl: "AI Chat" },
  citizen: { en: "Citizen", hi: "नागरिक", aw: "जनता", hl: "Citizen Portal" },
  officer: { en: "Officer", hi: "अधिकारी", aw: "हाकिम", hl: "Officer Desk" },
  admin: { en: "Admin", hi: "प्रशासक", aw: "प्रधान", hl: "Admin Panel" },
  orchestration: { en: "Orchestration", hi: "संजाल प्रबंधन", aw: "कामकाज लेखा-जोखा", hl: "Live Graph" },
  analytics: { en: "Analytics", hi: "विश्लेषण", aw: "जांच-पड़ताल", hl: "Analytics" },
  notifications: { en: "Alerts", hi: "सूचनाएं", aw: "चेतावनी", hl: "Alerts" },
  settings: { en: "Settings", hi: "सेटिंग्स", aw: "बदलाव", hl: "Settings" },
  faq: { en: "FAQ & Help Center", hi: "सामान्य प्रश्न", aw: "मदद केंद्र", hl: "FAQ & Help" },
  complaints: { en: "Complaint Center", hi: "शिकायत केंद्र", aw: "शिकायत दर्ज करा", hl: "Complaint Center" },
  track: { en: "Track Complaint", hi: "शिकायत ट्रैकिंग", aw: "अर्ज़ी जांचा", hl: "Track Complaint" },
  contact: { en: "Contact Us", hi: "संपर्क करें", aw: "हाकिम संपर्क", hl: "Contact Us" },
  feedback: { en: "Feedback Desk", hi: "प्रतिक्रिया डेस्क", aw: "सुझाव केंद्र", hl: "Feedback" },
  news: { en: "Lucknow Updates", hi: "लखनऊ समाचार", aw: "लखनऊ हाल-चाल", hl: "Lucknow Updates" },
  feed: { en: "Community Feed", hi: "सामुदायिक मंच", aw: "चौपाल", hl: "Community Feed" },
  explore: { en: "Explore Lucknow", hi: "लखनऊ दर्शन", aw: "लखनऊ घूमा", hl: "Explore Lucknow" },
  emergency: { en: "Emergency Help", hi: "आपातकालीन सहायता", aw: "तुरंत मदद (112)", hl: "Emergency Help" },
  history: { en: "User Activity & Memory", hi: "नागरिक इतिहास", aw: "हमार खाता", hl: "Activity Memory" },
  propertyServices: { en: "Property Registry Desk", hi: "संपत्ति रजिस्ट्री डेस्क", aw: "खतौनी रजिस्ट्री", hl: "Property Services" },
  pensionServices: { en: "Pension Scheme Desk", hi: "पेंशन योजना डेस्क", aw: "पेंशन डेस्क", hl: "Pension Services" },
  docVerification: { en: "Document Verification", hi: "दस्तावेज़ सत्यापन", aw: "कागज़ जांच", hl: "Doc Verify" },
  groupMain: { en: "Main Core", hi: "मुख्य सेवाएं", aw: "मुख्य कामकाज", hl: "Main Menu" },
  howItWorks: { en: "How SarkarAI Works", hi: "सकरारएआई कैसे काम करता है", aw: "सरकारी इंजन कइसे चलत है", hl: "SarkarAI Kaise Kaam Karta Hai" },
  groupGovernance: { en: "AI Governance", hi: "एआई शासन", aw: "राज-काज", hl: "AI Governance" },
  groupSmartCity: { en: "Smart Lucknow", hi: "स्मार्ट लखनऊ", aw: "लखनऊ दर्शन", hl: "Smart Lucknow" },
  groupCitizen: { en: "Citizen Services", hi: "नागरिक सेवाएं", aw: "जन-सेवा", hl: "Citizen Services" },
  groupCommunity: { en: "Community & Help", hi: "समुदाय एवं सहायता", aw: "मदद चौपाल", hl: "Help & Community" },

  // Hero Section
  heroTitle: {
    en: "Next-Gen AI Orchestration for Uttar Pradesh Governance",
    hi: "उत्तर प्रदेश शासन के लिए अगली पीढ़ी का एआई संजाल प्रबंधन",
    aw: "लखनाउ प्रशासन का नवा अवतार — एआई चलावै सरकारी कारभार",
    hl: "UP Governance ke liye Next-Gen AI Orchestration Platform"
  },
  heroSubtitle: {
    en: "Transforming bureaucracy through multi-agent collaboration, real-time OCR document verification, automated rule validation, and instant language localization.",
    hi: "मल्टी-एजेंट सहयोग, रीयल-टाइम ओसीआर दस्तावेज़ सत्यापन, स्वचालित नियम सत्यापन और त्वरित भाषा स्थानीयकरण के माध्यम से नौकरशाही का आधुनिकीकरण।",
    aw: "कागज़ी पचड़ा ख़तम! एआई एजेंट करीहें सब सत्यापन, तुरंतै मिली मंजूरी, और आपन अवधी भाषा मा बात-चीत की सुविधा।",
    hl: "Bureaucracy ko modernize karein multi-agent collaboration, real-time OCR document check, and instant language options ke sath."
  },
  startSession: {
    en: "Enter Operating System",
    hi: "ऑपरेटिंग सिस्टम में प्रवेश करें",
    aw: "कामकाज शुरू करा जाए",
    hl: "System Mein Enter Karein"
  },
  viewGithub: {
    en: "View Blueprint",
    hi: "ब्लूप्रिंट देखें",
    aw: "नक़्शा देखा जाए",
    hl: "View Blueprint"
  },

  // Citizen Dashboard
  uploadDoc: { en: "Upload Document", hi: "दस्तावेज़ अपलोड करें", aw: "कागज़ जमा करा", hl: "Document Upload" },
  dragDrop: {
    en: "Drag & drop governance files (Aadhaar, PAN, Land Registry PDF)",
    hi: "सरकारी फाइलें खींचें और छोड़ें (आधार, पैन, भूमि पंजीकरण पीडीएफ)",
    aw: "कागज़ हियाँ घसीट कय लाओ या ब्राउज़ करा (आधार, पैन, खतौनी पीडीएफ)",
    hl: "Governance files drag & drop karein (Aadhaar, PAN, Registry PDF)"
  },
  myApplications: { en: "My Applications", hi: "मेरे आवेदन", aw: "हमार अर्ज़ी", hl: "My Applications" },
  trackingId: { en: "Tracking ID", hi: "ट्रैकिंग आईडी", aw: "पहचान संख्या", hl: "Tracking ID" },
  status: { en: "Status", hi: "स्थिति", aw: "हाल-चाल", hl: "Status" },
  downloadReport: { en: "Download Report", hi: "रिपोर्ट डाउनलोड करें", aw: "परचा डाऊनलोड करा", hl: "Report Download" },

  // Officer Dashboard
  assignedCases: { en: "Assigned Cases", hi: "आवंटित मामले", aw: "हमरे ज़िम्मे अर्ज़ी", hl: "Assigned Cases" },
  riskAnalysis: { en: "AI Risk Analysis", hi: "एआई जोखिम विश्लेषण", aw: "एआई गड़बड़ी जांच", hl: "AI Risk Analysis" },
  fraudScore: { en: "Fraud Score", hi: "धोखाधड़ी स्कोर", aw: "फर्जीवाड़ा ख़तरा", hl: "Fraud Score" },
  approve: { en: "Approve", hi: "स्वीकृत करें", aw: "मंजूरी द्या", hl: "Approve" },
  reject: { en: "Reject", hi: "अस्वीकृत करें", aw: "खारिज करा", hl: "Reject" },
  escalate: { en: "Escalate", hi: "उच्च अधिकारी को भेजें", aw: "बड़े हाकिम कय भेजा जाए", hl: "Escalate" },

  // AI Chat
  chatPlaceholder: {
    en: "Ask SarkarAI about your grievance or scheme eligibility...",
    hi: "अपनी शिकायत या योजना पात्रता के बारे में सरकारएआई से पूछें...",
    aw: "अर्ज़ी या सरकारी योजना कय बारे मा कुछौ पूछय का चाहत हौ? हियाँ लिखा...",
    hl: "Apni grievance ya scheme eligibility ke baare mein poochhein..."
  },
  voiceOrbActive: {
    en: "Listening... speak now",
    hi: "सुन रहा हूँ... अब बोलें",
    aw: "हम सुनत अही... बोला जाय",
    hl: "Listening... bolna shuru karein"
  },
  voiceOrbIdle: {
    en: "Click orb to speak",
    hi: "बोलने के लिए ओर्ब पर क्लिक करें",
    aw: "बोलय बरे गोला छुवा जाए",
    hl: "Speak karne ke liye orb click karein"
  }
};

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
  t: (key) => {
    const lang = get().language;
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    return key;
  }
}));
