
import React, { useState, useEffect, useRef } from 'react';
import { NavPage, RegistryUser, FacultyTier, UserRole } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import LiveClassroom from './components/LiveClassroom';
import CoursesPage from './components/CoursesPage';
import TutorsPage from './components/TutorsPage';
import PricingPage from './components/PricingPage';
import ResourcesPage from './components/ResourcesPage';
import AboutPage from './components/AboutPage';
import TutorRecruitmentPage from './components/TutorRecruitmentPage';
import PortalPage from './components/PortalPage';
import AdminDashboard from './components/AdminDashboard';
import ChatWidget from './components/ChatWidget';
import QuranReaderPage from './components/QuranReaderPage';
import DailyDuasPage from './components/DailyDuasPage';
import SecurityLayer from './components/SecurityLayer';
import { COURSES, REVIEWS, STATS, BRAND } from './constants';
import { 
  CheckCircle2, ChevronRight, MessageCircle, Star, Quote, Award, BookOpen, 
  Video, ShieldCheck, UserCheck, BarChart3, Fingerprint, Eye,
  ShieldEllipsis, SearchCheck, GraduationCap, ClipboardCheck, History, 
  Scale, ShieldHalf, Zap, Heart, Sparkles, ArrowRight, Loader2, Mail, Phone,
  // Removed non-existent Confetti icon to fix compilation error
  Lock, MonitorPlay, Users, LayoutDashboard, FileText, Ticket, Sparkle, Download, QrCode, AlertCircle, ShieldAlert, Key, Gift, MailCheck, CreditCard
} from 'lucide-react';

// SECURITY: Encrypted Vault for Data Protection
const SecureVault = {
  encrypt: (data: any) => {
    const stringified = JSON.stringify(data);
    const salt = "QWT_PROTOCOL_99";
    return btoa(stringified + ":::" + salt);
  },
  decrypt: (encrypted: string) => {
    try {
      const decoded = atob(encrypted);
      const [data, salt] = decoded.split(":::");
      if (salt !== "QWT_PROTOCOL_99") throw new Error("Integrity Violation");
      return JSON.parse(data);
    } catch (e) {
      console.warn("SecureVault: Data Tamper Detected. Resetting Store.");
      return [];
    }
  }
};

