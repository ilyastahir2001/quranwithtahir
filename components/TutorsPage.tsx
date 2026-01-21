
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, ShieldCheck, Award, GraduationCap, Video, CheckCircle2, 
  ArrowRight, BookOpen, Heart, MessageCircle, X, ChevronLeft, 
  Globe, PlayCircle, Lock, ShieldAlert, Search, Filter, SlidersHorizontal, 
  UserCircle, Calendar, Briefcase, Clock, CalendarDays, Check
} from 'lucide-react';
import { TUTORS, BRAND } from '../constants';
import { NavPage, Tutor } from '../types';

interface TutorsPageProps {
  onNavigate: (page: NavPage) => void;
}

const AvailabilityCalendar: React.FC<{ tutorName: string }> = ({ tutorName }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const days = [
    { name: 'Mon', date: '22 May' },
    { name: 'Tue', date: '23 May' },
    { name: 'Wed', date: '24 May' },
    { name: 'Thu', date: '25 May' },
    { name: 'Fri', date: '26 May' },
    { name: 'Sat', date: '27 May' },
    { name: 'Sun', date: '28 May' }
  ];

  const slots = ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', '08:00 PM'];
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);

  return (
    <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100">
      <div className="flex items-center justify-between mb-8">
         <h3 className="text-xl font-black text-blue-950 flex items-center space-x-3">
            <CalendarDays className="text-blue-600" size={24} />
            <span>Live Availability</span>
         </h3>
         <div className="hidden sm:flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100">
            <Globe size={12} />
            <span>Timezone: London/GMT</span>
         </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDay(idx)}
            className={`flex flex-col items-center min-w-[80px] p-4 rounded-2xl transition-all border
              ${selectedDay === idx 
                ? 'bg-blue-600 text-white border-blue-600 shadow-xl' 
                : 'bg-white text-slate-600 border-slate-100 hover:border-blue-100'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{day.name}</span>
            <span className="text-sm font-black">{day.date}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {slots.map((slot, idx) => (
          <button
            key={idx}
            onClick={() => setBookedSlot(slot)}
            className={`p-4 rounded-xl font-bold text-xs transition-all border flex items-center justify-between group
              ${bookedSlot === slot 
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-300 hover:text-emerald-600'}`}
          >
            <span>{slot}</span>
            {bookedSlot === slot ? <Check size={14} /> : <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>}
          </button>
        ))}
      </div>

      {bookedSlot && (
        <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
              <Check size={18} strokeWidth={3} />
            </div>
            <div>
              <p className="text-emerald-900 font-black text-[10px] uppercase">Selected Slot</p>
              <p className="text-emerald-700 text-xs font-bold">{days[selectedDay].date} @ {bookedSlot}</p>
            </div>
          </div>
          <button className="text-emerald-600 font-black text-[10px] uppercase underline decoration-2 underline-offset-4">Change</button>
        </div>
      )}
    </div>
  );
};

