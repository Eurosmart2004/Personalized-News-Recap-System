const setTheme = (state, action) => {
    state.theme = action.payload;
    if (action.payload === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
    else if (action.payload === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', 'auto');
    }
    else {
        document.documentElement.removeAttribute('data-bs-theme');
    }
};

const themeAction = {
    setTheme,
};

export default themeAction;