
import React, { useRef, useState } from 'react';
import { 
  Users, Award, ShieldCheck, Zap, ArrowRight, CheckCircle2, 
  MessageSquare, BookOpen, Clock, Globe, Lock, Upload,
  Loader2, Sparkles, Send, GraduationCap
} from 'lucide-react';
import { BRAND } from '../constants';
import { NavPage, RegistryUser } from '../types';

interface TutorRecruitmentPageProps {
  onNavigate: (page: NavPage) => void;
  onEnrollTutor: (data: any) => void;
  isSubmitting: boolean;
  successData: RegistryUser | null;
}

const TutorRecruitmentPage: React.FC<TutorRecruitmentPageProps> = ({ onNavigate, onEnrollTutor, isSubmitting, successData }) => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    onEnrollTutor({
       name: fd.get('name'),
       email: fd.get('email'),
       phone: fd.get('phone'),
       course: "Classical Instruction"
    });
  };

  if (successData) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-3xl w-full bg-white rounded-[4rem] shadow-2xl p-10 md:p-20 text-center space-y-10 animate-in zoom-in-95 duration-500 border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-3 bg-blue-600"></div>
           
           <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-inner">
              <CheckCircle2 size={48} />
           </div>
           
           <div className="space-y-4">
              <h2 className="text-4xl font-black text-blue-950 tracking-tight">Vetting Initiated Successfully!</h2>
              <p className="text-slate-500 text-lg font-medium">
                As-salamu alaykum, Sheikh! Your academic portfolio has been safely received.
              </p>
           </div>

           <div className="relative group max-w-md mx-auto">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-all"></div>
              <div className="relative bg-white p-8 rounded-[2rem] border border-slate-100 text-center space-y-4 shadow-xl">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Institutional Verification ID</p>
                 <div className="bg-slate-50 py-6 rounded-2xl border border-dashed border-slate-200">
                    <span className="text-4xl font-black text-blue-900 tracking-tighter select-all">{successData.academyId}</span>
                 </div>
                 <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-xs">
                    <ShieldCheck size={16} />
                    <span>Vetting Phase: 1 (Audit)</span>
                 </div>
              </div>
           </div>

           <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto leading-relaxed">
             Our Quality Dean is now reviewing your Ijazah and scholarly credentials. You will receive an update regarding your interview schedule shortly.
           </p>

           <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={() => onNavigate(NavPage.HOME)}
                className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all"
              >
                 Academy Home
              </button>
              <button 
                onClick={() => onNavigate(NavPage.DASHBOARD)}
                className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl"
              >
                 Tutor Portal
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-950 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-full border border-emerald-500/20 mb-10">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Proprietary Academic Pedagogy</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
            Join the World's Most <br /> <span className="text-emerald-500 underline decoration-white/10 underline-offset-8">Elite Quranic Tutors</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Are you a certified scholar with a documented Ijazah? Join {BRAND.name} and reach thousands of students globally through our high-end digital ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={scrollToForm}
              className="bg-emerald-600 text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-3 group"
            >
              <span>Apply to Teach</span>
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate(NavPage.ABOUT)}
              className="bg-white/5 text-white border border-white/10 px-10 py-6 rounded-2xl font-black text-xl hover:bg-white/10 transition-all backdrop-blur-md"
            >
              View Quality Charter
            </button>
          </div>
        </div>
      </section>

      {/* The 5-Gate Onboarding Process */}
      <section className="py-24 md:py-32 container mx-auto px-4">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-black text-blue-950 mb-6 leading-tight">Our Rigorous <span className="text-blue-600">Selection Framework</span></h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium md:text-lg">To maintain our status as the world's #1 academy, we only select the top 1% of tutor applicants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[
            { step: "01", title: "Ijazah Audit", desc: "Digital verification of your chains of transmission (Isnad).", icon: <BookOpen size={28} /> },
            { step: "02", title: "Recitation Test", desc: "Live Tarteel and Tajweed evaluation with our Senior Dean.", icon: <Zap size={28} /> },
            { step: "03", title: "Pedagogy Test", desc: "Assessing teaching style for non-Arabic speakers and kids.", icon: <Users size={28} /> },
            { step: "04", title: "Ethical Audit", desc: "Moral alignment interview regarding child safety and integrity.", icon: <ShieldCheck size={28} /> },
            { step: "05", title: "Tech Mastery", desc: "Certified training on our high-performance teaching portal.", icon: <Clock size={28} /> }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group relative">
              <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                {item.icon}
              </div>
              <span className="text-blue-900/5 text-6xl font-black mb-2 block absolute top-8 right-8 group-hover:text-blue-900/10 transition-colors">{item.step}</span>
              <h4 className="text-xl font-black text-blue-900 mb-4 tracking-tight">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section ref={formRef} id="apply" className="py-24 md:py-32 container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden relative">
           {isSubmitting && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="text-blue-600 animate-spin mb-6" size={60} />
                <h3 className="text-2xl font-black text-blue-900 mb-2 uppercase tracking-widest">Securing Your Profile</h3>
                <p className="text-slate-500 font-bold text-sm">Uploading credentials to our encrypted academic server...</p>
             </div>
           )}
           <div className="p-10 md:p-20">
              <div className="text-center mb-16">
                 <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <Send className="text-blue-600" size={32} />
                 </div>
                 <h2 className="text-4xl font-black text-blue-900 mb-4 leading-none">Onboarding Gateway</h2>
                 <p className="text-slate-500 font-medium md:text-lg">Enter your professional credentials to initiate the vetting sequence.</p>
              </div>
              
              <form className="space-y-8" onSubmit={handleApply}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Legal Name (With Titles)</label>
                       <input 
                         name="name"
                         required
                         type="text" 
                         className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-blue-900 text-lg shadow-inner" 
                         placeholder="e.g. Sheikh Abdullah bin Yusuf" 
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Academic Email</label>
                       <input 
                         name="email"
                         required
                         type="email" 
                         className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-blue-900 text-lg shadow-inner" 
                         placeholder="scholar@example.com" 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">WhatsApp for Coordination</label>
                       <input 
                         name="phone"
                         required
                         type="text" 
                         className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-blue-900 text-lg shadow-inner" 
                         placeholder="+ (Country Code) 000 0000" 
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Quranic Pedagogy Experience</label>
                       <select className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-blue-900 text-lg shadow-inner appearance-none">
                          <option>1-3 Years Professional</option>
                          <option>3-5 Years Professional</option>
                          <option>5-10 Years Professional</option>
                          <option>10+ Years Expert Mastery</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Upload Digital Ijazah / Scholarly Credentials</label>
                    <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center hover:border-blue-300 transition-all group cursor-pointer bg-slate-50 hover:bg-white shadow-inner">
                       <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-slate-50 group-hover:scale-110 transition-transform">
                          <Upload className="text-slate-300 group-hover:text-blue-500 transition-colors" size={28} />
                       </div>
                       <p className="text-lg font-black text-slate-400 group-hover:text-blue-950 transition-colors">Select PDF/JPG Portfolio</p>
                       <p className="text-xs font-bold text-slate-300 mt-2 uppercase tracking-widest">Max File Size: 25MB</p>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   className="w-full bg-blue-900 text-white py-6 rounded-[2rem] font-black text-2xl hover:bg-blue-950 transition-all shadow-2xl flex items-center justify-center space-x-4 group active:scale-[0.98]"
                 >
                    <span>Submit Academic Portfolio</span>
                    <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                 </button>
              </form>
           </div>
        </div>
      </section>
    </div>
  );
};

export default TutorRecruitmentPage;