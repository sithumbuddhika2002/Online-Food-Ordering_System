import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); 
  console.log(token);

  // If the token exists, allow access to the protected route
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
