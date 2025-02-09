import React from 'react';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('authToken') !== null;
    return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
