import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar } from 'lucide-react';
import type { NewsArticle } from '../lib/supabase';

function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching news articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest News</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news about blood donation drives, success stories, and community events.
          </p>
        </div>

        <div className="grid gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="md:flex">
                {article.image_url && (
                  <div className="md:flex-shrink-0">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="h-48 w-full md:w-48 object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(article.published_at || article.created_at).toLocaleDateString()}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link to={`/news/${article.slug}`} className="hover:text-red-600">
                      {article.title}
                    </Link>
                  </h2>
                  {article.excerpt && (
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  )}
                  <Link
                    to={`/news/${article.slug}`}
                    className="text-red-600 hover:text-red-700 font-medium inline-flex items-center"
                  >
                    Read more
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No news articles available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default News;