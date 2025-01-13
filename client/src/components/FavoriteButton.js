import React, { useState, useEffect } from 'react';
import { useAxios } from '../axios/axios';

const FavoriteButton = ({ userId, newsId, isFavorited: initialFavorited, onFavoriteChange }) => {
    const [favorited, setFavorited] = useState(initialFavorited);
    const { privateAxios } = useAxios();

    useEffect(() => {
        console.log(`FavoriteButton: Received new initialFavorited ${initialFavorited} for news ${newsId}`);
        setFavorited(initialFavorited);
    }, [initialFavorited, newsId]);

    const handleFavorite = async () => {
        try {
            const newStatus = !favorited;
            console.log(`Attempting to ${newStatus ? 'favorite' : 'unfavorite'} news ${newsId}`);

            if (favorited) {
                await privateAxios.delete('/favorite', { 
                    data: { user_id: userId, news_id: newsId } 
                });
            } else {
                await privateAxios.post('/favorite', { 
                    user_id: userId, 
                    news_id: newsId 
                });
            }
            
            setFavorited(newStatus);
            onFavoriteChange?.(newStatus);
            console.log(`Successfully ${newStatus ? 'favorited' : 'unfavorited'} news ${newsId}`);
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };

    return (
        <button
            onClick={handleFavorite}
            className={`px-4 py-2 rounded-full text-white font-bold transition-colors duration-300 ${
                favorited ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'
            }`}
        >
            {favorited ? 'Unfavorite' : 'Favorite'}
        </button>
    );
};

export default FavoriteButton;