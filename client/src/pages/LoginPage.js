import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';
import { useAxios } from '../axios/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const LoginPage = () => {
    const { publicAxios, privateAxios } = useAxios();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validateEmail = (email) => {
        if (!email.trim()) return 'Bạn cần nhập email';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Email không hợp lệ';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Bạn cần nhập mật khẩu';
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất 8 ký tự, 1 chữ cái viết hoa, 1 số và 1 ký tự đặc biệt';
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
            toast.error('Vui lòng kiểm tra lại thông tin đăng nhập');
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
                        <h2 className="font-bold text-2xl mb-4">Chào mừng bạn</h2>
                        <p className="text-gray-600 mb-6">Chào mừng trở lại! Vui lòng nhập thông tin chi tiết của bạn.</p>

                        <form onSubmit={login}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.email === undefined ? 'focus:ring focus:ring-orange-300' : errors.email !== '' ? 'border-red-500' : 'border-green-500'
                                        }`}
                                />
                                {errors.email && <small className="text-red-500">{errors.email}</small>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.password === undefined
                                            ? 'focus:ring focus:ring-orange-300 '
                                            : errors.password !== ''
                                                ? 'border-red-500'
                                                : 'border-green-500'
                                            }`}
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </div>
                                </div>
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
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember</label>
                                </div>
                                <Link to="/forgot-password" className="text-orange-400 text-sm hover:underline">Quên mật khẩu</Link>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-orange-400 text-white font-medium rounded-md hover:bg-orange-500 focus:outline-none focus:ring focus:ring-orange-300 mb-4"
                            >
                                Đăng nhập
                            </button>
                            <button
                                type="button"
                                className="w-full py-2 px-4 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:ring focus:ring-orange-300"
                                onClick={loginGoogle}
                            >
                                <img src={process.env.PUBLIC_URL + "/logo/google.png"} alt="Google logo" className="mr-2" />
                                <p className="m-0">Đăng nhập bằng Google</p>
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Bạn chưa có tài khoản? <Link to="/register" className="text-orange-400 hover:underline">Đăng ký</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="hidden md:block w-1/2 h-screen">
                    <img src={process.env.PUBLIC_URL + "/images/sun.png"} alt="" className="w-full h-full object-cover" />
                </div>
            </div>
        </>
    );

};

export default LoginPage;