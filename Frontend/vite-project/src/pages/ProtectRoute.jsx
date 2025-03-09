



import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Fetch token from localStorage
    return token ? children : <Navigate to="/login" replace />;
};

export default ProtectRoute;
