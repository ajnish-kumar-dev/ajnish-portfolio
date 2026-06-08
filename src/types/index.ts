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

// Experience Database Type
export interface ExperienceDB {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExperienceInput {
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  description: string;
  responsibilities?: string[];
  technologies?: string[];
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  sort_order?: number;
  published?: boolean;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

// ============================================================================
// MARKETPLACE TYPES
// ============================================================================

// User Profile
export interface UserProfile {
  id: string;
  full_name?: string;
  company?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  role: 'client' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface UserProfileInput {
  full_name?: string;
  company?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

// Product
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  category: string;
  price: number;
  compare_at_price?: number;
  image_url?: string;
  gallery_urls?: string[];
  features?: string[];
  status: 'active' | 'draft' | 'archived';
  stock_quantity: number;
  sku?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  slug?: string;
  description: string;
  short_description?: string;
  category: string;
  price: number;
  compare_at_price?: number;
  image_url?: string;
  gallery_urls?: string[];
  features?: string[];
  status?: 'active' | 'draft' | 'archived';
  stock_quantity?: number;
  sku?: string;
  metadata?: Record<string, unknown>;
}

// Order
export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'processing' | 'active' | 'completed' | 'cancelled' | 'refunded';
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  coupon_code?: string;
  billing_name: string;
  billing_email: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_country?: string;
  billing_postal_code?: string;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface OrderInput {
  billing_name: string;
  billing_email: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_country?: string;
  billing_postal_code?: string;
  payment_method?: string;
  coupon_code?: string;
  notes?: string;
}

// Invoice
export interface Invoice {
  id: string;
  invoice_number: string;
  order_id: string;
  user_id: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  due_date?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  order?: Order;
}

// Cart Item
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

// Coupon
export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value?: number;
  max_uses?: number;
  current_uses: number;
  valid_from?: string;
  valid_until?: string;
  active: boolean;
  created_at: string;
}

// Product Review
export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  review?: string;
  verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
}

export interface ProductReviewInput {
  product_id: string;
  rating: number;
  title?: string;
  review?: string;
}

// Dashboard Stats
export interface MarketplaceStats {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  total_clients: number;
  pending_orders: number;
  recent_orders: Order[];
  top_products: Array<{ product: Product; sales: number }>;
}

export interface ClientStats {
  total_orders: number;
  total_spent: number;
  active_orders: number;
  pending_invoices: number;
}