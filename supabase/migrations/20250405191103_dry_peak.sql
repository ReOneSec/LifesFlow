/*
  # Fix Admin Permissions and Add Blood Group Tracking

  1. Changes
    - Add blood_group_changes table to track blood group modifications
    - Update RLS policies for blog_posts and news_articles
    - Fix admin access permissions

  2. Security
    - Enable RLS on new table
    - Update admin policies to use proper authentication checks
*/

-- Create blood_group_changes table
CREATE TABLE IF NOT EXISTS blood_group_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  old_blood_group text,
  new_blood_group text NOT NULL,
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blood_group_changes ENABLE ROW LEVEL SECURITY;

-- Update blog posts policies
DROP POLICY IF EXISTS "Admin can manage all blog posts" ON blog_posts;
CREATE POLICY "Admin can manage all blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = 'lifesflow@proton.me'::text)
  WITH CHECK ((auth.jwt() ->> 'email'::text) = 'lifesflow@proton.me'::text);

-- Update news articles policies
DROP POLICY IF EXISTS "Admin can manage all news articles" ON news_articles;
CREATE POLICY "Admin can manage all news articles"
  ON news_articles FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = 'lifesflow@proton.me'::text)
  WITH CHECK ((auth.jwt() ->> 'email'::text) = 'lifesflow@proton.me'::text);

-- Add policies for blood_group_changes
CREATE POLICY "Users can view their own blood group changes"
  ON blood_group_changes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blood group changes"
  ON blood_group_changes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);