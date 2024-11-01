// src/pages/ConfirmPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicAxios } from '../axios/axios';
import { ToastContainer, toast } from 'react-toastify';
import { setAuth } from '../redux/reducer/authReducer';
import { useDispatch } from 'react-redux';
const ConfirmPage = () => {
    const [code, setCode] = useState(new Array(6).fill(""));
    const [resendDisabled, setResendDisabled] = useState(false);
    const { email } = useParams();
    const dispatch = useDispatch();
    const handleChange = (e, index) => {
        const { value } = e.target;

        // Allow only digits and set to a max length of 1 per input box
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Automatically focus on the next input if a digit is entered
            if (value && index < 5) {
                document.getElementById(`code-input-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && code[index] === "" && index > 0) {
            document.getElementById(`code-input-${index - 1}`).focus();
        }

        if (e.key === "ArrowLeft" && index > 0) {
            document.getElementById(`code-input-${index - 1}`).focus();
        }

        if (e.key === "ArrowRight" && index < 5) {
            document.getElementById(`code-input-${index + 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmationCode = code.join("");
        if (confirmationCode.length === 6) {
            console.log("Submitted confirmation code:", confirmationCode);
        } else {
            alert("Please enter a valid 6-digit code.");
        }

        try {
            const response = await publicAxios.put('/user/confirm', {
                email,
                code: confirmationCode
            });
            dispatch(setAuth(response.data));
            toast.success('Account confirmed successfully');

        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        }
    };

    const handleResend = () => {
        setResendDisabled(true);
        publicAxios.get(`/user/confirm?email=${email}`)
            .then(() => {
                toast.success('Verification code sent successfully');
                setResendDisabled(false);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.error);
                setResendDisabled(false);
            });
    };

    useEffect(() => {
        document.getElementById('code-input-0').focus();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="container d-flex flex-column align-items-center mt-5" style={{ maxWidth: "400px" }}>
                <h2 className="mb-2 text-center text-primary">2-step verification</h2>
                <p className="text-center text-muted">
                    We sent a verification code to your email.<br />Please enter the code in the field below.
                </p>
                <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center w-100">
                    <div className="d-flex justify-content-center mb-4">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-input-${index}`}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="form-control mx-1 text-center border"
                                style={{ width: "60px", height: "60px", fontSize: "24px", backgroundColor: "#f8f9fa" }}
                                maxLength="1"
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3"
                        style={{ fontSize: "15px" }}
                    >
                        Verify my account
                    </button>
                </form>
                <hr className="w-100" />
                <p className="text-center mt-3 text-muted">
                    Did not receive the email? Check your spam filter, or
                </p>
                <button
                    onClick={handleResend}
                    className="btn btn-outline-secondary w-100 mb-3"
                    disabled={resendDisabled}
                >
                    Resend code
                </button>
            </div>
        </>
    );
};

export default ConfirmPage;
