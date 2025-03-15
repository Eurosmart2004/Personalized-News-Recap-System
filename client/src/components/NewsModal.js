import React from "react";
import { BASEURL, formatDateTime } from "../utils/Main";
const NewsModal = ({ onClose, news }) => {
    const handleOutsideClick = (e) => {
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleOutsideClick}
        >
            <div
                className="bg-white dark:bg-black p-6 rounded-lg shadow-lg w-11/12 max-w-3xl"
                onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing
            >
                {/* Header with Icon and Title */}
                <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        {news.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
                    >
                        ✖
                    </button>
                </div>

                {/* News Image */}
                <img
                    src={news.image} // try loading the original image
                    onError={(e) => {
                        // Remove onError to avoid an infinite loop in case the fallback also fails
                        e.target.onerror = null;
                        // Set the fallback image URL using the BASEURL
                        e.target.src = BASEURL + '/news/image?image_url=' + news.image;
                    }}
                    alt="News"
                    className="w-full h-48 object-cover mb-4 rounded-md"
                />

                {/* News Details */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {formatDateTime(news.date)}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {news.summary}
                </p>

                {/* Interaction Buttons */}
                <div className="flex justify-between items-center">
                    <div></div>
                    <a
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                    >
                        Đọc chi tiết
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NewsModal;
