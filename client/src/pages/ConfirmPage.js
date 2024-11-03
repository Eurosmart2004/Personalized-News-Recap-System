import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { publicAxios } from '../axios/axios';
import { ToastContainer, toast } from 'react-toastify';
import { setAuth } from '../redux/reducer/authReducer';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
const ConfirmPage = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(false);
    const navigate = useNavigate();
    const handleChoosePreference = () => { navigate('/preference'); };
    useEffect(() => {
        const confirm = async () => {
            try {
                const res = await publicAxios.put('/user/confirm', { token });
                console.log(res.data);
                dispatch(setAuth(res.data));
                setConfirm(true);
                setLoading(false);
            } catch (error) {
                console.log(error);
                try {
                    const payload = jwtDecode(token);
                    const res = await publicAxios.get(`/user/confirm?email=${payload.email}`);
                    setLoading(false);
                    setConfirm(false);
                }
                catch (error) {
                    console.log(error);
                }
            }
        };
        confirm();
    }, []);
    if (!token) { navigate('/'); }
    if (loading) { return <></>; }
    if (confirm) {
        return (
            <div className="container mt-5">
                <div className="card">
                    <div className="card-body text-center">
                        <h1 className="card-title">Account Confirmed</h1>
                        <p className="card-text">Your account has been confirmed successfully. You can now login.</p>
                        <button onClick={handleChoosePreference} className="btn btn-primary">Let choose your preference</button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="container mt-5">
                <div className="card">
                    <div className="card-body text-center">
                        <h1 className="card-title">Link Expired</h1>
                        <p className="card-text">Your confirmation link has expired. Please check your email for a new link.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmPage;
