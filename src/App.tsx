import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Guests from './pages/Guests';
import GuestDetail from './pages/GuestDetail';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/:id" element={<RoomDetail />} />
          
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          
          <Route path="guests" element={<Guests />} />
          <Route path="guests/:id" element={<GuestDetail />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;