import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';
import { publicAxios, privateAxios } from '../axios/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ThemeButton from '../components/ThemeButton';
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
            console.log('Login Success:', res);
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
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title text-center">Login</h3>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="email">Email address</label>
                                        <input
                                            type="email"
                                            className="form-control my-2"
                                            id="email"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            className="form-control my-2"
                                            id="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <button onClick={login} type="submit" className="btn btn-primary btn-block">Login</button>
                                </form>
                                <hr />
                                <div className="text-center">
                                    <button
                                        onClick={loginGoogle}
                                        className="btn btn-danger btn-block"
                                    >
                                        Login with Google
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='btn btn-outline-primary' onClick={() => navigate('/')}>Back to Home</button>
                <ThemeButton />
            </div>
        </>
    );
};

export default LoginPage;