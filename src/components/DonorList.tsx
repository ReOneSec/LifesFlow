import React from 'react';
import type { Profile } from '../lib/supabase';

type DonorListProps = {
  donors: Profile[];
};

function DonorList({ donors }: DonorListProps) {
  if (donors.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500">No donors found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {donors.map((donor) => (
        <div key={donor.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{donor.name}</h3>
            <p className="text-red-600 font-semibold">Blood Group: {donor.blood_group}</p>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Mobile: {donor.mobile}</p>
            {donor.alt_mobile && <p>Alt. Mobile: {donor.alt_mobile}</p>}
            <p>Location: {donor.village}, {donor.block}</p>
            <p>{donor.district}, {donor.state}</p>
            <p>PIN: {donor.pin}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DonorList;