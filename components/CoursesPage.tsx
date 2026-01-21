
import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle, Clock, Star, Users, ArrowRight, Zap, Target, 
  Award, ShieldCheck, GraduationCap, ChevronRight, BarChart, Search, Info, ListChecks
} from 'lucide-react';
import { COURSES, BRAND, EnhancedCourse } from '../constants';
import { NavPage } from '../types';

interface CourseCardProps {
  course: EnhancedCourse;
  onEnroll: () => void;
}

// Added missing CoursesPageProps interface to fix compilation error
interface CoursesPageProps {
  onNavigate: (page: NavPage) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  const [showCurriculum, setShowCurriculum] = useState(false);

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col relative">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.seoTarget} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-md text-blue-900 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
            {course.level}
          </span>
          <span className="bg-emerald-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
            Ijazah Track
          </span>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
           <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <Star size={14} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Top Rated Curriculum</span>
           </div>
           <h3 className="text-2xl font-black text-white leading-tight">{course.title}</h3>
        </div>
      </div>

      <div className="p-8 flex-grow flex flex-col">
        <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
          {course.description}
        </p>

        <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50 mb-8">
           <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                 <Clock size={18} />
              </div>
              <div>
                 <p className="text-slate-400 text-[8px] font-black uppercase tracking-tighter">Est. Duration</p>
                 <p className="text-blue-950 text-xs font-black">{course.duration}</p>
              </div>
           </div>
           <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                 <Users size={18} />
              </div>
              <div>
                 <p className="text-slate-400 text-[8px] font-black uppercase tracking-tighter">Active Souls</p>
                 <p className="text-blue-950 text-xs font-black">{course.studentsCount}</p>
              </div>
           </div>
        </div>

        <button 
           onClick={() => setShowCurriculum(!showCurriculum)}
           className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 hover:gap-4 transition-all"
        >
           <ListChecks size={16} />
           <span>{showCurriculum ? 'Hide Full Syllabus' : 'View Full Syllabus'}</span>
        </button>

        {showCurriculum && (
           <div className="space-y-3 mb-8 animate-in slide-in-from-top-4 duration-500">
              {course.curriculum?.map((item, i) => (
                 <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-[11px] font-bold text-slate-700">{item}</span>
                 </div>
              ))}
           </div>
        )}

        <button 
          onClick={onEnroll}
          className="mt-auto w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center space-x-3 group active:scale-95"
        >
          <span>Join Thousands of Learners Worldwide!</span>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = COURSES.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-24 min-h-screen bg-[#f8fafc]">
      <section className="bg-slate-950 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-8">
              <GraduationCap size={16} className="text-blue-400" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Proprietary Academic Pedagogy</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
              A Curriculum Crafted for <br />
              <span className="text-emerald-400 underline decoration-white/10 underline-offset-8 italic font-light">Spiritual Excellence.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              We provide the world's most comprehensive online Quranic education. Each program is structured to transform a beginner into a master.
            </p>
            
            <div className="max-w-xl mx-auto relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl group-focus-within:bg-blue-500/30 transition-all rounded-full"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/10 p-2 rounded-full flex items-center">
                 <Search className="ml-6 text-slate-400" size={20} />
                 <input 
                    type="text" 
                    placeholder="Search for Tajweed, Hifz, or Qaida..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow bg-transparent border-none outline-none text-white px-4 py-3 font-bold placeholder:text-slate-500"
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEnroll={() => onNavigate(NavPage.REGISTER)} 
            />
          ))}
        </div>
      </section>

      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
               <h2 className="text-4xl font-black text-blue-950 mb-8 leading-tight">Expert Guidance for Your <span className="text-blue-600">Decision</span></h2>
               <p className="text-slate-500 text-lg mb-12 font-medium leading-relaxed">
                 Still unsure which program is right for your family? Our admissions team is available for a free spiritual assessment.
               </p>
               
               <div className="space-y-6">
                  {[
                    { q: "Can my child learn with a female tutor?", a: "Yes. We have a dedicated wing of expert female scholars for sisters and children." },
                    { q: "What if we miss a class?", a: "Our platform allows you to reschedule 24 hours in advance with zero penalty." },
                    { q: "Is Noorani Qaida enough to start?", a: "It is the perfect foundation. Once completed, your child will transition to Tajweed Mastery automatically." }
                  ].map((faq, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                       <h4 className="text-blue-900 font-black mb-2 flex items-center space-x-3">
                          <CheckCircle size={18} className="text-emerald-500" />
                          <span>{faq.q}</span>
                       </h4>
                       <p className="text-slate-500 text-sm font-medium pl-8">{faq.a}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-slate-950 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-600/5 group-hover:scale-110 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                     <Zap size={40} className="text-emerald-400" />
                  </div>
                  <h3 className="text-white text-3xl font-black mb-6">Claim Your 3-Day Free Trial</h3>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                    Experience our high-tech portal and meet your tutor before committing. 100% risk-free.
                  </p>
                  <button 
                    onClick={() => onNavigate(NavPage.REGISTER)}
                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-500 transition-all shadow-2xl active:scale-95"
                  >
                    Start My Quran Journey
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
