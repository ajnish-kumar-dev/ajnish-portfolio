-- Profile Views (Analytics)
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

ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can view analytics"
  ON profile_views FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert profile views"
  ON profile_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX idx_profile_views_created_at ON profile_views(created_at DESC);
CREATE INDEX idx_profile_views_country ON profile_views(country);
CREATE INDEX idx_profile_views_device_type ON profile_views(device_type);

-- Chatbot Logs Table
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

ALTER TABLE chatbot_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can view chatbot logs"
  ON chatbot_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert chatbot logs"
  ON chatbot_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX idx_chatbot_logs_session_id ON chatbot_logs(session_id);
CREATE INDEX idx_chatbot_logs_created_at ON chatbot_logs(created_at DESC);
CREATE INDEX idx_chatbot_logs_intent ON chatbot_logs(intent_detected);