import React from 'react';
import { PlayCircle, Star, Sparkles, ShieldCheck, GraduationCap, ArrowRight, Award } from 'lucide-react';
import { useI18n } from './I18nContext';
import { BRAND } from '../constants';

const Hero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
  const { t, isRTL } = useI18n();

  return (
    <section className="relative bg-slate-950 flex items-center pt-24 pb-12 lg:pt-36 lg:pb-16 overflow-hidden selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -ml-24 -mb-24"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-2xl">
              <Award size={14} className="text-amber-400" />
              <span className="text-white text-[9px] font-black uppercase tracking-[0.3em]">{BRAND.role}</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight uppercase">
                {t('HERO_TITLE')}
              </h1>
              <p className="text-slate-400 text-sm md:text-lg max-w-xl font-medium leading-relaxed">
                Join a disciplined scholarly environment guided by the pedagogical vision of <span className="text-blue-400 font-bold">{BRAND.director}</span>. Authentic Tajweed for global families who prioritize excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={onCtaClick}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-2 rtl:space-x-reverse group active:scale-95"
              >
                <span>{t('CTA_TRIAL')}</span>
                <ArrowRight size={18} className={`transition-transform ${isRTL ? 'group-hover:-translate-x-2 rotate-180' : 'group-hover:translate-x-2'}`} />
              </button>
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 backdrop-blur-md flex items-center justify-center space-x-2 rtl:space-x-reverse group">
                <PlayCircle size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
                <span>The Mission</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-8">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-slate-300 font-bold text-[9px] uppercase tracking-[0.2em]">Al-Azhar Authenticated</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-slate-300 font-bold text-[9px] uppercase tracking-[0.2em]">5,200+ Active Students</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative group max-w-sm ml-auto">
              {/* Profile Card Aura */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-amber-500/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl aspect-[4/5] bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1584697964846-4409976bc6ce?auto=format&fit=crop&q=80&w=1000" 
                  alt="Academy Governance" 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                
                {/* Floating Institutional Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-2xl flex justify-between items-center rtl:flex-row-reverse transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="space-y-1">
                    <p className="text-amber-400 font-black text-[9px] uppercase tracking-[0.3em]">Director of Faculty</p>
                    <p className="text-white font-black text-lg tracking-tight">{BRAND.director}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-amber-400 shadow-inner">
                     <Award size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;