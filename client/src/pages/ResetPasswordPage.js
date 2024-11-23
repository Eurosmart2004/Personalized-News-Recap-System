import { useParams, useNavigate } from 'react-router-dom';
import { useAxios } from '../axios/axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[!@#$%^&*]/.test(password)
    ) {
        return 'Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character';
    }
    return '';
};

const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Confirm password is required';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
};

const ResetPasswordPage = () => {
    const { publicAxios } = useAxios();
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Validate password and update errors state
        setErrors((prevErrors) => ({
            ...prevErrors,
            password: validatePassword(value),
            confirmPassword: validateConfirmPassword(confirmPassword, value),
        }));
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);

        // Validate confirm password and update errors state
        setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: validateConfirmPassword(value, password),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

        if (passwordError || confirmPasswordError) {
            setErrors({ password: passwordError, confirmPassword: confirmPasswordError });
            toast.error('Please fix the errors before submitting');
            return;
        }

        try {
            setLoading(true);
            const response = await publicAxios.post('/user/reset-password', { token, password });
            toast.success(response.data.message);
            setSuccess(true);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Something went wrong');
        }
        finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        try {
            const payload = jwtDecode(token);
            setLoading(true);
            await publicAxios.post('/user/forgot-password', { email: payload.email });
            toast.success('Email sent successfully');
        } catch (error) {
            toast.error('Failed to resend email');
        }
        finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center">
                    <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
                    <p className="text-gray-600 mb-6">
                        Password reset successfully. Please login with your new password.
                    </p>
                    <button
                        className="w-full py-2 px-4 bg-orange-400 text-white font-medium rounded-md hover:bg-orange-500"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <ToastContainer />
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={handlePasswordChange}
                            className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.password === undefined ? 'focus:ring focus:ring-orange-300' : errors.password !== '' ? 'border-red-500' : 'border-green-500'
                                }`}
                        />
                        {errors.password && <small className="text-red-500">{errors.password}</small>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.confirmPassword === undefined ? 'focus:ring focus:ring-orange-300' : errors.confirmPassword !== '' ? 'border-red-500' : 'border-green-500'
                                }`}
                        />
                        {errors.confirmPassword && <small className="text-red-500">{errors.confirmPassword}</small>}
                    </div>
                    <button
                        type="submit"
                        // className="w-full py-2 px-4 bg-orange-400 text-white font-medium rounded-md hover:bg-orange-500"
                        className={`w-full py-2 px-4 text-white font-medium rounded-md ${loading ? 'bg-orange-500' : 'bg-orange-400  hover:bg-orange-500'} `}
                        disabled={loading}
                    >
                        Reset Password
                    </button>
                </form>
                <button
                    onClick={handleResendEmail}
                    className={`w-full py-2 px-4 mt-4 text-gray-700 font-medium rounded-md ${loading ? 'bg-gray-400' : 'bg-gray-300  hover:bg-gray-400'} `}
                    disabled={loading}
                >
                    Resend Email
                </button>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
