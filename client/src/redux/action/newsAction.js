const setBeforeTime = (state, action) => {
    state.beforeTime = action.payload;
};

const setAfterTime = (state, action) => {
    state.afterTime = action.payload;
};

const setNews = (state, action) => {
    const existingIds = new Set(state.news.map((item) => item.id));
    const filteredNews = action.payload.filter((item) => !existingIds.has(item.id));
    state.news = [...state.news, ...filteredNews];
};

const newsAction = {
    setBeforeTime,
    setAfterTime,
    setNews
};

export default newsAction;