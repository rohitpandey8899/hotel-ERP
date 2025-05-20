import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Room, Booking, Guest, DashboardStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to set auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Room API
export const roomApi = {
  getAll: async (): Promise<Room[]> => {
    const response = await api.get('/rooms');
    return response.data;
  },
  
  getById: async (id: string): Promise<Room> => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },
  
  create: async (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<Room> => {
    const response = await api.post('/rooms', room);
    return response.data;
  },
  
  update: async (id: string, room: Partial<Room>): Promise<Room> => {
    const response = await api.put(`/rooms/${id}`, room);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/rooms/${id}`);
  },
};

// Booking API
export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },
  
  getById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  
  create: async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },
  
  update: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}`, booking);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
  
  checkIn: async (id: string): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}/check-in`);
    return response.data;
  },
  
  checkOut: async (id: string): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}/check-out`);
    return response.data;
  },
};

// Guest API
export const guestApi = {
  getAll: async (): Promise<Guest[]> => {
    const response = await api.get('/guests');
    return response.data;
  },
  
  getById: async (id: string): Promise<Guest> => {
    const response = await api.get(`/guests/${id}`);
    return response.data;
  },
  
  create: async (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guest> => {
    const response = await api.post('/guests', guest);
    return response.data;
  },
  
  update: async (id: string, guest: Partial<Guest>): Promise<Guest> => {
    const response = await api.put(`/guests/${id}`, guest);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/guests/${id}`);
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export default api;