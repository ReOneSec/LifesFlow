import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function DonorRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    mobile: '',
    alt_mobile: '',
    age: '',
    weight: '',
    blood_group: '',
    last_donation_date: '',
    village: '',
    block: '',
    pin: '',
    district: '',
    state: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to register as a donor');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const processedData = {
        ...formData,
        id: user.id,
        email: user.email,
        last_donation_date: formData.last_donation_date || null
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(processedData);

      if (error) throw error;

      toast.success('Registration successful!');
      navigate('/profile');
    } catch (error) {
      toast.error('Error registering as donor. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Donor Registration</h1>
            <p className="mt-2 text-sm text-gray-600">Join our community of blood donors and help save lives</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Personal Information Section */}
              <div className="col-span-1 sm:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              </div>

              <div className="col-span-1 sm:col-span-2 md:col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 md:col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  disabled
                  value={formData.email}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 bg-gray-50"
                />
              </div>

              {/* Contact Information Section */}
              <div className="col-span-1 sm:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pt-4">Contact Information</h2>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter mobile number"
                />
              </div>

              <div>
                <label htmlFor="alt_mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Alternative Mobile
                </label>
                <input
                  type="tel"
                  id="alt_mobile"
                  name="alt_mobile"
                  value={formData.alt_mobile}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Alternative number (optional)"
                />
              </div>

              {/* Medical Information Section */}
              <div className="col-span-1 sm:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pt-4">Medical Information</h2>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="18"
                  max="65"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Must be 18-65 years"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  required
                  min="45"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Minimum 45 kg"
                />
              </div>

              <div>
                <label htmlFor="blood_group" className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group *
                </label>
                <select
                  id="blood_group"
                  name="blood_group"
                  required
                  value={formData.blood_group}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                <label htmlFor="last_donation_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Donation Date
                </label>
                <input
                  type="date"
                  id="last_donation_date"
                  name="last_donation_date"
                  value={formData.last_donation_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Address Section */}
              <div className="col-span-1 sm:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pt-4">Address Information</h2>
              </div>

              <div>
                <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-1">
                  Village/Area *
                </label>
                <input
                  type="text"
                  id="village"
                  name="village"
                  required
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter village/area"
                />
              </div>

              <div>
                <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-1">
                  Block *
                </label>
                <input
                  type="text"
                  id="block"
                  name="block"
                  required
                  value={formData.block}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter block"
                />
              </div>

              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  id="pin"
                  name="pin"
                  required
                  value={formData.pin}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter PIN code"
                />
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter district"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register as Donor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DonorRegistration;