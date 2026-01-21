
import React, { useState } from 'react';
import { 
  Plus, Minus, Search, HelpCircle, 
  ChevronDown, MessageSquare, Bot, 
  ShieldCheck, Zap, BookOpen, UserCheck, CreditCard 
} from 'lucide-react';
import { NavPage } from '../types';
import { BRAND } from '../constants';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    category: "Admissions",
    q: "How does the 3-day free trial work?",
    a: "Our free trial is a zero-obligation period where you can experience our teaching methodology. You will be matched with a tutor based on your goals, have 3 live sessions, and receive an initial assessment. No credit card is required to start."
  },
  {
    category: "Admissions",
    q: "Are there any age restrictions for students?",
    a: "We welcome students from age 4 to adulthood. For younger children, we use specialized Montessori-style digital tools to keep them engaged with the Noorani Qaida."
  },
  {
    category: "Curriculum",
    q: "Can I choose my own schedule?",
    a: "Yes. Our platform operates 24/7. You can select your preferred days and times during enrollment. We have tutors available in all global timezones (UK, USA, Australia, etc.)."
  },
  {
    category: "Curriculum",
    q: "How long does it take to complete the Noorani Qaida?",
    a: "On average, a consistent student completes the Qaida in 3-5 months. However, our tutors prioritize 'Itqan' (perfection) over speed to ensure the foundation of Tajweed is unshakable."
  },
  {
    category: "Technology",
    q: "What equipment do I need for the live classes?",
    a: "A stable internet connection and a device with a camera and microphone (Laptop, Tablet, or Smartphone) are all you need. Our proprietary classroom runs directly in your browser—no software installation required."
  },
  {
    category: "Faculty",
    q: "Are there female tutors available for sisters?",
    a: "Absolutely. We have a dedicated wing of Ijazah-holding female scholars (Ustadhas) specifically for sisters and young children."
  },
  {
    category: "Faculty",
    q: "How do you vet your tutors?",
    a: "Our vetting process is rigorous: we verify Ijazahs from reputable institutions like Al-Azhar, conduct background checks, and evaluate pedagogical skills. Only the top 1% of applicants are accepted."
  },
  {
    category: "Pricing",
    q: "What payment methods are supported?",
    a: "We accept all major credit/debit cards via our secure encrypted gateway. PayPal and direct bank transfers are also available for certain regions. You will receive an official invoice for every payment."
  }
];

const CATEGORIES = ["All", "Admissions", "Curriculum", "Faculty", "Technology", "Pricing"];

const FaqAccordion: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`group border-b border-slate-100 transition-all duration-300 ${isOpen ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
      >
        <span className={`text-lg md:text-xl font-black transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-800'}`}>
          {item.q}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 md:px-8 pb-8">
           <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
             {item.a}
           </p>
           <div className="mt-6 flex items-center space-x-2 text-[10px] font-black uppercase text-blue-400 tracking-widest">
              <ShieldCheck size={12} />
              <span>Verified Institutional Answer</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const FaqPage: React.FC<{ onNavigate: (page: NavPage) => void }> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 min-h-screen bg-[#f8fafc] pb-24">
      {/* Dynamic Header */}
      <section className="bg-slate-950 py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 unselectable pointer-events-none">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-600/10 text-blue-400 px-4 py-2 rounded-full border border-blue-600/20 mb-8">
            <HelpCircle size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Knowledge Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Transparent Answers for <br /> <span className="text-emerald-500">Your Spiritual Success.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Everything you need to know about our elite digital methodology, faculty vetting, and global classroom protocols.
          </p>
        </div>
      </section>

      {/* SEARCH & FILTERS */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-6 md:p-10 flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-full lg:w-1/3 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search keywords (e.g. Schedule, Price)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-blue-900 shadow-inner"
            />
          </div>
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap
                  ${activeCategory === cat 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-900/20' 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-blue-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="bg-white rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, idx) => (
              <FaqAccordion key={idx} item={item} />
            ))
          ) : (
            <div className="p-20 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-slate-300" />
               </div>
               <h3 className="text-xl font-black text-slate-800 mb-2">No matching results</h3>
               <p className="text-slate-400 font-medium">Try different keywords or switch categories.</p>
            </div>
          )}
        </div>

        {/* AI HANDOFF CTA */}
        <div className="mt-16 bg-slate-950 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
           <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl group-hover:scale-110 transition-transform">
                 <Bot size={32} />
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                Can't find your <span className="text-blue-400">specific query?</span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto font-medium">
                Our Senior AI Steward is trained on our entire academic library and can provide instant specialized answers.
              </p>
              <button 
                onClick={() => onNavigate(NavPage.CONTACT)}
                className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mx-auto"
              >
                <MessageSquare size={18} className="text-blue-600" />
                <span>Ask the Academic Bot</span>
              </button>
           </div>
        </div>
      </section>

      {/* TRUST ELEMENTS */}
      <section className="container mx-auto px-4">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="text-emerald-500" />, title: "Full Privacy", desc: "Your inquiries and personal data are strictly encrypted." },
              { icon: <Zap className="text-blue-500" />, title: "Live Updates", desc: "Class protocols updated weekly based on Dean's office." },
              { icon: <UserCheck className="text-purple-500" />, title: "Human Backup", desc: "Direct access to Director Ilyas Tahir for urgent matters." }
            ].map((box, i) => (
              <div key={i} className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center group hover:bg-white transition-all">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">{box.icon}</div>
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">{box.title}</h4>
                 <p className="text-slate-400 text-xs font-medium leading-relaxed">{box.desc}</p>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default FaqPage;
