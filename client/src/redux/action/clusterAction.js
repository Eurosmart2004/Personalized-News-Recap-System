const setCluster = (state, action) => {
    if (!state.cluster[action.payload.duration]) {
        state.cluster[action.payload.duration] = action.payload.clusterList;
    }
};

const clusterAction = {
    setCluster
};

export default clusterAction;