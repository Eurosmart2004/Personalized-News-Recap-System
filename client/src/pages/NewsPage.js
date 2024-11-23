import NewsCard, { NewsCardSkeleton } from "../components/NewsCard";
import { useEffect, useRef, useState } from "react";
import { useAxios } from "../axios/axios";
import { useSelector } from "react-redux";

const NewsPage = () => {
    const { privateAxios } = useAxios();
    const auth = useSelector((state) => state.auth);

    const [news, setNews] = useState([]); // News list
    const [loading, setLoading] = useState(false); // Main loading state
    const [beforeTime, setBeforeTime] = useState(null); // For fetching older news
    const [afterTime, setAfterTime] = useState(null); // For fetching newer news
    const isFecting = useRef(false); // Ref to prevent multiple requests

    function convertToUTC(dateString) {
        // Extract the components from the input string
        const [time, date, timezone] = dateString.split(' ');
        const [day, month, year] = date.split('/');
        const [hours, minutes] = time.split(':');
        const timezoneOffset = parseInt(timezone.slice(4, 6)) * 60 + parseInt(timezone.slice(6, 8));
        const offsetSign = timezone[3] === '+' ? 1 : -1;

        // Create a Date object in local time
        const localDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

        // Adjust for the timezone offset
        const utcDate = new Date(localDate.getTime() - offsetSign * timezoneOffset * 60000);

        return utcDate;
    }


    // Function to fetch news (only for older news)
    const getNews = async () => {
        if (loading || isFecting.current) return;
        isFecting.current = true;
        setLoading(true);
        try {

            const payload = { limit: 9 };
            if (beforeTime) payload.before_time = beforeTime; // Add `beforeTime` if available
            if (afterTime) payload.after_time = afterTime; // Add `afterTime` if available

            const response = await privateAxios.post("/news/get", payload);
            const fetchedNews = response.data.news;
            console.log("Payload: ", payload);
            console.log("Fetched News: ", fetchedNews);

            // Append older news to the list
            setNews((prevNews) => {
                const existingIds = new Set(prevNews.map((item) => item.id));
                const filteredNews = fetchedNews.filter((item) => !existingIds.has(item.id));
                return [...prevNews, ...filteredNews];
            });


            // Update `beforeTime` for the next request
            if (beforeTime && convertToUTC(fetchedNews[fetchedNews.length - 1].date) < convertToUTC(beforeTime)) setBeforeTime(fetchedNews[fetchedNews.length - 1].date);
            if (beforeTime === null) setBeforeTime(fetchedNews[fetchedNews.length - 1].date);

            if (afterTime === null) setAfterTime(fetchedNews[0].date);
            if (afterTime && convertToUTC(fetchedNews[0].date) > convertToUTC(afterTime)) setAfterTime(fetchedNews[0].date);

        } catch (err) {
            console.error("Error fetching news:", err);
        } finally {
            isFecting.current = false;
            setLoading(false);
        }
    };

    // Initial news fetch on component mount
    useEffect(() => {
        getNews();
    }, []);

    // Infinite scroll for loading older news
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
                !loading
            ) {
                getNews();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);

    return (
        <div className="mt-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap -mx-4">
                    {/* Render News Items */}
                    {news.map((item) => (
                        <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-4 mb-6" key={item.id}>
                            <NewsCard news={item} />
                        </div>
                    ))}

                    {/* Loading Skeleton */}

                    <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
                        <NewsCardSkeleton />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NewsPage;
