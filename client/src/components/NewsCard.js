import NewsModal from './NewsModal';
import { useState, useEffect } from 'react';
import CollectionButton from './CollectionButton';
import { useSelector } from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';
import { useAxios } from '../axios/axios';
import { BASEURL } from '../utils/Network';

const NewsCard = ({ news, isSaved }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const auth = useSelector((state) => state.auth);
    const { privateAxios } = useAxios();
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
                    src={news.image} // try loading the original image
                    onError={(e) => {
                        // Remove onError to avoid an infinite loop in case the fallback also fails
                        e.target.onerror = null;
                        // Set the fallback image URL using the BASEURL
                        e.target.src = BASEURL + '/news/image?image_url=' + news.image;
                    }}
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
                                isSaved={isSaved}
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
};;
