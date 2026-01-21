
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  Sparkles, Send, Bot, User, 
  Loader2, X, Lightbulb, ExternalLink, 
  BookMarked, History, Globe, ScrollText, ChevronRight
} from 'lucide-react';

interface GroundingSource {
  title: string;
  uri: string;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
  sources?: GroundingSource[];
}

const SUGGESTED_INQUIRIES = [
  "Context of Surah Al-Kahf",
  "Modern fatwas on digital finance",
  "Benefits of Surah Ar-Rahman",
  "History of Quranic preservation"
];

const AiScholarHub: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "Assalamu Alaykum! I am your Lead AI Scholarly Assistant. I am equipped with real-time grounding to provide you with verified Quranic wisdom and academic context. How can I assist your studies today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', text: textToSend, timestamp: Date.now() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Map history for Gemini Chat API
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `You are the Elite AI Scholarly Assistant at QuranWithTahir.com. 
          You provide deep Tafseer, historical context, and spiritual guidance based on the Quran and authentic Sunnah.
          Maintain a deeply respectful, scholarly, and wise persona.
          Always use your search grounding to verify complex historical facts or modern scholarly opinions.
          If someone asks about a specific Surah, provide its linguistic beauty and primary themes.`,
        },
        history: history,
      });

      const response = await chat.sendMessage({ message: textToSend });

      // Extract Grounding Sources
      const sources: GroundingSource[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({
              title: chunk.web.title,
              uri: chunk.web.uri
            });
          }
        });
      }

      const aiMsg: Message = { 
        role: 'ai', 
        text: response.text || "I apologize, my link to the knowledge base was momentarily interrupted.", 
        timestamp: Date.now(),
        sources: sources.length > 0 ? sources : undefined
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Scholar Error:", error);
      const errMsg: Message = {
        role: 'ai',
        text: "I encountered a technical interruption while querying the archives. Please try rephrasing your request.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none unselectable">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between relative z-10 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg group">
            <Bot size={24} className="group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h3 className="text-white font-black text-lg tracking-tight uppercase">Elite AI Scholar</h3>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grounding Engine Active</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex items-start space-x-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-white/10 border-white/20 text-white' : 'bg-blue-600/20 border-blue-500/30 text-blue-400'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="space-y-3">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none font-medium shadow-xl' 
                  : 'bg-white/5 text-slate-300 border border-white/10 rounded-tl-none backdrop-blur-sm'
                }`}>
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} className={line.trim() === '' ? 'h-2' : 'mb-2 last:mb-0'}>{line}</p>
                  ))}
                </div>

                {/* Grounding Sources Panel */}
                {msg.sources && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center space-x-2 mb-3">
                      <ScrollText size={12} className="text-emerald-400" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Verified Scholarly Sources</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.sources.map((source, sIdx) => (
                        <a 
                          key={sIdx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                        >
                          <span className="text-[11px] text-slate-400 font-medium truncate pr-4">{source.title}</span>
                          <ExternalLink size={10} className="text-blue-400 group-hover:scale-110 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-2xl flex items-center space-x-3 border border-white/10 animate-pulse">
              <Loader2 size={16} className="animate-spin text-blue-500" />
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Consulting Academic Archives...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Input Pills */}
      <div className="px-6 pb-2 flex gap-2 overflow-x-auto scrollbar-hide relative z-10">
        {SUGGESTED_INQUIRIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 hover:bg-blue-600/20 hover:text-blue-400 transition-all flex items-center space-x-2"
          >
            <span>{q}</span>
            <ChevronRight size={12} />
          </button>
        ))}
      </div>

      {/* Input Console */}
      <div className="p-6 bg-white/5 border-t border-white/10 relative z-10 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex-grow relative group">
            <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for Tafseer, context, or history..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-all font-medium relative z-10"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 pointer-events-none opacity-50">
               <BookMarked size={16} className="text-blue-500" />
            </div>
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 active:scale-95 disabled:opacity-50 group shrink-0"
          >
            <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
        <div className="flex items-center justify-center mt-4 space-x-4 opacity-30">
          <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.3em]">Institutional Grade Data</p>
          <div className="h-px w-12 bg-white/10"></div>
          <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.3em]">Powered by Gemini 3</p>
        </div>
      </div>
    </div>
  );
};

export default AiScholarHub;
