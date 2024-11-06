import React, { useEffect, useState } from 'react';
import Time from '../components/Time';
import { privateAxios } from '../axios/axios';
import { setAuth } from '../redux/reducer/authReducer';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const PreferencePage = () => {
    const [time, setTime] = useState();
    const [preferences] = useState(['sport', 'economic', 'politic', 'health']);
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const togglePreference = (preference) => {
        setSelectedPreferences((prevSelected) => {
            if (prevSelected.includes(preference)) {
                return prevSelected.filter((item) => item !== preference);
            } else {
                return [...prevSelected, preference];
            }
        });
    };

    const handleConfirm = async () => {
        if (selectedPreferences.length === 0) {
            toast.error('Please select at least one preference');
            return;
        }

        const data = {
            time,
            preferences: selectedPreferences,
        };

        console.log("Data before post update", data); // Log data for debugging
        try {
            const res_pre = await privateAxios.put('/user/preferences', {
                preferences: selectedPreferences
            });
            const res_schedule = await privateAxios.put('/user/schedule', {
                schedule: time
            });
            setUpdateSuccess(true);
        }
        catch (err) {
            console.log(err);
            toast.error(err.response.data.error);
        }
    };

    const handleUpdateSuccess = async () => {
        try {
            const res = await privateAxios.get('/user');
            dispatch(setAuth({ ...auth, user: res.data }));
            navigate('/');
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const res = await privateAxios.get('/user/preferences');
                console.log("Response preferences: ", res);
                setSelectedPreferences(res.data.preferences);
            }
            catch (err) {
                console.log(err);
            }
        };
        const fetchSchedule = async () => {
            try {
                const res = await privateAxios.get('/user/schedule');
                console.log("Response schedule: ", res);
                if (res.data.schedule.length != 0) {
                    setTime(res.data.schedule);
                } else {
                    setTime([{ hour: 9, minute: 0 }, { hour: 18, minute: 0 }]);
                }
            }
            catch (err) {
                console.log(err);
            }
        };
        const fetchData = async () => {
            await Promise.all([fetchPreferences(), fetchSchedule()]);
            setLoading(false);
        };

        fetchData();
    }, []);


    if (loading) return <></>;

    if (updateSuccess) {
        return (
            <div className="container mt-4">
                <h1>Preferences Updated</h1>
                <p>Your preferences have been updated successfully.</p>
                <button className="btn btn-primary mt-3" onClick={handleUpdateSuccess}>
                    Explore More
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <ToastContainer />
            <h1>Preference Page</h1>
            <Time setTime={setTime} time={time} />
            <div className="mt-3">
                {preferences.map((preference, index) => (
                    <span
                        key={index}
                        className={`badge me-2 ${selectedPreferences.includes(preference) ? 'bg-primary' : 'bg-secondary'}`}
                        onClick={() => togglePreference(preference)}
                        style={{ cursor: 'pointer' }}
                    >
                        {preference}
                    </span>
                ))}
            </div>
            <button className="btn btn-success mt-3" onClick={handleConfirm}>
                Confirm
            </button>
        </div>
    );
};

export default PreferencePage;