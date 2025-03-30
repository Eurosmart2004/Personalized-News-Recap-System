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

const setFavoriateNews = (state, action) => {
    state.favoriateNews = action.payload;
};

const setFavoriteQueries = (state, action) => {
    state.favoriteQueries = action.payload;
};

const newsAction = {
    setBeforeTime,
    setAfterTime,
    setNews,
    setFavoriateNews,
    setFavoriteQueries
};

export default newsAction;