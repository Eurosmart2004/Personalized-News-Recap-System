import { createSlice } from '@reduxjs/toolkit';
import newsAction from '../action/newsAction';

export const newsSlice = createSlice({
    name: 'news',
    initialState: {
        beforeTime: null,
        afterTime: null,
        news: [],
    },
    reducers: {
        setBeforeTime: newsAction.setBeforeTime,
        setAfterTime: newsAction.setAfterTime,
        setNews: newsAction.setNews,
    }
});

export const { setBeforeTime, setAfterTime, setNews } = newsSlice.actions;
export default newsSlice.reducer;