-- Blog Posts Table
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

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true AND published_at <= now());

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(published) WHERE published = true;
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX idx_blog_posts_views ON blog_posts(views_count DESC);

-- Blog Comments Table
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

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX idx_blog_comments_approved ON blog_comments(approved);