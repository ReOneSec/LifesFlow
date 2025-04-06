import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, LayoutDashboard, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BloodRequest, Profile } from '../lib/supabase';
import DonorSearch from '../components/DonorSearch';
import DonorList from '../components/DonorList';

function Home() {
  const [recentRequests, setRecentRequests] = useState<BloodRequest[]>([]);
  const [donors, setDonors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllRequests, setShowAllRequests] = useState(false);

  useEffect(() => {
    fetchRecentRequests();
  }, []);

  const fetchRecentRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('status', 'pending')  // Only fetch pending requests
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecentRequests(data || []);
    } catch (error) {
      console.error('Error fetching recent requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (results: Profile[]) => {
    setDonors(results);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'Within 24h': return 'bg-orange-100 text-orange-800';
      case 'Within 48h': return 'bg-yellow-100 text-yellow-800';
      case 'Within 72h': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const displayedRequests = showAllRequests ? recentRequests : recentRequests.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-red-600 text-white py-24 mb-24">
        <div 
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1920&q=80')"
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Connect with blood donors</h1>
          <h2 className="text-4xl font-bold mb-4 text-red-200">save lives together</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find blood donors near you or register to become a donor. Every
            donation counts in saving precious lives.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/donor-registration"
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Become a Donor
            </Link>
            <Link
              to="/request-blood"
              className="bg-red-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-900 transition duration-300 border-2 border-white"
            >
              Request Blood
            </Link>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <DonorSearch onSearch={handleSearch} setLoading={setLoading} />
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <DonorList donors={donors} />
        )}
      </div>

      {/* Recent Blood Requests Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Blood Requests</h2>
          {!showAllRequests && recentRequests.length > 3 && (
            <button
              onClick={() => setShowAllRequests(true)}
              className="flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              See All Requests
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{request.patient_name}</h3>
                    <p className="text-sm text-gray-500">Posted {new Date(request.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(request.urgency_level)}`}>
                    {request.urgency_level}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-red-600 font-semibold">Blood Group: {request.blood_group}</p>
                  <p>Units Needed: {request.units_needed}</p>
                  <p>Location: {request.district}, {request.state}</p>
                  <p className="text-sm text-gray-600">Contact: {request.mobile}</p>
                </div>
                <Link
                  to={`/request-details/${request.id}`}
                  className="mt-4 block text-center bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">OUR SERVICES</h2>
        <h3 className="text-2xl font-bold text-gray-900 mb-12">Making blood donation easier</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Donor Registration</h4>
            <p className="text-gray-600 mb-4">
              Quick and easy registration process for new donors with health screening.
            </p>
            <Link to="/donor-registration" className="text-red-600 hover:text-red-700 font-medium">
              Learn More →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Appointment Scheduling</h4>
            <p className="text-gray-600 mb-4">
              Book your donation slots at your convenience with our smart calendar.
            </p>
            <Link to="/appointments" className="text-red-600 hover:text-red-700 font-medium">
              Learn More →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <LayoutDashboard className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Donor Dashboard</h4>
            <p className="text-gray-600 mb-4">
              Track your donations, manage appointments, and view your impact.
            </p>
            <Link to="/profile" className="text-red-600 hover:text-red-700 font-medium">
              Learn More →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to save lives?</h2>
            <p className="text-xl mb-8">Join our donor community today.</p>
            <Link
              to="/register"
              className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Register Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;