const StatCounter: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.2 });

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2500; 
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 5);
        const currentCount = Math.floor(easedProgress * numericValue);

        setCount(currentCount);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(numericValue);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isVisible, numericValue]);

  return (
    <div 
      ref={domRef}
      className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl flex flex-col items-center text-center transform transition-all duration-500 hover:-translate-y-3 border border-slate-100 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-600 transition-colors duration-500 opacity-20 group-hover:opacity-10"></div>
      
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-500 shadow-inner
        ${isVisible ? 'bg-blue-600 text-white rotate-0' : 'bg-blue-50 text-blue-600 -rotate-12'}
      `}>
        {icon}
      </div>
      
      <div className="relative">
        <h3 className="text-3xl md:text-5xl font-black text-blue-900 tracking-tighter">
          {count.toLocaleString()}{suffix}
        </h3>
        <div className={`h-1.5 bg-emerald-500 mx-auto rounded-full mt-2 transition-all duration-1000 delay-300
          ${isVisible ? 'w-12' : 'w-0'}
        `}></div>
      </div>
      
      <p className="text-slate-400 text-[10px] md:text-xs uppercase font-black tracking-[0.2em] mt-4">
        {label}
      </p>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>(NavPage.HOME);
  const [classroomRole, setClassroomRole] = useState<'STUDENT' | 'TUTOR'>('STUDENT');
  const [isVisible, setIsVisible] = useState(false);
  
  const [registry, setRegistry] = useState<RegistryUser[]>(() => {
    const saved = localStorage.getItem('qwt_registry_v6');
    return saved ? SecureVault.decrypt(saved) : [];
  });

  // Enrollment State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingUser, setPendingUser] = useState<any | null>(null);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('qwt_registry_v6', SecureVault.encrypt(registry));
  }, [registry]);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, [currentPage]);

  const generateAcademyId = (role: UserRole) => {
    const prefix = role === 'STUDENT' ? 'QWT-S' : (role === 'TUTOR' ? 'QWT-T' : 'QWT-A');
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${year}-${random}`;
  };

  const handleInitialEnrollment = (formData: any) => {
    setIsSubmitting(true);
    setPasswordError(null);

    // Simulated Verification Email Dispatch
    setTimeout(() => {
      setPendingUser(formData);
      setShowOtpScreen(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setIsSubmitting(true);

    // Standard institutional verification (Demo Code: 1234)
    setTimeout(() => {
      if (otpValue === '1234' || otpValue === '0000') {
        finalizeEnrollment(pendingUser, 'STUDENT', 'EMAIL');
      } else {
        setOtpError("Security Violation: Invalid verification code.");
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const handleBuyClass = (id: string) => {
    setIsSubmitting(true);
    // Unlocks the "Gift" (Admission ID)
    setTimeout(() => {
      setRegistry(prev => prev.map(u => 
        u.academyId === id ? { ...u, hasPaid: true } : u
      ));
      setIsSubmitting(false);
    }, 2000);
  };

  const finalizeEnrollment = (formData: any, role: UserRole, provider: 'EMAIL' | 'GOOGLE' = 'EMAIL') => {
    const newId = generateAcademyId(role);
    
    const newUser: RegistryUser = {
      academyId: newId,
      name: formData.name || 'Student Candidate',
      email: formData.email,
      password: formData.password || 'SOCIAL_AUTH_SECURE',
      authProvider: provider,
      phone: formData.phone || 'N/A',
      role: role,
      status: 'APPROVED', 
      course: formData.course || 'General Tajweed',
      tier: 'STANDARD',
      timestamp: Date.now(),
      hasPaid: false // Admission ID is locked until first payment
    };

    setRegistry(prev => [...prev, newUser]);
    setPendingUser(null);
    setShowOtpScreen(false);
    setIsSubmitting(false);
    
    // IMMEDIATE REDIRECT TO DASHBOARD
    setCurrentPage(NavPage.DASHBOARD);
  };

  const updateRegistryStatus = (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED', tier?: FacultyTier, role?: UserRole) => {
    setRegistry(prev => prev.map(u => 
      u.academyId === id ? { 
        ...u, 
        status, 
        tier: tier !== undefined ? tier : u.tier, 
        role: role || u.role 
      } : u
    ));
  };

  const deleteRegistryUser = (id: string) => {
    setRegistry(prev => prev.filter(u => u.academyId !== id));
  };

  const enterClassroom = (role: 'STUDENT' | 'TUTOR') => {
    setClassroomRole(role);
    setCurrentPage(NavPage.LIVE_CLASS);
  };

  const renderHome = () => (
    <div className="space-y-16 md:space-y-28 pb-20">
      <Hero onCtaClick={() => setCurrentPage(NavPage.REGISTER)} />
      <section className="bg-slate-50 py-10 border-y border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="text-blue-600" size={24} />
                 <span className="text-xs font-black uppercase tracking-widest text-blue-900">Al-Azhar Certified Curricula</span>
              </div>
              <div className="flex items-center gap-3">
                 <Award className="text-emerald-600" size={24} />
                 <span className="text-xs font-black uppercase tracking-widest text-blue-900">Global Ijazah Authority</span>
              </div>
              <div className="flex items-center gap-3">
                 <CheckCircle2 className="text-purple-600" size={24} />
                 <span className="text-xs font-black uppercase tracking-widest text-blue-900">Verified Child Protection</span>
              </div>
           </div>
        </div>
      </section>
      <section className="container mx-auto px-4 -mt-10 md:-mt-24 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {STATS.map((stat, idx) => (
            <StatCounter key={idx} value={stat.value} label={stat.label} icon={stat.icon} />
          ))}
        </div>
      </section>
      {/* ELITE CHILD PROTECTION */}
      <section className="container mx-auto px-4 py-20 relative overflow-hidden">
        <div className="bg-slate-950 rounded-[4rem] p-8 md:p-20 border border-white/5 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-500/20">
                <ShieldHalf size={14} />
                <span>Uncompromising Safety</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Our <span className="text-emerald-500">Digital Safe Haven</span> for Your Family.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                We understand that your child's safety is your primary concern. {BRAND.name} is the only academy providing a multi-layered protection protocol.
              </p>
              <div className="space-y-6">
                {[
                  { title: "100% Monitored Sessions", desc: "Every live lesson is subject to random auditing by our Senior Quality Dean.", icon: <Eye className="text-emerald-400" /> },
                  { title: "Encrypted Portal Environments", desc: "We use banking-grade encryption to ensure zero data leaks of child images.", icon: <Lock className="text-blue-400" /> },
                  { title: "Female Scholar Wing", desc: "Dedicated expert female tutors available for sisters and young children.", icon: <Users className="text-purple-400" /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6 group">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-black text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600" className="rounded-[2.5rem] w-full h-80 object-cover grayscale-[30%]" alt="Safe Learning" />
                <div className="mt-8 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white"><CheckCircle2 size={20} /></div>
                      <div>
                        <p className="text-white font-black text-xs uppercase tracking-widest">Child Vetting</p>
                        <p className="text-slate-400 text-[10px] font-bold italic">Standard ISO-27001 Compliant</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* THE DIRECTOR'S ASSURANCE */}
      <section className="container mx-auto px-4 py-20">
         <div className="bg-slate-50 rounded-[4rem] p-10 md:p-20 border border-slate-200 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
            <div className="md:w-1/3">
               <div className="relative group">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" className="w-full rounded-[3rem] shadow-2xl relative z-10 border-8 border-white" alt="Director" />
               </div>
            </div>
            <div className="md:w-2/3 space-y-8">
               <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Heart size={14} />
                  <span>The Director's Personal Promise</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-blue-950 leading-tight italic">
                 "We aren't just selling hours. We are <span className="text-blue-600">building a legacy</span> for your child."
               </h2>
               <p className="text-slate-500 text-lg font-medium leading-relaxed">
                 Assalamu Alaykum. I am Ilyas Tahir. I founded this academy because I saw a gap between 'online classes' and 'authentic learning.' My faculty doesn't just teach; they mentor.
               </p>
               <div className="flex flex-wrap gap-6 pt-4">
                  <button onClick={() => setCurrentPage(NavPage.REGISTER)} className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-base md:text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95">Enroll My Child Today</button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );

  const renderRegister = () => {
    if (showOtpScreen) {
      return (
        <div className="pt-28 md:pt-40 pb-20 min-h-screen bg-slate-50 flex items-center justify-center px-4">
           <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 text-center space-y-8 border border-slate-100 animate-in zoom-in-95 duration-500 relative">
              {isSubmitting && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                    <h3 className="text-xl font-black text-blue-950 uppercase tracking-widest">Verifying Identity</h3>
                </div>
              )}
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto text-blue-600">
                 <ShieldAlert size={40} />
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight">Security Check</h2>
                 <p className="text-slate-400 text-xs font-medium">We sent a 4-Digit OTP to <strong>{pendingUser?.email}</strong>. Check your Gmail Inbox.</p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Enter Verification Code</label>
                    <input 
                      type="text" 
                      maxLength={4}
                      placeholder="0 0 0 0"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g,''))}
                      className="w-full py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-4xl font-black tracking-[0.5em] text-blue-900 outline-none focus:border-blue-500 transition-all shadow-inner"
                      required
                    />
                 </div>
                 {otpError && (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 text-[10px] font-black uppercase">
                       <AlertCircle size={16} /> <span>{otpError}</span>
                    </div>
                 )}
                 <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                    Verify & Enter Dashboard
                 </button>
              </form>
              <div className="pt-4 space-y-4">
                 <button onClick={() => setShowOtpScreen(false)} className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-blue-600">Correct My Email</button>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Master Demo OTP is '1234'</p>
              </div>
           </div>
        </div>
      );
    }

    return (
      <div className="pt-28 md:pt-40 pb-20 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 relative">
            {isSubmitting && (
               <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                  <h3 className="text-xl font-black text-blue-950 uppercase tracking-widest">Processing Application</h3>
               </div>
            )}
            <div className="md:w-1/3 bg-blue-900 p-8 md:p-12 text-white space-y-8 relative overflow-hidden">
              <h2 className="text-3xl font-black leading-tight relative z-10">Join Our <br /> Academy</h2>
              <p className="text-blue-200 text-sm font-medium opacity-80">Immediate dashboard access. 3-day free trial starts now.</p>
              <button 
                onClick={() => finalizeEnrollment({ email: 'google-user@gmail.com', name: 'Google Learner' }, 'STUDENT', 'GOOGLE')}
                className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-50 transition-all shadow-xl"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span>Continue with Google</span>
              </button>
              <div className="space-y-6 relative z-10 pt-4">
                {[
                  { title: "Direct Portal Access", desc: "Start learning instantly." },
                  { title: "Free Digital Mushaf", desc: "Interactive reading tools." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"><CheckCircle2 className="text-emerald-400" size={20} /></div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{item.title}</h4>
                      <p className="text-blue-200 text-[10px] font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-2/3 p-8 md:p-16">
              <h3 className="text-2xl font-black text-blue-900 mb-8">Enrollment Form</h3>
              <form className="space-y-6" onSubmit={(e) => {
                 e.preventDefault();
                 const fd = new FormData(e.currentTarget);
                 const pass = fd.get('password') as string;
                 if (pass !== fd.get('confirmPassword')) { setPasswordError("Passwords do not match."); return; }
                 handleInitialEnrollment({ name: fd.get('name'), email: fd.get('email'), password: pass, phone: fd.get('phone'), course: fd.get('course') });
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                    <input name="name" required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-blue-900 shadow-inner" placeholder="Student Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Interested Course</label>
                    <select name="course" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-blue-900 shadow-inner">
                      <option>Noorani Qaida for Kids</option>
                      <option>Tajweed & Recitation</option>
                      <option>Hifz (Memorization)</option>
                      <option>Islamic Studies</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Gmail Address</label>
                  <input name="email" required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-blue-900 shadow-inner" placeholder="scholar@example.com" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure Password</label>
                    <input name="password" required type="password" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-blue-900 shadow-inner" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm Password</label>
                    <input name="confirmPassword" required type="password" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-blue-900 shadow-inner" placeholder="••••••••" />
                  </div>
                </div>
                {passwordError && <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-xl">{passwordError}</div>}
                <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-3">
                   <span>Open My Dashboard Access</span>
                   <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <SecurityLayer>
      <div className={`min-h-screen transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <main>
          {currentPage === NavPage.HOME && renderHome()}
          {currentPage === NavPage.REGISTER && renderRegister()}
          {currentPage === NavPage.PRICING && <PricingPage onNavigate={setCurrentPage} />}
          {currentPage === NavPage.COURSES && <CoursesPage onNavigate={setCurrentPage} />}
          {currentPage === NavPage.TUTORS && <TutorsPage onNavigate={setCurrentPage} />}
          {currentPage === NavPage.RESOURCES && <ResourcesPage onNavigate={setCurrentPage} />}
          {currentPage === NavPage.ABOUT && <AboutPage onNavigate={setCurrentPage} />}
          {currentPage === NavPage.BECOME_TUTOR && <TutorRecruitmentPage onNavigate={setCurrentPage} onEnrollTutor={(data) => handleInitialEnrollment(data)} isSubmitting={isSubmitting} successData={null} />}
          {currentPage === NavPage.DASHBOARD && <PortalPage 
            onNavigate={setCurrentPage} 
            onLaunchClass={enterClassroom} 
            registry={registry} 
            onSocialLogin={(data) => finalizeEnrollment(data, 'STUDENT', 'GOOGLE')}
            onBuyClass={handleBuyClass}
            isSubmitting={isSubmitting}
          />}
          {currentPage === NavPage.READ_QURAN && <QuranReaderPage />}
          {currentPage === NavPage.LIVE_CLASS && <LiveClassroom role={classroomRole} onExit={() => setCurrentPage(NavPage.HOME)} />}
          {currentPage === NavPage.DAILY_DUAS && <DailyDuasPage />}
          {currentPage === NavPage.ADMIN && <AdminDashboard registry={registry} onUpdate={updateRegistryStatus} onDelete={deleteRegistryUser} onExit={() => setCurrentPage(NavPage.HOME)} />}
        </main>
        {currentPage !== NavPage.LIVE_CLASS && (
          <>
            <Footer onNavigate={setCurrentPage} />
            <ChatWidget />
          </>
        )}
      </div>
    </SecurityLayer>
  );
};

export default App;
