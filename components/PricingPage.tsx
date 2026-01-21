
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Zap, ShieldCheck, HelpCircle, ArrowRight, 
  MessageCircle, DollarSign, Globe, Percent, Users, 
  TrendingUp, Clock, Info, AlertTriangle, Check, X,
  CreditCard, Calendar, RefreshCcw
} from 'lucide-react';
import { BRAND } from '../constants';
import { NavPage } from '../types';

interface PricingPageProps {
  onNavigate: (page: NavPage) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'GBP' | 'EUR'>('USD');
  const [studentCount, setStudentCount] = useState(1);

  const currencySymbols = { USD: '$', GBP: '£', EUR: '€' };
  const exchangeRates = { USD: 1, GBP: 0.78, EUR: 0.92 };

  const plans = [
    {
      id: "starter",
      name: "Starter Scholar",
      tagline: "The Foundation",
      desc: "Perfect for beginners getting familiar with Arabic letters and basic phonetics.",
      basePrice: 35,
      days: 2,
      duration: "30 mins",
      features: [
        "Intro to Arabic Alphabet",
        "Basic Makharij (Phonetics)",
        "Monthly Progress Report",
        "Flexible Rescheduling",
        "1-on-1 Dedicated Tutor"
      ],
      popular: false,
      color: "blue"
    },
    {
      id: "standard",
      name: "Standard Guardian",
      tagline: "Best Seller",
      desc: "The optimal frequency for children and consistent long-term learners.",
      basePrice: 65,
      days: 4,
      duration: "30 mins",
      features: [
        "Advanced Tajweed Rules",
        "Namaz & Daily Duas",
        "Islamic Ethics (Akhlaq)",
        "Weekly Teacher Evaluation",
        "Priority Support Access",
        "Free Access to Workshops"
      ],
      popular: true,
      color: "emerald"
    },
    {
      id: "elite",
      name: "Elite Hafiz",
      tagline: "Intensive Track",
      desc: "Accelerated track for Hifz (Memorization) and deep Quranic understanding.",
      basePrice: 110,
      days: 5,
      duration: "45 mins",
      features: [
        "Hifz Tracking Dashboard",
        "One-on-One Intensive Feedback",
        "Tafseer (Meaning) Deep Dive",
        "Customized Revision Plans",
        "Ijazah Certification Track",
        "Direct Support from Director"
      ],
      popular: false,
      color: "purple"
    }
  ];

  const calculatePrice = (base: number) => {
    let price = base * exchangeRates[currency];
    
    // Apply family discount (10% for 2 students, 20% for 3+)
    let familyDiscount = 1;
    if (studentCount === 2) familyDiscount = 0.9;
    else if (studentCount >= 3) familyDiscount = 0.8;
    
    price = price * studentCount * familyDiscount;

    // Apply billing cycle discount (15% for quarterly)
    if (billingCycle === 'quarterly') {
      price = (price * 3) * 0.85; 
    }
    
    return Math.round(price);
  };

  const currentSymbol = currencySymbols[currency];

