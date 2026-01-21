import React from 'react';
import { 
  Globe, MessageCircle, ArrowRight, ShieldCheck, Lock, ShieldAlert, Award, Scale, BookOpen, UserCheck, Star
} from 'lucide-react';
import { BRAND } from '../constants';
import { NavPage } from '../types';

const AboutPage: React.FC<{ onNavigate: (page: NavPage) => void }> = ({ onNavigate }) => {
  return (
    <div className="pt-24 min-h-screen bg-white selection:bg-amber-100">
      {/* CEO Institutional Hero */}
      <section className="bg-slate-950 py-24 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[150px] -mr-96 -mt-96"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-10">
            <Award size={14} className="text-amber-400" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Official Institutional Governance</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase">
            Leadership in <br /> <span className="text-amber-500 italic">Sacred Learning.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
            Under the direction of {BRAND.director}, we provide the world's most disciplined and spiritually authentic digital Quranic ecosystem.
          </p>
        </div>
      </section>

      {/* The Director's Message Block */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row gap-0">
             <div className="lg:w-2/5 relative">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700" alt="Director Tahir" />
                <div className="absolute bottom-8 left-8 right-8 bg-slate-950/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
                   <p className="text-amber-500 font-black text-xs uppercase tracking-widest mb-1">Director's Office</p>
                   <p className="text-white font-black text-2xl tracking-tight">{BRAND.director}</p>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">CEO & Dean of Faculty</p>
                </div>
             </div>
             <div className="lg:w-3/5 p-12 md:p-24 space-y-10 flex flex-col justify-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-900 shadow-inner">
                   <Scale size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-950 leading-tight">"We are the <span className="text-blue-700">Custodians</span> of the next generation's faith."</h2>
                <div className="space-y-6 text-slate-600 text-lg md:text-xl font-medium leading-relaxed italic">
                   <p>"{BRAND.mission}"</p>
                   <p>"As Director, I personally vet every scholar who joins our faculty. Our standard is not 'completion'—it is 'perfection.' We are not just teaching a book; we are building spiritual legacies."</p>
                </div>
                <div className="pt-8 border-t border-slate-100 flex items-center gap-6">
                   <div className="ceo-signature select-none">{BRAND.director}</div>
                   <div className="h-10 w-px bg-slate-200"></div>
                   <button onClick={() => onNavigate(NavPage.REGISTER)} className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-950 transition-all shadow-xl">Enroll Under Director's Supervision</button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Core Institutional Values */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
             <h3 className="text-[10px] font-black uppercase text-amber-600 tracking-[0.4em] mb-4">Academic Pillars</h3>
             <h2 className="text-4xl md:text-6xl font-black text-slate-900">Elite Governance Standards.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck />, title: "Ijazah Vetting", desc: "Every tutor must pass the Director's 12-point authentication audit." },
              { icon: <BookOpen />, title: "Proprietary Syllabus", desc: "Curricula designed by the Director for maximum retention." },
              { icon: <Globe />, title: "Global Pedigree", desc: "Reaching 48+ nations with unified academic quality." },
              { icon: <Star />, title: "Top 1% Selection", desc: "We reject 99% of tutor applicants to maintain institutional prestige." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className="w-14 h-14 bg-slate-50 text-blue-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-900 group-hover:text-white transition-all shadow-inner">
                   {item.icon}
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protection Protocol */}
      <section className="py-24 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-10">
           <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert size={48} />
           </div>
           <h2 className="text-4xl md:text-6xl font-black text-slate-950">Safety is an <span className="text-emerald-600">Institutional Mandate.</span></h2>
           <p className="text-slate-500 text-lg md:text-2xl font-medium leading-relaxed">
             Under Director Tahir's governance, your family's data and images are protected by banking-grade encryption and 100% human-monitored sessions.
           </p>
           <button onClick={() => onNavigate(NavPage.CONTACT)} className="inline-flex items-center gap-4 bg-slate-950 text-white px-12 py-6 rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-2xl">
              <span>View Privacy Charter</span>
              <ArrowRight size={24} />
           </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;