import { useParams, useNavigate } from 'react-router-dom';
import { useAxios } from '../axios/axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const validatePassword = (password) => {
    if (!password) return 'Bạn cần nhập mật khẩu mới';
    if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[!@#$%^&*]/.test(password)
    ) {
        return 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt';
    }
    return '';
};

const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Bạn cần nhập xác nhận mật khẩu';
    if (confirmPassword !== password) return 'Mật khẩu không trùng nhau';
    return '';
};

const ResetPasswordPage = () => {
    const { publicAxios } = useAxios();
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

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
            toast.error('Vui lòng kiểm tra lại các yêu cầu');
            return;
        }

        try {
            setLoading(true);
            const response = await publicAxios.post('/user/reset-password', { token, password });
            toast.success(response.data.message);
            setSuccess(true);
        } catch (error) {
            console.log(error);
            if (error.response?.data?.error === "The link has expired. Please click to resend the email.") {
                toast.error("Đường dẫn link này đã hết hạn, chúng tôi sẽ cung cấp đường dẫn mới", {
                    autoClose: 10000,
                });
                handleResendEmail();
            }
            else {
                toast.error("Đã xảy ra sự cố");
            }
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
            toast.success("Đường dẫn mới để đặt lại mật khẩu đã trong email vui lòng kiểm tra.", {
                autoClose: 10000,
            });
        } catch (error) {
            toast.error('Đã xảy ra sự cố');
        }
        finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center">
                    <h1 className="text-2xl font-semibold mb-4">Đặt lại mật khẩu</h1>
                    <p className="text-gray-600 mb-6">
                        Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới của bạn.
                    </p>
                    <button
                        className="w-full py-2 px-4 bg-orange-400 text-white font-medium rounded-md hover:bg-orange-500"
                        onClick={() => navigate('/login')}
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <ToastContainer />
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-semibold text-center mb-6">Đặt lại mật khẩu</h1>
                <form onSubmit={handleSubmit} noValidate>
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
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 text-white font-medium rounded-md ${loading ? 'bg-orange-500' : 'bg-orange-400  hover:bg-orange-500'} `}
                        disabled={loading}
                    >
                        Đặt lại mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
