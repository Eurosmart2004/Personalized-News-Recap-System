import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';
import { publicAxios, privateAxios } from '../axios/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [registerStatus, setRegisterStatus] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useSelector((state) => state.auth);
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

    const register = async (e) => {
        e.preventDefault();
        console.log('email:', email);
        console.log('password:', password);
        if (!name) {
            toast.error('Name is required');
            return;
        }
        if (!email) {
            toast.error('Email is required');
            return;
        }
        if (!password) {
            toast.error('Password is required');
            return;
        }
        try {
            const response = await publicAxios.post('/user/register', {
                name,
                email,
                password,
            });
            // const confirm = await publicAxios.get(`/user/confirm?email=${email}`);
            dispatch(setAuth(response.data));
            setRegisterStatus(true);

        } catch (error) {
            console.log('error:', error);
            toast.error(error.response.data.error);
        }
    };


    if (registerStatus) {
        navigate('/require-confirm');
    }

    return (
        <>
            <ToastContainer />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title text-center">Register</h3>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="name">Your Name</label>
                                        <input
                                            type="text"
                                            className="form-control my-2"
                                            id="name"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
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
                                    <button onClick={register} type="submit" className="btn btn-primary btn-block">Register</button>
                                </form>
                                <hr />
                                <div className="text-center">
                                    <button
                                        onClick={loginGoogle}
                                        className="btn btn-danger btn-block"
                                    >
                                        Register with Google
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        </>
    );
};

export default RegisterPage;