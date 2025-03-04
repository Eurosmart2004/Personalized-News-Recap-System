const setCollection = (state, action) => {
    state.collections = action.payload.collections;
};

const collectionAction = {
    setCollection
};

export default collectionAction;
