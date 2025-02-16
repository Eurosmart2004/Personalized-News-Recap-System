import NewsModal from './NewsModal';
import { useState, useEffect } from 'react';
import CollectionButton from './CollectionButton';
import { useSelector} from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';
import { useAxios } from '../axios/axios';

const NewsCard = ({ news }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [collections, setCollections] = useState([]);
    const auth = useSelector((state) => state.auth);
    const { privateAxios } = useAxios();

    // Fetch initial favorite status
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await privateAxios.get(`/collection/${auth.user.id}`);
                if (response.status === 200) {
                    const collections = response.data;
                    setCollections(collections);
                }
            } catch (error) {
                console.error('Error fetching collections:', error.message || error);
            }
        };
    
        if (auth.user?.id) {
          fetchCollections();
        }
      }, [auth.user?.id, privateAxios]);

    // Toggle modal visibility
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Prevent favorite button click from triggering modal
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
    };

    return (
        <>

            <div className=" cursor-pointer transition-all duration-200 bg-white hover:bg-gray-100 dark:bg-black dark:border-gray-700 dark:border dark:hover:bg-gray-800 shadow-lg rounded-lg overflow-hidden flex flex-col h-full"
                onClick={openModal}>
                <img
                    src={news.image}
                    alt="Post Cover"
                    className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                    <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {news.title}
                    </h5>
                    <div className="mt-auto flex items-center justify-between">
                        <small className="text-gray-500 dark:text-gray-400">{news.date}</small>
                        <div onClick={handleFavoriteClick}>
                            <CollectionButton 
                                userId={auth.user.id} 
                                newsId={news.id} 
                                collections={collections}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {
                isModalOpen && <NewsModal onClose={closeModal} news={news} />
            }
        </>
    );
};

export default NewsCard;

export const NewsCardSkeleton = () => {
    return (
        <div className="transition-all duration-200 bg-white dark:bg-black dark:border-gray-700 dark:border shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 mb-2 animate-pulse"></div>
                <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            </div>
        </div>
    );
};
