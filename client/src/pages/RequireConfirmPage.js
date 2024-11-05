import { useEffect, useState } from "react";
import { publicAxios, privateAxios } from "../axios/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from "../redux/reducer/authReducer";
import { socket } from "../socket";
const RequireConfirmPage = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const email = auth.user.email;
    const navigate = useNavigate();
    useEffect(() => {
        checkConfirm();
        // Listen for confirmation events
        setLoading(false);
        socket.emit('join', { email });
        socket.on('message', (data) => {
            console.log(data.message);
        });
        socket.on('confirmation', async (data) => {
            console.log("Message confirm from socket: ", data.message);
            try {
                const res = await privateAxios.get('/user');
                dispatch(setAuth({ "user": res.data }));
            }
            catch (error) {
                // console.log(error);
            }
            setIsConfirmed(true);
            socket.emit('leave', { email });
        });



        return () => {
            socket.off('confirmation');
        };
    }, []);

    const checkConfirm = async () => {
        try {
            const res = await publicAxios.get(`/user/confirm?email=${email}`);
        }
        catch (error) {
            console.log(error);
            if (error.response && error.response.data.error == "User is already confirmed") {
                setIsConfirmed(true);
            }
        }
    };

    if (loading) { return <></>; }
    if (isConfirmed) {
        navigate('/preference');
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body text-center">
                    <h1 className="card-title">Account Created</h1>
                    <p className="card-text">Your account has been created successfully. Please check your email for a confirmation link.</p>
                </div>
            </div>
        </div>
    );
};
export default RequireConfirmPage;