const TutorsPage: React.FC<TutorsPageProps> = ({ onNavigate }) => {
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpec, setActiveSpec] = useState<string>('All');
  const [activeAvailability, setActiveAvailability] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (selectedTutor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedTutor]);

  // Derive unique specializations from data
  const specializations = useMemo(() => {
    const specs = new Set<string>(['All']);
    TUTORS.forEach(t => t.specializations.forEach(s => specs.add(s)));
    return Array.from(specs);
  }, []);

  const availabilities = ['All', 'Available', 'Limited', 'Full'];

  const filteredTutors = useMemo(() => {
    return TUTORS.filter(tutor => {
      const matchesSearch = 
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tutor.languages?.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesSpec = activeSpec === 'All' || tutor.specializations.includes(activeSpec);
      const matchesAvailability = activeAvailability === 'All' || tutor.availability === activeAvailability;

      return matchesSearch && matchesSpec && matchesAvailability;
    });
  }, [searchQuery, activeSpec, activeAvailability]);

  const getBadgeStyles = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('tajweed') || t.includes('qaida')) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (t.includes('tafseer') || t.includes('scholar')) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (t.includes('hifz')) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    if (t.includes('female') || t.includes('kids')) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available': return 'text-emerald-500 bg-emerald-500/10';
      case 'Limited': return 'text-amber-500 bg-amber-500/10';
      case 'Full': return 'text-red-500 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-100';
    }
  };

  const renderDetailedProfile = (tutor: Tutor) => (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 md:px-0">
        <div className="container mx-auto h-16 md:h-20 flex items-center justify-between">
          <button 
            onClick={() => setSelectedTutor(null)}
            className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors font-bold group"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm md:text-base">Back to Tutors</span>
          </button>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onNavigate(NavPage.REGISTER)}
              className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg md:rounded-full font-black text-xs md:text-sm shadow-md active:scale-95"
            >
              Book {tutor.name.split(' ')[1] || tutor.name}
            </button>
            <button 
              onClick={() => setSelectedTutor(null)}
              className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-6 md:space-y-8">
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-br from-blue-600 to-emerald-500 opacity-5"></div>
                 <div className="relative z-10">
                    <img 
                      src={tutor.image} 
                      alt={tutor.name} 
                      className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] object-cover mx-auto ring-4 ring-white shadow-xl mb-6"
                    />
                    <div className="flex items-center justify-center gap-2 mb-2">
                       <h2 className="text-2xl md:text-3xl font-black text-blue-900">{tutor.name}</h2>
                       <CheckCircle2 size={24} className="text-blue-500" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                       {tutor.specializations.map((spec, idx) => (
                         <span key={idx} className={`text-[8px] md:text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border tracking-wider ${getBadgeStyles(spec)}`}>
                            {spec}
                         </span>
                       ))}
                    </div>
                    
                    <div className={`inline-flex items-center space-x-2 py-2 px-4 rounded-full mb-8 text-[10px] font-black uppercase tracking-widest ${getAvailabilityColor(tutor.availability)}`}>
                       <Calendar size={12} />
                       <span>{tutor.availability} Status</span>
                    </div>

                    <div className="flex justify-center space-x-1 text-yellow-400 mb-6">
                       {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                       <span className="text-slate-400 ml-2 font-bold text-xs">({tutor.rating})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                       <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                          <p className="text-blue-600 font-black text-lg md:text-xl">{tutor.experience}</p>
                          <p className="text-slate-500 text-[8px] md:text-[9px] uppercase font-bold tracking-widest">Teaching Age</p>
                       </div>
                       <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                          <p className="text-emerald-600 font-black text-lg md:text-xl">Top 1%</p>
                          <p className="text-slate-500 text-[8px] md:text-[9px] uppercase font-bold tracking-widest">Global Rank</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => onNavigate(NavPage.REGISTER)}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-base md:text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center space-x-3 group active:scale-95"
                    >
                      <span>Book Your Live Quran Tutor Now!</span>
                      <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>

              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-lg border border-slate-100">
                <h4 className="text-base font-black text-blue-900 mb-4 flex items-center space-x-3">
                   <Globe size={18} className="text-blue-500" />
                   <span className="uppercase tracking-widest text-[10px] font-black">Spoken Languages</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                   {tutor.languages?.map((lang, idx) => (
                     <span key={idx} className="bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
                        {lang}
                     </span>
                   ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8 md:space-y-12">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
                <div className="flex items-center space-x-3 mb-8">
                   <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
                   <h3 className="text-2xl font-black text-blue-950">Professional Trajectory</h3>
                </div>
                <p className="text-slate-600 text-sm md:text-lg leading-relaxed mb-10 font-medium">
                   {tutor.bio}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Academic Credentials</h4>
                      <ul className="space-y-3">
                         {tutor.education?.map((edu, i) => (
                           <li key={i} className="flex items-start space-x-3 text-sm text-blue-900 font-bold">
                              <GraduationCap size={18} className="text-blue-500 shrink-0 mt-0.5" />
                              <span>{edu}</span>
                           </li>
                         ))}
                      </ul>
                   </div>
                   <div className="bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 mb-4">Methodology Focus</h4>
                      <div className="flex flex-wrap gap-2">
                         {tutor.specializations.map((spec, i) => (
                           <span key={i} className="bg-white px-3 py-1 rounded-lg text-[9px] font-black text-emerald-700 border border-emerald-100 uppercase">
                              {spec}
                           </span>
                         ))}
                      </div>
                   </div>
                </div>

                {/* INTERACTIVE CALENDAR SECTION */}
                <AvailabilityCalendar tutorName={tutor.name} />

                <div className="flex items-center space-x-3 mb-8 mt-12">
                   <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
                   <h3 className="text-2xl font-black text-blue-900">Academic Philosophy</h3>
                </div>
                <div className="bg-blue-50/50 p-6 md:p-10 rounded-[2rem] border border-blue-100 relative overflow-hidden italic font-medium">
                   <Heart size={60} className="absolute -bottom-4 -right-4 text-blue-100" />
                   <p className="text-blue-900 text-lg md:text-xl relative z-10 leading-relaxed">
                     "{tutor.philosophy}"
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 min-h-screen bg-[#f8fafc] pb-24">
      <section className="bg-slate-950 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-white text-[10px] font-black uppercase tracking-widest">Global Expert Tutors</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
            Discover Your <br /> <span className="text-emerald-500">Perfect Mentor.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-10">
            We vet thousands, but only hire the top 1%. Find the specific expertise you need for your family's spiritual journey.
          </p>
          
          <div className="max-w-4xl mx-auto space-y-4">
             {/* Search Bar */}
             <div className="relative group">
                <div className="absolute inset-0 bg-blue-600/10 blur-2xl transition-all opacity-0 group-focus-within:opacity-100"></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 flex items-center">
                   <Search className="ml-6 text-slate-400" size={24} />
                   <input 
                      type="text" 
                      placeholder="Search tutors by name, specialization, or language (e.g. Fatima, Tajweed, English)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-grow bg-transparent border-none outline-none text-white px-6 py-4 font-bold placeholder:text-slate-500 md:text-lg"
                   />
                   <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`hidden md:flex items-center space-x-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                        ${showFilters ? 'bg-emerald-50 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                   >
                      <SlidersHorizontal size={18} />
                      <span>Advanced Filters</span>
                   </button>
                </div>
             </div>

             {/* Filters Panel */}
             {(showFilters || searchQuery.length > 0) && (
               <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 animate-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                     <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-slate-400 mb-2">
                           <Briefcase size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Specialization</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {specializations.map(spec => (
                             <button 
                                key={spec}
                                onClick={() => setActiveSpec(spec)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border
                                  ${activeSpec === spec 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'}`}
                             >
                                {spec}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-slate-400 mb-2">
                           <Calendar size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Live Availability</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {availabilities.map(av => (
                             <button 
                                key={av}
                                onClick={() => setActiveAvailability(av)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border
                                  ${activeAvailability === av 
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'}`}
                             >
                                {av}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Showing {filteredTutors.length} Mentors Match
                     </p>
                     <button 
                        onClick={() => { setActiveSpec('All'); setActiveAvailability('All'); setSearchQuery(''); }}
                        className="text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:text-emerald-300 transition-colors"
                     >
                        Reset All Filters
                     </button>
                  </div>
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredTutors.map((tutor) => (
            <div 
              key={tutor.id} 
              onClick={() => setSelectedTutor(tutor)}
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col active:scale-[0.98] transform duration-300 relative overflow-hidden"
            >
              {/* Availability Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-16 -mt-16 blur-2xl ${tutor.availability === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              
              <div className="flex items-center space-x-5 mb-8">
                 <div className="relative shrink-0">
                    <img src={tutor.image} alt={tutor.name} className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] object-cover ring-4 ring-slate-50 group-hover:ring-blue-100 transition-all shadow-md" />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg border-2 border-white shadow-lg ${getAvailabilityColor(tutor.availability)}`}>
                       <CheckCircle2 size={12} />
                    </div>
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-1">
                       <h3 className="text-lg md:text-xl font-black text-blue-950 group-hover:text-blue-600 transition-colors">{tutor.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                       {tutor.specializations.slice(0, 2).map((spec, idx) => (
                         <span key={idx} className={`text-[8px] font-black uppercase px-2 py-1.5 rounded-lg border tracking-wider ${getBadgeStyles(spec)}`}>
                            {spec}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                 <Globe size={14} className="text-blue-400" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {tutor.languages?.join(' • ')}
                 </p>
              </div>

              <p className="text-slate-500 text-sm line-clamp-3 mb-8 font-medium leading-relaxed">
                {tutor.bio}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                   <div className="flex items-center space-x-1 text-yellow-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-blue-950 font-black text-sm">{tutor.rating}</span>
                   </div>
                   <span className="text-slate-300 text-xs">|</span>
                   <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{tutor.experience} EXP</span>
                </div>
                <button className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white p-3 rounded-xl transition-all shadow-inner">
                   <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTutors.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <UserCircle size={48} className="text-slate-200" />
            </div>
            <h3 className="text-3xl font-black text-blue-950 mb-4">No Tutor Matches Found</h3>
            <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">Try broadening your search or resetting the filters to discover more of our expert tutors.</p>
            <button 
              onClick={() => { setActiveSpec('All'); setActiveAvailability('All'); setSearchQuery(''); }}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-base shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              Show All Tutors
            </button>
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4">
         <div className="bg-blue-50/50 rounded-[3rem] p-12 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center space-x-6">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-blue-600 border border-blue-50">
                  <ShieldAlert size={40} />
               </div>
               <div className="max-w-md">
                  <h4 className="text-xl font-black text-blue-950 mb-2">Platform Exclusive Guarantee</h4>
                  <p className="text-slate-500 text-sm font-medium">For your security, all academic interactions must take place within our encrypted portal. We do not support off-platform teaching.</p>
               </div>
            </div>
            <button 
              onClick={() => onNavigate(NavPage.ABOUT)}
              className="w-full md:w-auto bg-white text-blue-900 border border-blue-100 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-sm active:scale-95"
            >
               View Quality Charter
            </button>
         </div>
      </section>

      {/* Profile Modal */}
      {selectedTutor && renderDetailedProfile(selectedTutor)}
    </div>
  );
};

export default TutorsPage;