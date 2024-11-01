import { createSlice } from '@reduxjs/toolkit';
import authAction from '../action/authAction';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: null,
        user: null,
    },
    reducers: {
        setAuth: authAction.setAuth,
        removeAuth: authAction.removeAuth,
    }
});

export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;