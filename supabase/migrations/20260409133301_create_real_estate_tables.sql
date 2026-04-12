/*
  # Real Estate Application - Core Tables

  ## Summary
  Creates the foundation for a luxury UAE real estate platform.

  ## New Tables

  ### 1. `emirates`
  Stores information about the 7 UAE Emirates
  - `id` - UUID primary key
  - `name` - Display name (e.g., "Dubai")
  - `slug` - URL-friendly identifier (e.g., "dubai")
  - `property_count` - Cached count of properties
  - `image_url` - Hero image for the emirate
  - `description` - Short description

  ### 2. `properties`
  Stores all property listings
  - `id` - UUID primary key
  - `title` - Property title
  - `price` - Listing price (AED)
  - `price_type` - "sale" or "rent"
  - `property_type` - apartment, villa, penthouse, commercial, townhouse
  - `emirate_slug` - Foreign key to emirates
  - `location` - Specific neighborhood/area
  - `bedrooms`, `bathrooms`, `sqft` - Property details
  - `image_url` - Property image
  - `description` - Full description
  - `is_featured` - Featured listing flag
  - `is_verified` - Verified listing flag

  ## Security
  - RLS enabled on both tables
  - Public read access for browsing listings (real estate sites are public)
  - No write access from client (admin only via service role)
*/

-- Emirates table
CREATE TABLE IF NOT EXISTS emirates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  property_count integer DEFAULT 0,
  image_url text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emirates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view emirates"
  ON emirates FOR SELECT
  TO anon, authenticated
  USING (true);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price numeric NOT NULL,
  price_type text DEFAULT 'sale' CHECK (price_type IN ('sale', 'rent')),
  property_type text NOT NULL CHECK (property_type IN ('apartment', 'villa', 'penthouse', 'commercial', 'townhouse')),
  emirate_slug text NOT NULL REFERENCES emirates(slug) ON DELETE CASCADE,
  location text NOT NULL,
  bedrooms integer,
  bathrooms integer,
  sqft integer,
  image_url text,
  description text,
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT true,
  amenities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view properties"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS properties_emirate_slug_idx ON properties(emirate_slug);
CREATE INDEX IF NOT EXISTS properties_price_type_idx ON properties(price_type);
CREATE INDEX IF NOT EXISTS properties_property_type_idx ON properties(property_type);
CREATE INDEX IF NOT EXISTS properties_is_featured_idx ON properties(is_featured);

