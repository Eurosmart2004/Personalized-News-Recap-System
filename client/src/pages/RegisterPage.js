import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';
import { useAxios } from '../axios/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import sunLogin from '../images/sun.png';

const RegisterPage = () => {
    const { publicAxios, privateAxios } = useAxios();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [remember, setRemember] = useState(false);
    const [registerStatus, setRegisterStatus] = useState(false);

    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

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
                console.error('Error logging in with Google:', error);
            }
        },
        onError: (error) => console.error('Login Failed:', error),
    });

    const validateName = (name) => {
        if (!name.trim()) return 'Name is required';
        return '';
    };

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

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Confirm password is required';
        if (confirmPassword !== password) return 'Passwords do not match';
        return '';
    };

    const handleNameChange = (e) => {
        const { value } = e.target;
        setName(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            name: validateName(value),
        }));
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
            confirmPassword: validateConfirmPassword(confirmPassword, value),
        }));
    };

    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setConfirmPassword(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: validateConfirmPassword(value, password),
        }));
    };

    const register = async (e) => {
        e.preventDefault();

        // Validate all fields on submit
        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

        if (nameError || emailError || passwordError || confirmPasswordError) {
            setErrors({
                name: nameError,
                email: emailError,
                password: passwordError,
                confirmPassword: confirmPasswordError,
            });
            toast.error('Please fix the errors before submitting');
            return;
        }

        try {
            const response = await publicAxios.post('/user/register', {
                name,
                email,
                password,
                isRemember: remember,
            });
            dispatch(setAuth({
                accessToken: response.data.accessToken,
                user: response.data.user,
                isRemember: remember,
            }));
            setRegisterStatus(true);
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response.data.error);
        }
    };

    if (registerStatus) {
        navigate('/require-confirm');
    }

    console.log(errors);
    console.log('name in erros', !(name in errors));
    return (
        <>
            <ToastContainer />
            <div className="flex">
                {/* Left Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-4">
                    <div className="container mx-auto p-6 max-w-sm">
                        <h2 className="font-bold text-2xl mb-4">Create an Account</h2>
                        <p className="text-gray-600 mb-6">Please enter your details to create a new account.</p>

                        <form onSubmit={register}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={handleNameChange}
                                    className={`block w-full px-4 py-2 border rounded-md focus:outline-none  ${errors.name === undefined ? 'focus:ring focus:ring-orange-300' : errors.name !== '' ? 'border-red-500' : 'border-green-500'
                                        }`}
                                />
                                {errors.name && <small className="text-red-500">{errors.name}</small>}
                            </div>
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
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="peer h-4 w-4 text-orange-400 focus:ring-orange-300 rounded focus:outline-none"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600 peer-checked:text-orange-400">
                                        Remember me
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-orange-400 text-white font-medium rounded-md hover:bg-orange-500 focus:ring focus:ring-orange-300 mb-4"
                            >
                                Sign up
                            </button>
                            <button
                                type="button"
                                className="w-full py-2 px-4 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:ring focus:ring-orange-300"
                                onClick={loginGoogle}
                            >
                                <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google logo" className="mr-2" />
                                <p className="m-0">Sign up with Google</p>
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Already have an account? <Link to="/login" className="text-orange-400 hover:underline">Login</Link>
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

export default RegisterPage;
