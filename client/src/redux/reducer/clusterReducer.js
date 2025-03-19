import { createSlice } from '@reduxjs/toolkit';
import clusterAction from '../action/clusterAction';
import { formatDate } from '../../utils/Main';

const date = formatDate(new Date().toISOString());

export const clusterSlice = createSlice({
    name: 'cluster',
    initialState: {
        clusters: {
            [date]: {
                'day': [],
                'week': [],
                'month': [],
            }
        },
        duration: 'day',
        date: new Date().toISOString(),
    },
    reducers: {
        setCluster: clusterAction.setCluster,
        setDuration: clusterAction.setDuration,
        setDate: clusterAction.setDate,
    }
});

export const { setCluster, setDuration, setDate, setClusterList } = clusterSlice.actions;
export default clusterSlice.reducer;