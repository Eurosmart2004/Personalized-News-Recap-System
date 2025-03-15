import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAxios } from "../axios/axios";
import { useSelector, useDispatch } from "react-redux";
import { setCollection } from "../redux/reducer/collectionReducer";
import { GrAdd } from "react-icons/gr";
import { CiBookmark } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import Loading from "../components/Loading";
import { toast, ToastContainer } from 'react-toastify';

const CollectionPage = () => {
  const { privateAxios } = useAxios();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedListToDelete, setSelectedListToDelete] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAxios, setLoadingAxios] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const collection = useSelector((state) => state.collection.collections);
  console.log("collection", collection);
  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !event.target.closest(".menu-button")
    ) {
      setOpenMenuIndex(null);
    }
    if (isEditModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
      closeEditModal();
    }
    if (isDeleteModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
      closeDeleteModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditModalOpen, isDeleteModalOpen]);

  const getCollections = async () => {
    if (collection !== null) return;
    setLoading(true);
    try {
      const response = await privateAxios.get("/collection");
      dispatch(setCollection(response.data));
    } catch (err) {
      console.error("Error fetching collections:", err);
    }
    finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getCollections();
  }, []);

  const handleCreate = async () => {
    try {
      if (newCollectionName.length === 0 || newCollectionName.length > 100) {
        toast.error("Bộ sưu tập phải có tên từ 1 đến 100 ký tự");
        return;
      }
      setLoadingAxios(true);
      const response = await privateAxios.post('/collection', {
        name: newCollectionName,
      });
      dispatch(setCollection(response.data));
      setNewCollectionName('');
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Error creating collection:", err);
    }
    finally {
      setLoadingAxios(false);
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewCollectionName('');
  };

  const openEditModal = (list) => {
    setSelectedList(list);
    setIsEditModalOpen(true);
    setOpenMenuIndex(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedList(null);
  };

  const openDeleteModal = (list) => {
    setSelectedListToDelete(list);
    setIsDeleteModalOpen(true);
    setOpenMenuIndex(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedListToDelete(null);
  };

  const handleSave = async () => {
    try {
      if (selectedList.collection.name.length === 0 || selectedList.collection.name.length > 100) {
        toast.error("Bộ sưu tập phải có tên từ 1 đến 100 ký tự");
        return;
      }
      setLoadingAxios(true);
      const response = await privateAxios.put('/collection', {
        collection_id: selectedList.collection.id,
        name: selectedList.collection.name,
      });
      console.log(response);
      dispatch(setCollection(response.data));

      closeEditModal();

    }
    catch (err) {
      console.error("Error saving collection:", err);
    }
    finally {
      setLoadingAxios(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoadingAxios(true);
      const response = await privateAxios.delete('/collection', {
        data: {
          collection_id: selectedListToDelete.collection.id,
        }
      });
      dispatch(setCollection(response.data));
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting collection:", err);
    }
    finally {
      setLoadingAxios(false);
    }
  };

  useEffect(() => {
    console.log("Updated collection:", collection);
  }, [collection]);

  return (
    <div className="p-3 my-[40px] min-h-screen md:h-auto md:mt-0 mx-auto ">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[40px] font-light mb-4 dark:text-white">Lists</h1>
        <button
          type="button"
          onClick={openCreateModal}
          className="dark:text-white inline-flex justify-center items-center relative whitespace-nowrap align-middle leading-[1.2] rounded-3xl py-2 px-5 text-[16px] h-12 base-md gap-2 bg-bgr-faint text-fg-base hover:bg-gray-100 dark:bg-bgr-dark dark:text-fg-dark dark:hover:bg-gray-700 border border-border-emphasis dark:border-gray-700"
        >
          <GrAdd size={20} />
          <span className="">Tạo mới</span>
        </button>
      </div>

      {loading && <Loading />}

      <div className="space-y-3">
        {collection &&
          collection.map((list, index) => (
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
                    {list.news.length} {list.news.length > 1 ? "bài báo" : "bài báo"}
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
                    <span>Chỉnh sửa</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(list);
                    }}
                  >
                    <FiTrash2 />
                    <span>Xóa</span>
                  </button>
                </motion.div>
              )}
            </div>
          ))}
      </div>

      {/* Create New List Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tạo mới bộ sưu tập</h2>
                <button
                  onClick={closeCreateModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoMdClose size={25} />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên bộ sưu tập</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Tối đa 100 kí tự</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100"
                  onClick={closeCreateModal}
                >
                  Hủy
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  disabled={loadingAxios}
                  onClick={handleCreate}
                >
                  Tạo mới
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Edit List Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Chỉnh sửa bộ sưu tập</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoMdClose size={25} />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên bộ sưu tập</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={selectedList?.collection?.name || ""}
                  onChange={(e) =>
                    setSelectedList((prev) => ({
                      ...prev,
                      collection: { ...prev.collection, name: e.target.value },
                    }))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">Tối đa 100 kí tự</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100"
                  onClick={closeEditModal}
                >
                  Hủy
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  disabled={loadingAxios}
                  onClick={handleSave}
                >
                  Lưu
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Delete List Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Xóa bộ sưu tập</h2>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoMdClose size={25} />
                </button>
              </div>
              <div className="mb-4">
                <p>Bạn có chắc chắn muốn xóa bộ sưu tập "{selectedListToDelete?.collection?.name}"?</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  disabled={loadingAxios}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;