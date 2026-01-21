
import React from 'react';
import { 
  Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, 
  ArrowRight, Sparkles, ShieldCheck, Lock, UserCheck, 
  Settings2, Fingerprint, Globe
} from 'lucide-react';
import { BRAND } from '../constants';
import { NavPage } from '../types';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-8 border-t border-white/5 relative overflow-hidden">
      {/* Aesthetic Backdrop */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Identity */}
          <div className="space-y-8">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onNavigate(NavPage.HOME)}
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white leading-none tracking-tight">QuranWithTahir</h2>
                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em] mt-1">Institutional Excellence</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm font-medium">
              The world's premier digital Quran academy. We provide a sacred, 1-on-1 learning environment powered by elite Ijazah-holding tutors and state-of-the-art technology.
            </p>
            <div className="flex space-x-4 pt-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-white/10 group">
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Academy Navigation */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 border-b border-white/10 pb-4">Academic Hub</h3>
            <ul className="space-y-4">
              {[
                { label: 'Specialized Courses', page: NavPage.COURSES },
                { label: 'Verified Tutors', page: NavPage.TUTORS },
                { label: 'Fee Schedules', page: NavPage.PRICING },
                { label: 'Digital Library', page: NavPage.RESOURCES },
                { label: 'Daily Dua Hub', page: NavPage.DAILY_DUAS },
                { label: 'Institutional About', page: NavPage.ABOUT }
              ].map((item, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => onNavigate(item.page)}
                    className="hover:text-emerald-400 transition-all flex items-center space-x-2 text-sm font-bold group"
                  >
                    <ArrowRight size={12} className="text-emerald-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Access - THE MULTI ROLE GATEWAY */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 border-b border-white/10 pb-4">Institutional Access</h3>
            <div className="space-y-6">
               <button 
                  onClick={() => onNavigate(NavPage.DASHBOARD)}
                  className="w-full bg-white/5 border border-white/10 hover:border-blue-500/50 p-4 rounded-2xl transition-all group text-left"
               >
                  <div className="flex items-center space-x-3 mb-1">
                     <Fingerprint size={18} className="text-blue-400" />
                     <span className="text-white font-black text-xs uppercase tracking-widest">Learner & Tutor Portal</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium pl-8 group-hover:text-slate-300">Access your classroom or teaching terminal with your Admission Ticket.</p>
               </button>

               <button 
                  onClick={() => onNavigate(NavPage.BECOME_TUTOR)}
                  className="w-full bg-white/5 border border-white/10 hover:border-emerald-500/50 p-4 rounded-2xl transition-all group text-left"
               >
                  <div className="flex items-center space-x-3 mb-1">
                     <UserCheck size={18} className="text-emerald-400" />
                     <span className="text-white font-black text-xs uppercase tracking-widest">Join as Tutor</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium pl-8 group-hover:text-slate-300">Certified scholars may apply for Ijazah vetting and academic placement.</p>
               </button>

               <button 
                  onClick={() => onNavigate(NavPage.ADMIN)}
                  className="flex items-center space-x-2 text-[10px] font-black text-slate-600 hover:text-blue-400 uppercase tracking-[0.2em] transition-colors mt-4"
               >
                  <Settings2 size={12} />
                  <span>Master Command Console</span>
               </button>
            </div>
          </div>

          {/* Contact Strategy */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 border-b border-white/10 pb-4">Global Support</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-600/20">
                   <Phone className="text-blue-400" size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Admissions Office</p>
                   <p className="text-white font-bold text-sm">{BRAND.phone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center shrink-0 border border-emerald-600/20">
                   <Mail className="text-emerald-400" size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Formal Inquiries</p>
                   <p className="text-white font-bold text-sm">{BRAND.email}</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate(NavPage.REGISTER)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Sparkles size={16} />
                <span>Book 3-Day Trial</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
             <p>© {new Date().getFullYear()} {BRAND.name}. Official Governance by {BRAND.director}.</p>
             <div className="flex gap-6">
                <a href="#" className="hover:text-blue-400 transition-colors">Privacy Charter</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Academic Ethics</a>
             </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-500">
             <Globe size={14} />
             <span>USA • UK • EU • AUS • GCC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;