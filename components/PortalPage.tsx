
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, BookOpen, CheckCircle2, Clock, 
  ArrowRight, ShieldCheck, Wallet, Receipt,
  PlayCircle, Lock, Star, CreditCard,
  AlertCircle, ChevronRight, Activity, TrendingUp, Settings, LogOut,
  Globe, Layout, DollarSign, CalendarDays, Award,
  Eye, Briefcase, GraduationCap, Heart, SearchCheck,
  ClipboardCheck, BarChart3, Mail, Phone, Shield, Sparkle, Gift, Copy, Check, Loader2, Sparkles, MessageSquareCode, Mic2,
  Calendar, Home, Book, FileText, Bell, Zap, Volume2, PlusCircle, Baby, Brain
} from 'lucide-react';
import { BRAND } from '../constants';
import { NavPage, RegistryUser, UserRole } from '../types';
import AiScholarHub from './AiScholarHub';
import AiHifzMentor from './AiHifzMentor';
import AiPronunciationLab from './AiPronunciationLab';
import PaymentGateway from './PaymentGateway';

interface PortalPageProps {
  onNavigate: (page: NavPage) => void;
  onLaunchClass: (role: 'STUDENT' | 'TUTOR') => void;
  registry: RegistryUser[];
  onSocialLogin?: (data: any) => void;
  onBuyClass?: (id: string) => void;
  isSubmitting?: boolean;
}

