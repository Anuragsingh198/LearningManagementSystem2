import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/contextFiles/AuthContext';

const PrivateRoute = ({ children }) => {
  const { state: { user, loading } } = useAuth();
  if (loading) return <div>Loading... from private route</div>;
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
