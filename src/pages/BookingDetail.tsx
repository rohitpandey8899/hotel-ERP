import React from 'react';
import { useParams } from 'react-router-dom';

const BookingDetail = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Booking details will be implemented here */}
        <p className="text-gray-600">Loading booking {id}...</p>
      </div>
    </div>
  );
};

export default BookingDetail;