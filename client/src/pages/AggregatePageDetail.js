import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAxios } from "../axios/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loading from "../components/Loading";
import styles from '../styles/markdown.module.css';

const AggregatePageDetail = () => {
    const { id, } = useParams();
    const { privateAxios } = useAxios();
    const navigate = useNavigate();
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const getClusters = async () => {
        setLoading(true);
        try {
            const response = await privateAxios.get(`/cluster?id=${id}`);
            setSelectedCluster(response.data.cluster);

        } catch (err) {
            console.error("Error fetching clusters:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        getClusters();
    }, []);


    if (error) {
        return (
            <div className="text-center p-3">
                <p className="mb-4 text-lg font-semibold">
                    Bài báo tổng hợp này không tồn tại hoặc đã bị loại bỏ.
                </p>
                <p className="mb-6 text-gray-500 dark:text-gray-400">
                    Bài tổng hợp bạn đang cố gắng truy cập không khả dụng. Nó có thể đã
                    bị xóa hoặc URL có thể không chính xác. Vui lòng kiểm tra lại URL hoặc
                    thử truy cập một bài tổng hợp khác.
                </p>
                <button
                    onClick={() => navigate("/aggregate")}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg dark:bg-orange-700 hover:bg-orange-600 dark:hover:bg-orange-800 transition-all duration-100"
                >
                    Đi đến Bài Tổng Hợp
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
            <div className={styles.markdown}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}>
                    {selectedCluster.content}
                </ReactMarkdown>
            </div>

            {/* Summary Section */}
            <p className="mt-6 text-lg italic text-gray-700 dark:text-gray-300 font-medium">
                Bài tổng hợp này được tạo dựa trên các bài báo sau:
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
