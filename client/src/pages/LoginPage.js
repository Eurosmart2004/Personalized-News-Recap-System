import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';
import { publicAxios, privateAxios } from '../axios/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ThemeButton from '../components/ThemeButton';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const loginGoogle = useGoogleLogin({
        onSuccess: async (res) => {
            try {
                const response = await publicAxios.post('/user/login/google', {
                    token: res.access_token,
                });
                privateAxios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
                dispatch(setAuth(response.data));
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
        try {
            const response = await publicAxios.post('/user/login', {
                email,
                password,
            });
            privateAxios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
            dispatch(setAuth(response.data));
            navigate(from, { replace: true });
        } catch (error) {
            console.log('error:', error);
            toast.error(error.response.data.error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-lg">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4">Login</h3>
                                <form onSubmit={login}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="email">Email address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                                </form>
                                <hr />
                                <div className="text-center">
                                    <button
                                        onClick={loginGoogle}
                                        className="btn btn-danger btn-block w-100"
                                    >
                                        Login with Google
                                    </button>
                                </div>
                                <div className="text-center mt-3">
                                    <Link to={"/forgot-password"}>Forgot Password?</Link>
                                </div>
                                <div className="text-center mt-2">
                                    <span>Don't have an account? </span>
                                    <Link to={"/register"} >Register</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button className='btn btn-outline-primary' onClick={() => navigate('/')}>Back to Home</button>
                </div>
                <div className="text-center mt-2">
                    <ThemeButton />
                </div>
            </div>
        </>
    );
};

export default LoginPage;