import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authReducer';
import themeReducer from './reducer/themeReducer';


export default configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        // collection: collectionReducer,
    },
});