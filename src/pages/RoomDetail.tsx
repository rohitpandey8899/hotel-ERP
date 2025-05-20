import React from 'react';
import { useParams } from 'react-router-dom';

const RoomDetail = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Room Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Room ID: {id}</p>
        {/* Room details will be populated with actual data in a future update */}
      </div>
    </div>
  );
};

export default RoomDetail;