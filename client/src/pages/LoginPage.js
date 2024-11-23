import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';
import { useAxios } from '../axios/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import sunLogin from '../images/sun.png';


const LoginPage = () => {
    const { publicAxios, privateAxios } = useAxios();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';


    const validateEmail = (email) => {
        if (!email.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return 'Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character';
        }
        return '';
    };

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            email: validateEmail(value),
        }));
    };

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setPassword(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            password: validatePassword(value),
        }));
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: async (res) => {
            try {
                const response = await publicAxios.post('/user/login/google', {
                    token: res.access_token,
                    isRemember: remember,
                });
                privateAxios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
                dispatch(setAuth({
                    accessToken: response.data.accessToken,
                    user: response.data.user,
                    isRemember: remember,
                }));
                navigate(from, { replace: true });
            } catch (error) {
                console.log('error:', error);
            }
        },
        onError: (error) => {
            console.log('Login Failed:', error);
        },
    });

    const login = async (e) => {
        e.preventDefault();

        // Validate all fields on submit
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError,
            });
            toast.error('Please fix the errors before submitting');
            return;
        }

        try {
            const response = await publicAxios.post('/user/login', {
                email,
                password,
                isRemember: remember,
            });
            privateAxios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
            dispatch(setAuth({
                accessToken: response.data.accessToken,
                user: response.data.user,
                isRemember: remember,
            }));
            navigate(from, { replace: true });
        } catch (error) {
            console.log('error:', error);
            toast.error(error.response.data.error);
        }
    };
    return (
        <>
            <ToastContainer />
            <div className="flex">
                {/* Left Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-4">
                    <div className="container p-6 mx-auto max-w-sm">
                        <h2 className="font-bold text-2xl mb-4">Welcome back</h2>
                        <p className="text-gray-600 mb-6">Welcome back! Please enter your details.</p>

                        <form onSubmit={login}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.email === undefined ? 'focus:ring focus:ring-orange-300' : errors.email !== '' ? 'border-red-500' : 'border-green-500'
                                        }`}
                                />
                                {errors.email && <small className="text-red-500">{errors.email}</small>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.password === undefined ? 'focus:ring focus:ring-orange-300 ' : errors.password !== '' ? 'border-red-500' : 'border-green-500'
                                        }`}
                                />
                                {errors.password && <small className="text-red-500">{errors.password}</small>}
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="h-4 w-4 text-orange-400 focus:ring-orange-300 rounded focus:outline-none"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
                                </div>
                                <Link to="/forgot-password" className="text-orange-400 text-sm hover:underline">Forgot Password</Link>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-orange-400 text-white font-medium rounded-md hover:bg-orange-500 focus:outline-none focus:ring focus:ring-orange-300 mb-4"
                            >
                                Sign in
                            </button>
                            <button
                                type="button"
                                className="w-full py-2 px-4 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:ring focus:ring-orange-300"
                                onClick={loginGoogle}
                            >
                                <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google logo" className="mr-2" />
                                <p className="m-0">Sign in with Google</p>
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Don't have an account? <Link to="/register" className="text-orange-400 hover:underline">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="hidden md:block w-1/2 h-screen">
                    <img src={sunLogin} alt="" className="w-full h-full object-cover" />
                </div>
            </div>
        </>
    );

};

export default LoginPage;