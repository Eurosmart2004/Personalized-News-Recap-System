import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authReducer';
import themeReducer from './reducer/themeReducer';
import collectionReducer from './reducer/collectionReducer';
import clusterReducer from './reducer/clusterReducer';
import newsReducer from './reducer/newsReducer';
export default configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        collection: collectionReducer,
        cluster: clusterReducer,
        news: newsReducer,
    },
});