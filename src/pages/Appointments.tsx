import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar } from 'lucide-react';

function Appointments() {
  const { user } = useAuth();
  const [appointmentDate, setAppointmentDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to schedule an appointment');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('donations')
        .insert({
          donor_id: user.id,
          donation_date: appointmentDate,
          status: 'scheduled'
        });

      if (error) throw error;

      toast.success('Appointment scheduled successfully!');
      setAppointmentDate('');
    } catch (error) {
      toast.error('Failed to schedule appointment');
      console.error('Appointment error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today) and maximum date (3 months from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <Calendar className="w-12 h-12 text-red-600 mr-4" />
              <h1 className="text-3xl font-bold text-gray-900">Schedule Blood Donation</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Important Information</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>You must be at least 18 years old and weigh more than 45kg</li>
                <li>Maintain a gap of at least 3 months between donations</li>
                <li>Eat well and stay hydrated before your appointment</li>
                <li>Bring a valid ID proof</li>
                <li>The donation process takes about 30-45 minutes</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700">
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  id="appointment-date"
                  required
                  min={today}
                  max={maxDateStr}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;