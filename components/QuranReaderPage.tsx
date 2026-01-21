
import React, { useState } from 'react';
import { 
  Book, Maximize2, ExternalLink, ShieldCheck, Heart, Info, 
  Search, Play, ChevronRight, X, Sparkles, BookOpen, 
  Lightbulb, Zap, Info as InfoIcon, Layers
} from 'lucide-react';
import { BRAND } from '../constants';

interface TajweedRule {
  rule: string;
  definition: string;
  example: string;
  color: string;
}

interface AyahData {
  id: number;
  arabic: string;
  translation: string;
  rules: TajweedRule[];
}

const SAMPLE_SURAH: AyahData[] = [
  {
    id: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    rules: [
      { rule: "Lam of Majesty", definition: "The 'L' in Allah is pronounced thin here because it follows a Kasrah (Bi).", example: "بِسْمِ اللَّهِ", color: "text-blue-400" },
      { rule: "Lam Shamshiya", definition: "The 'Al' is merged into the 'Ra' because it is a Sun letter.", example: "الرَّحْمَنِ", color: "text-orange-400" }
    ]
  },
  {
    id: 2,
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "[All] praise is [due] to Allah, Lord of the worlds.",
    rules: [
      { rule: "Mad Arid Lissukun", definition: "An optional long vowel (2, 4, or 6 counts) at the end of a verse.", example: "الْعَالَمِينَ", color: "text-rose-400" },
      { rule: "Lam Qamariya", definition: "The 'Al' is pronounced clearly before the 'Ha'.", example: "الْحَمْدُ", color: "text-emerald-400" }
    ]
  },
  {
    id: 3,
    arabic: "الرَّحْمَنِ الرَّحِيمِ",
    translation: "The Entirely Merciful, the Especially Merciful.",
    rules: [
      { rule: "Ra Tafkheem", definition: "The 'Ra' is heavy because it has a Fatha.", example: "الرَّحْمَنِ", color: "text-amber-400" },
      { rule: "Mad Arid Lissukun", definition: "Temporary extension due to stopping at the end of the ayah.", example: "الرَّحِيمِ", color: "text-rose-400" }
    ]
  },
  {
    id: 7,
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِِّينَ",
    translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
    rules: [
      { rule: "Izhar Halqi", definition: "Noon Sakinah followed by 'Ain'. Pronounce the 'N' clearly without Ghunnah.", example: "أَنْعَمْتَ", color: "text-emerald-400" },
      { rule: "Mad Lazim Kalimi", definition: "Compulsory 6-count extension when a Mad letter is followed by a Shaddah.", example: "الضَّالِِّينَ", color: "text-purple-400" }
    ]
  }
];

