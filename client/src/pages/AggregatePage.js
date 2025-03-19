import { useAxios } from "../axios/axios";
import React, { useState, useEffect, useRef } from "react";
import { setCluster, setDuration, setDate } from "../redux/reducer/clusterReducer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { BASEURL, formatDate } from '../utils/Main';
import ReactMarkdown from "react-markdown";
import dayjs from 'dayjs';
import { FormControl, MenuItem, Select, Box, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const AggregatePage = () => {
    const { privateAxios } = useAxios();
    const dispatch = useDispatch();

    const duration = useSelector((state) => state.cluster.duration);
    const date = useSelector((state) => state.cluster.date);
    const clusters = useSelector((state) => state.cluster.clusters);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const calendarRef = useRef(null);

    const getClusters = async () => {
        setLoading(true);
        try {
            const response = await privateAxios.get(`/cluster/${duration}?date=${date}`);
            dispatch(setCluster(response.data.clusters));
        } catch (err) {
            console.error("Error fetching clusters:", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clusters[formatDate(date)] === undefined || clusters[formatDate(date)][duration].length === 0) {
            getClusters();
        }
    }, [duration, date]);

    const handleDurationChange = (e) => {
        dispatch(setDuration(e.target.value));
    };

    const toggleChart = () => {
        setShowChart(!showChart);
    };

    const handleClickOutside = (event) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) {
            setShowChart(false);
        }
    };

    useEffect(() => {
        if (showChart) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showChart]);

    return (
        <div className="text-gray-900 min-h-screen">
            < div className="flex flex-col lg:flex-row justify-between" >
                <div className="relative lg:hidden">
                    <IconButton onClick={toggleChart} className="fixed top-1/2 transform -translate-y-1/2 bg-white z-50">
                        {showChart ? <ChevronLeft /> : <ChevronRight />}
                    </IconButton>
                    <AnimatePresence>
                        {showChart && (
                            <motion.div
                                ref={calendarRef}
                                initial={{ opacity: 0, x: '100%' }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: '100%' }}
                                transition={{ duration: 0.5 }}
                                className="fixed top-0 right-0 w-64 h-full bg-white z-50 p-4"
                            >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar value={dayjs(date)} onChange={(newDate) => dispatch(setDate(newDate.toISOString()))} />
                                </LocalizationProvider>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="flex-1 p-6">
                    <div className="flex items-center py-6 mt-2 border-b-2">
                        <h1 className="text-2xl lg:text-4xl text-gray-900 mr-4">
                            Tổng hợp theo
                        </h1>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    value={duration}
                                    onChange={handleDurationChange}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    sx={{ fontSize: '16px lg:20px' }}
                                >
                                    <MenuItem value="day">ngày</MenuItem>
                                    <MenuItem value="week">tuần</MenuItem>
                                    <MenuItem value="month">tháng</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </div>

                    <div className="flex flex-col gap-4 lg:gap-6 mt-4">
                        {clusters[formatDate(date)] && clusters[formatDate(date)][duration].map((cluster) => (
                            <div
                                key={cluster.id}
                                className="flex flex-col lg:flex-row items-center justify-between p-4 cursor-pointer border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition duration-300"
                                onClick={() => navigate(`/aggregate/${cluster.id}`)}
                            >
                                <div className="flex items-start mb-4 lg:mb-0">
                                    <img
                                        src={cluster.news[0].image}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = BASEURL + '/news/image?image_url=' + cluster.news[0].image;
                                        }}
                                        alt="Post Cover"
                                        className="w-20 h-20 lg:w-32 lg:h-32 object-cover rounded-md mr-4"
                                    />
                                    <div className="flex flex-col">
                                        <h2 className="text-lg lg:text-xl font-semibold mb-2">{cluster.title}</h2>
                                        <p className="text-sm lg:text-base text-gray-600">
                                            <ReactMarkdown>{cluster.content.split("\n")[2] + "..."}</ReactMarkdown>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading ? <Loading /> : <></>}
                    </div>
                </div>
                <div className="hidden lg:block border border-l-2 border-gray-100 min-h-screen h-auto p-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar value={dayjs(date)} onChange={(newDate) => dispatch(setDate(newDate.toISOString()))} />
                    </LocalizationProvider>
                </div>
            </ div>

            {/* Additional content */}
        </div >
    );
};

export default AggregatePage;