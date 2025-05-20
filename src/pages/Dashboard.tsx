import React, { useState, useEffect } from 'react';
import { 
  Hotel, 
  CalendarClock, 
  UserCheck, 
  DollarSign,
  Bed,
  Users,
  CheckSquare
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { dashboardApi } from '../api';
import { DashboardStats } from '../types';
import StatCard from '../components/ui/StatCard';
import Card, { CardHeader, CardContent } from '../components/ui/Card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real application, you would use this:
        // const data = await dashboardApi.getStats();
        
        // For demo purposes, we'll use mock data
        const mockData: DashboardStats = {
          totalRooms: 50,
          availableRooms: 32,
          occupiedRooms: 15,
          maintenanceRooms: 3,
          todayCheckIns: 8,
          todayCheckOuts: 5,
          currentOccupancyRate: 30,
          revenueToday: 2450,
          revenueThisWeek: 15350,
          revenueThisMonth: 68240,
        };
        
        setStats(mockData);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const occupancyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: [28, 35, 40, 42, 38, 60, 55],
        borderColor: '#4338ca',
        backgroundColor: 'rgba(67, 56, 202, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const revenueChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [1200, 1800, 2100, 1750, 2300, 3100, 2800],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="whitespace-nowrap">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-500">Welcome back to Atithi Manager System</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Rooms"
          value={stats?.availableRooms || 0}
          icon={<Bed size={20} />}
          iconClassName="bg-primary-100 text-primary-600"
        />
        
        <StatCard
          title="Occupancy Rate"
          value={`${stats?.currentOccupancyRate || 0}%`}
          icon={<Hotel size={20} />}
          trend={{ value: 5.2, isPositive: true }}
          iconClassName="bg-blue-100 text-blue-600"
        />
        
        <StatCard
          title="Check-ins Today"
          value={stats?.todayCheckIns || 0}
          icon={<UserCheck size={20} />}
          iconClassName="bg-success-100 text-success-600"
        />
        
        <StatCard
          title="Revenue Today"
          value={`₹${stats?.revenueToday.toLocaleString() || 0}`}
          icon={<DollarSign size={20} />}
          trend={{ value: 3.7, isPositive: true }}
          iconClassName="bg-accent-100 text-accent-600"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader
            title="Weekly Occupancy"
            subtitle="Room occupancy rate for the current week"
          />
          <CardContent>
            <Line data={occupancyChartData} options={chartOptions} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader
            title="Weekly Revenue"
            subtitle="Revenue generated for the current week"
          />
          <CardContent>
            <Line data={revenueChartData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activities */}
      <Card>
        <CardHeader
          title="Recent Activities"
          subtitle="Latest hotel activities"
          action={
            <button className="text-sm text-primary-600 hover:underline">
              View All
            </button>
          }
        />
        <CardContent>
          <div className="space-y-3">
            {[
              { icon: <CheckSquare size={16} />, text: 'Room 204 checked in', time: '15 minutes ago', user: 'John Smith' },
              { icon: <Users size={16} />, text: 'New booking created', time: '1 hour ago', user: 'Emma Wilson' },
              { icon: <CalendarClock size={16} />, text: 'Room 118 checked out', time: '2 hours ago', user: 'Sara Johnson' },
              { icon: <Bed size={16} />, text: 'Room 305 marked as clean', time: '3 hours ago', user: 'Maintenance Staff' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="p-2 rounded-full bg-gray-100 text-gray-600 mr-3">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.text}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{activity.time}</span>
                    <span className="mx-2">•</span>
                    <span>{activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;