const TajweedAnalysisModal: React.FC<{ ayah: AyahData; onClose: () => void }> = ({ ayah, onClose }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs">Ayah Analysis</h3>
            <p className="text-slate-400 text-[10px] font-bold">Rule Mapping Protocol</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="text-center space-y-4">
          <p className="font-arabic text-4xl text-white leading-loose" dir="rtl">{ayah.arabic}</p>
          <p className="text-slate-400 text-sm font-medium italic">"{ayah.translation}"</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Applied Rules</h4>
          <div className="grid grid-cols-1 gap-4">
            {ayah.rules.map((rule, idx) => (
              <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-black text-sm uppercase tracking-wider ${rule.color}`}>{rule.rule}</span>
                  <span className="font-arabic text-xl text-white/40 group-hover:text-white transition-colors">{rule.example}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{rule.definition}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start space-x-4">
          <InfoIcon className="text-emerald-500 shrink-0" size={20} />
          <p className="text-[11px] text-emerald-400/80 font-medium leading-relaxed uppercase tracking-wider">
            Academic Note: These rules are specific to the Hafs 'an 'Asim recitation style. Consult your tutor for variations in Qira'at.
          </p>
        </div>
      </div>

      <div className="p-8 bg-black/20 flex gap-4">
        <button className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
          <Play size={14} fill="currentColor" /> Play Recitation
        </button>
        <button className="flex-1 bg-white/5 text-white border border-white/10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
          Mark as Learned
        </button>
      </div>
    </div>
  </div>
);

const QuranReaderPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'STANDARD' | 'SMART'>('STANDARD');
  const [selectedAyah, setSelectedAyah] = useState<AyahData | null>(null);

  return (
    <div className="pt-24 min-h-screen bg-[#020617]">
      {/* Top Header Information */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-950 py-12 border-b border-white/5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <Book size={32} />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-4">
                <h1 className="text-3xl font-black text-white">Digital Mushaf</h1>
                <span className="font-arabic text-3xl text-emerald-400 leading-none">المصحف الرقمي</span>
              </div>
              <p className="text-blue-200 text-sm font-medium">Interactive Multi-Mode Learning Environment</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button 
              onClick={() => setViewMode('STANDARD')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'STANDARD' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Standard Mode
            </button>
            <button 
              onClick={() => setViewMode('SMART')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'SMART' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Smart Analysis
            </button>
          </div>
        </div>
      </section>

      {/* The Reader Container */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-10">
           <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 mb-4">
              <Sparkles size={12} />
              <span>{viewMode === 'SMART' ? 'Smart Tajweed Analysis Active' : 'Global Quranic Resource'}</span>
           </div>
           <span className="font-arabic text-4xl text-emerald-400/80 mb-2">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</span>
           <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        </div>
        
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white/5 min-h-[70vh] relative group p-8 md:p-16">
          {viewMode === 'STANDARD' ? (
            <iframe 
              src="quran-app/index.html" 
              className="w-full h-[80vh] border-none rounded-2xl"
              title="Online Quran Reader"
            >
              <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <Info size={64} className="text-blue-200 mb-6" />
                <h2 className="text-2xl font-black text-blue-900">External App View</h2>
                <p className="text-gray-500 max-w-md mt-4">Place your HTML reader in <code>/public/quran-app/</code> for full standard integration.</p>
              </div>
            </iframe>
          ) : (
            <div className="max-w-4xl mx-auto space-y-12">
               <div className="text-center mb-16">
                  <h2 className="text-3xl font-black text-blue-950 mb-2">Surah Al-Fatiha</h2>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Click any Ayah to view Tajweed Rules</p>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                  {SAMPLE_SURAH.map((ayah) => (
                    <div 
                      key={ayah.id}
                      onClick={() => setSelectedAyah(ayah)}
                      className="group p-8 md:p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-emerald-500 hover:bg-white hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-6 left-8 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 font-black text-xs border border-slate-100">
                        {ayah.id}
                      </div>
                      <div className="text-right space-y-6">
                        <p className="font-arabic text-4xl md:text-5xl text-slate-800 leading-[2.2] md:leading-[2.5] select-none group-hover:text-blue-900 transition-colors" dir="rtl">
                          {ayah.arabic}
                        </p>
                        <div className="flex justify-end gap-2">
                           {ayah.rules.map((r, i) => (
                             <span key={i} className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white border border-slate-100 ${r.color.replace('text', 'border')}`}>
                                {r.rule}
                             </span>
                           ))}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-20 p-12 bg-blue-900 rounded-[3rem] text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-10"><Layers size={200} /></div>
                  <h3 className="text-2xl font-black mb-4 relative z-10">Expand Your Academic Mastery</h3>
                  <p className="text-blue-200 mb-8 max-w-lg mx-auto font-medium relative z-10">Our full curriculum includes analysis for all 114 Surahs. Connect with a mentor to unlock the complete Smart Mushaf.</p>
                  <button className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all shadow-xl relative z-10">
                    Schedule Assessment
                  </button>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Reader Footer Advice */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 flex items-center space-x-4">
            <div className="bg-emerald-500/20 p-3 rounded-2xl"><Heart className="text-emerald-400" size={24} /></div>
            <div>
              <h4 className="text-white font-bold text-sm">Spiritual Focus</h4>
              <p className="text-blue-200 text-xs">A clean environment for focused Tilawat.</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 flex items-center space-x-4">
            <div className="bg-blue-500/20 p-3 rounded-2xl"><ShieldCheck className="text-blue-400" size={24} /></div>
            <div>
              <h4 className="text-white font-bold text-sm">Safe & Secure</h4>
              <p className="text-blue-200 text-xs">Ad-free reading experience for families.</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 flex items-center space-x-4">
            <div className="bg-purple-500/20 p-3 rounded-2xl"><BookOpen className="text-purple-400" size={24} /></div>
            <div>
              <h4 className="text-white font-bold text-sm">Academy Support</h4>
              <p className="text-blue-200 text-xs">Need help understanding? Book a tutor.</p>
            </div>
          </div>
        </div>
      </section>

      {selectedAyah && (
        <TajweedAnalysisModal 
          ayah={selectedAyah} 
          onClose={() => setSelectedAyah(null)} 
        />
      )}
    </div>
  );
};

export default QuranReaderPage;
