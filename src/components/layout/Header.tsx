import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
          </div>
          
          {/* Right side - User menu & notifications */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>
            
            {/* User menu */}
            <div className="relative ml-3">
              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                
                <div className="flex">
                  <button className="flex text-sm rounded-full focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                      <User size={16} />
                    </div>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-1 text-gray-500 rounded-full hover:bg-gray-100"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;