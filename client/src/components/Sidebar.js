import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import logo from "../images/logo.png";
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';
import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export default function Sidebar({ expanded, setExpanded, modal, setModal, children }) {
    const auth = useSelector((state) => state.auth);

    const closeModal = () => {
        setModal(false);
        setExpanded(false);
    };

    return (
        <>
            {/* Modal Overlay for Mobile */}
            {modal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
                    onClick={closeModal}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed h-screen top-0 left-0 z-50 bg-white dark:bg-gray-900 shadow-md border-r dark:border-gray-800 transition-transform ${modal ? "sm:hidden" : ""
                    } ${expanded ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
                style={{ maxWidth: "250px" }}
            >
                <nav className="h-full flex flex-col">
                    {/* Logo & Collapse Button */}
                    <div className={`p-4 pb-2 flex ${!modal ? 'justify-between' : 'justify-evenly'} items-center`}>
                        <img
                            src={logo}
                            className={`overflow-hidden transition-all ${expanded ? "w-20" : "w-0"
                                }`}
                            alt="Logo"
                        />
                        {
                            expanded && <p className=" text-gray-700 dark:text-slate-50">News Recap</p>
                        }

                        {
                            !modal && <button
                                onClick={() => {
                                    setExpanded((curr) => !curr);
                                }}
                                className="p-1.5 rounded-lg bg-gray-50 dark:bg-slate-300 hover:bg-gray-100 dark:hover:bg-slate-100"
                            >
                                {expanded ? <LuChevronFirst /> : <LuChevronLast />}
                            </button>
                        }

                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>

                    {/* User Info */}
                    {auth.user && (
                        <div className="border-t dark:border-gray-800 flex p-3">
                            {auth.user.picture ? (
                                <img
                                    src={auth.user.picture}
                                    className="w-10 h-10 rounded-full"
                                    alt="User"
                                />
                            ) : (
                                <Avatar name={auth.user.name} size="35" round={true} />
                            )}
                            <div
                                className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
                                    }`}
                            >
                                <div className="leading-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{auth.user.name}</h4>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{auth.user.email}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            </aside>
        </>
    );
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
    const { expanded } = useContext(SidebarContext);

    return (
        <li
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active
                ? "bg-gradient-to-tr from-orange-200 to-orange-100 text-orange-600 dark:from-orange-500 dark:to-orange-400 dark:text-orange-100"
                : "hover:bg-orange-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                }`}
            onClick={onClick}
        >
            {icon}
            {
                expanded && <span
                    className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
                        }`}
                >
                    {text}
                </span>
            }

            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-orange-400 dark:bg-orange-600 ${expanded ? "" : "top-2"
                        }`}
                />
            )}

            {!expanded && (
                <div className={`absolute left-full w-max rounded-md px-2 py-1 ml-6 bg-orange-100 dark:bg-gray-800 text-orange-800 dark:text-gray-300 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                >
                    {text}
                </div>
            )}
        </li >
    );
}


export function SidebarDropdown({ icon, text, children }) {
    const { expanded } = useContext(SidebarContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <li className="relative">
            <div
                className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${isOpen
                    ? "bg-gradient-to-tr from-orange-200 to-orange-100 text-orange-600 dark:from-orange-500 dark:to-orange-400 dark:text-orange-100"
                    : "hover:bg-orange-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }`}
                onClick={toggleDropdown}
            >
                {icon}
                {expanded && (
                    <>
                        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                            {text}
                        </span>
                    </>
                )}
                <span className="ml-auto">
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
                {!expanded && (
                    <div className={`absolute left-full w-max rounded-md px-2 py-1 ml-6 bg-orange-100 dark:bg-gray-800 text-orange-800 dark:text-gray-300 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                    >
                        {text}
                    </div>
                )}
            </div>
            <ul
                className={`pl-8 transition-height duration-700 ease-out ${isOpen ? "max-h-96" : "max-h-0 overflow-hidden"}`}
            >
                {children}
            </ul>
        </li>
    );
}