import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthState, User } from '../types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@hotel.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
          });
          
          const { token } = response.data;
          
          // Decode JWT to get user data
          const decoded = jwtDecode<User & { exp: number }>(token);
          
          set({
            token,
            user: {
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              role: decoded.role,
              createdAt: decoded.createdAt,
              updatedAt: decoded.updatedAt,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          let message = 'Failed to login';
          if (axios.isAxiosError(error) && error.response) {
            message = error.response.data.message || message;
          }
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      checkAuth: () => {
        const { token } = get();
        if (!token) return false;
        
        try {
          const decoded = jwtDecode<{ exp: number }>(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            get().logout();
            return false;
          }
          
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);