import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';
import { useAxios } from '../axios/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
    const { publicAxios, privateAxios } = useAxios();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [remember, setRemember] = useState(false);
    const [registerStatus, setRegisterStatus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                console.error('Lỗi đăng nhập bằng Google:', error);
            }
        },
        onError: (error) => console.error('Đăng nhập thất bại:', error),
    });

    const validateName = (name) => {
        if (!name.trim()) return 'Bạn cần nhập tên';
        return '';
    };

    const validateEmail = (email) => {
        if (!email.trim()) return 'Bạn cần nhập email';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Email không hợp lệ';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Mật khẩu là bắt buộc';
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt';
        }
        return '';
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Bạn cần nhập lại mật khẩu';
        if (confirmPassword !== password) return 'Mật khẩu không khớp';
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
            toast.error('Vui lòng kiểm tra lại thông tin đăng ký');
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
            toast.error(error.response.data.error);
        }
    };

    if (registerStatus) {
        navigate('/require-confirm');
    }

    return (
        <>
            <ToastContainer />
            <div className="flex">
                {/* Left Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-4">
                    <div className="container mx-auto p-6 max-w-sm">
                        <h2 className="font-bold text-2xl mb-4">Tạo tài khoản</h2>
                        <p className="text-gray-600 mb-6">Vui lòng nhập thông tin của bạn để tạo tài khoản mới.</p>

                        <form onSubmit={register}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Nhập tên của bạn"
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
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.email === undefined ? 'focus:ring focus:ring-orange-300' : errors.email !== '' ? 'border-red-500' : 'border-green-500'
                                        }`}
                                />
                                {errors.email && <small className="text-red-500">{errors.email}</small>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
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
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.password === undefined
                                            ? 'focus:ring focus:ring-orange-300 '
                                            : errors.password !== ''
                                                ? 'border-red-500'
                                                : 'border-green-500'
                                            }`}
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        onClick={toggleShowConfirmPassword}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </div>
                                </div>
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
                                        Remember
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-orange-400 text-white font-medium rounded-md hover:bg-orange-500 focus:ring focus:ring-orange-300 mb-4"
                            >
                                Đăng ký
                            </button>
                            <button
                                type="button"
                                className="w-full py-2 px-4 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:ring focus:ring-orange-300"
                                onClick={loginGoogle}
                            >
                                <img src={process.env.PUBLIC_URL + "/logo/google.png"} alt="Google logo" className="mr-2" />
                                <p className="m-0">Đăng ký bằng Google</p>
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Đã có tài khoản? <Link to="/login" className="text-orange-400 hover:underline">Đăng nhập</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="hidden md:block w-1/2 h-screen">
                    <img src={process.env.PUBLIC_URL + "/images/sun.png"} alt="Sun" className="w-full h-full object-cover" />
                </div>
            </div>

        </>
    );
};

export default RegisterPage;
