import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowLeft } from 'lucide-react';
import type { BlogPost } from '../lib/supabase';

function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
            <Link to="/blog" className="text-red-600 hover:text-red-700">
              Return to blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-red-600 hover:text-red-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to blog
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.published_at || post.created_at).toLocaleDateString()}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>
            <div className="prose max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default BlogPostPage;