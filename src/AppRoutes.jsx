import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Admin from './Admin/AdminLogin';
import AdminDashboard from './Admin/AdminDashboard';
import App from './App';
import EventsPage from './Events/EventsPage';
import Forgot from './Reset/Forgot';
import Login from './Login/Login';
import React from 'react';
import Register from './Register/Register';
import Resets from './Reset/Resets';
import EventDetails from './Events/EventDetails';

// A basic homepage component




const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/reset-password" element={<Resets />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetails />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