  const faqs = [
    {
      category: "Billing",
      icon: <CreditCard className="text-blue-500" size={20} />,
      q: "What payment methods do you accept?",
      a: "We support all major Credit/Debit cards (Visa, Mastercard, Amex), PayPal, and direct Bank Transfers for students in the UK, EU, and USA. All transactions are encrypted and secure."
    },
    {
      category: "Billing",
      icon: <RefreshCcw className="text-emerald-500" size={20} />,
      q: "Is there a money-back guarantee?",
      a: "Absolutely. We offer a 100% refund policy if you are not satisfied after your first 3 sessions. We prioritize your spiritual satisfaction over everything else."
    },
    {
      category: "Packages",
      icon: <Users className="text-purple-500" size={20} />,
      q: "Do you offer family or sibling discounts?",
      a: "Yes! Our dynamic pricing automatically applies a 10% discount for 2 students and a 20% discount for 3 or more students from the same household. Select the student count above to see your adjusted rate."
    },
    {
      category: "Packages",
      icon: <Zap className="text-amber-500" size={20} />,
      q: "Can I switch between plans later?",
      a: "You can upgrade or downgrade your plan at any time. Any price differences will be pro-rated for the remainder of your billing cycle. No hidden fees or administrative costs."
    },
    {
      category: "Availability",
      icon: <Calendar className="text-rose-500" size={20} />,
      q: "What if I need to reschedule a class?",
      a: "Life happens. You can reschedule any class with at least 24 hours' notice through your student portal. Makeup classes are scheduled at your convenience with your assigned tutor."
    },
    {
      category: "Availability",
      icon: <ShieldCheck className="text-indigo-500" size={20} />,
      q: "Can I request a specific gender for the tutor?",
      a: "Yes, we have a large faculty of both male scholars and female Ustadhas. You can specify your preference during the registration process to ensure a comfortable learning environment."
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-white selection:bg-emerald-100">
      {/* Dynamic Hero Section */}
      <section className="bg-gray-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 mb-8 animate-float">
            <Zap size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Global Premium Education</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
            Transparent Pricing for <span className="text-emerald-500">Divine Wisdom</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
            Join thousands of satisfied parents. Professional Quranic education that scales with your family’s needs.
          </p>

          {/* MASTER CONTROLS */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
            {/* Currency */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Preferred Currency</span>
              <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex">
                {Object.keys(currencySymbols).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr as any)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${currency === curr ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105' : 'text-gray-400 hover:text-white'}`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            {/* Billing Cycle */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Billing Cycle</span>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${billingCycle === 'monthly' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-105' : 'text-gray-400 hover:text-white'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('quarterly')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${billingCycle === 'quarterly' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-105' : 'text-gray-400 hover:text-white'}`}
                >
                  Quarterly <span className="ml-1 text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full">-15% OFF</span>
                </button>
              </div>
            </div>

            {/* Family Multiplier */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Family Plan</span>
              <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex items-center px-4">
                <Users size={16} className="text-blue-400 mr-3" />
                <div className="flex space-x-3">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => setStudentCount(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-black transition-all flex items-center justify-center ${studentCount === num ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'}`}
                    >
                      {num === 3 ? '3+' : num}
                    </button>
                  ))}
                </div>
                <span className="ml-3 text-[10px] font-bold text-emerald-400">
                  {studentCount > 1 ? `-${studentCount === 2 ? '10%' : '20%'} Disc.` : 'Add Students'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-[3rem] p-10 shadow-2xl border-t-8 flex flex-col transition-all duration-500 hover:-translate-y-4 hover:shadow-emerald-500/10
                ${plan.popular ? 'border-emerald-500 scale-105 relative z-10' : 'border-gray-100'}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center space-x-2">
                  <TrendingUp size={14} />
                  <span>Director's Recommendation</span>
                </div>
              )}
              
              <div className="mb-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-3xl font-black text-blue-900">{plan.name}</h3>
                  <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${plan.popular ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {plan.tagline}
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{plan.desc}</p>
              </div>

              <div className="mb-10 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <DollarSign size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-black text-blue-900 transition-all duration-300">
                      {currentSymbol}{calculatePrice(plan.basePrice)}
                    </span>
                    <span className="text-gray-400 font-bold text-sm tracking-tight">
                      /{billingCycle === 'monthly' ? 'mo' : 'quarter'}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                     <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-tighter">
                        <Clock size={14} />
                        <span>{plan.days} Days / Wk</span>
                     </div>
                     <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-tighter">
                        <Info size={14} />
                        <span>{plan.duration} Lessons</span>
                     </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-gray-600 font-bold">
                    <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onNavigate(NavPage.REGISTER)}
                className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center space-x-3 group active:scale-95
                  ${plan.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-blue-900 text-white hover:bg-blue-800 shadow-blue-900/20'}
                `}
              >
                <span>Enroll Now</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SALES STRATEGY: COMPETITIVE COMPARISON */}
      <section className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-blue-900 mb-4">Why Smart Parents Choose Us</h2>
            <p className="text-gray-500 font-medium">We deliver 3x more value than traditional local academies at a fraction of the stress.</p>
          </div>

          <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Feature Header */}
              <div className="p-8 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="h-full flex flex-col justify-center">
                  <h4 className="text-xl font-black text-blue-900 mb-8">Value Comparison</h4>
                  <ul className="space-y-6">
                    <li className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tutor Quality</li>
                    <li className="text-sm font-bold text-gray-400 uppercase tracking-widest">Flexibility</li>
                    <li className="text-sm font-bold text-gray-400 uppercase tracking-widest">Monitoring</li>
                    <li className="text-sm font-bold text-gray-400 uppercase tracking-widest">Safety</li>
                    <li className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pricing</li>
                  </ul>
                </div>
              </div>
              
              {/* Other Platforms */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100 opacity-50 grayscale">
                <div className="h-full flex flex-col text-center">
                  <h4 className="text-xl font-black text-gray-400 mb-8">Physical Academy</h4>
                  <ul className="space-y-6">
                    <li className="flex justify-center"><AlertTriangle size={20} className="text-amber-500" /></li>
                    <li className="text-sm font-bold text-gray-500">Fixed Hours</li>
                    <li className="flex justify-center"><X size={20} className="text-red-400" /></li>
                    <li className="text-sm font-bold text-gray-500">Commute Risks</li>
                    <li className="text-sm font-bold text-gray-500">Commute Costs</li>
                  </ul>
                </div>
              </div>

              {/* QuranWithTahir */}
              <div className="p-8 bg-blue-50/50">
                <div className="h-full flex flex-col text-center">
                  <div className="inline-flex items-center justify-center space-x-2 text-blue-700 font-black text-lg mb-8">
                    <LocalGraduationCap size={20} />
                    <span>Our Academy</span>
                  </div>
                  <ul className="space-y-6">
                    <li className="flex justify-center"><Check size={20} className="text-emerald-500 stroke-[4px]" /></li>
                    <li className="text-sm font-black text-blue-900">24/7 Global Access</li>
                    <li className="flex justify-center"><Check size={20} className="text-emerald-500 stroke-[4px]" /></li>
                    <li className="text-sm font-black text-blue-900">Safe Home Environment</li>
                    <li className="text-sm font-black text-emerald-600">Family Discounts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPANDED FAQ SECTION */}
      <section className="py-24 container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
             <HelpCircle size={14} />
             <span>Transparency Desk</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-4">Pricing & Logistics <span className="text-blue-600">FAQs</span></h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">Common questions about billing, packages, and assigned tutors to help you decide with absolute confidence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-xl transition-all group flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-white group-hover:shadow-md transition-all">
                    {faq.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{faq.category}</span>
                </div>
              </div>
              <h4 className="text-lg font-black text-blue-900 mb-3 group-hover:text-blue-600 transition-colors">
                {faq.q}
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                 <MessageCircle size={32} />
              </div>
              <div>
                 <h4 className="text-xl font-black text-blue-900">Still have questions?</h4>
                 <p className="text-gray-500 text-sm font-medium">Our admissions team is available for a one-on-one consultation.</p>
              </div>
           </div>
           <a 
             href={`https://wa.me/${BRAND.phone.replace(/\+/g, '')}`}
             className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-2"
           >
              <MessageCircle size={18} />
              <span>Chat with Us</span>
           </a>
        </div>
      </section>

      {/* SALES STRATEGY: THE VALUE STACK (Director Guarantee) */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-[4rem] p-12 lg:p-24 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
          <div className="lg:w-2/5">
             <div className="relative group">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl group-hover:blur-3xl transition-all rounded-full"></div>
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600" className="w-full rounded-[3rem] shadow-2xl relative z-10 border-4 border-white/5" alt="Director Ilyas Tahir" />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-gray-100 text-center animate-bounce">
                  <div className="text-emerald-500 font-black text-3xl">100%</div>
                  <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Risk-Free</div>
                </div>
             </div>
          </div>
          <div className="lg:w-3/5 space-y-8">
             <div className="inline-flex items-center space-x-2 text-emerald-400 font-black text-xs uppercase tracking-widest">
                <ShieldCheck size={16} />
                <span>The Director's Personal Word</span>
             </div>
             <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">Your Success is My <br /> <span className="text-emerald-400 underline decoration-blue-500 underline-offset-8">Moral Responsibility</span></h2>
             <p className="text-blue-100 text-xl leading-relaxed italic font-light">
               "We aren't just selling 'hours' of tutoring. We are offering a lifelong spiritual transformation. If after 3 sessions you feel this isn't the best Quranic education you've ever experienced, I will refund your enrollment—no questions asked."
             </p>
             <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <a 
                  href={`https://wa.me/${BRAND.phone.replace(/\+/g, '')}`}
                  className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center space-x-3"
                >
                  <MessageCircle size={24} />
                  <span>Claim Your Family Discount</span>
                </a>
                <button 
                  onClick={() => onNavigate(NavPage.CONTACT)}
                  className="text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-black text-xl hover:bg-white/10 transition-all flex items-center justify-center space-x-3"
                >
                  <span>Book Free Consultation</span>
                </button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;

// Local helper icon for comparison table
const LocalGraduationCap = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);
