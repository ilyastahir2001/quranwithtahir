
import React from 'react';
import { Book, Heart, Globe, Shield, Star, Users, Award, Clock, CheckCircle2, ShieldCheck, GraduationCap } from 'lucide-react';
import { Course, Tutor, Review } from './types';

export const BRAND = {
  name: "QuranWithTahir.com",
  tagline: "Global Authority in Quranic Excellence & Spiritual Mentorship",
  director: "Ilyas Tahir",
  role: "Founding CEO & Director of Faculty",
  mission: "To cultivate a generation of Quranic ambassadors through elite 1-on-1 scholarly mentorship.",
  phone: "+92 311 0267879",
  email: "ilyastahir2001@gmail.com",
  address: "International Academic Headquarters",
  accreditations: ["Al-Azhar University Certified", "Islamic University of Madinah Aligned", "W.H.O. Child Safety Standard"],
  colors: {
    primary: "#0A192F",
    secondary: "#10b981",
    accent: "#D4AF37", // Academy Gold
    corporate: "#020617"
  }
};

export interface EnhancedCourse extends Course {
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  studentsCount: string;
  seoTarget: string;
  curriculum: string[];
}

export const COURSES: EnhancedCourse[] = [
  {
    id: "1",
    title: "Noorani Qaida Mastery",
    description: "The Director's proprietary 'Foundation First' methodology. We focus on 'Makharij' (articulation points) using an interactive, kid-friendly methodology that ensures 100% correct pronunciation from day one.",
    icon: "BookOpen",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=800",
    keywords: ["Noorani Qaida online", "Quran for beginners", "Kids Quran classes"],
    level: 'Beginner',
    duration: '3-6 Months',
    studentsCount: '2,400+',
    seoTarget: 'Learn Noorani Qaida Online for Kids with Perfect Makharij Pronunciation',
    curriculum: ["Alphabet Recognition", "Harakaat (Vowels)", "Tanween Mastery", "Joint Letters"]
  },
  {
    id: "2",
    title: "Tajweed & Tarteel Masterclass",
    description: "Learn to recite the Quran like a Qari. This course covers the intricate rules of Noon Sakinah, Meem Sakinah, and Madd, transforming your recitation into a spiritual art form under the Director's syllabus.",
    icon: "Mic",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800",
    keywords: ["Learn Tajweed online", "Quran recitation classes", "Tajweed teacher"],
    level: 'Intermediate',
    duration: '6-12 Months',
    studentsCount: '1,850+',
    seoTarget: 'Advanced Online Tajweed and Tarteel Mastery Classes for Melodic Quran Recitation',
    curriculum: ["Rules of Noon Sakinah", "Rules of Meem Sakinah", "Sifat-ul-Huroof", "Stop Rules (Waqf)"]
  },
  {
    id: "3",
    title: "Elite Hifz (Memorization)",
    description: "A scientifically structured memorization program based on the Director's 'Isnad' system. We use the 'Lauh' and 'Sabak' techniques to ensure long-term retention and spiritual connection.",
    icon: "Brain",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800",
    keywords: ["Online Hifz course", "Memorize Quran online", "Hifz tutor"],
    level: 'Advanced',
    duration: 'Self-Paced',
    studentsCount: '900+',
    seoTarget: 'Memorize Quran Online with Guided Hifz Program using Sabak and Lauh Techniques',
    curriculum: ["Short Surahs", "Juz Amma", "Full Quran Path", "Revision Techniques"]
  },
  {
    id: "4",
    title: "Tafseer & Academic Wisdom",
    description: "Deep contextual analysis (Sabab al-Nuzul) and linguistic miracles of the Holy Quran with senior academic scholars hand-picked by the Director.",
    icon: "Compass",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800",
    keywords: ["Learn Tafseer online", "Quran translation classes", "Islamic interpretation"],
    level: 'Advanced',
    duration: 'Ongoing',
    studentsCount: '1,200+',
    seoTarget: 'Online Quran Tafseer Classes - Understand Contextual Revelation and Linguistic Miracles',
    curriculum: ["Historical Context", "Linguistic Miracles", "Modern Application", "Ethics of Quran"]
  }
];

export const TUTORS: Tutor[] = [
  {
    id: "1",
    name: "Sheikh Abdullah Ahmed",
    specializations: ["Tajweed Expert", "Qirat Specialist", "Ijazah Holder"],
    experience: "12+ Years",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    rating: 5.0,
    availability: 'Available',
    bio: "Sheikh Abdullah is a renowned Qari with certifications from Al-Azhar. He follows the Director's high-standard pedagogical framework.",
    philosophy: "I believe that every student has a unique rhythm. My goal is to find that rhythm and align it with the Divine melody of the Quran.",
    languages: ["Arabic (Native)", "English (Fluent)", "Urdu"],
    education: ["B.A. Islamic Studies, Al-Azhar University", "Ijazah in Hafs 'an 'Asim"]
  },
  {
    id: "2",
    name: "Ustadha Fatima Zahra",
    specializations: ["Female Tutor", "Kids Specialist", "Noorani Qaida"],
    experience: "8+ Years",
    image: "https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    availability: 'Limited',
    isFemale: true,
    bio: "Ustadha Fatima specializes in early childhood Quranic education. She is the Director's Lead for the Female Academic Wing.",
    philosophy: "Teaching children requires more than knowledge; it requires a heart full of patience and a soul full of light.",
    languages: ["English (Fluent)", "Arabic", "Urdu"],
    education: ["M.A. Islamic Pedagogy", "Certified Montessori Educator"]
  }
];

export const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Ahmed Khan",
    location: "London, UK",
    content: "QuranWithTahir has changed the way my kids learn. The Director's personal oversight is evident in every class.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=100"
  }
];

export const STATS = [
  { label: "Hearts Inspired", value: "5200+", icon: <Users className="w-6 h-6" /> },
  { label: "Elite Scholars", value: "180+", icon: <Award className="w-6 h-6" /> },
  { label: "Global Reach", value: "48+", icon: <Globe className="w-6 h-6" /> },
  { label: "Director's Rating", value: "5.0", icon: <Star className="w-6 h-6" /> }
];
