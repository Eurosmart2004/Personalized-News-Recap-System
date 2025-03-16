import { useNavigate } from 'react-router-dom';
import { LuSettings, LuNewspaper, LuLogOut } from "react-icons/lu";
import { GrAggregate } from "react-icons/gr";
import { FaRegBookmark } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useAxios } from '../axios/axios';
import { removeAuth } from '../redux/reducer/authReducer';
import { useState, useEffect } from 'react';
import Sidebar, { SidebarItem } from './Sidebar';

function SideBarComponent({ expanded, setExpanded }) {
  const { publicAxios } = useAxios();
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

  const [modal, setModal] = useState(false);


  // Handle screen resize to toggle modal/expanded states
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setModal(false); // No modal on larger screens
        setExpanded(true); // Always expanded on larger screens
      } else {
        setModal(true);
        setExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Run on initial render
    return () => window.removeEventListener("resize", handleResize);
  }, [setExpanded]);



  return (
    <>
      <Sidebar
        expanded={expanded}
        setExpanded={setExpanded}
        modal={modal}
        setModal={setModal}
      >
        <SidebarItem
          icon={<LuNewspaper size={16} />}
          text="Tin tức"
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        />
        <SidebarItem
          icon={<FaRegBookmark size={16} />}
          text="Bộ sưu tập"
          active={location.pathname.startsWith("/collection")}
          onClick={() => navigate("/collection")}
        />
        <SidebarItem
          icon={<GrAggregate size={16} />}
          text="Tin tổng hợp"
          active={location.pathname.startsWith("/aggregate")}
          onClick={() => navigate("/aggregate")}
        />
        {
          modal &&
          <>

            <hr className="my-3" />
            <SidebarItem
              icon={<LuSettings size={16} />}
              text="Hồ sơ"
              active={location.pathname.startsWith("/user")}
              onClick={() => navigate("/user")}
            />
            <SidebarItem
              icon={<LuLogOut size={16} />}
              text="Đăng xuất"
              onClick={logOut}
            />
          </>
        }
        {/*
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
        */}
      </Sidebar>
    </>
  );
}

export default SideBarComponent;
