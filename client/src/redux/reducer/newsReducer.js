import { createSlice } from '@reduxjs/toolkit';
import newsAction from '../action/newsAction';

export const newsSlice = createSlice({
    name: 'news',
    initialState: {
        beforeTime: null,
        afterTime: null,
        news: [],
        favoriateNews: [],
        favoriteQueries: [],
    },
    reducers: {
        setBeforeTime: newsAction.setBeforeTime,
        setAfterTime: newsAction.setAfterTime,
        setNews: newsAction.setNews,
        setFavoriateNews: newsAction.setFavoriateNews,
        setFavoriteQueries: newsAction.setFavoriteQueries,
    }
});

export const { setBeforeTime, setAfterTime, setNews, setFavoriateNews, setFavoriteQueries } = newsSlice.actions;
export default newsSlice.reducer;