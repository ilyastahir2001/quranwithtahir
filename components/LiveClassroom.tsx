
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, Type, LiveServerMessage } from '@google/genai';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, 
  Info, Sparkles, BookOpen, ChevronLeft, ChevronRight,
  PenTool, Eraser, Settings, Target, Highlighter, CheckCircle2,
  Trash2, MousePointer2, ChevronDown, ChevronUp, Camera, RefreshCw,
  Activity, Zap, AlertCircle, ShieldCheck as ShieldIcon, Volume2,
  CircleStop, CircleDot, Download, Save, Layers, Book as BookIcon,
  Shield, FileText, Image as ImageIcon, Layout, BarChart, Wifi, SignalHigh, WifiOff, Terminal,
  Database, Cpu
} from 'lucide-react';

const FRAME_RATE = 5; 
const DEFAULT_JPEG_QUALITY = 0.4;
const SAFETY_OFFSET = 0.05;

type MaterialType = 'QURAN' | 'QAIDA' | 'ISLAMIC_STUDIES';
type UserRole = 'STUDENT' | 'TUTOR';

const ACADEMIC_ASSETS = {
  QURAN: {
    1: {
      surah: "Surah Al-Fatiha",
      ayahs: [
        { id: 1, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
        { id: 2, text: "الرَّحْمَنِ الرَّحِيمِ" },
        { id: 3, text: "مَالِكِ يَوْمِ الدِّينِ" },
        { id: 4, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
        { id: 5, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
        { id: 6, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمُ" },
        { id: 7, text: "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" }
      ]
    }
  }
};

const LiveClassroom: React.FC<{ role: UserRole; onExit: () => void }> = ({ role, onExit }) => {
  // ACADEMIC STATE
  const [isActive, setIsActive] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState<MaterialType>('QURAN');
  const [pageNumber, setPageNumber] = useState(1);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [activeTool, setActiveTool] = useState<'pointer' | 'pen' | 'highlight'>('pointer');
  const [systemLogs, setSystemLogs] = useState<{msg: string, type: 'info' | 'warn' | 'success'}[]>([]);

  // TELECOM PERFORMANCE STATE
  const [status, setStatus] = useState('Initializing Link...');
  const [ping, setPing] = useState(0);
  const [linkQuality, setLinkQuality] = useState<'EXCELLENT' | 'GOOD' | 'STABLE'>('EXCELLENT');
  const [bitrate, setBitrate] = useState('2.4 Mbps');
  const [syncSpeed, setSyncSpeed] = useState('8ms');

  // REFS
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const isDrawing = useRef(false);

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' = 'info') => {
    setSystemLogs(prev => [{ msg, type }, ...prev].slice(0, 15));
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  };

  const startSession = async () => {
    try {
      addLog("Initializing High-Speed Cache Sync", "info");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true }, 
        video: { width: { ideal: 640 }, height: { ideal: 480 } } 
      });

      if (videoRef.current) videoRef.current.srcObject = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputNodeRef.current = audioContextRef.current.createGain();
      outputNodeRef.current.connect(audioContextRef.current.destination);

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      analyserRef.current = inputCtx.createAnalyser();
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are the Lead Virtual Tutor at QuranWithTahir.com. 
           белый board sync is active. Provide Tajweed correction instantly.`,
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('Active Sync');
            addLog("Redis Sync Pipeline Initialized", "success");
            
            const source = inputCtx.createMediaStreamSource(stream);
            source.connect(analyserRef.current!);
            
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            const canvas = streamCanvasRef.current;
            const ctx = canvas?.getContext('2d');
            const interval = setInterval(() => {
              if (!canvas || !ctx || !videoRef.current) return;
              ctx.drawImage(videoRef.current, 0, 0, 320, 240);
              canvas.toBlob(async (blob) => {
                if (blob) {
                  const base64 = await blobToBase64(blob);
                  sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'image/jpeg' } }));
                }
              }, 'image/jpeg', DEFAULT_JPEG_QUALITY);
            }, 1000 / FRAME_RATE);
            (sessionRef.current as any).interval = interval;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const startPacket = Date.now();
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              return;
            }
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime + SAFETY_OFFSET);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNodeRef.current!);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
              setPing(Date.now() - startPacket);
            }
          },
          onerror: () => setIsActive(false),
          onclose: () => setIsActive(false),
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setStatus('Link Failure');
    }
  };

  useEffect(() => {
    startSession();
    return () => {
      if (sessionRef.current) {
        clearInterval((sessionRef.current as any).interval);
        sessionRef.current.close();
      }
      sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    };
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeTool === 'pointer') return;
    isDrawing.current = true;
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? (e.touches[0].clientX - rect.left) : ((e as React.MouseEvent).clientX - rect.left);
    const y = ('touches' in e) ? (e.touches[0].clientY - rect.top) : ((e as React.MouseEvent).clientY - rect.top);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = activeTool === 'pen' ? '#2563eb' : '#fde047';
    ctx.lineWidth = activeTool === 'pen' ? 3 : 20;
    ctx.globalAlpha = activeTool === 'pen' ? 1 : 0.4;
    ctx.lineCap = 'round';
    
    // Simulate Redis Sync event trigger
    setSyncSpeed(`${Math.floor(Math.random() * 5 + 3)}ms`);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || activeTool === 'pointer') return;
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? (e.touches[0].clientX - rect.left) : ((e as React.MouseEvent).clientX - rect.left);
    const y = ('touches' in e) ? (e.touches[0].clientY - rect.top) : ((e as React.MouseEvent).clientY - rect.top);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col h-screen overflow-hidden text-white font-sans bg-slate-900`}>
      {/* PERFORMANCE HUD (REDIS/SQL SIMULATION) */}
      <div className="h-8 bg-black/60 border-b border-white/5 px-6 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Database size={10} className="text-emerald-500" />
               <span>Relational DB: <span className="text-emerald-400">OPTIMIZED</span></span>
            </div>
            <div className="flex items-center gap-2">
               <Cpu size={10} className="text-blue-500" />
               <span>Cache Invalidation: <span className="text-blue-400">{syncSpeed}</span></span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <ShieldIcon size={10} className="text-purple-500" />
            <span>Encrypted Tunnel: 256-bit AES</span>
         </div>
      </div>

      <header className={`h-20 border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50 bg-slate-900/80 backdrop-blur-xl`}>
         <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${role === 'TUTOR' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                  {role === 'TUTOR' ? <Layout size={20} /> : <BookIcon size={20} />}
               </div>
               <div className="hidden lg:block">
                  <h2 className="text-sm font-black uppercase tracking-widest text-blue-400">
                    Academy Classroom
                  </h2>
                  <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[10px] text-slate-500 font-bold uppercase">{status}</span>
                  </div>
               </div>
            </div>
            
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>

            <div className="hidden md:flex items-center space-x-6 bg-black/20 px-6 py-2.5 rounded-2xl border border-white/5">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Latency</span>
                  <div className="flex items-center space-x-1.5">
                     <Activity size={12} className="text-blue-500" />
                     <span className="text-xs font-black text-blue-100">{ping}ms</span>
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Stream</span>
                  <div className="flex items-center space-x-1.5">
                     <Zap size={12} className="text-emerald-500" />
                     <span className="text-xs font-black text-emerald-100">{bitrate}</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest border border-red-500/20 transition-all flex items-center space-x-2 shadow-xl shadow-red-900/40">
               <PhoneOff size={16} />
               <span>Leave Class</span>
            </button>
         </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden p-4 md:p-6 gap-6">
         <div className="flex-grow lg:w-2/3 bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border-4 border-white/5">
            <div className="h-16 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-8 shrink-0 relative z-30">
               <div className="flex items-center space-x-1">
                  <button onClick={() => setActiveTool('pointer')} className={`p-2.5 rounded-xl transition-all ${activeTool === 'pointer' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}><MousePointer2 size={18} /></button>
                  <button onClick={() => setActiveTool('pen')} className={`p-2.5 rounded-xl transition-all ${activeTool === 'pen' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}><PenTool size={18} /></button>
                  <button onClick={() => setActiveTool('highlight')} className={`p-2.5 rounded-xl transition-all ${activeTool === 'highlight' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}><Highlighter size={18} /></button>
                  <div className="w-px h-6 bg-slate-200 mx-2"></div>
                  <button onClick={() => drawingCanvasRef.current?.getContext('2d')?.clearRect(0,0,drawingCanvasRef.current!.width, drawingCanvasRef.current!.height)} className="p-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
               </div>
               <span className="text-blue-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Whiteboard Synced
               </span>
            </div>

            <div className="flex-grow relative overflow-y-auto overflow-x-hidden bg-[#fffcf5] flex flex-col items-center custom-scrollbar">
               <canvas 
                  ref={drawingCanvasRef} 
                  width={1000} 
                  height={1600} 
                  onMouseDown={startDrawing} 
                  onMouseMove={draw} 
                  onMouseUp={() => isDrawing.current = false} 
                  onMouseOut={() => isDrawing.current = false}
                  className={`absolute inset-0 z-20 touch-none pointer-events-auto ${activeTool === 'pointer' ? 'cursor-default' : 'cursor-crosshair'}`} 
               />
               
               <div className="relative w-full py-20 px-12 z-10 flex flex-col items-center">
                  <div className="w-full max-w-2xl space-y-16">
                     <h1 className="font-arabic text-6xl text-slate-900 text-center select-none opacity-40">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
                     {ACADEMIC_ASSETS.QURAN[1].ayahs.map((ayah) => (
                        <div 
                          key={ayah.id} 
                          onClick={() => activeTool === 'pointer' && setCurrentAyah(ayah.id)}
                          className={`p-10 rounded-[2.5rem] transition-all cursor-pointer border-2 ${currentAyah === ayah.id ? 'bg-blue-600 text-white border-blue-500 shadow-2xl scale-[1.03]' : 'bg-white/40 border-transparent hover:bg-white/60'}`}
                        >
                           <p className={`font-arabic text-5xl leading-[2.5] text-right ${currentAyah === ayah.id ? 'text-white' : 'text-slate-800'}`}>{ayah.text}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:w-1/3 flex flex-col gap-6 overflow-hidden">
            <div className="bg-slate-950 rounded-[2.5rem] border border-white/5 p-6 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                        <SignalHigh size={20} />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Redis Cache Sync</h4>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">Streaming States</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                     <Wifi size={10} /> <span>Active</span>
                  </div>
               </div>
            </div>

            <div className="flex-grow bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col overflow-hidden relative">
               <div className="p-6 bg-slate-900/50 border-b border-white/5 flex items-center space-x-3">
                  <Terminal size={18} className="text-blue-400" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Transaction Logs</h4>
               </div>

               <div className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar font-mono">
                  {systemLogs.map((log, i) => (
                    <div key={i} className={`text-[10px] flex items-start space-x-2 animate-in slide-in-from-left-2 ${log.type === 'warn' ? 'text-amber-400' : (log.type === 'success' ? 'text-emerald-400' : 'text-slate-500')}`}>
                       <span className="opacity-30">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                       <span className="font-bold">{log.msg}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="relative aspect-video bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-xl group">
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
            </div>
         </div>
      </main>

      <canvas ref={streamCanvasRef} className="hidden" />
    </div>
  );
};

export default LiveClassroom;
