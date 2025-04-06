import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Droplet, Calendar, Clock, CheckCircle } from 'lucide-react';
import type { BloodRequest, Donation } from '../lib/supabase';

type DashboardStats = {
  totalDonations: number;
  pendingRequests: number;
  upcomingDonations: number;
  completedDonations: number;
};

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    pendingRequests: 0,
    upcomingDonations: 0,
    completedDonations: 0
  });
  const [recentRequests, setRecentRequests] = useState<BloodRequest[]>([]);
  const [upcomingDonations, setUpcomingDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      // Get total donations
      const { count: totalDonations } = await supabase
        .from('donations')
        .select('*', { count: 'exact' })
        .eq('donor_id', user.id);

      // Get pending requests
      const { count: pendingRequests } = await supabase
        .from('blood_requests')
        .select('*', { count: 'exact' })
        .eq('requester_id', user.id)
        .eq('status', 'pending');

      // Get upcoming donations
      const { count: upcomingDonations } = await supabase
        .from('donations')
        .select('*', { count: 'exact' })
        .eq('donor_id', user.id)
        .eq('status', 'scheduled')
        .gte('donation_date', new Date().toISOString());

      // Get completed donations
      const { count: completedDonations } = await supabase
        .from('donations')
        .select('*', { count: 'exact' })
        .eq('donor_id', user.id)
        .eq('status', 'completed');

      setStats({
        totalDonations: totalDonations || 0,
        pendingRequests: pendingRequests || 0,
        upcomingDonations: upcomingDonations || 0,
        completedDonations: completedDonations || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      await fetchDashboardStats();

      // Get recent requests
      const { data: requests, error: requestsError } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (requestsError) throw requestsError;

      // Get upcoming donations
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('*, blood_requests(*)')
        .eq('donor_id', user.id)
        .eq('status', 'scheduled')
        .gte('donation_date', new Date().toISOString())
        .order('donation_date', { ascending: true })
        .limit(5);

      if (donationsError) throw donationsError;

      setRecentRequests(requests || []);
      setUpcomingDonations(donations || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <Droplet className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Donations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalDonations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Donations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.upcomingDonations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedDonations}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Requests */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Blood Requests</h2>
            {recentRequests.length === 0 ? (
              <p className="text-gray-500">No recent requests</p>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div key={request.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{request.patient_name}</p>
                        <p className="text-sm text-gray-500">
                          {request.blood_group} • {request.units_needed} units
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : request.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Donations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Donations</h2>
            {upcomingDonations.length === 0 ? (
              <p className="text-gray-500">No upcoming donations</p>
            ) : (
              <div className="space-y-4">
                {upcomingDonations.map((donation) => (
                  <div key={donation.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <p className="font-medium">
                      {new Date(donation.donation_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="font-medium">{donation.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;