import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();
    if (!auth.user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (auth.user.role !== 'admin') return <Navigate to="/" state={{ from: location }} replace />;

    return children;
};

export default AdminRoute;
