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

// ============================================================================
// DATABASE TYPES
// ============================================================================

// Project Database Type (from database)
export interface ProjectDB {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  technologies: string[];
  demo_url?: string;
  github_url?: string;
  image_url?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'archived';
  featured: boolean;
  category: 'web' | 'desktop' | 'mobile' | 'academic' | 'other';
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// Skill Database Type (from database)
export interface SkillDB {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description: string;
  proficiency: number;
  category: 'programming' | 'web' | 'database' | 'tools' | 'soft' | 'other';
  subcategory?: string;
  tags: string[];
  sort_order: number;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// Testimonial Database Type
export interface TestimonialDB {
  id: string;
  client_name: string;
  client_role: string;
  client_company?: string;
  client_photo_url?: string;
  testimonial: string;
  rating?: number;
  project_id?: string;
  approved: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  approved_at?: string;
}

// Profile View (Analytics)
export interface ProfileViewDB {
  id: string;
  visitor_id?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  session_duration_seconds?: number;
  pages_visited: string[];
  created_at: string;
}

// Chatbot Log
export interface ChatbotLogDB {
  id: string;
  session_id: string;
  visitor_id?: string;
  user_message: string;
  bot_response: string;
  intent_detected?: string;
  confidence_score?: number;
  response_time_ms?: number;
  success: boolean;
  error_message?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Blog Post Database Type
export interface BlogPostDB {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url?: string;
  author: string;
  category: string;
  tags: string[];
  read_time_minutes?: number;
  views_count: number;
  likes_count: number;
  comments_enabled: boolean;
  featured: boolean;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// Blog Comment Database Type
export interface BlogCommentDB {
  id: string;
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email: string;
  author_url?: string;
  content: string;
  approved: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

// Site Configuration
export interface SiteConfigDB {
  id: string;
  key: string;
  value: Record<string, unknown>;
  description?: string;
  updated_at: string;
  updated_by?: string;
}

// Input Types for Creating/Updating
export interface ProjectInput {
  title: string;
  slug?: string;
  description: string;
  long_description?: string;
  technologies: string[];
  demo_url?: string;
  github_url?: string;
  image_url?: string;
  status?: 'planning' | 'in-progress' | 'completed' | 'archived';
  featured?: boolean;
  category: 'web' | 'desktop' | 'mobile' | 'academic' | 'other';
  sort_order?: number;
  published?: boolean;
}

export interface SkillInput {
  name: string;
  slug?: string;
  icon?: string;
  description: string;
  proficiency: number;
  category: 'programming' | 'web' | 'database' | 'tools' | 'soft' | 'other';
  subcategory?: string;
  tags?: string[];
  sort_order?: number;
  featured?: boolean;
  published?: boolean;
}

export interface TestimonialInput {
  client_name: string;
  client_role: string;
  client_company?: string;
  client_photo_url?: string;
  testimonial: string;
  rating?: number;
  project_id?: string;
  featured?: boolean;
  sort_order?: number;
}

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  cover_image_url?: string;
  author?: string;
  category: string;
  tags?: string[];
  read_time_minutes?: number;
  comments_enabled?: boolean;
  featured?: boolean;
  published?: boolean;
}

export interface BlogCommentInput {
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email: string;
  author_url?: string;
  content: string;
}

// Analytics Types
export interface AnalyticsStats {
  total_views: number;
  unique_visitors: number;
  avg_session_duration: number;
  top_pages: Array<{ page: string; views: number }>;
  top_countries: Array<{ country: string; count: number }>;
  top_devices: Array<{ device: string; count: number }>;
  top_browsers: Array<{ browser: string; count: number }>;
}

export interface ChatbotStats {
  total_conversations: number;
  unique_sessions: number;
  avg_response_time: number;
  success_rate: number;
  top_intents: Array<{ intent: string; count: number }>;
}

// Dashboard Stats
export interface DashboardStats {
  total_projects: number;
  published_projects: number;
  total_skills: number;
  total_testimonials: number;
  pending_testimonials: number;
  total_contact_messages: number;
  new_messages: number;
  total_blog_posts: number;
  published_posts: number;
  total_profile_views: number;
  total_chatbot_conversations: number;
}