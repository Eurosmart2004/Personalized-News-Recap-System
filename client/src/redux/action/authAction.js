const setAuth = (state, action) => {
    if (action.payload.accessToken) state.accessToken = action.payload.accessToken;
    if (action.payload.user) state.user = action.payload.user;
};

const removeAuth = (state) => {
    state.user = null;
    state.accessToken = null;
};

const authAction = {
    setAuth,
    removeAuth
};

export default authAction;
