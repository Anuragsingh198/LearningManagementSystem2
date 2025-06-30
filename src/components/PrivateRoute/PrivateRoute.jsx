import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/contextFiles/AuthContext';
import MuiLoading from '../../pages/common/Loading';

const PrivateRoute = ({ children }) => {

  const { state: { user, loading } } = useAuth();
  // console.log('the user and auth status from private route.jsx is: ', user)
  // console.log('the loading status from private route.jsx is: ', loading)

  if (loading) return <MuiLoading/>
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
