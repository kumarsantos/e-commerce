import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, ...rest }) => {
  const { loading, user, isAuthenticated } = useSelector((state) => state.user);

  return isAuthenticated ? children : <Navigate to='/' />;
};

export default ProtectedRoute;
