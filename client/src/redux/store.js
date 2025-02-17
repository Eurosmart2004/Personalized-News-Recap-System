import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authReducer';
import themeReducer from './reducer/themeReducer';
import collectionReducer from './reducer/collectionReducer';

export default configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        collection: collectionReducer,
    },
});