
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
import FaqPage from './components/FaqPage';
import TutorRecruitmentPage from './components/TutorRecruitmentPage';
import PortalPage from './components/PortalPage';
import AdminDashboard from './components/AdminDashboard';
import ChatWidget from './components/ChatWidget';
import QuranReaderPage from './components/QuranReaderPage';
import DailyDuasPage from './components/DailyDuasPage';
import SecurityLayer from './components/SecurityLayer';
import { I18nProvider } from './components/I18nContext';
import { COURSES, REVIEWS, STATS, BRAND } from './constants';
import { ApiService } from './utils/ApiService';
import { 
  CheckCircle2, Award, BookOpen, ShieldCheck, Eye, ShieldHalf, 
  Lock, Users, Star, Quote, Heart, ArrowRight, Zap, 
  Sparkles, GraduationCap, PlayCircle, Clock, Loader2
} from 'lucide-react';

const StatCounter: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setIsVisible(true);
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
        setCount(Math.floor(easedProgress * numericValue));
        if (progress < 1) requestAnimationFrame(animate);
        else setCount(numericValue);
      };
      requestAnimationFrame(animate);
    }
  }, [isVisible, numericValue]);

  return (
    <div ref={domRef} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl flex flex-col items-center text-center transform transition-all duration-500 hover:-translate-y-3 border border-slate-100 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-600 transition-colors duration-500 opacity-20 group-hover:opacity-10"></div>
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-500 shadow-inner ${isVisible ? 'bg-blue-600 text-white rotate-0' : 'bg-blue-50 text-blue-600 -rotate-12'}`}>{icon}</div>
      <div className="relative">
        <h3 className="text-3xl md:text-5xl font-black text-blue-900 tracking-tighter">{count.toLocaleString()}{suffix}</h3>
        <div className={`h-1.5 bg-emerald-500 mx-auto rounded-full mt-2 transition-all duration-1000 delay-300 ${isVisible ? 'w-12' : 'w-0'}`}></div>
      </div>
      <p className="text-slate-400 text-[10px] md:text-xs uppercase font-black tracking-[0.2em] mt-4">{label}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>(NavPage.HOME);
  const [classroomRole, setClassroomRole] = useState<'STUDENT' | 'TUTOR'>('STUDENT');
  const [isVisible, setIsVisible] = useState(false);
  const [registry, setRegistry] = useState<RegistryUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initial fetch of users from live MySQL DB
    ApiService.getAllUsers().then(setRegistry);
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, [currentPage]);

  const finalizeEnrollment = async (formData: any, role: UserRole) => {
    setIsSubmitting(true);
    const academyId = `QWT-${role[0]}-${Date.now().toString().slice(-4)}`;
    const response = await ApiService.register({
      academyId,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      course: formData.course || 'General Tajweed'
    });

    if (response.success) {
      setCurrentPage(NavPage.DASHBOARD);
    } else {
      alert("Scholarly Enrollment Error: " + response.error);
    }
    setIsSubmitting(false);
  };

  const renderHome = () => (
    <div className="space-y-16 md:space-y-32 pb-32 bg-white">
      <Hero onCtaClick={() => setCurrentPage(NavPage.REGISTER)} />
      
      <section className="bg-slate-50 py-10 border-y border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="flex flex-wrap items-center justify-center gap-8 md:gap-20 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="text-blue-600" size={24} />
                 <span className="text-xs font-black uppercase tracking-widest text-blue-900">Al-Azhar Certified</span>
              </div>
              <div className="flex items-center gap-3">
                 <Award className="text-emerald-600" size={24} />
                 <span className="text-xs font-black uppercase tracking-widest text-blue-900">Ijazah Mastery Authority</span>
              </div>
              <div className="flex items-center gap-3">
                 <CheckCircle2 className="text-purple-600" size={24} />
                 <span className="text-xs font-black uppercase tracking-widest text-blue-900">COPPA Security Verified</span>
              </div>
           </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-10 md:-mt-32 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {STATS.map((stat, idx) => (
            <StatCounter key={idx} value={stat.value} label={stat.label} icon={stat.icon} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-24">
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4">Scholarly Tracks</h2>
           <h3 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">Elite <span className="text-emerald-600">Learning Paths.</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {COURSES.slice(0, 3).map((course, idx) => (
             <div key={idx} className="group bg-white rounded-[3rem] p-10 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <BookOpen size={32} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4">{course.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">{course.description}</p>
                <button 
                  onClick={() => setCurrentPage(NavPage.COURSES)}
                  className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                >
                   <span>View Curriculum</span> <ArrowRight size={16} />
                </button>
             </div>
           ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 relative overflow-hidden">
        <div className="bg-slate-950 rounded-[4rem] p-8 md:p-20 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-500/20">
                <ShieldHalf size={14} />
                <span>Uncompromising Safety</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Our <span className="text-emerald-500">Safe Haven.</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">Banking-grade encryption for family learning sessions.</p>
              <div className="space-y-6">
                {[
                  { title: "Random Session Audits", desc: "Dean-level quality control.", icon: <Eye className="text-emerald-400" /> },
                  { title: "Encrypted Portals", desc: "Zero unauthorized data access.", icon: <Lock className="text-blue-400" /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6 group">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all">{item.icon}</div>
                    <div>
                      <h4 className="text-white font-black text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600" className="rounded-[3rem] w-full h-96 object-cover shadow-2xl" alt="Safe Haven" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
         <div className="bg-slate-50 rounded-[4rem] p-10 md:p-24 border border-slate-200 flex flex-col md:flex-row items-center gap-20 relative overflow-hidden">
            <div className="md:w-1/3 group">
               <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" className="w-full rounded-[3.5rem] shadow-2xl relative z-10 border-8 border-white group-hover:scale-[1.02] transition-transform" alt="Director Tahir" />
            </div>
            <div className="md:w-2/3 space-y-10 relative z-10">
               <div className="inline-flex items-center space-x-2 bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                  <Heart size={14} fill="currentColor" />
                  <span>The Director's Personal Promise</span>
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-slate-950 leading-tight">"We are building <span className="text-blue-600">Spiritual Legacies.</span>"</h2>
               <p className="text-slate-500 text-xl leading-relaxed font-medium">I am {BRAND.director}. My tutors don't just teach books; they instill the love of the Creator.</p>
               <button onClick={() => setCurrentPage(NavPage.REGISTER)} className="bg-blue-600 text-white px-12 py-6 rounded-3xl font-black text-base md:text-xl hover:bg-blue-700 transition-all shadow-2xl flex items-center gap-4 group">
                 <span>Enroll My Child Now</span>
                 <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
         </div>
      </section>
    </div>
  );

  return (
    <I18nProvider>
      <SecurityLayer>
        <div className={`min-h-screen transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <main>
            {currentPage === NavPage.HOME && renderHome()}
            {currentPage === NavPage.REGISTER && (
              <div className="pt-28 md:pt-40 pb-20 min-h-screen bg-slate-50">
                <div className="container mx-auto px-4 max-w-5xl">
                  <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 relative">
                    {isSubmitting && <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-md flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={60} /></div>}
                    <div className="md:w-1/3 bg-blue-900 p-8 md:p-12 text-white space-y-8">
                      <h2 className="text-3xl font-black leading-tight">Join Our <br /> Academy</h2>
                      <p className="text-blue-200 text-sm font-medium opacity-80">Immediate MySQL-secured access. 3-day free trial starts now.</p>
                    </div>
                    <div className="md:w-2/3 p-8 md:p-16">
                      <h3 className="text-2xl font-black text-blue-900 mb-8">Enrollment Form</h3>
                      <form className="space-y-6" onSubmit={(e) => {
                         e.preventDefault();
                         const fd = new FormData(e.currentTarget);
                         finalizeEnrollment({ name: fd.get('name'), email: fd.get('email'), password: fd.get('password'), role: fd.get('role') }, fd.get('role') as UserRole);
                      }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <input name="name" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="Full Name" />
                          <select name="role" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold">
                            <option value="STUDENT">I am a Student</option>
                            <option value="GUARDIAN">I am a Guardian (Parent)</option>
                          </select>
                        </div>
                        <input name="email" required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="Gmail Address" />
                        <input name="password" required type="password" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="Secure Password" />
                        <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-3">
                           <span>Begin Your Journey</span>
                           <ArrowRight size={20} />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentPage === NavPage.DASHBOARD && <PortalPage onNavigate={setCurrentPage} onLaunchClass={(r) => { setClassroomRole(r); setCurrentPage(NavPage.LIVE_CLASS); }} registry={registry} />}
            {currentPage === NavPage.LIVE_CLASS && <LiveClassroom role={classroomRole} onExit={() => setCurrentPage(NavPage.HOME)} />}
            {currentPage === NavPage.PRICING && <PricingPage onNavigate={setCurrentPage} />}
            {currentPage === NavPage.COURSES && <CoursesPage onNavigate={setCurrentPage} />}
            {currentPage === NavPage.TUTORS && <TutorsPage onNavigate={setCurrentPage} />}
            {currentPage === NavPage.RESOURCES && <ResourcesPage onNavigate={setCurrentPage} />}
            {currentPage === NavPage.ABOUT && <AboutPage onNavigate={setCurrentPage} />}
            {currentPage === NavPage.FAQ && <FaqPage onNavigate={setCurrentPage} />}
            {currentPage === NavPage.READ_QURAN && <QuranReaderPage />}
            {currentPage === NavPage.DAILY_DUAS && <DailyDuasPage />}
            {currentPage === NavPage.BECOME_TUTOR && <TutorRecruitmentPage onNavigate={setCurrentPage} onEnrollTutor={(data) => finalizeEnrollment(data, 'TUTOR')} isSubmitting={isSubmitting} successData={null} />}
            {currentPage === NavPage.ADMIN && <AdminDashboard registry={registry} onUpdate={() => {}} onDelete={() => {}} onExit={() => setCurrentPage(NavPage.HOME)} />}
          </main>
          {currentPage !== NavPage.LIVE_CLASS && (
            <>
              <Footer onNavigate={setCurrentPage} />
              <ChatWidget />
            </>
          )}
        </div>
      </SecurityLayer>
    </I18nProvider>
  );
};

export default App;
