import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAxios } from "../axios/axios";
import { setCluster } from "../redux/reducer/clusterReducer";
import { TfiArrowLeft } from "react-icons/tfi";
import ReactMarkDownCustom from "../components/ReactMarkDownCustom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loading from "../components/Loading";
import styles from '../styles/markdown.module.css';

const AggregatePageDetail = () => {
    const { id, duration } = useParams();
    const { privateAxios } = useAxios();
    const clusterList = useSelector((state) => state.cluster.cluster);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const getClusters = async (duration) => {
        setLoading(true);
        try {
            const response = await privateAxios.get(`/cluster/${duration}`);
            dispatch(setCluster({ duration, clusterList: response.data.clusters }));
        } catch (err) {
            console.error("Error fetching clusters:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!clusterList[duration]) {
            getClusters(duration);
        }
    }, [duration]);

    useEffect(() => {
        if (clusterList[duration]) {
            const foundCluster = clusterList[duration].find((c) => c.id == id);
            if (foundCluster) {
                setSelectedCluster(foundCluster);
            } else {
                setError(true);
            }
        }
    }, [clusterList]);

    if (error) {
        return (
            <div className="text-center p-6">
                <p className="mb-4 text-lg font-semibold">
                    This aggregate does not exist or may have been removed.
                </p>
                <p className="mb-6 text-gray-500 dark:text-gray-400">
                    The aggregate you are trying to access is not available. It might have
                    been deleted or the URL might be incorrect. Please check the URL or
                    try accessing another aggregate.
                </p>
                <button
                    onClick={() => navigate("/aggregate")}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg dark:bg-orange-700 hover:bg-orange-600 dark:hover:bg-orange-800 transition-all duration-100"
                >
                    Go to Aggregate
                </button>
            </div>
        );
    }

    if (loading || !selectedCluster) {
        return <Loading />;
    }

    return (
        <div className="lg:p-5">
            {/* Centered Title with Spacing */}
            <h1 className="text-4xl font-bold mb-6 mt-2 text-gray-900 dark:text-gray-100">
                {selectedCluster.title}
            </h1>

            {/* Article Content */}
            <div className="prose max-w-none dark:prose-invert">
                {/* <ReactMarkDownCustom
                    remarkPlugins={[remarkGfm]}
                >
                    {selectedCluster.content}
                </ReactMarkDownCustom> */}

            </div>

            <div className={styles.markdown}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}>
                    {selectedCluster.content}
                </ReactMarkdown>
            </div>

            {/* Summary Section */}
            <p className="mt-6 text-lg italic text-gray-700 dark:text-gray-300 font-medium">
                This article is summarized and analyzed based on these points:
            </p>

            {/* News List with Better Spacing and Styling */}
            <div className="mt-4 space-y-4">
                {selectedCluster.news.map((news) => (
                    <a
                        key={news.id}
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer block p-4 border rounded-lg shadow-md bg-white dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150"
                    >
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            {news.title}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default AggregatePageDetail;
