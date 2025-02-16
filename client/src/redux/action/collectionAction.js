

const getCollection = (state, action) => {
    return state.collections
}

const addCollection = (state, action) => {
    state.collections.forEach(c => {
        if (c.id === action.payload.collection.id) return state.collections
    })

    state.collections.push(action.payload.collection)

    return state.collections
}

const updateCollection = (state, action) => {
    state.collections.forEach(c => {
        if (c.id === action.payload.collection.id) c = action.payload.collection
    })

    return state.collections
}

const deleteCollection = (state, action) => {
    state.collections.forEach((c, index) => {
        if (c.id === action.collection.id) state.collections.splice(index, 1)
    })

    return state.collections
}

const collectionAction = {
    getCollection,
    addCollection,
    updateCollection,
    deleteCollection,
}

export default collectionAction
