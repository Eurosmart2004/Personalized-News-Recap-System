import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AdminPage from '../pages/AdminPage';
import UserPage from '../pages/UserPage';
import LoginPage from '../pages/LoginPage';
import ConfirmPage from '../pages/ConfirmPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ForgotpasswordPage from '../pages/ForgotpasswordPage';
import RequireConfirmPage from '../pages/RequireConfirmPage';
import RegisterPage from '../pages/RegisterPage';
import PreferencePage from '../pages/PreferencePage';
import App from '../App';
import UserRoute from './UserRoute';
import AdminRoute from './AdminRoute';
import UnLoginRoute from './UnLoginRoute';
import { useSelector } from 'react-redux';
const Router = () => {
    const location = useLocation();
    const auth = useSelector(state => state.auth);
    const isLogin = auth.user !== null;
    const isFirstLogin = auth.user?.isFirstLogin;
    // console.log('isFirstLogin:', isFirstLogin);
    // console.log('auth:', auth);
    // console.log('isLogin:', isLogin);
    return (
        <Routes>
            <Route path="/" element={<App />} >
                <Route index element={
                    isLogin ?
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
                <Route path='/require-confirm' element={
                    <UserRoute>
                        <RequireConfirmPage />
                    </UserRoute>
                } />
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                } />
                <Route path="/login" element={
                    <UnLoginRoute>
                        <LoginPage />
                    </UnLoginRoute>
                } />
                <Route path="/register" element={
                    <UnLoginRoute>
                        <RegisterPage />
                    </UnLoginRoute>
                } />
                <Route path="/confirm/:token" element={
                    <ConfirmPage />
                } />
                <Route path="/forgot-password" element={
                    <UnLoginRoute>
                        <ForgotpasswordPage />
                    </UnLoginRoute>
                } />
                <Route path='/reset-password/:token' element={
                    <UnLoginRoute>
                        <ResetPasswordPage />
                    </UnLoginRoute>
                } />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
        </Routes>
    );
};

export default Router;
