import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAxios } from '../axios/axios';
import { jwtDecode } from 'jwt-decode';
import { removeAuth } from '../redux/reducer/authReducer';
import { useSelector, useDispatch } from 'react-redux';
const ConfirmPage = () => {
    const { publicAxios } = useAxios();
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(false);
    const [isAlreadyConfirmed, setIsAlreadyConfirmed] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        confirmFunction();
    }, []);


    const confirmFunction = async () => {
        try {
            const res = await publicAxios.put('/user/confirm', { token });
            console.log(res);
            setConfirm(true);
            setIsAlreadyConfirmed(false);
            setLoading(false);

        } catch (error) {
            console.log(error);
            if (error.response && error.response.data.error == "User is already confirmed") {
                setConfirm(false);
                setIsAlreadyConfirmed(true);
                setLoading(false);

            }
            else {
                try {
                    const payload = jwtDecode(token);
                    const res = await publicAxios.get(`/user/confirm?email=${payload.email}`);
                    setConfirm(false);
                    setIsAlreadyConfirmed(false);
                    setLoading(false);
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    };

    if (!token) { navigate('/'); }
    if (loading) { return <></>; }

    if (confirm) {
        return (
            <div className="container mt-5">
                <div className="card">
                    <div className="card-body text-center">
                        <h1 className="card-title">Account Confirmed</h1>
                        <p className="card-text">Your account has been confirmed successfully</p>
                    </div>
                </div>
            </div>
        );
    }
    if (isAlreadyConfirmed) {
        return (
            <div className="container mt-5">
                <div className="card">
                    <div className="card-body text-center">
                        <h1 className="card-title">Already Confirmed</h1>
                        <p className="card-text">Your account has already been confirmed.</p>
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
