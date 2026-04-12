/*
  # Agents & Inquiries Tables

  ## New Tables

  ### 1. `agents`
  Property consultants displayed on listing pages.

  ### 2. `inquiries`
  Contact form and property inquiry submissions.
  - Public INSERT allowed (anonymous visitors can submit)
  - No public SELECT (admin only via service role)
*/

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL DEFAULT 'Property Consultant',
  photo_url text,
  phone text,
  email text,
  rating numeric DEFAULT 5.0 CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view agents"
  ON agents FOR SELECT
  TO anon, authenticated
  USING (true);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  source text DEFAULT 'contact_form' CHECK (source IN ('contact_form', 'property_inquiry')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
CREATE POLICY "Public can submit inquiries"
  ON inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Index for fast lookup by property
CREATE INDEX IF NOT EXISTS inquiries_property_id_idx ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries(created_at DESC);

-- Seed default agents
INSERT INTO agents (name, title, photo_url, phone, email, rating) VALUES
  ('Ahmed Al Rashid', 'Senior Property Consultant', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', '+971 4 555 1234', 'ahmed@luxestate.ae', 5.0),
  ('Sara Al Mansoori', 'Luxury Residential Specialist', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', '+971 4 555 5678', 'sara@luxestate.ae', 4.9),
  ('James Mitchell', 'Commercial Property Expert', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', '+971 4 555 9012', 'james@luxestate.ae', 4.8)
ON CONFLICT DO NOTHING;
