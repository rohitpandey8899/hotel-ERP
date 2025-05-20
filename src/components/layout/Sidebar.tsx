import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Hotel, 
  CalendarClock, 
  Users, 
  Clipboard, 
  BarChart4,
  Settings,
  X,
  BedDouble,
  User
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-100 text-primary-900'
            : 'text-gray-600 hover:bg-gray-100'
        }`
      }
      onClick={onClick}
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuthStore();
  
  const closeOnMobile = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <div className="flex items-center whitespace-nowrap">
              <BedDouble size={24} className="text-primary-600 flex-shrink-0" />
              <h1 className="ml-2 text-lg font-semibold text-gray-800">Atithi Manager System</h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1 text-gray-500 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <NavItem 
              to="/dashboard" 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              onClick={closeOnMobile}
            />
            <NavItem 
              to="/rooms" 
              icon={<Hotel size={18} />} 
              label="Rooms" 
              onClick={closeOnMobile}
            />
            <NavItem 
              to="/bookings" 
              icon={<CalendarClock size={18} />} 
              label="Bookings" 
              onClick={closeOnMobile}
            />
            <NavItem 
              to="/guests" 
              icon={<Users size={18} />} 
              label="Guests" 
              onClick={closeOnMobile}
            />
            
            {user?.role === 'admin' && (
              <>
                <div className="mt-6 mb-2 px-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </h3>
                </div>
                <NavItem 
                  to="/staff" 
                  icon={<Clipboard size={18} />} 
                  label="Staff Management" 
                  onClick={closeOnMobile}
                />
                <NavItem 
                  to="/reports" 
                  icon={<BarChart4 size={18} />} 
                  label="Reports" 
                  onClick={closeOnMobile}
                />
                <NavItem 
                  to="/settings" 
                  icon={<Settings size={18} />} 
                  label="Settings" 
                  onClick={closeOnMobile}
                />
              </>
            )}
          </nav>
          
          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                  <User size={16} />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;