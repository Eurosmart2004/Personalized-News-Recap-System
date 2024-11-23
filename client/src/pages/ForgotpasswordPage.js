import { useState } from 'react';
import { useAxios } from '../axios/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPasswordPage = () => {
    const { publicAxios } = useAxios();
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        if (!email.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        if (emailError !== '') {
            toast.error(emailError);
            return;
        }
        try {
            setLoading(true);
            await publicAxios.post('/user/forgot-password', { email });
            setSuccess(true);
        } catch (error) {
            toast.error(error.response.data.error);
            console.log(error);
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
                    <p className="text-gray-600">
                        Please click on the link sent to your email to reset your password.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <ToastContainer />
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-semibold text-center mb-6">Forgot Password</h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="block w-full px-4 py-2 border rounded-md focus:ring focus:ring-orange-300 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 text-white font-medium rounded-md ${loading ? 'bg-orange-500' : 'bg-orange-400  hover:bg-orange-500'} `}
                        disabled={loading}
                    >
                        Send Reset Email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
