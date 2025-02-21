import { createSlice } from '@reduxjs/toolkit';
import clusterAction from '../action/clusterAction';

export const clusterSlice = createSlice({
    name: 'cluster',
    initialState: {
        cluster: {}
    },
    reducers: {
        setCluster: clusterAction.setCluster,
    }
});

export const { setCluster } = clusterSlice.actions;
export default clusterSlice.reducer;