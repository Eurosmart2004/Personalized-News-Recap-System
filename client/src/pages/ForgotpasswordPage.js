import { useState } from 'react';
import { publicAxios } from '../axios/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotpasswordPage = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await publicAxios.post('/user/forgot-password', { email });
            toast.success('Password reset email sent successfully');
        } catch (error) {
            toast.error(error.response.data.error);
            console.log(error);
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h1 className="text-center">Forgot Password Page</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Send Reset Email</button>
            </form>
        </div>
    );
};

export default ForgotpasswordPage;