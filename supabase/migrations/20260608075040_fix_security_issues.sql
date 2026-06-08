-- Security Fixes Migration
-- Fixes: Function search path mutability, RLS policy bypasses

-- ============================================================================
-- 1. FIX FUNCTION SEARCH PATH MUTABILITY
-- ============================================================================

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  order_num TEXT;
BEGIN
  order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN order_num;
END;
$$;

-- Fix generate_invoice_number function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  invoice_num TEXT;
BEGIN
  invoice_num := 'INV-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN invoice_num;
END;
$$;

-- ============================================================================
-- 2. FIX RLS POLICIES - Remove overly permissive policies and add proper ones
-- ============================================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can manage comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can insert chatbot logs" ON public.chatbot_logs;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can delete messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can manage experience" ON public.experience;
DROP POLICY IF EXISTS "Anyone can insert profile views" ON public.profile_views;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can manage site config" ON public.site_config;
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON public.skills;
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON public.testimonials;

-- ============================================================================
-- BLOG COMMENTS - Proper RLS policies
-- ============================================================================

-- Public can read approved comments
CREATE POLICY "public_read_approved_comments" ON public.blog_comments FOR SELECT
  USING (approved = true);

-- Admin can manage all comments
CREATE POLICY "admin_manage_comments" ON public.blog_comments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Anyone can submit comments (needs approval)
CREATE POLICY "anyone_insert_comments" ON public.blog_comments FOR INSERT
  WITH CHECK (approved = false OR approved IS NULL);

-- ============================================================================
-- BLOG POSTS - Proper RLS policies
-- ============================================================================

-- Public can read published posts
CREATE POLICY "public_read_published_posts" ON public.blog_posts FOR SELECT
  USING (published = true);

-- Admin can manage all posts
CREATE POLICY "admin_manage_posts" ON public.blog_posts FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- CHATBOT LOGS - Proper RLS policies
-- ============================================================================

-- Only allow inserts with valid data
CREATE POLICY "authenticated_insert_chatbot_logs" ON public.chatbot_logs FOR INSERT
  TO authenticated
  WITH CHECK (session_id IS NOT NULL AND user_message IS NOT NULL AND bot_response IS NOT NULL);

CREATE POLICY "anon_insert_chatbot_logs" ON public.chatbot_logs FOR INSERT
  TO anon
  WITH CHECK (session_id IS NOT NULL AND user_message IS NOT NULL AND bot_response IS NOT NULL);

-- Admin can read all logs
CREATE POLICY "admin_read_chatbot_logs" ON public.chatbot_logs FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- CONTACT MESSAGES - Proper RLS policies
-- ============================================================================

-- Anyone can submit contact messages (with required fields)
CREATE POLICY "anyone_insert_contact_messages" ON public.contact_messages FOR INSERT
  WITH CHECK (name IS NOT NULL AND email IS NOT NULL AND message IS NOT NULL);

-- Admin can read all messages
CREATE POLICY "admin_read_contact_messages" ON public.contact_messages FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can update messages (for status changes)
CREATE POLICY "admin_update_contact_messages" ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can delete messages
CREATE POLICY "admin_delete_contact_messages" ON public.contact_messages FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- EXPERIENCE - Proper RLS policies
-- ============================================================================

-- Public can read published experience entries
CREATE POLICY "public_read_published_experience" ON public.experience FOR SELECT
  USING (published = true);

-- Admin can manage all experience entries
CREATE POLICY "admin_manage_experience" ON public.experience FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- PROFILE VIEWS - Proper RLS policies
-- ============================================================================

-- Allow inserts with required fields
CREATE POLICY "anon_insert_profile_views" ON public.profile_views FOR INSERT
  TO anon
  WITH CHECK (visitor_id IS NOT NULL);

CREATE POLICY "authenticated_insert_profile_views" ON public.profile_views FOR INSERT
  TO authenticated
  WITH CHECK (visitor_id IS NOT NULL);

-- Admin can read all profile views
CREATE POLICY "admin_read_profile_views" ON public.profile_views FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- PROJECTS (Portfolio) - Proper RLS policies
-- ============================================================================

-- Public can read published projects
CREATE POLICY "public_read_published_projects" ON public.projects FOR SELECT
  USING (published = true);

-- Admin can manage all projects
CREATE POLICY "admin_manage_projects" ON public.projects FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- SITE CONFIG - Proper RLS policies
-- ============================================================================

-- Public can read site config
CREATE POLICY "public_read_site_config" ON public.site_config FOR SELECT
  USING (true);

-- Admin can manage site config
CREATE POLICY "admin_manage_site_config" ON public.site_config FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- SKILLS - Proper RLS policies
-- ============================================================================

-- Public can read published skills
CREATE POLICY "public_read_published_skills" ON public.skills FOR SELECT
  USING (published = true);

-- Admin can manage all skills
CREATE POLICY "admin_manage_skills" ON public.skills FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- TESTIMONIALS - Proper RLS policies
-- ============================================================================

-- Public can read approved testimonials
CREATE POLICY "public_read_approved_testimonials" ON public.testimonials FOR SELECT
  USING (approved = true);

-- Admin can manage all testimonials
CREATE POLICY "admin_manage_testimonials" ON public.testimonials FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));