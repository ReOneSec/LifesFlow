import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  alt_mobile?: string;
  age: number;
  weight: number;
  blood_group: string;
  last_donation_date?: string;
  village: string;
  block: string;
  pin: string;
  district: string;
  state: string;
  created_at: string;
  updated_at: string;
};

export type BloodRequest = {
  id: string;
  patient_name: string;
  guardian_name?: string;
  mobile: string;
  alt_mobile?: string;
  age: number;
  units_needed: number;
  blood_group: string;
  urgency_level: 'Urgent' | 'Within 24h' | 'Within 48h' | 'Within 72h' | 'Scheduled';
  village: string;
  block: string;
  pin: string;
  district: string;
  state: string;
  receiving_address: string;
  status: 'pending' | 'matched' | 'completed' | 'cancelled';
  requester_id: string;
  created_at: string;
  updated_at: string;
};

export type Donation = {
  id: string;
  donor_id: string;
  request_id: string;
  donation_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  excerpt?: string;
  author_id: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  excerpt?: string;
  author_id: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
};
