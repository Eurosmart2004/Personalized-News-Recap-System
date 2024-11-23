import React, { useEffect, useState } from "react";
import Time from "../components/Time";
import { useAxios } from "../axios/axios";
import { setAuth } from "../redux/reducer/authReducer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

const PreferencePage = () => {
    const { privateAxios } = useAxios();
    const [time, setTime] = useState([{ hour: 9, minute: 0 }, { hour: 18, minute: 0 }]);
    const [preferences, setPreferences] = useState([]);
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [receiveDailyEmails, setReceiveDailyEmails] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userName = useSelector((state) => state.auth?.user?.name || "there");

    const togglePreference = (preference) => {
        setSelectedPreferences((prevSelected) =>
            prevSelected.includes(preference)
                ? prevSelected.filter((item) => item !== preference)
                : [...prevSelected, preference]
        );
    };

    const handleSubmit = async () => {
        if (selectedPreferences.length === 0) {
            toast.error("Please select at least one preference");
            return;
        }

        const data = {
            preferences: selectedPreferences,
            schedule: receiveDailyEmails ? time : null,
        };

        try {
            await privateAxios.put("/user/preferences", {
                preferences: selectedPreferences,
            });

            if (receiveDailyEmails) {
                await privateAxios.put("/user/schedule", {
                    schedule: time,
                });
            }

            // toast.success("Preferences updated successfully!");
            const res = await privateAxios.get("/user");
            dispatch(setAuth({ user: res.data }));
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error("An error occurred. Please try again.");
        }
    };

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const res = await privateAxios.get("/preference");
                setPreferences(res.data.preferences.map((item) => item.name));
            } catch (err) {
                console.error(err);
            }
        };

        fetchPreferences();
        setLoading(false);
    }, []);

    if (loading) return <></>;

    return (
        <div className="container mx-auto mt-10">
            <ToastContainer />
            <div className="bg-blue-100 rounded-lg p-6 shadow-md">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Welcome, {userName}! 🎉
                </h1>
                <p className="text-gray-600 mt-2">
                    Let's personalize your experience. Follow the steps below to set up your preferences.
                </p>
            </div>

            <div className="max-w-4xl mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
                {step === 1 && (
                    <>
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Step 1: Choose Your Preferences</h2>
                        <div className="flex flex-wrap gap-3 mb-6">
                            {preferences.map((preference, index) => (
                                <span
                                    key={index}
                                    className={`px-4 py-2 rounded-full cursor-pointer text-white ${selectedPreferences.includes(preference)
                                        ? "bg-blue-500"
                                        : "bg-gray-400"
                                        } hover:scale-105 transition-transform`}
                                    onClick={() => togglePreference(preference)}
                                >
                                    {preference}
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-between">
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
                            >
                                <FaArrowLeft className="inline-block mr-2" /> Back
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                onClick={() => setStep(2)}
                            >
                                Next <FaArrowRight className="inline-block ml-2" />
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                            Step 2: Would you like to receive daily emails?
                        </h2>
                        <div className="flex items-center mb-6">
                            <input
                                type="checkbox"
                                id="daily-emails"
                                className="mr-2 w-5 h-5 accent-blue-500"
                                checked={receiveDailyEmails}
                                onChange={() => setReceiveDailyEmails(!receiveDailyEmails)}
                            />
                            <label htmlFor="daily-emails" className="text-lg text-gray-700">
                                Yes, I want to receive daily emails
                            </label>
                        </div>
                        {receiveDailyEmails && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    Set your preferred time:
                                </h3>
                                <Time setTime={setTime} time={time} />
                            </div>
                        )}
                        <div className="flex justify-between">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                onClick={() => setStep(1)}
                            >
                                <FaArrowLeft className="inline-block mr-2" /> Back
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                onClick={() => setStep(3)}
                            >
                                Next <FaArrowRight className="inline-block ml-2" />
                            </button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Step 3: Confirm Your Choices</h2>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Selected Preferences:</h3>
                            <p className="text-gray-600">{selectedPreferences.join(", ") || "None selected"}</p>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Daily Emails:</h3>
                            <p className="text-gray-600">
                                {receiveDailyEmails
                                    ? `Yes, at ${time.map((t) => `${t.hour}:${String(t.minute).padStart(2, '0')}`).join(" and ")}`
                                    : "No"}

                            </p>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                onClick={() => setStep(2)}
                            >
                                <FaArrowLeft className="inline-block mr-2" /> Back
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                onClick={handleSubmit}
                            >
                                Confirm & Submit <FaCheckCircle className="inline-block ml-2" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PreferencePage;
