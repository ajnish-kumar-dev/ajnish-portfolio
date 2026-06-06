-- Experience Table for work history
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

-- Enable RLS
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

-- Policies for experience
CREATE POLICY "Public can view published experience"
  ON experience FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can manage experience"
  ON experience FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_experience_current ON experience(current) WHERE current = true;
CREATE INDEX idx_experience_sort_order ON experience(sort_order);
CREATE INDEX idx_experience_published ON experience(published) WHERE published = true;

-- Trigger for updated_at
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();