import { useNavigate } from 'react-router-dom';
import { LuSettings, LuLogOut, LuNewspaper, LuLogIn, LuStar } from "react-icons/lu";
import { VscColorMode } from "react-icons/vsc";
import { FiMenu } from "react-icons/fi";
import { CiLight } from "react-icons/ci";
import { MdNightlightRound, MdAutorenew } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAxios } from '../axios/axios';
import { setTheme } from '../redux/reducer/themeReducer';
import { removeAuth } from '../redux/reducer/authReducer';
import Sidebar, { SidebarItem, SidebarDropdown } from './Sidebar';


function Header({ expanded, setExpanded }) {
    const { publicAxios } = useAxios();
    const auth = useSelector((state) => state.auth);
    const [modal, setModal] = useState(false);
    const theme = useSelector((state) => state.theme.theme);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const logOut = async () => {
        try {
            const res = await publicAxios.post('/user/logout');
            console.log('res:', res);
            dispatch(removeAuth());
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    };

    // Handle screen resize to toggle modal/expanded states
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setModal(false); // No modal on larger screens
                setExpanded(true); // Always expanded on larger screens
            }
            else {
                setModal(false);
                setExpanded(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Run on initial render
        return () => window.removeEventListener("resize", handleResize);
    }, [setExpanded]);

    return (
        <>
            {/* Toggle Button for Mobile */}
            <button
                onClick={() => {
                    setModal(true);
                    setExpanded(true);
                }}
                className="sm:hidden p-2 fixed top-2 left-2 z-50 bg-gray-100 rounded-md shadow-lg"
            >
                <FiMenu size={20} />
            </button>

            <Sidebar
                expanded={expanded}
                setExpanded={setExpanded}
                modal={modal}
                setModal={setModal}
            >

                <SidebarItem icon={<LuNewspaper size={20} />} text="News" active={location.pathname === "/"} onClick={() => navigate("/")} />
                <SidebarItem icon={<LuStar size={20} />} text="Favorites" active={location.pathname === "/favorites"} onClick={() => navigate("/favorites")} />
                <hr className="my-3" />
                <SidebarItem icon={<LuSettings size={20} />} text="Settings" />
                <SidebarDropdown icon={<VscColorMode size={20} />} text="Theme">
                    <SidebarItem
                        icon={<MdNightlightRound size={20} />}
                        text="Dark Mode"
                        onClick={() => dispatch(setTheme('dark'))}
                        active={theme === 'dark'}
                    />
                    <SidebarItem
                        icon={<CiLight size={20} />}
                        text="Light Mode"
                        onClick={() => dispatch(setTheme('light'))}
                        active={theme === 'light'}
                    />
                    <SidebarItem
                        icon={<MdAutorenew size={20} />}
                        text="Auto Mode"
                        onClick={() => dispatch(setTheme('auto'))}
                        active={theme === 'auto'}
                    />
                </SidebarDropdown>
                <hr className="my-3" />
                <div className="mt-auto">
                    {auth.user ? (
                        <SidebarItem
                            icon={<LuLogOut size={20} />}
                            text="Logout"
                            onClick={logOut}
                        />
                    ) : (
                        <SidebarItem
                            icon={<LuLogIn size={20} />}
                            text="Login"
                            onClick={() => navigate("/login")}
                        />
                    )}
                </div>
            </Sidebar>
        </>
    );
}

export default Header;
