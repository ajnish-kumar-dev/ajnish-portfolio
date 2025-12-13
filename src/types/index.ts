// Core type definitions for the portfolio application
export interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  proficiency: number;
  category: 'programming' | 'web' | 'tools' | 'soft';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
  category: 'web' | 'mobile' | 'desktop' | 'academic';
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  username?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  profileImage?: string;
}

export interface Stats {
  yearsOfStudy: number;
  projectsCompleted: number;
  technologiesLearned: number;
  certificationsEarned: number;
}

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}