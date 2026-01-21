
export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  keywords: string[];
}

export interface Tutor {
  id: string;
  name: string;
  specializations: string[];
  experience: string;
  image: string;
  rating: number;
  availability: 'Available' | 'Limited' | 'Full';
  bio: string;
  philosophy: string;
  languages: string[];
  education: string[];
  isFemale?: boolean;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  content: string;
  rating: number;
  image: string;
}

export type FacultyTier = 'STANDARD' | 'SENIOR' | 'ELITE';

export type UserRole = 
  | 'DIRECTOR' 
  | 'DEAN' 
  | 'TUTOR' 
  | 'REGISTRAR' 
  | 'BURSAR' 
  | 'GUARDIAN' 
  | 'STUDENT';

export type AppLanguage = 'EN' | 'AR' | 'UR' | 'FR' | 'TR' | 'MS';

// Relational Schema for Registry
export interface RegistryUser {
  academyId: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  authProvider: 'EMAIL' | 'GOOGLE';
  role: UserRole;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  course?: string;
  tier?: FacultyTier;
  timestamp: number;
  hasPaid?: boolean;
  
  // SQL-Like Relational Fields
  guardianId?: string; // Links Student to Guardian
  linkedStudentIds?: string[]; // Links Guardian to Students
  
  // Pro Metrics
  streakCount?: number;
  points?: number;
  progressPercent?: number;
  rank?: 'NOVICE' | 'QARI' | 'SCHOLAR' | 'IJAZAH_CANDIDATE';
  
  // AI Mastery Stats
  avgPronunciationScore?: number;
  lastRecitedAyah?: string;

  // I18n Preference
  preferredLanguage?: AppLanguage;
}

export enum NavPage {
  HOME = 'home',
  ABOUT = 'about',
  COURSES = 'courses',
  TUTORS = 'tutors',
  PRICING = 'pricing',
  CONTACT = 'contact',
  REGISTER = 'register',
  RESOURCES = 'resources',
  LIVE_CLASS = 'live-class',
  READ_QURAN = 'read-quran',
  BECOME_TUTOR = 'become-tutor',
  DASHBOARD = 'dashboard',
  DAILY_DUAS = 'daily-duas',
  ADMIN = 'admin',
  AI_LAB = 'ai-lab',
  FAQ = 'faq'
}
