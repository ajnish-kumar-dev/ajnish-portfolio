/*
  # Create Contact Messages Table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text) - Visitor's name
      - `email` (text) - Visitor's email
      - `subject` (text) - Message subject
      - `message` (text) - Message content
      - `status` (text) - Message status (new, read, replied)
      - `created_at` (timestamp) - When message was sent
      - `read_at` (timestamp) - When message was read by admin

  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy allowing public (unauthenticated) users to INSERT messages
    - Add policy allowing only authenticated admin to READ/UPDATE/DELETE messages
    
  3. Indexes
    - Index on `status` for filtering
    - Index on `created_at` for sorting
    - Index on `email` for searching
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can update messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
