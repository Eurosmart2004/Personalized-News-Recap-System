import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useAxios } from "../axios/axios";
import { setFavoriteQueries, setFavoriateNews } from "../redux/reducer/newsReducer";
export default function NewsPreference({ isOpen, onClose }) {
    const [newPreference, setNewPreference] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const sidebarRef = useRef(null);
    const dispatch = useDispatch();
    const { privateAxios } = useAxios();
    const favoriteQueries = useSelector((state) => state.news.favoriteQueries);
    const favoriateNews = useSelector((state) => state.news.favoriateNews);

    const fetchNewsPreference = async (searchs) => {
        try {
            const response = await privateAxios.post("/news/favorite/search", {
                searchs
            });
            dispatch(setFavoriateNews([...favoriateNews, ...response.data.news]));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchFavoriteQueries = async () => {
            try {
                const response = await privateAxios.get("/news/favorite");
                dispatch(setFavoriteQueries(response.data.news_query));
                fetchNewsPreference(response.data.news_query.map((fav) => fav.search));
            } catch (error) {
                console.error(error);
            }
        };
        fetchFavoriteQueries();

    }, []);


    useEffect(() => {
        function handleClickOutside(event) {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest(".preference-button")
            ) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const addPreference = async () => {
        if (newPreference.trim()) {
            try {
                const response = await privateAxios.post("/news/favorite", {
                    query: newPreference.trim(),
                });
                dispatch(setFavoriteQueries(response.data.news_query));
                fetchNewsPreference([newPreference.trim()]);

            } catch (error) {
                console.error(error);
            }
            setNewPreference("");
        }
    };

    const editPreference = (index) => {
        setNewPreference(favoriteQueries[index].search);
        setEditingIndex(index);
    };

    const updatePreference = async () => {
        if (newPreference.trim()) {
            try {
                const response = await privateAxios.put("/news/favorite", {
                    new_query: newPreference.trim(),
                    query_id: favoriteQueries[editingIndex].id
                });
                dispatch(setFavoriteQueries(response.data.news_query));
                dispatch(setFavoriateNews(favoriateNews.filter((news) => news.search !== favoriteQueries[editingIndex].search)));
                fetchNewsPreference([newPreference.trim()]);
            }
            catch (error) {
                console.error(error);
            }
            setEditingIndex(null);
            setNewPreference("");
        }
    };

    const deletePreference = async (index) => {
        try {
            const response = await privateAxios.delete("/news/favorite", {
                data: {
                    query_id: favoriteQueries[index].id
                }
            });
            dispatch(setFavoriteQueries(response.data.news_query));
            dispatch(setFavoriateNews(favoriateNews.filter((news) => news.search !== favoriteQueries[index].search)));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}
            <motion.div
                ref={sidebarRef}
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 flex flex-col z-50"
            >
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold">Chủ đề bạn quan tâm</h2>
                    <button className="p-2 rounded-md hover:bg-gray-200" onClick={onClose}><AiOutlineClose /></button>
                </div>
                <div className="flex mt-4 gap-2">
                    <input
                        type="text"
                        placeholder="Chủ đề bạn quan tâm vd: Giá vàng"
                        value={newPreference}
                        onChange={(e) => setNewPreference(e.target.value)}
                        className="border p-2 flex-1 rounded-md"
                    />
                    {editingIndex === null ? (
                        <button className="p-2 bg-orange-500 text-white rounded-md" onClick={addPreference}><AiOutlinePlus /></button>
                    ) : (
                        <button className="p-2 bg-green-500 text-white rounded-md" onClick={updatePreference}><AiOutlineEdit /></button>
                    )}
                </div>
                <ul className="mt-4 space-y-2">
                    {favoriteQueries.map((fav, index) => (
                        <li key={fav.id} className="flex justify-between items-center p-2 border rounded-md">
                            <span>{fav.search}</span>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-200 rounded-md" onClick={() => editPreference(index)}>
                                    <AiOutlineEdit size={16} />
                                </button>
                                <button className="p-2 hover:bg-red-200 rounded-md" onClick={() => deletePreference(index)}>
                                    <AiOutlineDelete size={16} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </motion.div>
        </>
    );
}
