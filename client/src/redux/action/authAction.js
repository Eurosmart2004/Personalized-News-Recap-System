const setAuth = (state, action) => {
    if (action.payload.accessToken) state.accessToken = action.payload.accessToken;
    if (action.payload.user) state.user = action.payload.user;
    if (action.payload.isRemember) localStorage.setItem('isRemember', action.payload.isRemember);
    localStorage.setItem('isAuth', true);
};

const removeAuth = (state) => {
    state.user = null;
    state.accessToken = null;
    localStorage.setItem('isAuth', false);
    localStorage.setItem('isRemember', false);
};

const authAction = {
    setAuth,
    removeAuth
};

export default authAction;
