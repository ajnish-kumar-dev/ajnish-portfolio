-- Testimonials Table
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

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX idx_testimonials_approved ON testimonials(approved) WHERE approved = true;
CREATE INDEX idx_testimonials_featured ON testimonials(featured) WHERE featured = true;
CREATE INDEX idx_testimonials_rating ON testimonials(rating DESC);
CREATE INDEX idx_testimonials_sort_order ON testimonials(sort_order);