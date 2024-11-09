import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RoleRoute = ({ roles, children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    const LOGIN_PATH = "/login";
    const HOME_PATH = "/";
    const REQUIRE_CONFIRM_PATH = "/require-confirm";
    const PREFERENCE_PATH = "/preference";

    if (!user) {
        return <Navigate to={LOGIN_PATH} state={{ from: location }} replace />;
    }

    if (!roles.includes(user.role)) {
        return <Navigate to={HOME_PATH} state={{ from: location }} replace />;
    }

    if (user.role === 'user') {
        if (!user.isConfirmed && location.pathname !== REQUIRE_CONFIRM_PATH) {
            return <Navigate to={REQUIRE_CONFIRM_PATH} state={{ from: location }} replace />;
        }

        if (user.isFirstLogin && user.isConfirmed && location.pathname !== PREFERENCE_PATH) {
            return <Navigate to={PREFERENCE_PATH} state={{ from: location }} replace />;
        }
    }

    return children;
};

export default RoleRoute;
