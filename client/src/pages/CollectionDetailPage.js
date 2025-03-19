import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { setCollection } from "../redux/reducer/collectionReducer";
import { useParams, useNavigate } from 'react-router-dom';
import { useAxios } from "../axios/axios";
import { TfiArrowLeft } from "react-icons/tfi";
import Loading from "../components/Loading";
import { formatDateTime } from "../utils/Main";

const CollectionDetailPage = () => {
    const { id } = useParams();
    const { privateAxios } = useAxios();
    const collection = useSelector((state) => state.collection.collections);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [newsList, setNewsList] = useState([]);
    const [collectionName, setCollectionName] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const getCollections = async () => {
        if (collection !== null) return;
        setLoading(true);
        try {
            const response = await privateAxios.get("/collection");
            dispatch(setCollection(response.data));
        } catch (err) {
            console.error("Error fetching collections:", err);
            setError(true);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (collection === null) {
            getCollections();
        }
    }, []);

    useEffect(() => {
        if (collection === null) return;
        const news = () => {
            const foundCollection = collection.find(c => c.collection.id == id);
            if (foundCollection) {
                setCollectionName(foundCollection.collection.name);
                return foundCollection.news;
            }
            setError(true);
            return null;
        };

        setNewsList(news());
    }, [collection, id]);

    if (error) {
        return <div className="text-center">
            <p className="mb-4">You are not the owner of this list. Please create your own list to view your saved bookmarks.</p>
            <button
                onClick={() => navigate('/collection')}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg dark:bg-orange-700"
            >
                Go to My List
            </button>
        </div>;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-4 dark:text-white min-h-screen">
            <div className="flex items-center mb-4">
                <button
                    onClick={() => navigate('/collection')}
                    className="mr-4 p-2 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-100"
                >
                    <TfiArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-semibold">{collectionName}</h1>
            </div>
            {
                newsList && newsList.map(news => (
                    <div key={news.id} className="mb-6 p-4 border rounded-lg dark:border-gray-700">
                        <img src={news.title} alt="" />
                        <h2 className="text-xl font-semibold">{news.title}</h2>
                        <small className="my-2 text-gray-500 dark:text-gray-400">{formatDateTime(news.date)}</small>
                        <p className="my-2 text-gray-500">{news.summary}</p>
                        <a href={news.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-300">Read more</a>
                    </div>
                ))
            }
        </div>
    );
};

export default CollectionDetailPage;