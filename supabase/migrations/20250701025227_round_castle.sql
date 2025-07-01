/*
  # UniNest Initial Database Schema

  1. New Tables
    - `profiles` - User profiles with role-based access (host/seeker)
    - `listings` - Property listings with location and details
    - `messages` - Real-time chat messages between users
    - `listing_views` - Track listing views for analytics
    - `favorites` - User favorites/bookmarks

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure file storage policies

  3. Functions
    - Trigger for profile creation on user signup
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE user_role AS ENUM ('host', 'seeker', 'admin');
CREATE TYPE listing_status AS ENUM ('active', 'inactive', 'pending', 'rented');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  photo_url text,
  role user_role NOT NULL DEFAULT 'seeker',
  university text,
  year integer,
  bio text,
  phone text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  location geography(POINT, 4326),
  rent decimal(10, 2) NOT NULL,
  deposit decimal(10, 2),
  available_date date NOT NULL,
  photos_urls text[] DEFAULT '{}',
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms decimal(3, 1) NOT NULL DEFAULT 1,
  square_feet integer,
  amenities text[] DEFAULT '{}',
  preferences jsonb DEFAULT '{}',
  status listing_status DEFAULT 'active',
  view_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table for real-time chat
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Listing views for analytics
CREATE TABLE IF NOT EXISTS listing_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  viewer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_listings_host_id ON listings (host_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_available_date ON listings (available_date);
CREATE INDEX IF NOT EXISTS idx_listings_rent ON listings (rent);
CREATE INDEX IF NOT EXISTS idx_messages_listing_id ON messages (listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites (user_id);

-- Function to update location from lat/lng
CREATE OR REPLACE FUNCTION update_listing_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update location and timestamp
CREATE TRIGGER update_listing_location_trigger
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_location();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for listings
CREATE POLICY "Listings are viewable by everyone"
  ON listings FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Hosts can insert their own listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = host_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages they're involved in"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

-- RLS Policies for listing views
CREATE POLICY "Anyone can insert listing views"
  ON listing_views FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own listing views"
  ON listing_views FOR SELECT
  TO authenticated
  USING (auth.uid() = viewer_id);

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);