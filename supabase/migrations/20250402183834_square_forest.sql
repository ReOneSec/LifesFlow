/*
  # Initial Schema Setup for Blood Bank

  1. New Tables
    - `profiles`
      - User profile information including donor details
      - Stores name, contact info, blood group, and address
    - `blood_requests`
      - Blood donation requests
      - Tracks patient details, requirements, and status
    - `donations`
      - Records of completed donations
      - Links donors with requests

  2. Security
    - Enable RLS on all tables
    - Policies for user data access
    - Admin access controls
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  mobile text,
  alt_mobile text,
  age integer,
  weight numeric,
  blood_group text,
  last_donation_date date,
  village text,
  block text,
  pin text,
  district text,
  state text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blood requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  guardian_name text,
  mobile text NOT NULL,
  alt_mobile text,
  age integer,
  units_needed integer NOT NULL,
  blood_group text NOT NULL,
  urgency_level text NOT NULL,
  village text,
  block text,
  pin text,
  district text,
  state text,
  receiving_address text NOT NULL,
  status text DEFAULT 'pending',
  requester_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES profiles(id),
  request_id uuid REFERENCES blood_requests(id),
  donation_date timestamptz NOT NULL,
  status text DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Blood requests policies
CREATE POLICY "Anyone can view blood requests"
  ON blood_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create blood requests"
  ON blood_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their own requests"
  ON blood_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = requester_id);

-- Donations policies
CREATE POLICY "Users can view their donations"
  ON donations FOR SELECT
  TO authenticated
  USING (auth.uid() = donor_id);

CREATE POLICY "Users can create donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blood_requests_updated_at
  BEFORE UPDATE ON blood_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();