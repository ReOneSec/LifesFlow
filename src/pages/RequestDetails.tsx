import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { BloodRequest } from '../lib/supabase';

function RequestDetails() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setRequest(data);
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to load request details');
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

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">Request not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Blood Request Details</h1>
          
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{request.patient_name}</h2>
                <p className="text-sm text-gray-500">
                  Posted on {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                request.urgency_level === 'Urgent' ? 'bg-red-100 text-red-800' :
                request.urgency_level === 'Within 24h' ? 'bg-orange-100 text-orange-800' :
                request.urgency_level === 'Within 48h' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {request.urgency_level}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Age:</span> {request.age} years</p>
                  <p><span className="font-medium">Blood Group:</span> {request.blood_group}</p>
                  <p><span className="font-medium">Units Needed:</span> {request.units_needed}</p>
                  {request.guardian_name && (
                    <p><span className="font-medium">Guardian:</span> {request.guardian_name}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Mobile:</span> {request.mobile}</p>
                  {request.alt_mobile && (
                    <p><span className="font-medium">Alternative Mobile:</span> {request.alt_mobile}</p>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Location Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Village/Area:</span> {request.village}</p>
                  <p><span className="font-medium">Block:</span> {request.block}</p>
                  <p><span className="font-medium">District:</span> {request.district}</p>
                  <p><span className="font-medium">State:</span> {request.state}</p>
                  <p><span className="font-medium">PIN Code:</span> {request.pin}</p>
                </div>
              </div>

              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Receiving Address</h3>
                <p className="text-gray-700">{request.receiving_address}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Volunteer to Donate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;