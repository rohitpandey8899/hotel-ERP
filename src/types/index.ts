// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Room related types
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export type RoomType = 'single' | 'double' | 'twin' | 'suite' | 'deluxe' | 'presidential';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  price: number;
  capacity: number;
  status: RoomStatus;
  amenities: string[];
  images: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Booking related types
export type BookingStatus = 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';

export interface Booking {
  id: string;
  roomId: string;
  room?: Room;
  guestId: string;
  guest?: Guest;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  totalAmount: number;
  paidAmount: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

// Guest related types
export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  idType?: 'passport' | 'driving_license' | 'national_id';
  idNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  currentOccupancyRate: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
}