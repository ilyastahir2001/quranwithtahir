
import React, { useState } from 'react';
import { 
  BookOpen, Download, FileText, Play, Library, 
  Search, Filter, ArrowRight, Share2, Bookmark, 
  ExternalLink, Sparkles, Database, Code, Layout, 
  FileCheck, Languages, GraduationCap 
} from 'lucide-react';
import { NavPage } from '../types';

interface Resource {
  id: string;
  title: string;
  category: string;
  type: 'PDF' | 'Video' | 'Interactive' | 'Article';
  description: string;
  image: string;
  tags: string[];
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Digital Noorani Qaida (HD)',
    category: 'Foundations',
    type: 'PDF',
    description: 'A complete, high-resolution digital version of the traditional Qaida for offline practice.',
    image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=400',
    tags: ['Beginner', 'Kids', 'Essential']
  },
  {
    id: '2',
    title: 'Interactive Tajweed Poster',
    category: 'Tajweed',
    type: 'Interactive',
    description: 'Visual map of articulation points (Makharij) with color-coded pronunciation rules.',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400',
    tags: ['Advanced', 'Visual', 'Rules']
  },
  {
    id: '3',
    title: 'Daily Sunnah Checklist',
    category: 'Lifestyle',
    type: 'PDF',
    description: 'A beautifully designed printable tracker for kids to follow daily Islamic habits.',
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=400',
    tags: ['Habits', 'Kids', 'Printable']
  },
  {
    id: '4',
    title: 'Pronunciation Mastery Series',
    category: 'Recitation',
    type: 'Video',
    description: 'Masterclass video series covering the top 10 most common mistakes in recitation.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400',
    tags: ['Correction', 'Mastery', 'Video']
  },
  {
    id: '5',
    title: 'Tafseer for Modern Teens',
    category: 'Understanding',
    type: 'Article',
    description: 'Contextual analysis of Surah Al-Kahf simplified for the modern English-speaking youth.',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=400',
    tags: ['Teens', 'English', 'Reflection']
  },
  {
    id: '6',
    title: 'Prayer (Salah) Step-by-Step',
    category: 'Fiqh',
    type: 'Interactive',
    description: 'An interactive 3D-style guide to performing Namaz with correct Arabic utterances.',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=400',
    tags: ['Salah', 'Beginner', 'Guide']
  }
];

const ResourcesPage: React.FC<{ onNavigate: (page: NavPage) => void }> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Foundations', 'Tajweed', 'Lifestyle', 'Understanding', 'Fiqh'];

  const filteredResources = RESOURCES.filter(res => 
    (activeCategory === 'All' || res.category === activeCategory) &&
    (res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="pt-24 min-h-screen bg-[#f8fafc]">
      {/* Dynamic SEO Header */}
      <section className="bg-white border-b border-gray-100 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 transform origin-top-right"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-2xl mb-6 border border-blue-600/20">
              <Library size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Digital Learning Hub</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-blue-900 mb-8 leading-[0.9]">
              Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Premium Resources</span> <br />
              for Your Spiritual Journey
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              Access curated materials designed by our expert scholars to supplement your online classes. From digital Qaidas to interactive Tajweed charts, we provide everything you need for mastery.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Search */}
            <div className="w-full lg:w-1/3 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search resources, tags, levels..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-blue-900"
              />
            </div>

            {/* Categories Scrollable */}
            <div className="w-full lg:w-2/3 flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              <Filter className="text-gray-400 shrink-0 mr-2" size={20} />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap border
                    ${activeCategory === cat 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20 scale-105' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Resources */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredResources.map((res) => (
            <div key={res.id} className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col hover:-translate-y-2 duration-500">
              <div className="relative h-64 overflow-hidden">
                <img src={res.image} alt={res.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute top-6 left-6 flex space-x-2">
                  <span className="bg-white/90 backdrop-blur-md text-blue-900 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {res.type}
                  </span>
                  <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {res.category}
                  </span>
                </div>
                {res.type === 'Video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                      <Play className="text-blue-600 ml-1" fill="currentColor" size={24} />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-10 flex-grow flex flex-col">
                <div className="flex flex-wrap gap-2 mb-6">
                  {res.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter border border-gray-100 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-black text-blue-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {res.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
                  {res.description}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <button className="flex items-center space-x-2 text-blue-600 font-black text-sm uppercase tracking-widest hover:text-blue-800 transition-colors">
                    {res.type === 'PDF' ? <Download size={18} /> : (res.type === 'Video' ? <Play size={18} /> : <ArrowRight size={18} />)}
                    <span>{res.type === 'PDF' ? 'Download' : 'Open Resource'}</span>
                  </button>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <button className="hover:text-emerald-500 transition-colors"><Bookmark size={20} /></button>
                    <button className="hover:text-blue-500 transition-colors"><Share2 size={20} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-40">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search size={40} className="text-gray-300" />
            </div>
            <h3 className="text-3xl font-black text-blue-900 mb-2">No Matching Resources</h3>
            <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
            <button 
              onClick={() => {setActiveCategory('All'); setSearchQuery('');}}
              className="mt-8 text-blue-600 font-bold underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Feature Request / Help Section */}
      <section className="container mx-auto px-4 pb-24">
        <div className="bg-gradient-to-br from-gray-900 to-blue-950 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden text-center lg:text-left flex flex-col lg:flex-row items-center justify-between">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
          
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
              Can't find what <br /> you're <span className="text-emerald-400">looking for?</span>
            </h2>
            <p className="text-blue-100 text-lg opacity-80 max-w-lg">
              Our academic team is constantly creating new tools. Suggest a resource, and we'll prioritize it for our community.
            </p>
          </div>

          <div className="lg:w-1/2 mt-12 lg:mt-0 flex flex-col sm:flex-row gap-6 justify-center lg:justify-end">
            <button className="bg-white text-blue-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-2xl flex items-center justify-center space-x-3">
              <Sparkles className="text-emerald-500" />
              <span>Suggest a Resource</span>
            </button>
            <button 
              onClick={() => onNavigate(NavPage.CONTACT)}
              className="border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center space-x-3"
            >
              <span>Contact Academic Help</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;
