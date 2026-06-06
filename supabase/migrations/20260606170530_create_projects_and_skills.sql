-- Projects Table
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

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_sort_order ON projects(sort_order);
CREATE INDEX idx_projects_published ON projects(published) WHERE published = true;

-- Skills Table
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

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_featured ON skills(featured) WHERE featured = true;
CREATE INDEX idx_skills_proficiency ON skills(proficiency DESC);
CREATE INDEX idx_skills_sort_order ON skills(sort_order);