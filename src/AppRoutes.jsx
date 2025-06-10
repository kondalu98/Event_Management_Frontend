import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import App from './App';
import Forgot from './Reset/Forgot';
import Login from './Login/Login';
import React from 'react';
import Register from './Register/Register';
import Resets from './Reset/Resets';

// A basic homepage component




const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />

          <Route path="/forgot-password" element={<Forgot />} />
  <Route path="/reset-password" element={<Resets />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
