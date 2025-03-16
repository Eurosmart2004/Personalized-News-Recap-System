import { useEffect, useState } from "react";
import { useAxios } from "../axios/axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../redux/reducer/authReducer";
import { socket } from "../socket";

const RequireConfirmPage = () => {
    const { publicAxios, privateAxios } = useAxios();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const email = auth.user.email;
    const navigate = useNavigate();

    useEffect(() => {
        checkConfirm();
        setLoading(false);
        socket.connect();
        socket.emit("join", { email });
        socket.on("message", (data) => {
        });
        socket.on("confirmation", async (data) => {
            console.log("Message confirm from socket: ", data.message);
            try {
                const res = await privateAxios.get("/user");
                dispatch(setAuth({ user: res.data }));
            } catch (error) {
                console.error(error);
            }
            setIsConfirmed(true);
            socket.emit("leave", { email });
        });

        return () => {
            socket.off("confirmation");
            socket.disconnect();
        };
    }, []);

    const checkConfirm = async () => {
        try {
            const res = await publicAxios.get(`/user/confirm?email=${email}`);
        } catch (error) {
            // console.log(error);
            if (error.response && error.response.data.error === "User is already confirmed") {
                setIsConfirmed(true);
            }
        }
    };

    if (loading) return <></>;
    if (isConfirmed) navigate("/preference");

    return (
        <div className="container mx-auto mt-10">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Tài khoản đã được tạo</h1>
                    <p className="text-gray-600">
                        Tài khoản của bạn đã được tạo thành công. Vui lòng kiểm tra email của bạn để nhận liên kết xác nhận.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RequireConfirmPage;
