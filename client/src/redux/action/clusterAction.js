import { formatDate } from "../../utils/Main";

const setCluster = (state, action) => {
    if (formatDate(state.date) in state.clusters) {
        state.clusters[formatDate(state.date)][state.duration] = action.payload;
    } else {
        state.clusters[formatDate(state.date)] = {
            'day': [],
            'week': [],
            'month': [],
        };
        state.clusters[formatDate(state.date)][state.duration] = action.payload;
    }

};

const setDuration = (state, action) => {
    state.duration = action.payload;
};

const setDate = (state, action) => {
    state.date = action.payload;
};


const clusterAction = {
    setCluster, setDuration, setDate
};

export default clusterAction;