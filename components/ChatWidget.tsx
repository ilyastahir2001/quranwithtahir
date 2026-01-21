
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, X, Send, Phone, Mail, MessageSquare, 
  ShieldCheck, Clock, Bot, User, Sparkles, Loader2, 
  ChevronRight, ArrowRight, ExternalLink, Mic, MicOff, Volume2
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { BRAND } from '../constants';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "How do I start a free trial?",
  "What is the best way to learn Tajweed?",
  "Tell me about your female tutors.",
  "Which course is best for kids?"
];

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState<'AI' | 'CONTACT'>('AI');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatInstanceRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initial Greeting
    if (chatHistory.length === 0) {
      setChatHistory([{
        role: 'ai',
        text: `Assalamu Alaykum! I am the QWT Senior Academic AI. I can guide you through our scholarly tracks or answer Tajweed inquiries. How may I serve you today?`,
        timestamp: new Date()
      }]);
    }

    const timer = setTimeout(() => {
      if (!isOpen) setShowNotification(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const initializeChat = () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatInstanceRef.current = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are the Lead AI Academic Steward at QuranWithTahir.com. 
        Your persona is wise, extremely respectful (using Islamic greetings), and authoritative on Quranic education.
        - Encourage users to book the 3-day free trial.
        - Explain that we only hire the top 1% of faculty.
        - Pricing: Standard ($65/mo), Senior ($85/mo), Elite ($110/mo).
        - We have a dedicated Female Scholar Wing.
        - If the user is frustrated, tell them to switch to the 'Direct Support' tab to talk to Director Ilyas Tahir.`,
      }
    });
  };

  const toggleChat = () => {
    if (!isOpen && !chatInstanceRef.current) {
      initializeChat();
    }
    setIsOpen(!isOpen);
    setShowNotification(false);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      if (!chatInstanceRef.current) initializeChat();

      const result = await chatInstanceRef.current.sendMessageStream({ message: textToSend });
      
      let fullResponse = "";
      const aiMsg: ChatMessage = { role: 'ai', text: "", timestamp: new Date() };
      setChatHistory(prev => [...prev, aiMsg]);

      for await (const chunk of result) {
        fullResponse += chunk.text;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].text = fullResponse;
          return newHistory;
        });
      }
    } catch (err) {
      console.error("AI Chat Error:", err);
      setChatHistory(prev => [...prev, {
        role: 'ai',
        text: "I apologize, my scholarly archives are temporarily inaccessible. Please switch to the 'Direct Support' tab.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSendMessage(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleWhatsAppChat = () => {
    const url = `https://wa.me/${BRAND.phone.replace(/\+/g, '').replace(/\s/g, '')}?text=Assalamu Alaykum! I am looking for admission details at QuranWithTahir.com.`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[380px] md:w-[450px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 fade-in duration-300 h-[650px]">
          
          {/* Header */}
          <div className="bg-slate-950 p-8 text-white relative shrink-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Bot size={28} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tight">Lead AI Steward</h3>
                  <div className="flex items-center space-x-2 text-[9px] text-blue-400 font-black uppercase tracking-[0.2em]">
                    <ShieldCheck size={10} />
                    <span>Gemini 3 Pro Active</span>
                  </div>
                </div>
              </div>
              <button onClick={toggleChat} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-500">
                <X size={24} />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex mt-8 bg-white/5 p-1 rounded-2xl border border-white/10">
              <button 
                onClick={() => setActiveTab('AI')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'AI' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles size={12} />
                  <span>AI Scholar</span>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('CONTACT')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CONTACT' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <User size={12} />
                  <span>Direct Support</span>
                </div>
              </button>
            </div>
          </div>

          {/* BODY */}
          {activeTab === 'AI' ? (
            <div className="flex-grow flex flex-col overflow-hidden bg-slate-50/30">
              <div ref={scrollRef} className="flex-grow p-6 space-y-6 overflow-y-auto custom-scrollbar">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                    <div className={`flex items-start space-x-3 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${msg.role === 'user' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white border-slate-200 text-blue-600'}`}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-blue-900 text-white rounded-tr-none font-medium' 
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                      }`}>
                        {msg.text || <div className="flex gap-1 py-1"><div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce [animation-delay:0.4s]"></div></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-t border-slate-100 bg-white">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSendMessage(prompt)}
                    className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-slate-100 flex items-center space-x-4">
                <button 
                  onClick={startVoiceInput}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  title="Speak your question"
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isListening ? "Listening..." : "Ask the Scholar..."}
                  className="flex-grow bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
                />
                
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 bg-blue-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-950 transition-all shadow-xl active:scale-95 disabled:opacity-50 group"
                >
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            /* CONTACT BODY */
            <div className="flex-grow p-10 space-y-8 overflow-y-auto bg-slate-50/50 flex flex-col items-center">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center w-full relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-500"></div>
                 <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" className="w-24 h-24 rounded-full border-4 border-slate-50 mx-auto mb-6 object-cover shadow-lg group-hover:scale-105 transition-transform" alt="Director" />
                 <h4 className="text-blue-950 font-black text-xl">Ilyas Tahir</h4>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Director of Global Admissions</p>
                 <div className="mt-6 flex justify-center gap-4">
                    <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase">Live Now</div>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full">
                <button 
                  onClick={handleWhatsAppChat}
                  className="flex items-center space-x-5 p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] hover:bg-emerald-100 transition-all group"
                >
                  <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
                    <MessageCircle size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-emerald-950 font-black text-base uppercase tracking-tight">WhatsApp Office</p>
                    <p className="text-emerald-600 text-[10px] font-bold">Standard response: Under 5 mins</p>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = `tel:${BRAND.phone}`}
                  className="flex items-center space-x-5 p-6 bg-blue-50 border border-blue-100 rounded-[2rem] hover:bg-blue-100 transition-all group"
                >
                  <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    <Phone size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-blue-950 font-black text-base uppercase tracking-tight">Voice Support</p>
                    <p className="text-blue-600 text-[10px] font-bold">Priority International Line</p>
                  </div>
                </button>
              </div>

              <div className="mt-auto pt-8 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={12} className="text-blue-600" />
                    Encrypted Institutional Protocol
                 </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trigger Button */}
      <button 
        onClick={toggleChat}
        className={`relative p-6 rounded-[2rem] shadow-2xl transition-all transform hover:scale-110 active:scale-95 group overflow-hidden border-2
          ${isOpen ? 'bg-white text-slate-950 border-slate-100 rotate-90' : 'bg-slate-950 text-white border-white/5 animate-bounce'}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? <X size={32} className="relative z-10" /> : <MessageSquare size={36} className="relative z-10" />}
        
        {!isOpen && showNotification && (
          <span className="absolute top-2 right-2 flex h-6 w-6 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-2 border-slate-950 text-[10px] items-center justify-center font-black">1</span>
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
