import React from 'react';
import { useParams } from 'react-router-dom';

const GuestDetail = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Guest Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Guest details will be implemented here */}
        <p className="text-gray-600">Loading guest {id}...</p>
      </div>
    </div>
  );
};

export default GuestDetail;