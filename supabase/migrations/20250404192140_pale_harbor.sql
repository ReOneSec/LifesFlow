/*
  # Add Blog and News Management

  1. New Tables
    - `blog_posts`
      - Blog post content and metadata
      - Supports title, content, image URL, and publishing status
    - `news_articles`
      - News article content and metadata
      - Similar structure to blog posts for consistency

  2. Security
    - Enable RLS on new tables
    - Admin-only write access
    - Public read access for published content
*/

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  image_url text,
  excerpt text,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create news articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  image_url text,
  excerpt text,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Admin can manage all blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'lifesflow@proton.me')
  WITH CHECK (auth.jwt() ->> 'email' = 'lifesflow@proton.me');

-- News articles policies
CREATE POLICY "Public can view published news articles"
  ON news_articles FOR SELECT
  USING (published = true);

CREATE POLICY "Admin can manage all news articles"
  ON news_articles FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'lifesflow@proton.me')
  WITH CHECK (auth.jwt() ->> 'email' = 'lifesflow@proton.me');

-- Create triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();