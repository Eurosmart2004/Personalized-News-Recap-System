import { useState, useEffect } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { GrAdd } from "react-icons/gr";
import { useSelector, useDispatch } from "react-redux";
import { setCollection } from "../redux/reducer/collectionReducer";
import { useAxios } from "../axios/axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

export default function CollectionButtonForm({ isOpen, onClose, newsId }) {
    const { privateAxios } = useAxios();
    const dispatch = useDispatch();
    const collectionInitial = useSelector((state) => state.collection.collections);
    const [lists, setLists] = useState(collectionInitial);
    const [selectedLists, setSelectedLists] = useState(() => {
        var tempSelectedList = [];
        collectionInitial.forEach(c => {
            for (let index = 0; index < c.news.length; index++) {
                if (c.news[index].id === newsId) {
                    tempSelectedList.push(c.collection);
                    break;
                }
            }
        });
        return tempSelectedList;
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");

    useEffect(() => {
        function handleClickOutside(event) {
            if (event.target.closest(".modal-container") === null) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const toggleSelection = (collection) => {
        setSelectedLists((prev) =>
            prev.includes(collection)
                ? prev.filter((c) => c !== collection)
                : [...prev, collection]
        );
    };

    const handleDone = async () => {
        const removedListId = () => {
            var tempSelectedList = [];
            collectionInitial.forEach(c => {
                for (let index = 0; index < c.news.length; index++) {
                    if (c.news[index].id === newsId) {
                        tempSelectedList.push(c.collection);
                        break;
                    }
                }
            });
            var tempRemovedLists = [];
            tempSelectedList.forEach(c => {
                if (!selectedLists.includes(c)) {
                    tempRemovedLists.push(c.id);
                }
            });
            return tempRemovedLists;
        };

        const addedListId = () => {
            var tempAddedLists = [];
            collectionInitial.forEach(c => {
                if (selectedLists.includes(c.collection)) {
                    var isExist = false;
                    for (let index = 0; index < c.news.length; index++) {
                        if (c.news[index].id === newsId) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        tempAddedLists.push(c.collection.id);
                    }
                }
            });
            return tempAddedLists;
        };

        try {
            const removedList = removedListId();
            const addedList = addedListId();

            await privateAxios.delete('/collection/favorite', {
                data: {
                    news_id: newsId,
                    list_collection_id: removedList
                }
            });

            const response = await privateAxios.post('/collection/favorite', {
                news_id: newsId,
                list_collection_id: addedList
            });

            console.log(response);

            dispatch(setCollection(response.data));

            onClose();

        }
        catch (error) {
            console.error("Error saving to collection:", error);
        }

    };

    const handleCreateNewList = async () => {
        try {
            if (newCollectionName.length === 0 || newCollectionName.length > 100) {
                toast.error("Collection name must be between 1 and 100 characters");
                return;
            }
            const response = await privateAxios.post('/collection', {
                name: newCollectionName
            });
            console.log(response);
            setLists(response.data.collections);
            dispatch(setCollection(response.data));

            setIsCreateModalOpen(false);
            setNewCollectionName("");
        } catch (error) {
            console.error("Error creating new collection:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <ToastContainer />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="cursor-default fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="modal-container bg-white rounded-xl sm:w-[500px] max-h-[500px] overflow-hidden flex flex-col border"
                >
                    <div className="py-3 pl-4 pr-1.5 border-b flex items-center justify-between">
                        <h1 className="lg-bold text-fg-base">Save to collection</h1>
                        <button
                            data-testid="close-button"
                            type="button"
                            className="inline-flex justify-center items-center h-10 w-10 rounded-full text-fg-base hover:bg-bgr-faint"
                            onClick={onClose}
                        >
                            <IoMdClose size={30} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <button
                            className="flex items-center w-full gap-3 p-3 text-left bg-white hover:bg-gray-100 transition duration-150 border rounded-xl min-h-[68px] mb-4"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-bgr-subtle">
                                <GrAdd className="text-xl text-fg-muted" />
                            </div>
                            <span className="sm-md">Create new collection</span>
                        </button>
                        {lists.map((list, index) => (
                            <button
                                key={index}
                                className={`flex items-center w-full my-3 gap-3 p-3 text-left bg-white hover:bg-gray-100 transition duration-150 border rounded-xl min-h-[68px] ${selectedLists.includes(list.name) ? "bg-gray-200" : ""}`}
                                onClick={() => toggleSelection(list.collection)}
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-bgr-subtle">
                                    {selectedLists.includes(list.collection) ? <FaBookmark className="text-xl text-fg-muted" /> : <FaRegBookmark className="text-xl text-fg-muted" />}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <h2 className="sm-md">{list.collection.name}</h2>
                                    {
                                        list.news.length > 1 ? <p className="tiny-normal text-fg-muted">{list.news.length} papers</p> : <p className="tiny-normal text-fg-muted">{list.news.length} paper</p>
                                    }
                                </div>
                                <input type="checkbox" className="hidden" checked={selectedLists.includes(list.name)} readOnly />
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col-reverse gap-2 p-4 sm:flex-row sm:justify-end border-t">
                        <button
                            data-testid="cancel-button"
                            type="button"
                            className="py-2 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-border-emphasis rounded-3xl transition-colors duration-300"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDone}
                            className="py-2 px-4 bg-orange-600 text-white rounded-3xl hover:bg-orange-700 transition-colors duration-300"
                        >
                            Done
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            {isCreateModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="cursor-default fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="modal-container bg-white rounded-xl sm:w-[400px] p-4 border"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="lg-bold text-fg-base">Create New Collection</h2>
                            <button
                                type="button"
                                className="inline-flex justify-center items-center h-10 w-10 rounded-full text-fg-base hover:bg-bgr-faint"
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                <IoMdClose className="w-[30px] h-[30px]" />
                            </button>
                        </div>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg mb-4"
                            placeholder="New collection name"
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                        />
                        <p className="px-2 text-xs text-gray-500 mt-1 dark:text-gray-400">100 characters maximum</p>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="py-2 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-border-emphasis rounded-3xl transition-colors duration-300"
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="py-2 px-4 bg-orange-600 text-white rounded-3xl hover:bg-orange-700 transition-colors duration-300"
                                onClick={handleCreateNewList}
                            >
                                Create
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}