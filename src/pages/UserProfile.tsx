import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { User, Edit2, Save } from 'lucide-react';
import type { Profile } from '../lib/supabase';

function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});
  const [hasChangedBloodGroup, setHasChangedBloodGroup] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      checkBloodGroupHistory();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setEditedProfile(data || {});
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const checkBloodGroupHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_group_changes')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setHasChangedBloodGroup(!!data);
    } catch (error) {
      console.error('Error checking blood group history:', error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditedProfile(profile || {});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If blood group is being changed and it hasn't been changed before
      if (editedProfile.blood_group !== profile?.blood_group && !hasChangedBloodGroup) {
        // Record the blood group change
        const { error: changeError } = await supabase
          .from('blood_group_changes')
          .insert({
            user_id: user?.id,
            old_blood_group: profile?.blood_group,
            new_blood_group: editedProfile.blood_group
          });

        if (changeError) throw changeError;
      } else if (editedProfile.blood_group !== profile?.blood_group && hasChangedBloodGroup) {
        toast.error('Blood group can only be changed once');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update(editedProfile)
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <User className="w-12 h-12 text-red-600 mr-4" />
              <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            </div>
            {!editing && (
              <button
                onClick={handleEdit}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedProfile.name || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={editedProfile.mobile || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Alternative Mobile</label>
                <input
                  type="tel"
                  name="alt_mobile"
                  value={editedProfile.alt_mobile || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={editedProfile.age || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={editedProfile.weight || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Blood Group {hasChangedBloodGroup && '(Can only be changed once)'}
                </label>
                <select
                  name="blood_group"
                  value={editedProfile.blood_group || ''}
                  onChange={handleChange}
                  disabled={!editing || (hasChangedBloodGroup && profile?.blood_group)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
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
                <label className="block text-sm font-medium text-gray-700">Last Donation Date</label>
                <input
                  type="date"
                  name="last_donation_date"
                  value={editedProfile.last_donation_date || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Village/Area</label>
                <input
                  type="text"
                  name="village"
                  value={editedProfile.village || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Block</label>
                <input
                  type="text"
                  name="block"
                  value={editedProfile.block || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">PIN Code</label>
                <input
                  type="text"
                  name="pin"
                  value={editedProfile.pin || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input
                  type="text"
                  name="district"
                  value={editedProfile.district || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <select
                  name="state"
                  value={editedProfile.state || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
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
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                  <option value="Daman and Diu">Daman and Diu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Puducherry">Puducherry</option>
                </select>
              </div>
            </div>

            {editing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;