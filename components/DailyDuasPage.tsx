
import React, { useState, useRef } from 'react';
import { 
  Heart, Sun, Moon, Coffee, ShieldCheck, 
  Sparkles, Search, Play, Copy, Download, Share2, 
  Info, Check, Book, MessageSquare, Briefcase, GraduationCap, Clock,
  Loader2, Square, ExternalLink
} from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';

interface Dua {
  id: string;
  intent: string;
  category: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  ageGroups: ('Kids' | 'Youth' | 'Adults' | 'Elderly')[];
}

const DUAS: Dua[] = [
  {
    id: '1',
    intent: 'Waking Up',
    category: 'Morning',
    arabic: 'الْحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdulillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur.',
    translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
    reference: 'Sahih Bukhari',
    ageGroups: ['Kids', 'Youth', 'Adults', 'Elderly']
  },
  {
    id: '2',
    intent: 'For Parents',
    category: 'Family',
    arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi irhamhuma kama rabbayani sagheera.',
    translation: 'My Lord, have mercy upon them as they brought me up [when I was] small.',
    reference: 'Surah Al-Isra 17:24',
    ageGroups: ['Kids', 'Youth', 'Adults']
  },
  {
    id: '3',
    intent: 'Seeking Knowledge',
    category: 'Education',
    arabic: 'رَّبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni \'ilma.',
    translation: 'My Lord, increase me in knowledge.',
    reference: 'Surah Taha 20:114',
    ageGroups: ['Kids', 'Youth']
  },
  {
    id: '4',
    intent: 'Removing Anxiety',
    category: 'Relief',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazani, wal-\'ajzi wal-kasali...',
    translation: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness...',
    reference: 'Sahih Bukhari',
    ageGroups: ['Youth', 'Adults', 'Elderly']
  },
  {
    id: '5',
    intent: 'For Protection',
    category: 'Protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahi-lladhi la yadurru ma\'asmihi shay\'un fil-ardi wala fis-sama...',
    translation: 'In the Name of Allah, Who with His Name nothing can cause harm in the earth nor in the heavens...',
    reference: 'Abu Dawud & Tirmidhi',
    ageGroups: ['Kids', 'Youth', 'Adults', 'Elderly']
  }
];

const DailyDuasPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'All' | 'Kids' | 'Adults'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const filteredDuas = DUAS.filter(dua => {
    const matchesMode = activeMode === 'All' || dua.ageGroups.includes(activeMode as any);
    const matchesSearch = dua.intent.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dua.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMode && matchesSearch;
  });

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setPlayingId(null);
  };

  const handlePlay = async (dua: Dua) => {
    if (playingId === dua.id) {
      stopAudio();
      return;
    }

    if (loadingId) return;

    try {
      setLoadingId(dua.id);
      stopAudio();

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ 
          parts: [{ 
            text: `Recite this Arabic Dua slowly and clearly with perfect Tajweed and correct pronunciation: ${dua.arabic}` 
          }] 
        }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("Audio generation failed");

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const audioBuffer = await decodeAudioData(
        decodeBase64(base64Audio),
        audioContextRef.current,
        24000,
        1
      );

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setPlayingId(null);
        sourceNodeRef.current = null;
      };

      sourceNodeRef.current = source;
      source.start();
      setPlayingId(dua.id);
    } catch (err) {
      console.error("Audio Playback Error:", err);
      alert("Unable to generate audio. Please try again later.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCopy = (dua: Dua) => {
    const text = `${dua.intent}\n\n${dua.arabic}\n\n${dua.translation}\n\nShared from QuranWithTahir.com`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (dua: Dua) => {
    const shareData = {
      title: `Daily Dua: ${dua.intent}`,
      text: `${dua.intent}\n\n${dua.arabic}\n\n${dua.translation}\n\nLearn more at QuranWithTahir.com`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying link
        navigator.clipboard.writeText(window.location.href);
        setSharedId(dua.id);
        setTimeout(() => setSharedId(null), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="pt-16 md:pt-24 min-h-screen bg-[#f8fafc]">
      {/* ELITE HERO - SEO Optimized */}
      <section className="bg-slate-950 py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-600 rounded-full blur-[80px] md:blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-emerald-500 rounded-full blur-[70px] md:blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-6 md:mb-8">
            <Heart size={14} className="text-rose-400" />
            <span className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">Spiritual Wellness Hub</span>
          </div>
          <h1 className="text-3xl md:text-7xl font-black text-white mb-4 md:mb-6 leading-[1.1] md:leading-[0.9] tracking-tighter">
            Daily <span className="text-emerald-400">Divine Whispers</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-8 md:mb-12">
            Authentic Masnoon Duas for every heartbeat. From the innocence of a child's first word to the wisdom of elders.
          </p>

          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
             {/* Mode Selector */}
             <div className="flex flex-wrap items-center justify-center p-1.5 md:p-2 bg-white/5 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/10 w-full sm:w-fit mx-auto gap-1">
                <button 
                   onClick={() => setActiveMode('All')}
                   className={`flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'All' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                   Family
                </button>
                <button 
                   onClick={() => setActiveMode('Kids')}
                   className={`flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'Kids' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                   Kids
                </button>
                <button 
                   onClick={() => setActiveMode('Adults')}
                   className={`flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'Adults' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                   Adults
                </button>
             </div>

             {/* Search */}
             <div className="relative group max-w-xl mx-auto w-full">
                <div className="absolute inset-0 bg-blue-600/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-1 md:p-2 flex items-center">
                   <Search className="ml-4 md:ml-6 text-slate-400 shrink-0" size={20} />
                   <input 
                      type="text" 
                      placeholder="Search for success, protection..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-grow bg-transparent border-none outline-none text-white px-3 md:px-6 py-3 md:py-4 font-bold placeholder:text-slate-500 text-sm md:text-lg"
                   />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC LISTING */}
      <section className="py-12 md:py-24 container mx-auto px-4 max-w-6xl">
        {/* Bismillah Header */}
        <div className="text-center mb-16 md:mb-24 animate-in fade-in duration-1000">
           <h2 className="font-arabic text-4xl md:text-6xl text-slate-400 leading-[1.6] select-none opacity-40 mb-2" dir="rtl">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
           </h2>
           <div className="w-24 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:gap-12">
          {filteredDuas.map((dua) => (
            <div key={dua.id} className="group bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col lg:flex-row gap-8 md:gap-12 relative overflow-hidden">
               {/* Aesthetic Side Ribbon */}
               <div className={`absolute top-0 left-0 w-1.5 md:w-2 h-full ${activeMode === 'Kids' ? 'bg-emerald-500' : 'bg-blue-600'} opacity-20`}></div>
               
               <div className="lg:w-2/5 flex flex-col">
                  <div className="flex items-center space-x-3 mb-4 md:mb-6">
                     <div className={`w-10 h-10 md:w-12 md:h-12 ${activeMode === 'Kids' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0`}>
                        {dua.category === 'Morning' ? <Sun size={20} /> : (dua.category === 'Family' ? <Heart size={20} /> : <Sparkles size={20} />)}
                     </div>
                     <div>
                        <h4 className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{dua.category}</h4>
                        <h3 className="text-xl md:text-3xl font-black text-blue-950">{dua.intent}</h3>
                     </div>
                  </div>
                  <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed mb-6 md:mb-8 italic">
                     "{dua.translation}"
                  </p>
                  
                  <div className="mt-auto flex flex-wrap gap-2 md:gap-3">
                     <button 
                        onClick={() => handleCopy(dua)} 
                        title="Copy Dua Text"
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-slate-50 px-4 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm group/btn"
                     >
                        {copiedId === dua.id ? <Check size={14}/> : <Copy size={14} className="group-hover/btn:scale-110 transition-transform" />}
                        <span>{copiedId === dua.id ? 'Copied' : 'Copy'}</span>
                     </button>
                     <button 
                        onClick={() => handleShare(dua)}
                        title="Share via Social Media"
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-slate-50 px-4 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group/btn"
                     >
                        {sharedId === dua.id ? <Check size={14}/> : <Share2 size={14} className="group-hover/btn:scale-110 transition-transform" />}
                        <span>{sharedId === dua.id ? 'Link Copied' : 'Share'}</span>
                     </button>
                     <button 
                        title="Download Image Card"
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-slate-50 px-4 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm group/btn"
                     >
                        <Download size={14} className="group-hover/btn:scale-110 transition-transform" />
                        <span>Save</span>
                     </button>
                  </div>
               </div>

               <div className="lg:w-3/5 bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 border border-slate-100 flex flex-col justify-center text-center lg:text-right space-y-6 md:space-y-10 group-hover:bg-slate-50/50 transition-colors relative">
                  <p className="font-arabic text-4xl md:text-6xl lg:text-7xl text-blue-900 leading-[2.2] md:leading-[2.5] lg:leading-[2.8] select-none break-words px-2" dir="rtl">
                     {dua.arabic}
                  </p>
                  <div className="space-y-3 md:space-y-4">
                     <div className="h-px w-16 md:w-24 bg-blue-100 mx-auto lg:ml-auto lg:mr-0"></div>
                     <p className="text-slate-400 text-xs md:text-sm font-medium italic leading-relaxed text-center lg:text-left opacity-60">
                        {dua.transliteration}
                     </p>
                     <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 text-center lg:text-left">
                        Source: {dua.reference}
                     </p>
                  </div>
                  
                  <button 
                    onClick={() => handlePlay(dua)}
                    disabled={loadingId !== null && loadingId !== dua.id}
                    className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:scale-110 transition-transform active:scale-95 group/play border border-slate-100 disabled:opacity-50"
                  >
                     {loadingId === dua.id ? (
                       <Loader2 size={24} className="animate-spin" />
                     ) : playingId === dua.id ? (
                       <Square size={24} fill="currentColor" />
                     ) : (
                       <Play size={24} fill="currentColor" className="group-hover/play:animate-pulse ml-1" />
                     )}
                  </button>
               </div>
            </div>
          ))}
        </div>

        {filteredDuas.length === 0 && (
          <div className="text-center py-24 md:py-40 bg-white rounded-[2rem] md:rounded-[4rem] border border-dashed border-slate-200 px-4">
            <h3 className="text-2xl md:text-3xl font-black text-blue-950 mb-3 md:mb-4">No results found</h3>
            <p className="text-slate-500 mb-8 md:mb-10 max-w-md mx-auto font-medium text-sm md:text-base">If you can't find a specific Dua, our faculty can provide it for you instantly.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveMode('All'); }}
              className="bg-blue-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-base shadow-xl hover:scale-105 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* SCHOLARLY CONTEXT - Trust Section */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100 overflow-hidden">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
               <div className="space-y-6 md:space-y-8">
                  <div className="inline-flex items-center space-x-3 bg-blue-50 text-blue-600 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                     <GraduationCap size={14} />
                     <span>The Ethics of Dua</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-blue-950 leading-tight">Master the Art of <span className="text-blue-600">Supplication</span></h2>
                  <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium italic">
                    "Dua is the core of worship. Our tutors don't just teach you the words; they teach you the presence of heart required for your prayers to reach the Heavens."
                  </p>
                  <div className="space-y-4 md:space-y-6">
                     {[
                       { title: "Makharij Correctness", desc: "Ensuring the Arabic letters are articulated precisely.", icon: <ShieldCheck size={18}/> },
                       { title: "Contextual Understanding", desc: "Learning why and when the Prophet (PBUH) said these words.", icon: <Book size={18}/> },
                       { title: "Spiritual Presence", desc: "Techniques to maintain focus (Khushu) during worship.", icon: <Clock size={18}/> }
                     ].map((item, i) => (
                       <div key={i} className="flex items-start space-x-3 md:space-x-4">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg md:rounded-xl shrink-0">{item.icon}</div>
                          <div>
                             <h4 className="text-blue-900 font-black text-sm">{item.title}</h4>
                             <p className="text-slate-400 text-xs font-medium">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="relative">
                  <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full"></div>
                  <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-center text-white relative z-10 shadow-2xl overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-5"><MessageSquare size={100} /></div>
                     <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl">
                        <Play size={32} fill="currentColor" />
                     </div>
                     <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6">Live Pronunciation Clinic</h3>
                     <p className="text-blue-200 text-sm md:text-base mb-8 md:mb-10 leading-relaxed font-medium opacity-80">
                        Join our expert tutors in a live class to perfect your daily Adhkar and Duas. Incorrect pronunciation can change meaning—ensure your worship is accurate.
                     </p>
                     <button className="w-full bg-white text-blue-900 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:scale-105 transition-all shadow-xl">
                        Start Free Trial
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default DailyDuasPage;
