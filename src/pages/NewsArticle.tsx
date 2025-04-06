import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowLeft } from 'lucide-react';
import type { NewsArticle } from '../lib/supabase';

function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching news article:', error);
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

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
            <Link to="/news" className="text-red-600 hover:text-red-700">
              Return to news
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
          to="/news"
          className="inline-flex items-center text-red-600 hover:text-red-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to news
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(article.published_at || article.created_at).toLocaleDateString()}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>
            <div className="prose max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
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

export default NewsArticlePage;