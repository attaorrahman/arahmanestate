-- ============================================================
-- BNH MasterKey — Supabase Schema & Seed Data
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- Drop old tables first (required to change column types from UUID to TEXT)
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS emirates CASCADE;

-- Drop old policies (in case they linger)
-- (ignored if they don't exist)

-- Properties table
CREATE TABLE properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  price_type TEXT NOT NULL CHECK (price_type IN ('sale', 'rent')),
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'villa', 'penthouse', 'commercial', 'townhouse')),
  emirate_slug TEXT NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  sqft INTEGER,
  image_url TEXT,
  images JSONB DEFAULT '[]',
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  amenities JSONB DEFAULT '[]',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Emirates table
CREATE TABLE emirates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  property_count INTEGER DEFAULT 0,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agents table
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  photo_url TEXT,
  phone TEXT,
  email TEXT,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inquiries table
CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  source TEXT NOT NULL,
  property_id TEXT,
  email_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Meetings table
CREATE TABLE meetings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  purpose TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partners table
CREATE TABLE partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  highlight BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE emirates ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public read emirates" ON emirates FOR SELECT USING (true);
CREATE POLICY "Public read agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Public read partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Public read meetings" ON meetings FOR SELECT USING (true);
CREATE POLICY "Public read inquiries" ON inquiries FOR SELECT USING (true);

-- Public insert for inquiries and meetings (website forms)
CREATE POLICY "Public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert meetings" ON meetings FOR INSERT WITH CHECK (true);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Emirates
INSERT INTO emirates (id, name, slug, image_url, description) VALUES
  ('em-dubai', 'Dubai', 'dubai', 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg', 'The global city of luxury, innovation and world-class living.'),
  ('em-abu-dhabi', 'Abu Dhabi', 'abu-dhabi', 'https://images.pexels.com/photos/13003006/pexels-photo-13003006.jpeg', 'The UAE capital — a blend of cultural heritage and modern ambition.'),
  ('em-sharjah', 'Sharjah', 'sharjah', 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg', 'The cultural capital of the UAE with affordable luxury living.'),
  ('em-ajman', 'Ajman', 'ajman', 'https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg', 'A charming emirate on the Arabian Gulf with waterfront living.'),
  ('em-rak', 'Ras Al Khaimah', 'ras-al-khaimah', 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg', 'Breathtaking mountains meet pristine beaches in this scenic emirate.'),
  ('em-fujairah', 'Fujairah', 'fujairah', 'https://images.pexels.com/photos/1125137/pexels-photo-1125137.jpeg', 'The UAE''s east coast gem — mountains, sea and serene living.'),
  ('em-uaq', 'Umm Al Quwain', 'umm-al-quwain', 'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg', 'A tranquil retreat offering waterfront villas away from the city.')
ON CONFLICT (id) DO NOTHING;

-- Agent
INSERT INTO agents (id, name, title, photo_url, phone, email, rating) VALUES
  ('agent-001', 'Rahman Al Mansoori', 'Senior Property Consultant', 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg', '+971 55 775 7123', 'info@bnhmasterkey.ae', 5)
ON CONFLICT (id) DO NOTHING;

-- Partners
INSERT INTO partners (id, name, logo_url, highlight) VALUES
  ('p-001', 'EMAAR', null, true),
  ('p-002', 'DAMAC', null, false),
  ('p-004', 'SOBHA', null, false),
  ('p-005', 'MERAAS', null, false),
  ('p-006', 'HABIBI', null, true),
  ('p-007', 'ALDAR', null, false),
  ('p-008', 'DANUBE', null, false)
ON CONFLICT (id) DO NOTHING;
