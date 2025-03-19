import NewsCard, { NewsCardSkeleton } from "../components/NewsCard";
import { useEffect, useRef, useState } from "react";
import { useAxios } from "../axios/axios";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { setCollection } from '../redux/reducer/collectionReducer';
import { setNews, setAfterTime, setBeforeTime } from '../redux/reducer/newsReducer';
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import 'react-toastify/dist/ReactToastify.css';

const NewsPage = () => {
    const { privateAxios } = useAxios();
    const dispatch = useDispatch();
    const collection = useSelector((state) => state.collection.collections);
    const [listNewsFavorites, setListNewsFavorite] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const news = useSelector((state) => state.news.news);
    const beforeTime = useSelector((state) => state.news.beforeTime);
    const afterTime = useSelector((state) => state.news.afterTime);

    const [loading, setLoading] = useState(false); // Main loading state
    const isFecting = useRef(false); // Ref to prevent multiple requests

    function convertToUTC(dateString) {
        const [time, date, timezone] = dateString.split(' ');
        const [day, month, year] = date.split('/');
        const [hours, minutes] = time.split(':');
        const timezoneOffset = parseInt(timezone.slice(4, 6)) * 60 + parseInt(timezone.slice(6, 8));
        const offsetSign = timezone[3] === '+' ? 1 : -1;

        const localDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
        const utcDate = new Date(localDate.getTime() - offsetSign * timezoneOffset * 60000);

        return utcDate;
    }

    const getNews = async () => {
        if (loading || isFecting.current) return;
        isFecting.current = true;
        setLoading(true);
        try {
            const params = new URLSearchParams();

            if (beforeTime) {
                params.append('before_time', beforeTime);
            }

            if (afterTime) {
                params.append('after_time', afterTime);
            }

            params.append('limit', 9);

            const response = await privateAxios.get(`/news/get?${params.toString()}`);
            const fetchedNews = response.data.news;

            console.log("Fetched news:", fetchedNews);

            dispatch(setNews(fetchedNews));

            if (beforeTime && convertToUTC(fetchedNews[fetchedNews.length - 1].date) < convertToUTC(beforeTime)) dispatch(setBeforeTime(fetchedNews[fetchedNews.length - 1].date));
            if (beforeTime === null) dispatch(setBeforeTime(fetchedNews[fetchedNews.length - 1].date));

            if (afterTime === null) dispatch(setAfterTime(fetchedNews[0].date));
            if (afterTime && convertToUTC(fetchedNews[0].date) > convertToUTC(afterTime)) dispatch(setAfterTime(fetchedNews[0].date));

        } catch (err) {
            console.error("Error fetching news:", err);
        } finally {
            isFecting.current = false;
            setLoading(false);
        }
    };

    const getCollections = async () => {
        if (collection !== null) return;
        try {
            const response = await privateAxios.get("/collection");
            dispatch(setCollection(response.data));
            var tempListFavoriteNews = new Set();
            response.data.collections.forEach(c => {
                c.news.forEach(n => {
                    tempListFavoriteNews.add(n.id);
                });
            });
            setListNewsFavorite([...Array.from(tempListFavoriteNews)]);
        } catch (err) {
            console.error("Error fetching collections:", err);
        }
    };

    const getUserPreference = async () => {
        const res = await privateAxios.get("/user/preferences");
        setSelectedTopic(res.data.preferences);
        setPreferences(res.data.preferences);
    };

    useEffect(() => {
        getNews();
        getCollections();
        getUserPreference();
    }, []);

    useEffect(() => {
        if (collection === null) return;
        var tempListFavoriteNews = new Set();
        collection.forEach(c => {
            c.news.forEach(n => {
                tempListFavoriteNews.add(n.id);
            });
        });
        setListNewsFavorite([...Array.from(tempListFavoriteNews)]);

    }, [collection]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
                !loading
            ) {
                getNews();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);

    return (
        <>
            <div className=" w-full p-3 pt-4">
                <div className="flex flex-wrap">
                    {/* Render News Items */}
                    {news.map((item) => (
                        selectedTopic.includes(item.topic) && selectedTopic.length > 0 ? (
                            <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4 flex" key={item.id}>
                                <NewsCard
                                    news={item}
                                    isSaved={listNewsFavorites.includes(item.id)}
                                />
                            </div>
                        ) : null
                    ))}

                    {/* Loading Skeleton */}
                    <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4 flex">
                        <NewsCardSkeleton />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default NewsPage;