import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Hotel, Settings } from 'lucide-react';
import { roomApi } from '../api';
import { Room, RoomType, RoomStatus } from '../types';
import RoomCard from '../components/rooms/RoomCard';

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    minPrice: 0,
    maxPrice: 1000,
  });
  
  const fetchRooms = async () => {
    try {
      // In a real application, you would use this:
      // const data = await roomApi.getAll();
      
      // For demo purposes, we'll use mock data
      const mockRooms: Room[] = [
        {
          id: '1',
          roomNumber: '101',
          type: 'single',
          price: 99,
          capacity: 1,
          status: 'available',
          amenities: ['Wi-Fi', 'TV', 'Air conditioning', 'Mini bar'],
          images: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
          description: 'Cozy single room with all basic amenities for comfortable stay.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          roomNumber: '102',
          type: 'double',
          price: 149,
          capacity: 2,
          status: 'occupied',
          amenities: ['Wi-Fi', 'TV', 'Air conditioning', 'Mini bar', 'Coffee machine'],
          images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
          description: 'Spacious double room with queen size bed, perfect for couples.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          roomNumber: '103',
          type: 'twin',
          price: 149,
          capacity: 2,
          status: 'available',
          amenities: ['Wi-Fi', 'TV', 'Air conditioning', 'Mini bar', 'Desk'],
          images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
          description: 'Twin room with two single beds, ideal for friends or colleagues.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          roomNumber: '201',
          type: 'suite',
          price: 299,
          capacity: 3,
          status: 'available',
          amenities: ['Wi-Fi', 'TV', 'Air conditioning', 'Mini bar', 'Coffee machine', 'Bathtub', 'Living area'],
          images: ['https://images.pexels.com/photos/276671/pexels-photo-276671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
          description: 'Deluxe suite with separate living area and luxurious bathroom.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          roomNumber: '202',
          type: 'deluxe',
          price: 249,
          capacity: 2,
          status: 'maintenance',
          amenities: ['Wi-Fi', 'TV', 'Air conditioning', 'Mini bar', 'Coffee machine', 'Bathtub'],
          images: ['https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
          description: 'Deluxe room with king size bed and premium amenities.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '6',
          roomNumber: '301',
          type: 'presidential',
          price: 499,
          capacity: 4,
          status: 'available',
          amenities: ['Wi-Fi', 'TV', 'Air conditioning', 'Mini bar', 'Coffee machine', 'Bathtub', 'Living area', 'Dining area', 'Kitchen', 'Private balcony'],
          images: ['https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
          description: 'Luxurious presidential suite with panoramic city views and premium amenities.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      setRooms(mockRooms);
    } catch (error) {
      console.error('Failed to fetch rooms', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRooms();
  }, []);

  const handleRoomStatusChange = () => {
    fetchRooms();
  };
  
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || room.status === filters.status;
    const matchesType = !filters.type || room.type === filters.type;
    const matchesPrice = room.price >= filters.minPrice && room.price <= filters.maxPrice;
    
    return matchesSearch && matchesStatus && matchesType && matchesPrice;
  });
  
  const availableRooms = rooms.filter(room => room.status === 'available');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rooms</h1>
          <p className="text-gray-500">Manage hotel rooms and their details</p>
        </div>
        
        <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus size={18} className="mr-2" />
          Add New Room
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search rooms by number, type or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-1 justify-center">
            <Filter size={18} className="mr-2 text-gray-500" />
            <span>Filter</span>
          </button>
          
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Settings size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Room Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-success-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-success-100 text-success-600 mr-3">
              <Hotel size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Available</p>
              <p className="text-xl font-semibold text-gray-800">
                {rooms.filter(r => r.status === 'available').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-danger-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-danger-100 text-danger-600 mr-3">
              <Hotel size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Occupied</p>
              <p className="text-xl font-semibold text-gray-800">
                {rooms.filter(r => r.status === 'occupied').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-amber-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-amber-100 text-amber-600 mr-3">
              <Hotel size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Maintenance</p>
              <p className="text-xl font-semibold text-gray-800">
                {rooms.filter(r => r.status === 'maintenance').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
              <Hotel size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Reserved</p>
              <p className="text-xl font-semibold text-gray-800">
                {rooms.filter(r => r.status === 'reserved').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Room Cards Grid */}
      {filteredRooms.length === 0 ? (
        <div className="flex justify-center items-center bg-white rounded-lg shadow-card p-8">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Hotel size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No Rooms Found</h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No rooms match "${searchTerm}"`
                : 'Try adjusting your filters or add new rooms'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              availableRooms={availableRooms}
              onStatusChange={handleRoomStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;