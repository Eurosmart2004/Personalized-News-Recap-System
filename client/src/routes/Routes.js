import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AdminPage from '../pages/AdminPage';
import UserPage from '../pages/UserPage';
import LoginPage from '../pages/LoginPage';
import ConfirmPage from '../pages/ConfirmPage';
import RegisterPage from '../pages/RegisterPage';
import App from '../App';
import UserRoute from './UserRoute';
import AdminRoute from './AdminRoute';
import { useSelector } from 'react-redux';
import PreferencePage from '../pages/PreferencePage';
const Router = () => {
    const location = useLocation();
    const auth = useSelector(state => state.auth);
    const isLogin = auth.user !== null;
    const isFirstLogin = auth.user?.isFirstLogin;
    console.log('isFirstLogin:', isFirstLogin);
    console.log('auth:', auth);
    console.log('isLogin:', isLogin);
    return (
        <Routes>
            <Route path="/" element={<App />} >
                <Route index element={
                    isLogin && auth.user.role === 'user' ?
                        <UserRoute>
                            <HomePage />
                        </UserRoute>
                        : <HomePage />}
                />
                <Route path='/preference' element={
                    <UserRoute>
                        <PreferencePage />
                    </UserRoute>
                } />
                <Route path="/user" element={
                    <UserRoute>
                        <UserPage />
                    </UserRoute>
                } />
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                } />
                <Route path="/login" element={isLogin ? <Navigate to={location.state?.from || '/'} /> : <LoginPage />} />
                <Route path="/register" element={isLogin ? <Navigate to={location.state?.from || '/'} /> : <RegisterPage />} />
            </Route>
            <Route path="/confirm/:email" element={
                <UserRoute>
                    <ConfirmPage />
                </UserRoute>
            } />
        </Routes>
    );
};

export default Router;
