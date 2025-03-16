import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAxios } from "../axios/axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

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
            const res = await publicAxios.put("/user/confirm", { token });
            console.log(res);
            setConfirm(true);
            setIsAlreadyConfirmed(false);
            setLoading(false);
        } catch (error) {
            console.log(error);
            if (
                error.response &&
                error.response.data.error === "User is already confirmed"
            ) {
                setConfirm(false);
                setIsAlreadyConfirmed(true);
                setLoading(false);
            } else {
                try {
                    const payload = jwtDecode(token);
                    await publicAxios.get(`/user/confirm?email=${payload.email}`);
                    setConfirm(false);
                    setIsAlreadyConfirmed(false);
                    setLoading(false);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    if (!token) {
        navigate("/");
    }
    if (loading) {
        return <></>;
    }

    const renderMessage = (title, message) => (
        <div className="container mx-auto mt-10">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );

    if (confirm) {
        return renderMessage(
            "Tài khoản đã được xác nhận",
            "Tài khoản của bạn đã được xác nhận thành công. Quay lại trang gốc của bạn."
        );
    }

    if (isAlreadyConfirmed) {
        return renderMessage(
            "Đã xác nhận",
            "Tài khoản của bạn đã được xác nhận. Quay lại trang gốc của bạn."
        );
    }

    return renderMessage(
        "Liên kết đã hết hạn",
        "Liên kết xác nhận của bạn đã hết hạn. Vui lòng kiểm tra email của bạn để nhận liên kết mới."
    );
};

export default ConfirmPage;