const PortalPage: React.FC<PortalPageProps> = ({ onNavigate, onLaunchClass, registry, onSocialLogin, onBuyClass, isSubmitting }) => {
  const [loginMethod, setLoginMethod] = useState<'ID' | 'EMAIL'>('EMAIL');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [currentUser, setCurrentUser] = useState<RegistryUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idCopied, setIdCopied] = useState(false);
  const [activeAiView, setActiveAiView] = useState<'SCHOLAR' | 'HIFZ' | 'LAB' | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FAMILY' | 'SYLLABUS' | 'SCHEDULE' | 'BILLING'>('OVERVIEW');
  const [showPayment, setShowPayment] = useState(false);

  // Relational Logic: Finding linked students for a Guardian
  const familyMembers = useMemo(() => {
    if (!currentUser || currentUser.role !== 'GUARDIAN') return [];
    return registry.filter(u => u.guardianId === currentUser.academyId);
  }, [currentUser, registry]);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let user: RegistryUser | undefined;
    if (loginMethod === 'ID') {
      user = registry.find(u => u.academyId.toUpperCase() === identifier.trim().toUpperCase());
    } else {
      user = registry.find(u => u.email.toLowerCase() === identifier.toLowerCase() && u.password === password);
    }
    if (!user) { setError("The credentials entered were not recognized."); return; }
    
    // Simulate complex profile hydration
    setCurrentUser({
      ...user,
      streakCount: user.streakCount || 12,
      points: user.points || 1450,
      progressPercent: user.progressPercent || 35,
      rank: user.rank || 'QARI',
      avgPronunciationScore: user.avgPronunciationScore || 88
    });
    setIsLogged(true);
  };

  const handlePaymentSuccess = (txHash: string) => {
    if (currentUser) {
       onBuyClass?.(currentUser.academyId);
       setCurrentUser(prev => prev ? { ...prev, hasPaid: true } : null);
       setShowPayment(false);
    }
  };

  const renderGuardianView = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                 <Users size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Learners</span>
           </div>
           <p className="text-4xl font-black text-slate-900">{familyMembers.length}</p>
           <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Linked to your account</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <TrendingUp size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Family Avg. Score</span>
           </div>
           <p className="text-4xl font-black text-slate-900">92%</p>
           <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">Top 5% Globally</p>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
           <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                 <CalendarDays size={24} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest opacity-60">Next Family Session</p>
              <p className="text-xl font-black mt-1">Today @ 4:30 PM</p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">Family Learning Wing</h3>
           <button className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
              <PlusCircle size={16} /> Add Student Profile
           </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {familyMembers.length > 0 ? familyMembers.map((student, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg hover:shadow-xl transition-all group flex flex-col md:flex-row gap-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
               <div className="shrink-0 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-[2rem] border-4 border-slate-50 overflow-hidden shadow-md mb-4 bg-slate-100">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} className="w-full h-full object-cover" alt="Student" />
                  </div>
                  <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
               </div>
               <div className="flex-grow space-y-4">
                  <div>
                    <h4 className="text-2xl font-black text-slate-950 tracking-tight">{student.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{student.course}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Progress</p>
                        <p className="text-base font-black text-slate-900">{student.progressPercent || 0}%</p>
                     </div>
                     <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-[8px] font-black text-emerald-600 uppercase">AI Score</p>
                        <p className="text-base font-black text-emerald-700">{student.avgPronunciationScore || 0}%</p>
                     </div>
                  </div>
                  <button onClick={() => onLaunchClass('STUDENT')} className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-95">
                     <PlayCircle size={18} /> Launch Session
                  </button>
               </div>
            </div>
          )) : (
            <div className="lg:col-span-2 py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-6">
               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-slate-300 shadow-inner">
                  <Baby size={40} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900">No Student Profiles Linked</h4>
                  <p className="text-slate-500 text-sm font-medium">Link your child's Academy ID to your Guardian account for relational oversight.</p>
               </div>
               <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95">Link Existing ID</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDashboardContent = () => {
    if (!currentUser) return null;
    if (activeAiView === 'SCHOLAR') return <AiScholarHub onClose={() => setActiveAiView(null)} />;
    if (activeAiView === 'HIFZ') return <AiHifzMentor onClose={() => setActiveAiView(null)} />;
    if (activeAiView === 'LAB') return <AiPronunciationLab onClose={() => setActiveAiView(null)} userName={currentUser.name} />;

    if (currentUser.role === 'GUARDIAN' && activeTab === 'OVERVIEW') return renderGuardianView();

    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                   <TrendingUp size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recitation Streak</span>
             </div>
             <p className="text-3xl font-black text-slate-900">{currentUser.streakCount} Days</p>
             <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                <CheckCircle2 size={12} /> <span>Daily Goal Met</span>
             </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                   <Zap size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Score</span>
             </div>
             <p className="text-3xl font-black text-slate-900">{currentUser.avgPronunciationScore}%</p>
             <p className="text-[10px] font-bold text-slate-400 mt-1">Linguistic Precision Rating</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                   <Award size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academy Rank</span>
             </div>
             <p className="text-2xl font-black text-slate-900">{currentUser.rank}</p>
             <p className="text-[10px] font-bold text-slate-400 mt-1">Verified Ijazah Path</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden group cursor-pointer" onClick={() => onLaunchClass('STUDENT')}>
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
             <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                   <PlayCircle size={20} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60">Next Class</p>
                <p className="text-lg font-black mt-1">In 45 Minutes</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                   <span>Launch Classroom</span> <ArrowRight size={12} />
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
                 <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] rotate-12">
                    <BookOpen size={200} />
                 </div>
                 <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 bg-blue-50 rounded-[2.5rem] flex items-center justify-center shadow-inner border border-blue-100 rotate-3">
                       <GraduationCap size={64} className="text-blue-600" />
                    </div>
                    <div className="text-center md:text-left flex-grow">
                       <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back, {currentUser.name.split(' ')[0]}</h3>
                       <p className="text-slate-500 font-medium max-w-md">Your personalized dashboard is synced with the Global Faculty Office.</p>
                       <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                          <button onClick={() => onLaunchClass('STUDENT')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-3">
                             <PlayCircle size={20} />
                             <span>Enter Classroom</span>
                          </button>
                          <button onClick={() => onNavigate(NavPage.READ_QURAN)} className="bg-slate-100 text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-3">
                             <Book size={20} />
                             <span>Digital Mushaf</span>
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {!currentUser.hasPaid ? (
                 <div className="bg-gradient-to-br from-indigo-900 to-slate-950 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                          <Gift size={32} className="text-emerald-400 animate-bounce" />
                       </div>
                       <div className="text-left">
                          <h4 className="text-xl font-black tracking-tight">Unlock Your Admission Token</h4>
                          <p className="text-slate-400 text-sm font-medium">Secure your permanent ID for life-long password-free access.</p>
                       </div>
                    </div>
                    <button onClick={() => setShowPayment(true)} disabled={isSubmitting} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl active:scale-95 flex items-center gap-2 relative z-10 whitespace-nowrap">
                       {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                       <span>Claim Admission ID</span>
                    </button>
                 </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                         <ShieldCheck size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Verified Admission Token</p>
                         <p className="text-lg font-black text-slate-900 tracking-tighter">{currentUser.academyId}</p>
                      </div>
                   </div>
                   <button onClick={() => { navigator.clipboard.writeText(currentUser.academyId); setIdCopied(true); setTimeout(() => setIdCopied(false), 2000); }} className="p-3 bg-white border border-emerald-100 rounded-xl text-emerald-600 hover:bg-emerald-100 transition-all">
                      {idCopied ? <Check size={18} /> : <Copy size={18} />}
                   </button>
                </div>
              )}
           </div>

           <div className="space-y-6">
              <div onClick={() => setActiveAiView('LAB')} className="bg-slate-950 p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl group cursor-pointer hover:border-emerald-500/40 transition-all relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                       <BarChart3 size={24} />
                    </div>
                    <h5 className="text-xl font-black text-white mb-2">Mastery Lab 4.0</h5>
                    <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">Real-time AI pronunciation analysis and acoustic scoring.</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                       <span>Open Pro Lab</span> <Zap size={12} fill="currentColor" />
                    </div>
                 </div>
              </div>

              <div onClick={() => setActiveAiView('HIFZ')} className="bg-indigo-950 p-8 rounded-[2.5rem] border border-indigo-500/20 shadow-2xl group cursor-pointer hover:border-indigo-500/40 transition-all relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
                       <Brain size={24} />
                    </div>
                    <h5 className="text-xl font-black text-white mb-2">AI Hifz Mentor</h5>
                    <p className="text-indigo-200 text-sm font-medium mb-6 leading-relaxed">Structured memorization drills with real-time feedback.</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                       <span>Initialize Drill</span> <Mic2 size={12} />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {showPayment && (
          <PaymentGateway 
            isOpen={showPayment} 
            onClose={() => setShowPayment(false)} 
            onSuccess={handlePaymentSuccess}
            amount={65}
            tier="Standard"
          />
        )}
      </div>
    );
  };

  return (
    <div className="pt-24 min-h-screen bg-[#f8fafc] pb-24 overflow-hidden">
      {!isLogged ? (
        <div className="container mx-auto px-4 max-w-xl animate-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden p-12 md:p-16 text-center relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-emerald-500"></div>
              <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-white shadow-2xl rotate-3">
                 <Lock size={32} />
              </div>
              <h2 className="text-3xl font-black text-blue-950 mb-1 tracking-tighter uppercase">Academy Portal</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Institutional Access Terminal</p>
              <div className="flex p-1 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                <button onClick={() => setLoginMethod('EMAIL')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === 'EMAIL' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Email Login</button>
                <button onClick={() => setLoginMethod('ID')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === 'ID' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Admission ID</button>
              </div>
              <form onSubmit={handleAccess} className="space-y-5">
                 <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{loginMethod === 'EMAIL' ? 'Email Address' : 'Admission ID Token'}</label>
                    <input type={loginMethod === 'EMAIL' ? 'email' : 'text'} placeholder={loginMethod === 'EMAIL' ? 'scholar@example.com' : 'QWT-XXXX-XXXX'} value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-blue-900 shadow-inner" required />
                 </div>
                 {loginMethod === 'EMAIL' && (
                    <div className="space-y-1.5 text-left">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Secure Password</label>
                       <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-blue-900 shadow-inner" required />
                    </div>
                 )}
                 {error && <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 text-[10px] font-black uppercase">
                    <AlertCircle size={16} /> <span>{error}</span>
                 </div>}
                 <button type="submit" className="w-full py-5 bg-blue-900 text-white rounded-[1.5rem] font-black text-base uppercase tracking-widest shadow-2xl shadow-blue-900/20 hover:bg-blue-950 transition-all active:scale-95">Open Secure Terminal</button>
              </form>
              <button onClick={() => onSocialLogin?.({ email: 'google-user@gmail.com', name: 'Google Learner' })} className="mt-6 w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span>Sign in with Google</span>
              </button>
           </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 max-w-7xl flex flex-col lg:flex-row gap-8">
           <aside className="lg:w-64 shrink-0 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-xl">
                 <div className="flex flex-col items-center text-center mb-10 pt-4">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-50 overflow-hidden mb-4 shadow-lg ring-4 ring-emerald-500/10">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}`} alt="Avatar" className="w-full h-full object-cover bg-slate-50" />
                    </div>
                    <h2 className="text-xl font-black text-slate-950 truncate w-full">{currentUser?.name.split(' ')[0]}</h2>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-1">{currentUser?.role}</span>
                 </div>

                 <nav className="space-y-1">
                    {[
                      { id: 'OVERVIEW', label: 'Overview', icon: <Home size={18} /> },
                      ...(currentUser?.role === 'GUARDIAN' ? [{ id: 'FAMILY', label: 'Family Wing', icon: <Users size={18} /> }] : []),
                      { id: 'SYLLABUS', label: 'Curriculum', icon: <Book size={18} /> },
                      { id: 'SCHEDULE', label: 'Timetable', icon: <Calendar size={18} /> }
                    ].map(item => (
                      <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest
                          ${activeTab === item.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                         {item.icon}
                         <span>{item.label}</span>
                      </button>
                    ))}
                 </nav>

                 <div className="mt-10 pt-10 border-t border-slate-50 space-y-2">
                    <button 
                       onClick={() => {setIsLogged(false); setCurrentUser(null); setActiveAiView(null);}}
                       className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-black text-xs uppercase tracking-widest"
                    >
                       <LogOut size={18} />
                       <span>Exit Terminal</span>
                    </button>
                 </div>
              </div>
           </aside>

           <main className="flex-grow">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                 <div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter">Academic Portal</h1>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Terminal Secure • Relational Hub</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                       <div className="text-right">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Relational Sync</p>
                          <p className="text-xs font-black text-emerald-600 tracking-widest">CONNECTED</p>
                       </div>
                       <Activity size={20} className="text-emerald-500 animate-pulse" />
                    </div>
                 </div>
              </header>

              <div className="relative">
                 {renderDashboardContent()}
              </div>
           </main>
        </div>
      )}
    </div>
  );
};

export default PortalPage;
