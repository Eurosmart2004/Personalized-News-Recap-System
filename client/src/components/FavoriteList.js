import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAxios } from '../axios/axios';
import NewsCard from './NewsCard';

const FavoriteList = () => {
  const [favorites, setFavorites] = useState([]);
  const auth = useSelector((state) => state.auth);
  const { privateAxios } = useAxios();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await privateAxios.get(`/favorite/${auth.user.id}`);
        const transformedFavorites = response.data.map((favorite) => ({
          news: favorite.news,
          id: favorite.news.id,
          title: favorite.news.title,
          image: favorite.news.image,
          summary: favorite.news.summary,
          date: favorite.news.date,
          link: favorite.news.link,
        }));
        setFavorites(transformedFavorites);
      } catch (error) {
        console.error('Error fetching favorites', error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="mt-6 h-screen flex flex-col">
      <div className="container mx-auto px-4 flex-1">
        {/* Grid container for cards */}
        <div
          className={`grid gap-6 ${"grid-cols-3"}`}
        >
          {favorites.map((favorite) => (
            <div key={favorite.id}>
              <NewsCard news={favorite} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};  

export default FavoriteList;
