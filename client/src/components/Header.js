import { useState, useEffect } from "react";
import { FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import { hover, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { removeAuth } from '../redux/reducer/authReducer';
import { useAxios } from '../axios/axios';
import Avatar from "react-avatar";
import logo from "../images/logo.png";
import NewsPreference from "./NewsPreference";

export default function Header({ expanded, setExpanded }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPreferenceOpen, setIsPreferenceOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const { publicAxios } = useAxios();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const logOut = async () => {
        try {
            await publicAxios.post('/user/logout');
            dispatch(removeAuth());
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    };

    let lastScrollY = 0;

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth <= 640) {
                if (window.scrollY > lastScrollY) {
                    setShowHeader(false);
                    setExpanded(false);
                } else {
                    setShowHeader(true);
                }
                lastScrollY = window.scrollY;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <>
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: showHeader ? 0 : -100, opacity: showHeader ? 1 : 0 }}
                transition={{ duration: 0.01 }}
                className=" bg-white border border-b-2 h-[64px] p-4 flex items-center justify-between sticky top-0 z-50"
            >
                {/* Left: Logo & Text */}
                <div className="flex items-center space-x-2 cursor-pointer"

                >
                    <div className="">
                        <button
                            onClick={() => setExpanded(curr => !curr)}
                            className="p-1.5 rounded-lg hover:bg-gray-100"
                        >
                            <AiOutlineMenu size={20} />
                        </button>
                    </div>
                    <button
                        className="flex items-center space-x-2"
                        onClick={() => navigate("/")}>
                        <img
                            src={logo}
                            alt="Avatar"
                            className="w-8 h-8"
                        />
                        <span className="text-md hidden sm:block">News Recap</span>
                    </button>
                </div>

                {/* Center: Preference Button */}
                <div className="relative sm:w-1/2 md:w-1/3 flex justify-center">
                    <button
                        onClick={() => {
                            setIsPreferenceOpen((prev) => !prev);
                        }}
                        className="preference-button px-6 py-2 bg-white text-orange-500 border border-orange-500 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    >
                        Sở thích cá nhân
                    </button>
                </div>

                {/* Right: Avatar & Dropdown */}
                <div className="relative hidden sm:block">
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 focus:outline-none">
                        {
                            user?.picture ?
                                <img
                                    src={user.picture}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full border"
                                /> :
                                <Avatar
                                    name={user?.name.split(" ").map((n) => n[0]).join("")}
                                    size="40"
                                    round={true}
                                    textSizeRatio={2}
                                />
                        }

                    </button>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-36 bg-white shadow-xl rounded-md overflow-hidden border z-50"
                        >
                            <button
                                onClick={() => {
                                    navigate('/user');
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-500 hover:text-white transition duration-300"
                            >
                                <FaUser className="mr-2" size={16} /> Hồ sơ
                            </button>
                            <button
                                onClick={logOut}
                                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-500 hover:text-white transition duration-300"                        >
                                <FaSignOutAlt className="mr-2" size={16} /> Đăng xuất
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.header>
            <NewsPreference isOpen={isPreferenceOpen} onClose={() => setIsPreferenceOpen(false)} />
        </>
    );
}
