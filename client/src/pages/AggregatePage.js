import { useAxios } from "../axios/axios";
import React, { useState, useEffect } from "react";
import { setCluster } from "../redux/reducer/clusterReducer";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { TfiArrowLeft } from "react-icons/tfi";
import Loading from "../components/Loading";
import ReactMarkDownCustom from "../components/ReactMarkDownCustom";

const AggregatePage = () => {
    const [clusterList, setClusterList] = useState([]);
    const [duration, setDuration] = useState("day");
    const { privateAxios } = useAxios();
    const dispatch = useDispatch();
    const cluster = useSelector((state) => state.cluster.cluster);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const getClusters = async (duration) => {
        setLoading(true);
        try {
            const response = await privateAxios.get(`/cluster/${duration}`);
            setClusterList(response.data.clusters);
            dispatch(setCluster({ duration, clusterList: response.data.clusters }));
        } catch (err) {
            console.error("Error fetching clusters:", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!cluster[duration]) {
            getClusters(duration);
        } else {
            setClusterList(cluster[duration]);
        }
    }, [duration]);



    return (
        <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
            <div className="flex space-x-4 mb-6">
                {["day", "week", "month"].map((option) => (
                    <button
                        key={option}
                        className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${duration === option ? "bg-orange-600" : "bg-gray-400 hover:bg-gray-500"}
                            dark:bg-gray-700 dark:hover:bg-gray-600`}
                        onClick={() => setDuration(option)}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>
            {loading ? <Loading /> :
                <div className="space-y-4">
                    {clusterList.length > 0 ? (
                        clusterList.map((clusterItem, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={() => navigate(`/aggregate/${duration}/${clusterItem.id}`)}
                            >
                                <h2 className="text-xl font-semibold">{clusterItem.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(clusterItem.date).toLocaleDateString()}</p>
                                <div className="prose max-w-none">
                                    <ReactMarkdown>{clusterItem.content.split("\n")[2] + "..."}</ReactMarkdown>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No data available</p>
                    )}
                </div>
            }
        </div>
    );
};

export default AggregatePage;
