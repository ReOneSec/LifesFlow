import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Trash2, CheckCircle, XCircle, AlertCircle, Users, FileText, Newspaper, BookOpen } from 'lucide-react';
import type { BloodRequest, Donation, Profile, BlogPost, NewsArticle } from '../lib/supabase';

type RequestWithDonor = BloodRequest & {
  donations: (Donation & { profiles: Profile })[];
};

function AdminDashboard() {
  const [requests, setRequests] = useState<RequestWithDonor[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'users' | 'blog' | 'news'>('requests');
  const [filter, setFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    excerpt: '',
    published: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    if (activeTab === 'requests') {
      fetchRequests();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'blog') {
      fetchBlogPosts();
    } else if (activeTab === 'news') {
      fetchNewsArticles();
    }
  }, [activeTab]);

  const checkAdminAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'lifesflow@proton.me') {
      navigate('/admin');
      return;
    }
  };

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select(`
          *,
          donations (
            *,
            profiles (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    }
  };

  const fetchNewsArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsArticles(data || []);
    } catch (error) {
      console.error('Error fetching news articles:', error);
      toast.error('Failed to load news articles');
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      toast.success(`Request marked as ${newStatus}`);
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request status');
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      const { error: donationsError } = await supabase
        .from('donations')
        .delete()
        .eq('request_id', requestId);

      if (donationsError) throw donationsError;

      const { error: requestError } = await supabase
        .from('blood_requests')
        .delete()
        .eq('id', requestId);

      if (requestError) throw requestError;

      toast.success('Request deleted successfully');
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      image_url: '',
      excerpt: '',
      published: false
    });
    setShowEditor(true);
  };

  const handleEdit = (item: BlogPost | NewsArticle) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      image_url: item.image_url || '',
      excerpt: item.excerpt || '',
      published: item.published
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string, type: 'blog' | 'news') => {
    if (!window.confirm(`Are you sure you want to delete this ${type} post?`)) return;

    try {
      const { error } = await supabase
        .from(type === 'blog' ? 'blog_posts' : 'news_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success(`${type === 'blog' ? 'Blog post' : 'News article'} deleted successfully`);
      if (type === 'blog') {
        fetchBlogPosts();
      } else {
        fetchNewsArticles();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const table = activeTab === 'blog' ? 'blog_posts' : 'news_articles';
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const data = {
        ...formData,
        slug,
        author_id: user.id,
        published_at: formData.published ? new Date().toISOString() : null
      };

      if (editingItem) {
        const { error } = await supabase
          .from(table)
          .update(data)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success(`${activeTab === 'blog' ? 'Blog post' : 'News article'} updated successfully`);
      } else {
        const { error } = await supabase
          .from(table)
          .insert([data]);

        if (error) throw error;
        toast.success(`${activeTab === 'blog' ? 'Blog post' : 'News article'} created successfully`);
      }

      setShowEditor(false);
      if (activeTab === 'blog') {
        fetchBlogPosts();
      } else {
        fetchNewsArticles();
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderEditor = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {editingItem ? 'Edit' : 'Create New'} {activeTab === 'blog' ? 'Blog Post' : 'News Article'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={10}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
              Published
            </label>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'blog':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Blog Posts</h2>
              <button
                onClick={handleCreateNew}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Create New Post
              </button>
            </div>
            <div className="grid gap-6">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, 'blog')}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">{post.excerpt}</p>
                    <span className={`mt-2 inline-block px-2 py-1 text-sm rounded ${
                      post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'news':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">News Articles</h2>
              <button
                onClick={handleCreateNew}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Create New Article
              </button>
            </div>
            <div className="grid gap-6">
              {newsArticles.map((article) => (
                <div key={article.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{article.title}</h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id, 'news')}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">{article.excerpt}</p>
                    <span className={`mt-2 inline-block px-2 py-1 text-sm rounded ${
                      article.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'users':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">Age: {user.age}</div>
                    <div className="text-sm text-gray-500">Weight: {user.weight} kg</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">Mobile: {user.mobile}</div>
                    {user.alt_mobile && (
                      <div className="text-sm text-gray-500">Alt: {user.alt_mobile}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Blood Group: {user.blood_group}</div>
                    {user.last_donation_date && (
                      <div className="text-sm text-gray-500">
                        Last Donation: {new Date(user.last_donation_date).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.village}, {user.block}</div>
                    <div className="text-sm text-gray-500">{user.district}, {user.state}</div>
                    <div className="text-sm text-gray-500">PIN: {user.pin}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.patient_name}</div>
                    <div className="text-sm text-gray-500">Age: {request.age}</div>
                    <div className="text-sm text-gray-500">Mobile: {request.mobile}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Blood Group: {request.blood_group}</div>
                    <div className="text-sm text-gray-500">Units: {request.units_needed}</div>
                    <div className="text-sm text-gray-500">Urgency: {request.urgency_level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.district}</div>
                    <div className="text-sm text-gray-500">{request.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(request.id, 'completed')}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(request.id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(request.id, 'pending')}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <AlertCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
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
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeTab === 'requests'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Requests
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeTab === 'users'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                Users
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeTab === 'blog'
                    ? 'bg-red-600 text-white'
                    :  'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Blog
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeTab === 'news'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Newspaper className="w-5 h-5 mr-2" />
                News
              </button>
              {activeTab === 'requests' && (
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {renderContent()}
          </div>
        </div>
      </div>
      {showEditor && renderEditor()}
    </div>
  );
}

export default AdminDashboard;