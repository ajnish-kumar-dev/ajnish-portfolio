-- Site Configuration Table
CREATE TABLE IF NOT EXISTS site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by text
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site config"
  ON site_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage site config"
  ON site_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  position text NOT NULL,
  location text,
  start_date date NOT NULL,
  end_date date,
  current boolean DEFAULT false,
  description text NOT NULL,
  responsibilities text[] DEFAULT '{}',
  technologies text[] DEFAULT '{}',
  employment_type text DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship', 'freelance')),
  sort_order integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published experience"
  ON experience FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can manage experience"
  ON experience FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_experience_current ON experience(current) WHERE current = true;
CREATE INDEX idx_experience_sort_order ON experience(sort_order);
CREATE INDEX idx_experience_published ON experience(published) WHERE published = true;