import React from 'react';
import FavoriteList from '../components/FavoriteList';

const FavoritePage = ({ userId }) => {
  return (
    <div>
      <h1>Your Favorites</h1>
      <FavoriteList userId={userId} />
    </div>
    
  );
};

export default FavoritePage;