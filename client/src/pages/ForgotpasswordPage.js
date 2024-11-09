import { useState } from 'react';
import { useAxios } from '../axios/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotpasswordPage = () => {
    const { publicAxios } = useAxios();
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await publicAxios.post('/user/forgot-password', { email });
            setSuccess(true);
        } catch (error) {
            toast.error(error.response.data.error);
            console.log(error);
        }
    };

    if (success) return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body text-center">
                    <h1 className="card-title">Reset Password</h1>
                    <p className="card-text">Please click on the link sent to your email to reset your password.</p>
                </div>
            </div>
        </div>
    );


    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="text-center">Forgot Password</h1>
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
                                <button type="submit" className="btn btn-primary btn-block">Send Reset Email</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotpasswordPage;