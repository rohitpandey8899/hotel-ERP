import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, BedDouble } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Mock login for development
      if (email === 'admin@hotel.com' && password === 'password') {
        useAuthStore.setState({
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
        });
        
        toast.success('Login successful!');
        navigate(from);
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Invalid credentials. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login Form */}
      <div className="flex flex-col justify-center items-center p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 whitespace-nowrap">
              <BedDouble size={28} className="text-primary-600 flex-shrink-0" />
              <h1 className="ml-2 text-xl font-bold text-gray-800">Atithi Manager System</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@hotel.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div className="mt-6 text-sm text-center text-gray-500">
              <p>For demo purposes, use: admin@hotel.com / password</p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 bg-primary-600">
        <div 
          className="h-full bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
            backgroundBlendMode: 'multiply',
            backgroundColor: 'rgba(67, 56, 202, 0.3)'
          }}
        >
          <div className="h-full flex flex-col justify-center items-center text-white p-12">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold mb-4">Streamline Your Hotel Management</h2>
              <p className="text-lg opacity-90 mb-6">
                Efficiently manage rooms, bookings, guests and staff all from one intuitive dashboard.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-xl font-bold">99%</p>
                  <p className="text-sm opacity-80">Customer Satisfaction</p>
                </div>
                <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-xl font-bold">24/7</p>
                  <p className="text-sm opacity-80">Support</p>
                </div>
                <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-xl font-bold">50+</p>
                  <p className="text-sm opacity-80">Premium Features</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;