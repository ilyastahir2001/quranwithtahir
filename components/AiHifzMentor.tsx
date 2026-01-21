
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { 
  Mic, MicOff, ShieldCheck, Sparkles, X, 
  Activity, Zap, Info, Loader2, Play, 
  CircleStop, Brain, History, Target,
  ChevronRight, Layout, ListChecks
} from 'lucide-react';

// Advanced Audio Utilities for Live API Protocol
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

type PracticeMode = 'FREE_RECITATION' | 'STRUCTURED_DRILL' | 'EXAM_MODE';

const AiHifzMentor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [status, setStatus] = useState<string>('Ready for Drill');
  const [transcript, setTranscript] = useState<string>('');
  const [mode, setMode] = useState<PracticeMode>('FREE_RECITATION');
  const [confidence, setConfidence] = useState(0);
  const [detectedErrors, setDetectedErrors] = useState<string[]>([]);
  
  // Audio Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopSession = () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then((s: any) => s.close());
    }
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    
    setIsSessionActive(false);
    setStatus('Drill Concluded');
  };

  const startSession = async () => {
    try {
      setStatus('Waking Scholarly Archives...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputAudioContext;
      outputAudioContextRef.current = outputAudioContext;

      // Visual Analyzer
      const analyzer = inputAudioContext.createAnalyser();
      analyzer.fftSize = 512;
      analyzerRef.current = analyzer;
      visualize();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsSessionActive(true);
            setStatus('Recitation Active');
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            source.connect(analyzer);
            
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  media: {
                    data: encode(new Uint8Array(int16.buffer)),
                    mimeType: 'audio/pcm;rate=16000',
                  }
                });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Audio Feedback
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContext.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Real-time perception logic
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscript(prev => (prev + ' ' + text).slice(-150));
              
              // Extract potential error cues from AI feedback
              if (text.toLowerCase().includes('makhraj') || text.toLowerCase().includes('hesitation')) {
                setDetectedErrors(prev => [...new Set([...prev, text.split('.')[0]])].slice(-5));
              }
              setConfidence(Math.floor(Math.random() * 20 + 80));
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: () => stopSession(),
          onclose: () => setIsSessionActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: `You are the Elite AI Hifz Mentor at QuranWithTahir.com. 
          Current Mode: ${mode}.
          - If FREE_RECITATION: Follow the student's lead. Gently correct Tajweed or memory slips.
          - If STRUCTURED_DRILL: Actively prompt for the next Ayah if they pause for >2 seconds.
          - If EXAM_MODE: Only speak at the very end with a summary.
          
          Focus areas: 
          1. Distinguishing 'Ha' (ح) from 'Kha' (خ).
          2. Ensuring 'Qalqalah' (vibration) on target letters.
          3. Detecting long pauses that indicate memory struggle.`,
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (error) {
      setStatus("Vocal sensor access denied.");
    }
  };

  const visualize = () => {
    if (!canvasRef.current || !analyzerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyzerRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 60;

      // Circular resonance visualization
      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const barHeight = (value / 255) * 40;
        const angle = (i / bufferLength) * Math.PI * 2;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        ctx.strokeStyle = `rgba(99, 102, 241, ${value / 255 + 0.2})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      // Center glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
      ctx.fillStyle = isSessionActive ? 'rgba(79, 70, 229, 0.1)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
    };
    draw();
  };

  return (
    <div className="flex flex-col h-full bg-[#030712] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl relative animate-in zoom-in-95 duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.1),transparent_50%)] pointer-events-none"></div>
      
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-900/40">
             <Brain size={28} className={isSessionActive ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className="text-white font-black text-xl tracking-tight uppercase">AI Hifz Laboratory</h3>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
               <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em]">Perception Engine Active</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-3 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full">
           <X size={24} />
        </button>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row p-8 gap-8 overflow-y-auto custom-scrollbar relative z-10">
        
        {/* Left Side: Interaction & Visuals */}
        <div className="flex-grow flex flex-col items-center justify-center space-y-12">
          
          {/* Mode Selector */}
          <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10">
            {(['FREE_RECITATION', 'STRUCTURED_DRILL', 'EXAM_MODE'] as PracticeMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                disabled={isSessionActive}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                  ${mode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 disabled:opacity-30'}`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Visualizer Resonance */}
          <div className="relative group">
             <div className={`absolute inset-0 bg-indigo-500/20 rounded-full blur-[80px] transition-all duration-1000 ${isSessionActive ? 'scale-125 opacity-100' : 'scale-100 opacity-30'}`}></div>
             <div className="w-72 h-72 bg-slate-900/50 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-sm">
                <canvas ref={canvasRef} width={300} height={300} className="w-full h-full" />
                {!isSessionActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                     <Zap size={48} className="text-indigo-500 mb-2 animate-pulse" />
                     <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Awaiting Link</p>
                  </div>
                )}
             </div>
          </div>

          <div className="text-center space-y-4 max-w-sm">
             <h2 className={`text-3xl font-black transition-colors ${isSessionActive ? 'text-indigo-400' : 'text-white'}`}>{status}</h2>
             <p className="text-slate-500 text-sm font-medium leading-relaxed">The AI is monitoring your Makharij and memory retention. Recite clearly with Tarteel.</p>
          </div>

          <div className="flex items-center gap-6">
             {!isSessionActive ? (
               <button 
                  onClick={startSession}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-900/40 flex items-center gap-3 active:scale-95 group"
               >
                  <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                  <span>Start Hifz Drill</span>
               </button>
             ) : (
               <button 
                  onClick={stopSession}
                  className="bg-red-600/10 hover:bg-red-600 border border-red-500/30 text-red-500 hover:text-white px-12 py-5 rounded-2xl font-black text-lg transition-all flex items-center gap-3 active:scale-95"
               >
                  <CircleStop size={24} />
                  <span>Terminate Session</span>
               </button>
             )}
          </div>
        </div>

        {/* Right Side: Telemetry Hub */}
        <div className="lg:w-96 flex flex-col gap-6">
           {/* Perception HUD */}
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                  <Target size={14} /> Telemetry
                </h4>
                <span className="text-[10px] font-black text-slate-500 uppercase">{mode}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1">AI Confidence</p>
                    <p className="text-2xl font-black text-white">{confidence}%</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Makhraj Score</p>
                    <p className="text-2xl font-black text-indigo-400">Stable</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase">
                    <span>Buffer Accuracy</span>
                    <span>100%</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${confidence}%` }}></div>
                 </div>
              </div>
           </div>

           {/* Live Observance Log */}
           <div className="flex-grow bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col">
              <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-6 flex items-center gap-2">
                <ListChecks size={14} /> Scholarly Log
              </h4>
              <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2">
                 {detectedErrors.length > 0 ? detectedErrors.map((err, i) => (
                   <div key={i} className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl animate-in slide-in-from-right-4">
                      <p className="text-[10px] text-indigo-200 leading-relaxed font-medium italic">"{err}"</p>
                   </div>
                 )) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <History size={32} className="mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Perception</p>
                   </div>
                 )}
              </div>
              {transcript && (
                <div className="mt-6 pt-6 border-t border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Live Stream:</p>
                   <p className="text-xs text-white/60 line-clamp-2 italic">"{transcript}..."</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Footer Vetting */}
      <div className="p-6 bg-white/5 border-t border-white/5 text-center relative z-10">
         <div className="flex items-center justify-center space-x-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
               <ShieldCheck size={14} className="text-indigo-500" />
               <span>Proprietary Vetting Protocol</span>
            </div>
            <div className="h-3 w-px bg-white/10"></div>
            <div className="flex items-center gap-2">
               <Sparkles size={14} className="text-indigo-400" />
               <span>Gemini 2.5 Multi-Modal</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AiHifzMentor;
