import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SidebarContext = createContext();

// Variants for the sidebar width (open vs. closed)
const sidebarVariants = {
  open: { width: "200px", transition: { duration: 0.1 } },
  closed: { width: "65px", transition: { duration: 0.1 } },
  modal: { width: "0px", transition: { duration: 0.1 } }
};

export default function Sidebar({
  expanded,
  setExpanded,
  modal,
  setModal,
  children,
}) {

  // Function to close the sidebar on mobile overlay click
  const closeModal = () => {
    setModal(true);
    setExpanded(false);
  };

  return (
    <>
      {/* Mobile Modal Overlay */}
      {modal && expanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={closeModal}
        ></div>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {
          ((modal && expanded) || !modal) && (
            <motion.aside
              className={`overflow-visible fixed h-screen top-16 left-0 z-50 bg-white dark:bg-gray-900 border-r dark:border-gray-800 ${modal ? "sm:hidden" : ""}`}
              style={{ maxWidth: "250px" }}
              variants={sidebarVariants}
              initial={modal ? "modal" : (!expanded ? "closed" : "open")}
              animate={modal ? (expanded ? "open" : "modal") : (expanded ? "open" : "closed")}
              exit={{ opacity: 0, width: 0 }}
            >
              <nav className="h-full flex flex-col">
                <SidebarContext.Provider value={{ expanded }}>
                  <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>
              </nav>
            </motion.aside>
          )
        }
      </AnimatePresence>
    </>
  );
}


export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-3 h-[40px] font-medium rounded-md cursor-pointer transition-colors group ${active
        ? "bg-gradient-to-tr from-orange-200 to-orange-100 text-orange-600 dark:from-orange-500 dark:to-orange-400 dark:text-orange-100"
        : "hover:bg-orange-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
        }`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">{icon}</div>
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.1 }}
            className="ml-3 text-base overflow-hidden whitespace-nowrap"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-orange-400 dark:bg-orange-600 ${expanded ? "" : "top-2"}`}
        />
      )}
      {!expanded && (
        <div className="text-sm absolute left-full w-max rounded-md px-2 py-1 ml-6 bg-orange-100 dark:bg-gray-800 text-orange-800 dark:text-gray-300 transition-all duration-100 invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {text}
        </div>
      )}
    </li>
  );
}

export function SidebarDropdown({ icon, text, children }) {
  const { expanded } = useContext(SidebarContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  // Variants for the dropdown list
  const dropdownVariants = {
    open: { height: "auto", opacity: 1, transition: { duration: 0.1 } },
    closed: { height: 0, opacity: 0, transition: { duration: 0.1 } }
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
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.1 }}
            className="ml-3 overflow-hidden whitespace-nowrap"
          >
            {text}
          </motion.span>
        )}
        <span className="ml-auto">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
        {!expanded && (
          <div className="absolute left-full w-max rounded-md px-2 py-1 ml-6 bg-orange-100 dark:bg-gray-800 text-orange-800 dark:text-gray-300 text-sm transition-all duration-100 invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
            {text}
          </div>
        )}
      </div>
      <motion.ul
        variants={dropdownVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="pl-8 overflow-hidden"
      >
        {children}
      </motion.ul>
    </li>
  );
}