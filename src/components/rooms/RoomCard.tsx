import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, CheckCircle2, AlertCircle, LogIn, LogOut } from 'lucide-react';
import { Room } from '../../types';
import { roomApi } from '../../api';
import CheckInForm from './CheckInForm';

interface RoomCardProps {
  room: Room;
  availableRooms: Room[];
  onStatusChange?: () => void;
}

const statusColors = {
  available: 'bg-success-100 text-success-800',
  occupied: 'bg-danger-100 text-danger-800',
  maintenance: 'bg-amber-100 text-amber-800',
  reserved: 'bg-blue-100 text-blue-800',
};

const RoomCard: React.FC<RoomCardProps> = ({ room, availableRooms, onStatusChange }) => {
  const [showCheckInForm, setShowCheckInForm] = useState(false);

  const handleCheckIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCheckInForm(true);
  };

  const handleCheckOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await roomApi.update(room.id, { status: 'available' });
      onStatusChange?.();
    } catch (error) {
      console.error('Failed to check out:', error);
    }
  };

  const handleCheckInSubmit = async (data: any) => {
    try {
      // If room number has changed, update the room status for both rooms
      if (data.roomNumber !== room.roomNumber) {
        // Update the original room to available
        await roomApi.update(room.id, { status: 'available' });
        
        // Find and update the new room to occupied
        // Note: You'll need to implement this API call based on your backend structure
        // await roomApi.updateByRoomNumber(data.roomNumber, { status: 'occupied' });
      } else {
        // Update the current room status
        await roomApi.update(room.id, { status: 'occupied' });
      }
      
      // Here you would typically create a booking record with the guest information
      // await bookingApi.create({
      //   roomId: room.id,
      //   roomNumber: data.roomNumber,
      //   guestName: data.guestName,
      //   ...data,
      // });
      
      onStatusChange?.();
    } catch (error) {
      console.error('Failed to process check-in:', error);
      throw error;
    }
  };

  return (
    <>
      <Link 
        to={`/rooms/${room.id}`}
        className="block group"
      >
        <div className="bg-white rounded-lg overflow-hidden shadow-card transition-all duration-300 group-hover:shadow-card-hover border border-gray-200">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={room.images[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
              alt={`Room ${room.roomNumber}`} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusColors[room.status]}`}>
              {room.status === 'available' ? (
                <div className="flex items-center">
                  <CheckCircle2 size={14} className="mr-1" />
                  Available
                </div>
              ) : room.status === 'occupied' ? (
                <div className="flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  Occupied
                </div>
              ) : (
                room.status.charAt(0).toUpperCase() + room.status.slice(1)
              )}
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Room {room.roomNumber}</h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-3 capitalize">{room.type.replace('_', ' ')} Room</p>
            
            <div className="flex items-center text-gray-600 text-sm space-x-4">
              <div className="flex items-center">
                <Bed size={16} className="mr-1" />
                <span>{room.capacity} {room.capacity > 1 ? 'Persons' : 'Person'}</span>
              </div>
              
              <div className="flex items-center">
                <Bath size={16} className="mr-1" />
                <span>Ensuite</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs"
                >
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs">
                  +{room.amenities.length - 3} more
                </span>
              )}
            </div>

            {/* Check-in/Check-out buttons */}
            <div className="mt-4 flex justify-end">
              {room.status === 'available' && (
                <button
                  onClick={handleCheckIn}
                  className="inline-flex items-center px-3 py-1.5 bg-success-600 text-white text-sm rounded-lg hover:bg-success-700 transition-colors"
                >
                  <LogIn size={16} className="mr-1" />
                  Check In
                </button>
              )}
              {room.status === 'occupied' && (
                <button
                  onClick={handleCheckOut}
                  className="inline-flex items-center px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <LogOut size={16} className="mr-1" />
                  Check Out
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>

      {showCheckInForm && (
        <CheckInForm
          room={room}
          availableRooms={availableRooms}
          onClose={() => setShowCheckInForm(false)}
          onSubmit={handleCheckInSubmit}
        />
      )}
    </>
  );
};

export default RoomCard;