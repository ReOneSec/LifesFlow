import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/supabase';

type DonorSearchProps = {
  onSearch: (donors: Profile[]) => void;
  setLoading: (loading: boolean) => void;
};

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

function DonorSearch({ onSearch, setLoading }: DonorSearchProps) {
  const [searchParams, setSearchParams] = useState({
    bloodGroup: '',
    state: '',
    district: '',
    block: ''
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*');

      if (searchParams.bloodGroup) {
        query = query.eq('blood_group', searchParams.bloodGroup);
      }
      if (searchParams.state) {
        query = query.eq('state', searchParams.state);
      }
      if (searchParams.district) {
        query = query.eq('district', searchParams.district);
      }
      if (searchParams.block) {
        query = query.eq('block', searchParams.block);
      }

      const { data, error } = await query;

      if (error) throw error;
      onSearch(data || []);
    } catch (error) {
      console.error('Search error:', error);
      onSearch([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 backdrop-blur-lg bg-opacity-95 transform hover:scale-[1.02] transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label htmlFor="blood-group" className="block text-sm font-medium text-gray-700 mb-2">
            Blood Group
          </label>
          <select
            id="blood-group"
            value={searchParams.bloodGroup}
            onChange={(e) => setSearchParams({ ...searchParams, bloodGroup: e.target.value })}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Any Blood Group</option>
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
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            id="state"
            value={searchParams.state}
            onChange={(e) => setSearchParams({ ...searchParams, state: e.target.value })}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
            District
          </label>
          <input
            type="text"
            id="district"
            value={searchParams.district}
            onChange={(e) => setSearchParams({ ...searchParams, district: e.target.value })}
            placeholder="Enter district"
            className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-2">
            Block
          </label>
          <input
            type="text"
            id="block"
            value={searchParams.block}
            onChange={(e) => setSearchParams({ ...searchParams, block: e.target.value })}
            placeholder="Enter block"
            className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="md:col-span-4">
          <button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center shadow-lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Donors
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonorSearch;