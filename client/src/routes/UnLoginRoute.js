import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const UnLoginRoute = ({ children }) => {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();

    if (auth.user) return <Navigate to="/" state={{ from: location }} replace />;
    return children;
};

export default UnLoginRoute;