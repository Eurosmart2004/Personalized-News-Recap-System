import NewsCard, { NewsCardSkeleton } from "../components/NewsCard";
import { useEffect, useRef, useState } from "react";
import { useAxios } from "../axios/axios";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setCollection } from '../redux/reducer/collectionReducer';
import { setNews, setAfterTime, setBeforeTime } from '../redux/reducer/newsReducer';
import { setFavoriateNews } from "../redux/reducer/newsReducer";
import 'react-toastify/dist/ReactToastify.css';

const NewsPage = () => {
    const { privateAxios } = useAxios();
    const dispatch = useDispatch();

    const collection = useSelector((state) => state.collection.collections);
    const [listNewsFavorites, setListNewsFavorite] = useState([]);

    const news = useSelector((state) => state.news.news);

    const favoriateNews = useSelector((state) => state.news.favoriateNews);
    const beforeTime = useSelector((state) => state.news.beforeTime);
    const afterTime = useSelector((state) => state.news.afterTime);

    const [loading, setLoading] = useState(false);
    const isFetching = useRef(false);

    const getNews = async () => {
        if (loading || isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (beforeTime) params.append('before_time', beforeTime);
            if (afterTime) params.append('after_time', afterTime);
            params.append('limit', 30);

            const response = await privateAxios.get(`/news/get?${params.toString()}`);
            const fetchedNews = response.data.news;

            dispatch(setNews([...news, ...fetchedNews]));

            if (fetchedNews.length > 0) {
                dispatch(setBeforeTime(fetchedNews[fetchedNews.length - 1].date));
                if (!afterTime) dispatch(setAfterTime(fetchedNews[0].date));
            }
        } catch (err) {
            console.error("Error fetching news:", err);
        } finally {
            isFetching.current = false;
            setLoading(false);
        }
    };



    const getCollections = async () => {
        if (collection !== null) return;
        try {
            const response = await privateAxios.get("/collection");
            dispatch(setCollection(response.data));

            const tempListFavoriteNews = new Set();
            response.data.collections.forEach(c => {
                c.news.forEach(n => tempListFavoriteNews.add(n.id));
            });
            setListNewsFavorite([...tempListFavoriteNews]);
        } catch (err) {
            console.error("Error fetching collections:", err);
        }
    };

    useEffect(() => {
        getNews();
        getCollections();
    }, []);


    useEffect(() => {
        if (!collection) return;
        const tempListFavoriteNews = new Set();
        collection.forEach(c => {
            c.news.forEach(n => tempListFavoriteNews.add(n.id));
        });
        setListNewsFavorite([...tempListFavoriteNews]);
    }, [collection]);



    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && !loading) {
                getNews();
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);

    return (
        <>
            <div className="w-full p-3 pt-4">

                {/* Favorite News Section */}
                {favoriateNews && favoriateNews.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-3">Tin đề xuất</h2>
                        <div className="flex flex-wrap">
                            {favoriateNews.map((item) => (
                                <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4 flex" key={item.id}>
                                    <NewsCard news={item} isFavorite={true} isSaved={listNewsFavorites.includes(item.id)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All News Section */}
                <h2 className="text-xl font-bold mb-3">Toàn bộ tin tức</h2>
                <div className="flex flex-wrap">
                    {news.map((item) => (
                        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4 flex" key={item.id}>
                            <NewsCard news={item} isSaved={listNewsFavorites.includes(item.id)} isFavorite={favoriateNews.some((n) => n.id === item.id)} />
                        </div>
                    ))}

                    {/* Loading Skeleton */}
                    {loading && (
                        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4 flex">
                            <NewsCardSkeleton />
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default NewsPage;
