import { createSlice } from '@reduxjs/toolkit';
import themeAction from '../action/themeAction';

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: 'light',
    },
    reducers: {
        setTheme: themeAction.setTheme,
    }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;