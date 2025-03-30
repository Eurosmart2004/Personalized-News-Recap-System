import NewsModal from './NewsModal';
import { useState } from 'react';
import CollectionButton from './CollectionButton';
import { useSelector } from 'react-redux';
import { BASEURL, TOPIC, formatDateTime, extractDomain, DOMAIN } from '../utils/Main';

const NewsCard = ({ news, isSaved, isFavorite = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const auth = useSelector((state) => state.auth);

    const domain = extractDomain(news.link);
    const source = DOMAIN[domain];

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
    };

    return (
        <>
            <div className="flex flex-col w-full xl:w-[20rem] h-full md:h-[25rem] lg:h-auto cursor-pointer transition-all duration-200 bg-white hover:bg-gray-100 dark:bg-black dark:border-gray-700 dark:border dark:hover:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
                onClick={openModal}>
                <img
                    src={news.image}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = BASEURL + '/news/image?image_url=' + news.image;
                    }}
                    alt="Post Cover"
                    className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center mb-2">
                        {source && (
                            <>
                                <img src={source.logo} alt={source.name} className="w-5 h-5 mr-2" />
                                <span className="text-[10px] text-gray-600 dark:text-gray-400">{source.name}</span>
                            </>
                        )}

                    </div>
                    <h5 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {news.title}
                    </h5>
                    <div className='flex flex-wrap items-center gap-x-2 mb-2'>
                        <span className="inline-block bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">
                            {TOPIC[news.topic]}
                        </span>
                        {isFavorite && (
                            <span className="inline-block bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">
                                Recommend
                            </span>
                        )}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        <small className="text-gray-500 dark:text-gray-400">{formatDateTime(news.date)}</small>
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
            {isModalOpen && <NewsModal onClose={closeModal} news={news} />}
        </>
    );
};

export default NewsCard;

export const NewsCardSkeleton = () => {
    return (
        <div className="flex flex-col sm:w-full xl:w-[20rem] h-full md:h-[25rem] lg:h-96 transition-all duration-200 bg-white dark:bg-black dark:border-gray-700 dark:border shadow-lg rounded-lg overflow-hidden">
            <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center mb-2">
                    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse mr-2"></div>
                    <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                </div>
                <div className="w-full h-6 bg-gray-300 dark:bg-gray-700 mb-2 animate-pulse"></div>
                <div className="flex flex-wrap gap-1 mb-2">
                    <div className="w-16 h-6 bg-gray-200 animate-pulse rounded-full"></div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <div className="w-20 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};