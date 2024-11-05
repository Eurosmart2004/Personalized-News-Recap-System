import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const UserRoute = ({ children }) => {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();

    if (!auth.user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (auth.user.role !== 'user') return <Navigate to="/" state={{ from: location }} replace />;
    if (auth.user.isConfirmed === false && location.pathname !== `/require-confirm`) {
        return <Navigate to={`/require-confirm`} state={{ from: location }} replace />;
    }

    if (auth.user.isFirstLogin && auth.user.isConfirmed && location.pathname !== '/preference') {
        return <Navigate to="/preference" state={{ from: location }} replace />;
    }


    return children;
};

export default UserRoute;