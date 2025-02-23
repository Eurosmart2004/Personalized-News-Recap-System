import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import { CiBookmark } from "react-icons/ci";
import { motion } from "framer-motion";

const CollectionList = ({ 
  collections, 
  openMenuIndex, 
  toggleMenu, 
  menuRef, 
  openEditModal, 
  openDeleteModal 
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {collections &&
        collections.map((list, index) => (
          <div
            key={index}
            className="relative cursor-pointer p-3 flex justify-between items-center border rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800"
            onClick={() => {
              navigate(`/collection/${list.collection.id}`);
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg dark:bg-gray-700">
                <CiBookmark size={20} />
              </div>
              <div>
                <p className="font-medium dark:text-white">{list.collection.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {list.news.length} {list.news.length > 1 ? "papers" : "paper"}
                </p>
              </div>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 menu-button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(index);
              }}
            >
              <FiMoreVertical size={20} className="dark:text-white" />
            </button>

            {openMenuIndex === index && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 mt-2 w-40 bg-white border rounded-lg shadow-md p-2 z-10 dark:bg-gray-800 dark:border-gray-700"
              >
                <button
                  className="dark:text-white flex items-center space-x-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(list);
                  }}
                >
                  <FiEdit2 />
                  <span>Edit</span>
                </button>
                <button
                  className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(list);
                  }}
                >
                  <FiTrash2 />
                  <span>Delete</span>
                </button>
              </motion.div>
            )}
          </div>
        ))}
    </div>
  );
};

export default CollectionList;