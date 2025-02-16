import { createSlice } from '@reduxjs/toolkit';
// import themeAction from '../action/themeAction';
import collectionAction from '../action/collectionAction'


/* 
state = {
    collections = [
        {
            id: ,
            name: ,
            favorite: []
        },
        {
            id: ,
            name: ,
            favorite: []
        }
    ],
}
*/

export const collectionSlice = createSlice({
    name: 'collection',
    initialState: {
        collections: [],
    },
    reducers: {
        getCollection: collectionAction.getCollection,
        addCollection: collectionAction.addCollection,
        updateCollection: collectionAction.updateCollection,
        deleteCollection: collectionAction.deleteCollection,
    }
});

export const { getCollection, addCollection, updateCollection, deleteCollection } = collectionSlice.actions;
export default collectionSlice.reducer;