import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Phone, Mail, GraduationCap, ChevronDown, 
  LayoutDashboard, Sparkles, Globe, Book, Heart, Library, UserPlus, Users, Info
} from 'lucide-react';
import { BRAND } from '../constants';
import { NavPage, AppLanguage } from '../types';
import { useI18n } from './I18nContext';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { lang, setLang, t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages: { code: AppLanguage; label: string; flag: string }[] = [
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'AR', label: 'العربية', flag: '🇸🇦' },
    { code: 'UR', label: 'اردو', flag: '🇵🇰' },
    { code: 'FR', label: 'Français', flag: '🇫🇷' }
  ];

  const resourceLinks = [
    { label: 'Digital Mushaf', page: NavPage.READ_QURAN, icon: <Book size={16} /> },
    { label: 'Daily Dua Hub', page: NavPage.DAILY_DUAS, icon: <Heart size={16} /> },
    { label: 'Resource Library', page: NavPage.RESOURCES, icon: <Library size={16} /> },
  ];

  const mainNavLinks = [
    { label: t('NAV_HOME'), page: NavPage.HOME },
    { label: t('NAV_ABOUT'), page: NavPage.ABOUT },
    { label: t('NAV_COURSES'), page: NavPage.COURSES },
    { label: t('NAV_TUTORS'), page: NavPage.TUTORS },
    { label: t('NAV_PRICING'), page: NavPage.PRICING }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      {!isScrolled && (
        <div className="bg-blue-600 text-white py-1.5 hidden lg:block">
          <div className="container mx-auto px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <span className="flex items-center space-x-2 rtl:space-x-reverse"><Phone size={14}/> <span>{BRAND.phone}</span></span>
              <span className="flex items-center space-x-2 rtl:space-x-reverse"><Mail size={14}/> <span>{BRAND.email}</span></span>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-all"
                >
                  <Globe size={14} />
                  <span>{languages.find(l => l.code === lang)?.label}</span>
                  <ChevronDown size={12} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                </button>
                {showLangMenu && (
                  <div className="absolute top-full mt-2 right-0 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-100 p-2 min-w-[150px] animate-in slide-in-from-top-2 duration-200">
                    {languages.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group
                          ${lang === l.code ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-500'}`}
                      >
                        <span>{l.label}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">{l.flag}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="h-4 w-px bg-white/20 mx-2"></div>
              <button onClick={() => onNavigate(NavPage.BECOME_TUTOR)} className="hover:text-emerald-300 transition-colors uppercase tracking-widest flex items-center gap-1">
                <UserPlus size={12} />
                <span>{t('BECOME_TUTOR')}</span>
              </button>
              <button onClick={() => onNavigate(NavPage.DASHBOARD)} className="flex items-center space-x-1 text-emerald-300 hover:text-white transition-colors">
                <LayoutDashboard size={14} />
                <span>{t('PORTAL_LOGIN')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer group" onClick={() => onNavigate(NavPage.HOME)}>
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
              <GraduationCap size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className={`text-xl font-black leading-none ${isScrolled ? 'text-blue-900' : 'text-blue-800'}`}>QuranWithTahir</h1>
              <p className={`text-[9px] tracking-[0.2em] uppercase font-bold ${isScrolled ? 'text-slate-500' : 'text-slate-600'}`}>Digital Academy</p>
            </div>
          </div>

          <ul className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {mainNavLinks.map((link) => (
              <li key={link.page}>
                <button
                  onClick={() => onNavigate(link.page)}
                  className={`text-xs font-black uppercase tracking-widest transition-all hover:text-blue-600 relative py-1
                    ${currentPage === link.page ? 'text-blue-600' : (isScrolled ? 'text-slate-700' : 'text-slate-800')}
                  `}
                >
                  {link.label}
                  {currentPage === link.page && <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-in slide-in-from-left duration-300"></div>}
                </button>
              </li>
            ))}
            
            <li 
              className="relative group"
              onMouseEnter={() => setShowResourcesDropdown(true)}
              onMouseLeave={() => setShowResourcesDropdown(false)}
            >
              <button
                className={`text-xs font-black uppercase tracking-widest transition-all hover:text-blue-600 flex items-center gap-1 py-1
                  ${isScrolled ? 'text-slate-700' : 'text-slate-800'}
                `}
              >
                <span>{t('NAV_RESOURCES')}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showResourcesDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showResourcesDropdown && (
                <div className="absolute top-full left-0 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 min-w-[200px] overflow-hidden">
                    {resourceLinks.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => { onNavigate(sub.page); setShowResourcesDropdown(false); }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-50 group flex items-center gap-3 transition-all"
                      >
                        <div className="text-slate-400 group-hover:text-blue-600 transition-colors">{sub.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-blue-900">{sub.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li>
              <button onClick={() => onNavigate(NavPage.REGISTER)} className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${isScrolled ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-emerald-600 text-white shadow-emerald-900/10'} hover:scale-105`}>
                <Sparkles size={16} />
                <span>{t('CTA_TRIAL')}</span>
              </button>
            </li>
          </ul>
          
          <div className="lg:hidden flex items-center space-x-2 rtl:space-x-reverse">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2.5 bg-slate-100 rounded-lg text-slate-600"><Menu size={20} /></button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white animate-in slide-in-from-right duration-300">
           <div className="p-6 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center space-x-2">
                 <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white"><GraduationCap size={18} /></div>
                 <span className="font-black text-blue-900">QuranWithTahir</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
           </div>
           <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
              {mainNavLinks.map((link) => (
                <button 
                  key={link.page} 
                  onClick={() => { onNavigate(link.page); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left text-2xl font-black uppercase tracking-tighter ${currentPage === link.page ? 'text-blue-600' : 'text-slate-900'}`}
                >
                  {link.label}
                </button>
              ))}
              
              <div className="border-t border-slate-100 pt-6">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Scholarly Resources</p>
                <div className="grid grid-cols-1 gap-4">
                  {resourceLinks.map((sub, i) => (
                    <button 
                      key={i} 
                      onClick={() => { onNavigate(sub.page); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl"
                    >
                      <div className="text-blue-600">{sub.icon}</div>
                      <span className="font-black text-sm uppercase text-slate-800">{sub.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 space-y-4">
                 <button onClick={() => { onNavigate(NavPage.REGISTER); setIsMobileMenuOpen(false); }} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">Book Free Trial</button>
              </div>
           </div>
        </div>
      )}
    </header>
  );
};

export default Header;