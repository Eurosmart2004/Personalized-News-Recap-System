import { Routes, Route, Navigate } from 'react-router-dom';
import NewsPage from '../pages/NewsPage';
import AdminPage from '../pages/AdminPage';
import UserPage from '../pages/UserPage';
import LoginPage from '../pages/LoginPage';
import ConfirmPage from '../pages/ConfirmPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ForgotpasswordPage from '../pages/ForgotpasswordPage';
import RequireConfirmPage from '../pages/RequireConfirmPage';
import RegisterPage from '../pages/RegisterPage';
import PreferencePage from '../pages/PreferencePage';
import CollectionPage from '../pages/CollectionPage';
import CollectionDetailPage from '../pages/CollectionDetailPage';
import AggregatePage from '../pages/AggregatePage';
import AggregatePageDetail from '../pages/AggregatePageDetail';
import App from '../App';
import RoleRoute from './RoleRoute';
import UnLoginRoute from './UnLoginRoute';
import { useSelector } from 'react-redux';

const Router = () => {
    const auth = useSelector(state => state.auth);
    return (
        <Routes>
            <Route path="/" element={<App />} >
                <Route index element={
                    // auth.user ?
                    //     <RoleRoute roles={['user', 'admin']}> <NewsPage /></RoleRoute> :
                    //     <></>
                    <RoleRoute roles={['user', 'admin']}>
                        <NewsPage />
                    </RoleRoute>
                } />
                <Route path="/preference" element={
                    <RoleRoute roles={['user']}>
                        <PreferencePage />
                    </RoleRoute>
                } />
                <Route path="/user" element={
                    <RoleRoute roles={['user']}>
                        <UserPage />
                    </RoleRoute>
                } />
                <Route path="/require-confirm" element={
                    <RoleRoute roles={['user']}>
                        <RequireConfirmPage />
                    </RoleRoute>
                } />
                <Route path="/admin" element={
                    <RoleRoute roles={['admin']}>
                        <AdminPage />
                    </RoleRoute>
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
                <Route path="/confirm/:token" element={<ConfirmPage />} />
                <Route path="/forgot-password" element={
                    <UnLoginRoute>
                        <ForgotpasswordPage />
                    </UnLoginRoute>
                } />
                <Route path="/reset-password/:token" element={
                    <UnLoginRoute>
                        <ResetPasswordPage />
                    </UnLoginRoute>
                } />
                <Route path="/collection" element={
                    <RoleRoute roles={['user']}>
                        <CollectionPage />
                    </RoleRoute>
                } />
                <Route path="/collection/:id" element={
                    <RoleRoute roles={['user']}>
                        <CollectionDetailPage />
                    </RoleRoute>
                } />
                <Route path="/aggregate" element={
                    <RoleRoute roles={['user']}>
                        <AggregatePage />
                    </RoleRoute>
                } />
                <Route path="/aggregate/:duration/:id" element={
                    <RoleRoute roles={['user']}>
                        <AggregatePageDetail />
                    </RoleRoute>
                } />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
        </Routes>
    );
};

export default Router;
