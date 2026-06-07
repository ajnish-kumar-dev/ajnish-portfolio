-- Portfolio Database Schema
-- Creates comprehensive tables for portfolio management

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  long_description text,
  technologies text[] NOT NULL DEFAULT '{}',
  demo_url text,
  github_url text,
  image_url text,
  status text DEFAULT 'completed' CHECK (status IN ('planning', 'in-progress', 'completed', 'archived')),
  featured boolean DEFAULT false,
  category text NOT NULL CHECK (category IN ('web', 'desktop', 'mobile', 'academic', 'other')),
  sort_order integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies for projects
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for projects
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_sort_order ON projects(sort_order);
CREATE INDEX idx_projects_published ON projects(published) WHERE published = true;

-- ============================================================================
-- SKILLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  description text NOT NULL,
  proficiency integer NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  category text NOT NULL CHECK (category IN ('programming', 'web', 'database', 'tools', 'soft', 'other')),
  subcategory text,
  tags text[] DEFAULT '{}',
  sort_order integer DEFAULT 0,
  featured boolean DEFAULT false,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Policies for skills
CREATE POLICY "Public can view published skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for skills
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_featured ON skills(featured) WHERE featured = true;
CREATE INDEX idx_skills_proficiency ON skills(proficiency DESC);
CREATE INDEX idx_skills_sort_order ON skills(sort_order);

-- ============================================================================
-- TESTIMONIALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_role text NOT NULL,
  client_company text,
  client_photo_url text,
  testimonial text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  approved boolean DEFAULT false,
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  approved_at timestamptz
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policies for testimonials
CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Anyone can submit testimonials"
  ON testimonials FOR INSERT
  TO anon, authenticated
  WITH CHECK (approved = false);

CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for testimonials
CREATE INDEX idx_testimonials_approved ON testimonials(approved) WHERE approved = true;
CREATE INDEX idx_testimonials_featured ON testimonials(featured) WHERE featured = true;
CREATE INDEX idx_testimonials_rating ON testimonials(rating DESC);
CREATE INDEX idx_testimonials_sort_order ON testimonials(sort_order);

-- ============================================================================
-- PROFILE VIEWS (Analytics)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text,
  ip_address text,
  user_agent text,
  referrer text,
  country text,
  city text,
  device_type text,
  browser text,
  os text,
  session_duration_seconds integer,
  pages_visited text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Policies for profile_views
CREATE POLICY "Only authenticated users can view analytics"
  ON profile_views FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert profile views"
  ON profile_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Indexes for profile_views
CREATE INDEX idx_profile_views_created_at ON profile_views(created_at DESC);
CREATE INDEX idx_profile_views_country ON profile_views(country);
CREATE INDEX idx_profile_views_device_type ON profile_views(device_type);

-- ============================================================================
-- CHATBOT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS chatbot_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  visitor_id text,
  user_message text NOT NULL,
  bot_response text NOT NULL,
  intent_detected text,
  confidence_score float,
  response_time_ms integer,
  success boolean DEFAULT true,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chatbot_logs ENABLE ROW LEVEL SECURITY;

-- Policies for chatbot_logs
CREATE POLICY "Only authenticated users can view chatbot logs"
  ON chatbot_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert chatbot logs"
  ON chatbot_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Indexes for chatbot_logs
CREATE INDEX idx_chatbot_logs_session_id ON chatbot_logs(session_id);
CREATE INDEX idx_chatbot_logs_created_at ON chatbot_logs(created_at DESC);
CREATE INDEX idx_chatbot_logs_intent ON chatbot_logs(intent_detected);

-- ============================================================================
-- BLOG POSTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image_url text,
  author text NOT NULL DEFAULT 'Ajnish Kumar',
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  read_time_minutes integer,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_enabled boolean DEFAULT true,
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for blog_posts
CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true AND published_at <= now());

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for blog_posts
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(published) WHERE published = true;
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX idx_blog_posts_views ON blog_posts(views_count DESC);

-- ============================================================================
-- BLOG COMMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES blog_comments(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  author_url text,
  content text NOT NULL,
  approved boolean DEFAULT false,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Policies for blog_comments
CREATE POLICY "Public can view approved comments"
  ON blog_comments FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Anyone can submit comments"
  ON blog_comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (approved = false);

CREATE POLICY "Authenticated users can manage comments"
  ON blog_comments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for blog_comments
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX idx_blog_comments_approved ON blog_comments(approved);

-- ============================================================================
-- SITE CONFIG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by text
);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policies for site_config
CREATE POLICY "Public can view site config"
  ON site_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage site config"
  ON site_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON blog_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();