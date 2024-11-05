import { useParams, useNavigate } from 'react-router-dom';
import { publicAxios } from '../axios/axios';
import { setAuth } from '../redux/reducer/authReducer';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    console.log(token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const response = await publicAxios.post('/user/reset-password', { token, password });
            toast.success(response.data.message);
            setSuccess(true);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        }
    };

    const handleResendEmail = async () => {
        const payload = jwtDecode(token);
        try {
            await publicAxios.post('/user/forgot-password', { email: payload.email });
            toast.success('Email sent successfully');
        } catch (error) {
            console.log(error);
        }
    };

    if (success) {
        return (
            <div className="container mt-5">
                <div className="card">
                    <div className="card-body text-center">
                        <h1 className="card-title">Reset Password</h1>
                        <p className="card-text">Password reset successfully. Please login with your new password.</p>
                        <button className='btn btn-primary' onClick={() => { navigate('/login'); }}>Login</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h1 className="text-center">Reset Password Page</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">New Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Reset Password</button>
            </form>
            <button onClick={handleResendEmail} className="btn btn-secondary mt-3">Resend Email</button>
        </div>
    );
};

export default ResetPasswordPage;