-- Seed Emirates
INSERT INTO emirates (name, slug, property_count, image_url, description) VALUES
  ('Dubai', 'dubai', 24, 'https://images.pexels.com/photos/1467300/pexels-photo-1467300.jpeg', 'The city of superlatives — home to the world''s tallest tower, most luxurious hotels, and iconic skylines.'),
  ('Abu Dhabi', 'abu-dhabi', 18, 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg', 'The cosmopolitan capital of the UAE, blending traditional heritage with modern luxury living.'),
  ('Sharjah', 'sharjah', 22, 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg', 'The cultural capital of the UAE, offering affordable luxury with rich arts and heritage.'),
  ('Ajman', 'ajman', 15, 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg', 'A charming emirate with a relaxed lifestyle, pristine beaches, and competitive property prices.'),
  ('Ras Al Khaimah', 'ras-al-khaimah', 12, 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg', 'Adventure and luxury converge — from rugged Hajar Mountains to pristine Arabian Gulf beaches.'),
  ('Fujairah', 'fujairah', 10, 'https://images.pexels.com/photos/1802183/pexels-photo-1802183.jpeg', 'A tranquil escape on the Gulf of Oman, known for stunning landscapes and peaceful living.'),
  ('Umm Al Quwain', 'umm-al-quwain', 8, 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg', 'A serene coastal emirate offering an authentic UAE lifestyle away from the urban hustle.')
ON CONFLICT (slug) DO NOTHING;

-- Seed Properties - Dubai
INSERT INTO properties (title, price, price_type, property_type, emirate_slug, location, bedrooms, bathrooms, sqft, image_url, description, is_featured, amenities) VALUES
  ('Luxury Sky Villa in Downtown Dubai', 12500000, 'sale', 'penthouse', 'dubai', 'Downtown Dubai', 4, 5, 6500, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'An extraordinary sky villa with panoramic Burj Khalifa views, floor-to-ceiling windows, and world-class finishes. A true masterpiece of modern luxury living.', true, ARRAY['Pool', 'Gym', 'Concierge', 'Parking', 'Smart Home']),
  ('Ultra-Modern Villa with Private Pool', 8900000, 'sale', 'villa', 'dubai', 'Palm Jumeirah', 5, 6, 8200, 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', 'Exceptional beachfront villa on the iconic Palm Jumeirah featuring a private infinity pool, home cinema, and direct beach access.', true, ARRAY['Private Pool', 'Beach Access', 'Home Cinema', 'Gym', 'Garden']),
  ('Elegant Marina Apartment', 3200000, 'sale', 'apartment', 'dubai', 'Dubai Marina', 3, 3, 2100, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', 'Stunning high-rise apartment with full marina views, premium fittings, and access to world-class amenities in the heart of Dubai Marina.', true, ARRAY['Marina View', 'Pool', 'Gym', 'Concierge']),
  ('Premium Business Bay Penthouse', 6750000, 'sale', 'penthouse', 'dubai', 'Business Bay', 3, 4, 4800, 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg', 'Breathtaking dual-level penthouse overlooking the Dubai Canal with a private rooftop terrace and bespoke interiors.', false, ARRAY['Rooftop Terrace', 'Canal View', 'Smart Home', 'Pool', 'Valet']),
  ('Contemporary Townhouse in Jumeirah', 4200000, 'sale', 'townhouse', 'dubai', 'Jumeirah Village Circle', 4, 4, 3500, 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg', 'Beautifully designed townhouse in a gated community with lush landscaping, a private garden, and top-tier finishes throughout.', false, ARRAY['Garden', 'Parking', 'Community Pool', 'Security']),
  ('Exclusive Office Space — DIFC', 2800000, 'sale', 'commercial', 'dubai', 'DIFC', NULL, NULL, 3200, 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg', 'Grade A commercial space in the prestigious Dubai International Financial Centre with stunning city views and premium specifications.', false, ARRAY['Meeting Rooms', 'Reception', 'Parking', 'High-Speed Internet']);

-- Seed Properties - Abu Dhabi
INSERT INTO properties (title, price, price_type, property_type, emirate_slug, location, bedrooms, bathrooms, sqft, image_url, description, is_featured, amenities) VALUES
  ('Presidential Suite Residence on Saadiyat', 15000000, 'sale', 'villa', 'abu-dhabi', 'Saadiyat Island', 6, 7, 12000, 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', 'An unparalleled residential masterpiece on Saadiyat Island, adjacent to world-class museums, with private beach access and extraordinary architectural design.', true, ARRAY['Private Beach', 'Pool', 'Home Theater', 'Staff Quarters', 'Smart Home']),
  ('Corniche Waterfront Apartment', 4500000, 'sale', 'apartment', 'abu-dhabi', 'Corniche Road', 3, 3, 2800, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'Coveted Corniche apartment with sweeping Arabian Gulf views, premium interiors, and access to the finest dining and leisure facilities.', true, ARRAY['Sea View', 'Pool', 'Gym', 'Concierge']),
  ('Yas Island Luxury Villa', 7200000, 'sale', 'villa', 'abu-dhabi', 'Yas Island', 5, 5, 6800, 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', 'Magnificent villa on Yas Island with direct access to the F1 circuit, Yas Marina, and world-class theme parks and entertainment.', false, ARRAY['Private Pool', 'Garden', 'Smart Home', 'Parking']),
  ('Al Reem Island Premium Apartment', 2900000, 'sale', 'apartment', 'abu-dhabi', 'Al Reem Island', 2, 2, 1800, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', 'Modern apartment with city and canal views in the vibrant Al Reem Island community, offering contemporary living with island serenity.', false, ARRAY['Canal View', 'Pool', 'Gym', 'Retail']),
  ('Al Raha Beach Penthouse', 9800000, 'sale', 'penthouse', 'abu-dhabi', 'Al Raha Beach', 4, 4, 5500, 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg', 'Spectacular waterfront penthouse with panoramic Arabian Gulf views, private terrace, and direct beach access in the prestigious Al Raha Beach development.', true, ARRAY['Sea View', 'Private Terrace', 'Beach Access', 'Smart Home']);

-- Seed Properties - Sharjah
INSERT INTO properties (title, price, price_type, property_type, emirate_slug, location, bedrooms, bathrooms, sqft, image_url, description, is_featured, amenities) VALUES
  ('Luxury Al Majaz Corniche Villa', 5200000, 'sale', 'villa', 'sharjah', 'Al Majaz', 5, 5, 5500, 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', 'Prestige villa overlooking Al Majaz Waterfront with lush gardens, a private pool, and stunning lagoon views in one of Sharjah''s most sought-after addresses.', true, ARRAY['Lagoon View', 'Private Pool', 'Garden', 'Parking']),
  ('Waterfront Apartment in Maryam Island', 1950000, 'sale', 'apartment', 'sharjah', 'Maryam Island', 2, 2, 1650, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', 'Contemporary sea-view apartment on the exclusive Maryam Island, a master-planned waterfront community with promenades and premier dining.', true, ARRAY['Sea View', 'Pool', 'Gym', 'Promenade']),
  ('Tilal City Modern Villa', 2800000, 'sale', 'villa', 'sharjah', 'Tilal City', 4, 4, 4200, 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg', 'Architecturally stunning villa in the award-winning Tilal City development, combining modern design with spacious outdoor living areas.', false, ARRAY['Garden', 'Parking', 'Community Pool', 'Smart Home']),
  ('Aljada Penthouse', 3600000, 'sale', 'penthouse', 'sharjah', 'Aljada', 3, 3, 3200, 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg', 'Exceptional penthouse in Sharjah''s most ambitious mega-project, offering panoramic city views and access to an entertainment destination.', false, ARRAY['City View', 'Pool', 'Entertainment Hub', 'Smart Home']),
  ('Al Khan Lagoon Apartment', 1200000, 'sale', 'apartment', 'sharjah', 'Al Khan', 1, 1, 1100, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'Charming lagoon-view apartment in the serene Al Khan area, offering a tranquil lifestyle with easy access to Sharjah''s cultural landmarks.', false, ARRAY['Lagoon View', 'Pool', 'Parking']);

-- Seed Properties - Ajman
INSERT INTO properties (title, price, price_type, property_type, emirate_slug, location, bedrooms, bathrooms, sqft, image_url, description, is_featured, amenities) VALUES
  ('Beachfront Villa on Ajman Corniche', 3800000, 'sale', 'villa', 'ajman', 'Ajman Corniche', 5, 5, 5200, 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', 'Stunning beachfront villa with panoramic Gulf views, private beach access, and beautifully landscaped gardens on the iconic Ajman Corniche.', true, ARRAY['Beach Access', 'Private Pool', 'Garden', 'Smart Home']),
  ('Al Zorah Luxury Apartment', 1650000, 'sale', 'apartment', 'ajman', 'Al Zorah', 2, 2, 1800, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', 'Premium apartment in the eco-luxury Al Zorah Nature Reserve, surrounded by mangroves and with access to a 5-star golf course and marina.', true, ARRAY['Golf Course View', 'Marina', 'Pool', 'Nature Reserve']),
  ('Emirates City Modern Apartment', 780000, 'sale', 'apartment', 'ajman', 'Emirates City', 3, 2, 1950, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'Spacious modern apartment in the growing Emirates City, offering excellent value with contemporary finishes and community amenities.', false, ARRAY['Pool', 'Gym', 'Parking', 'Security']),
  ('Ajman Uptown Villa', 2200000, 'sale', 'villa', 'ajman', 'Ajman Uptown', 4, 4, 4000, 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg', 'Elegantly designed villa in Ajman Uptown featuring premium materials, private garden, and a family-friendly community environment.', false, ARRAY['Garden', 'Pool', 'Community Club', 'Parking']);

-- Seed Properties - Ras Al Khaimah
INSERT INTO properties (title, price, price_type, property_type, emirate_slug, location, bedrooms, bathrooms, sqft, image_url, description, is_featured, amenities) VALUES
  ('Mina Al Arab Waterfront Villa', 4900000, 'sale', 'villa', 'ras-al-khaimah', 'Mina Al Arab', 5, 5, 6000, 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', 'Extraordinary waterfront villa in the prestigious Mina Al Arab lagoon community with private beach, water canal views, and resort-style amenities.', true, ARRAY['Private Beach', 'Lagoon View', 'Pool', 'Smart Home']),
  ('Al Hamra Village Apartment', 1400000, 'sale', 'apartment', 'ras-al-khaimah', 'Al Hamra Village', 2, 2, 1700, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', 'Sea-view apartment in the tranquil Al Hamra Village, offering an integrated resort-living experience with golf, marina, and beach.', true, ARRAY['Sea View', 'Golf Course', 'Marina', 'Beach Access']),
  ('Hayat Island Beach Residence', 3200000, 'sale', 'villa', 'ras-al-khaimah', 'Hayat Island', 4, 4, 4500, 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', 'Exclusive beach residence on the newly developed Hayat Island, combining natural splendor with contemporary luxury design.', false, ARRAY['Beachfront', 'Private Pool', 'Garden', 'Concierge']);

-- Seed Properties - Fujairah
INSERT INTO properties (title, price, price_type, property_type, emirate_slug, location, bedrooms, bathrooms, sqft, image_url, description, is_featured, amenities) VALUES
  ('Gulf of Oman Beachfront Villa', 3500000, 'sale', 'villa', 'fujairah', 'Fujairah Corniche', 4, 4, 5000, 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', 'Magnificent beachfront villa on the pristine Gulf of Oman coastline with a private pool, lush tropical gardens, and breathtaking sea views.', true, ARRAY['Beachfront', 'Private Pool', 'Garden', 'Mountain View']),
  ('Modern Mountain View Apartment', 950000, 'sale', 'apartment', 'fujairah', 'Fujairah City', 3, 2, 2100, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', 'Contemporary apartment with dramatic views of the Hajar Mountains, blending modern comfort with Fujairah''s natural splendor.', false, ARRAY['Mountain View', 'Pool', 'Gym', 'Parking']),
  ('Dibba Beach Resort Villa', 4200000, 'sale', 'villa', 'fujairah', 'Dibba Al Fujairah', 5, 5, 5800, 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', 'Ultra-premium resort villa in scenic Dibba with unobstructed sea and mountain views, infinity pool, and a private stretch of beach.', true, ARRAY['Private Beach', 'Infinity Pool', 'Smart Home', 'Boat Dock']);

-- Seed Properties - Umm Al Quwain
INSERT INTO properties (title, price, price_type, property_type, emirate_slug, location, bedrooms, bathrooms, sqft, image_url, description, is_featured, amenities) VALUES
  ('Mangrove Bay Luxury Villa', 2800000, 'sale', 'villa', 'umm-al-quwain', 'UAQ Marina', 4, 4, 4800, 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', 'Serene waterfront villa nestled along mangrove-lined shores, offering exceptional privacy, natural beauty, and unique marine ecosystem views.', true, ARRAY['Waterfront', 'Private Pool', 'Garden', 'Boat Dock']),
  ('Falconry Estate Villa', 3900000, 'sale', 'villa', 'umm-al-quwain', 'UAQ Free Trade Zone', 5, 5, 6200, 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', 'A rare estate villa offering a truly authentic UAE experience with vast grounds, a traditional falconry facility, and a private stable.', false, ARRAY['Equestrian', 'Falconry', 'Private Pool', 'Vast Grounds']),
  ('Dreamland Waterpark Residence', 1100000, 'sale', 'apartment', 'umm-al-quwain', 'Umm Al Quwain City', 2, 2, 1600, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', 'Family-friendly waterfront apartment with lagoon views, offering a peaceful retreat with convenient access to leisure and dining.', false, ARRAY['Lagoon View', 'Pool', 'Family Friendly', 'Parking']);
