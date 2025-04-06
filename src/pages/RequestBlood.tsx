import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function RequestBlood() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    guardian_name: '',
    mobile: '',
    alt_mobile: '',
    age: '',
    units_needed: '1',
    blood_group: '',
    urgency_level: '',
    village: '',
    block: '',
    pin: '',
    district: '',
    state: '',
    receiving_address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to request blood');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('blood_requests')
        .insert({
          ...formData,
          requester_id: user.id
        });

      if (error) throw error;

      toast.success('Blood request submitted successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error('Error submitting request. Please try again.');
      console.error('Request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Request Blood</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patient_name"
                  name="patient_name"
                  required
                  value={formData.patient_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="guardian_name" className="block text-sm font-medium text-gray-700">
                  Guardian Name
                </label>
                <input
                  type="text"
                  id="guardian_name"
                  name="guardian_name"
                  value={formData.guardian_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="alt_mobile" className="block text-sm font-medium text-gray-700">
                  Alternative Mobile
                </label>
                <input
                  type="tel"
                  id="alt_mobile"
                  name="alt_mobile"
                  value={formData.alt_mobile}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Patient Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="units_needed" className="block text-sm font-medium text-gray-700">
                  Units Needed
                </label>
                <input
                  type="number"
                  id="units_needed"
                  name="units_needed"
                  required
                  min="1"
                  max="10"
                  value={formData.units_needed}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="blood_group" className="block text-sm font-medium text-gray-700">
                  Blood Group
                </label>
                <select
                  id="blood_group"
                  name="blood_group"
                  required
                  value={formData.blood_group}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label htmlFor="urgency_level" className="block text-sm font-medium text-gray-700">
                  Urgency Level
                </label>
                <select
                  id="urgency_level"
                  name="urgency_level"
                  required
                  value={formData.urgency_level}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Urgency Level</option>
                  <option value="Urgent">Urgent (Within 4 hours)</option>
                  <option value="Within 24h">Within 24 hours</option>
                  <option value="Within 48h">Within 48 hours</option>
                  <option value="Within 72h">Within 72 hours</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label htmlFor="village" className="block text-sm font-medium text-gray-700">
                  Village/Area
                </label>
                <input
                  type="text"
                  id="village"
                  name="village"
                  required
                  value={formData.village}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="block" className="block text-sm font-medium text-gray-700">
                  Block
                </label>
                <input
                  type="text"
                  id="block"
                  name="block"
                  required
                  value={formData.block}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
                  PIN Code
                </label>
                <input
                  type="text"
                  id="pin"
                  name="pin"
                  required
                  value={formData.pin}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  District
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>

              <div className="col-span-2">
                <label htmlFor="receiving_address" className="block text-sm font-medium text-gray-700">
                  Receiving Address (Hospital/Blood Bank)
                </label>
                <textarea
                  id="receiving_address"
                  name="receiving_address"
                  required
                  value={formData.receiving_address}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequestBlood;