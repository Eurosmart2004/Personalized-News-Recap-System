import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAxios } from "../axios/axios";
import { setAuth } from "../redux/reducer/authReducer";
import { setNews, setAfterTime, setBeforeTime } from "../redux/reducer/newsReducer";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaCamera, FaSave, FaUser, FaEnvelope, FaLock, FaTags, FaClock, FaCheckCircle } from "react-icons/fa";
import Time from "../components/Time";
import { motion, AnimatePresence } from "framer-motion";
import { TOPIC } from "../utils/Main";

const UserProfilePage = () => {
  const { privateAxios } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Get user data from Redux store
  const user = useSelector((state) => state.auth?.user || {});
  const userName = user?.name || "";
  const userEmail = user?.email || "";

  // User profile information states
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Preferences states
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState(
    []
  );
  const [receiveDailyEmails, setReceiveDailyEmails] = useState();
  const [time, setTime] = useState([
    { hour: 9, minute: 0 },
  ]);

  // UI states
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email is invalid";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return ""; // Not required for update
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      return "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword && !password) return ""; // Not required if no new password
    if (!confirmPassword && password) return "Confirm password is required";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  // Input handlers
  const handleNameChange = (e) => {
    const { value } = e.target;
    setName(value);
    setErrors((prev) => ({
      ...prev,
      name: validateName(value),
    }));
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value),
    }));
  };

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    setErrors((prev) => ({
      ...prev,
      newPassword: validatePassword(value),
      confirmPassword: validateConfirmPassword(confirmPassword, value),
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(value, newPassword),
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
      };

      reader.readAsDataURL(file);
      console.log(file);
      setAvatar(file);
    }
  };

  const togglePreference = (preference) => {
    setSelectedPreferences((prevSelected) =>
      prevSelected.includes(preference)
        ? prevSelected.filter((item) => item !== preference)
        : [...prevSelected, preference]
    );
  };

  // Fetch preferences data
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await privateAxios.get("/preference");
        setPreferences(res.data.preferences.map((item) => item.name));
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Fetch preferences of user
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const res = await privateAxios.get("/user/preferences");
        setSelectedPreferences(res.data.preferences);
        dispatch(setNews([]));
        dispatch(setAfterTime(null));
        dispatch(setBeforeTime(null));
      } catch (err) {
      }
    };
    fetchUserPreferences();
  }, []);

  // Fetch user schedule
  useEffect(() => {
    const fetchUserSchedule = async () => {
      try {
        const res = await privateAxios.get("/user/schedule");
        if (res.data.schedule.length > 0) {
          setReceiveDailyEmails(true);
          setTime(res.data.schedule);
        }
      } catch (err) {

      }
    };
    fetchUserSchedule();
  }, []);

  // Submit handlers
  const handleProfileUpdate = async () => {
    // Validate inputs
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(
      confirmPassword,
      newPassword
    );

    if (nameError || emailError || newPasswordError || confirmPasswordError) {
      setErrors({
        name: nameError,
        email: emailError,
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError,
      });
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("name", name);
      // formData.append("email", email);

      if (newPassword) {
        formData.append("password", newPassword);
      }

      if (avatar) {
        formData.append("picture", avatar);
      }

      console.log("formData", formData);

      const res = await privateAxios.put("/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Update user in Redux store
      dispatch(setAuth({ user: res.data }));

      toast.success("Cập nhập thông tin thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Cập nhập thông tin thất bại!");
      setIsSubmitting(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    if (selectedPreferences.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sở thích!");
      return;
    }

    setIsSubmitting(true);

    try {
      await privateAxios.put("/user/preferences", {
        preferences: selectedPreferences,
      });

      if (receiveDailyEmails) {
        await privateAxios.put("/user/schedule", {
          schedule: time,
        });
      } else {
        await privateAxios.delete("/user/schedule");
      }

      toast.success("Câp nhập sở thích thành công!");
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      toast.error("Cập nhập sở thích thất bại!");
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-8">
      <ToastContainer />

      {/* Page Header */}
      <div className="bg-orange-100 rounded-lg p-6 shadow-xl mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Thông tin của bạn</h1>
        <p className="text-gray-600 mt-2">
          Cập nhập thông tin cá nhân và sở thích của bạn
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex items-center px-6 py-3 focus:outline-none dark:text-white ${activeTab === "profile"
              ? "border-b-4 border-orange-500 text-orange-500 dark:border-orange-500 dark:text-orange-500"
              : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-slate-400"
              }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser className="mr-2" /> Thông tin cá nhân
          </button>
          <button
            className={`flex items-center px-6 py-3 focus:outline-none dark:text-white ${activeTab === "preferences"
              ? "border-b-4 border-orange-500 text-orange-500 dark:border-orange-500 dark:text-orange-500"
              : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-slate-400"
              }`}
            onClick={() => setActiveTab("preferences")}
          >
            <FaTags className="mr-2" /> Sở thích
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* Avatar Section */}
              <div className="mb-6 md:mb-0 md:mr-8 flex flex-col items-center">
                <div
                  className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer group"
                  onClick={handleAvatarClick}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : user.picture ? (
                    <img
                      src={user.picture}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <FaUser size={48} className="text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCamera className="text-white text-xl" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                />
                <p className="text-sm text-gray-500 dark:text-white mt-2">
                  Thay đổi giao diện
                </p>
              </div>

              {/* Profile Form */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-4">
                  Thông tin cá nhân
                </h2>

                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                  >
                    <FaUser className="inline-block mr-2 dark:text-white" />{" "}
                    Tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.name
                      ? "border-red-500"
                      : "focus:ring focus:ring-orange-500"
                      }`}
                  />
                  {errors.name && (
                    <small className="text-red-500">{errors.name}</small>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                  >
                    <FaEnvelope className="inline-block mr-2 dark:text-white" />{" "}
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={true}
                    className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.email
                      ? "border-red-500"
                      : "focus:ring focus:ring-orange-500"
                      }`}
                  />
                  {errors.email && (
                    <small className="text-red-500">{errors.email}</small>
                  )}
                </div>

                <div className="mt-6 mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                    <FaLock className="inline-block mr-2 dark:text-white" />{" "}
                    Thay đổi mật khẩu
                  </h3>
                  <p className="text-sm italic text-gray-500 dark:text-white mb-4">
                    Để thay đổi mật khẩu, vui lòng nhập mật khẩu hiện tại và mật khẩu mới
                  </p>

                  <div className="mb-4">
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                    >
                      Mật khâu hiện tại
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={handleCurrentPasswordChange}
                      className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                    >
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.newPassword
                        ? "border-red-500"
                        : "focus:ring focus:ring-orange-500"
                        }`}
                    />
                    {errors.newPassword && (
                      <small className="text-red-500">
                        {errors.newPassword}
                      </small>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`block w-full px-4 py-2 border rounded-md focus:outline-none ${errors.confirmPassword
                        ? "border-red-500"
                        : "focus:ring focus:ring-orange-500"
                        }`}
                    />
                    {errors.confirmPassword && (
                      <small className="text-red-500">
                        {errors.confirmPassword}
                      </small>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleProfileUpdate}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition focus:outline-none focus:ring focus:ring-orange-500 flex items-center"
                >
                  <FaSave className="mr-2" />
                  {isSubmitting ? "Đang lưu" : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="p-6 pb-10">
            <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-4">
              Sở thích
            </h2>
            <p className="text-gray-600 dark:text-white mb-4">
              Hãy chọn những chủ đề bạn quan tâm
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              {preferences.map((preference, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 rounded-full cursor-pointer text-white ${selectedPreferences.includes(preference)
                    ? "bg-orange-500"
                    : "bg-gray-400"
                    } hover:scale-105 transition-transform`}
                  onClick={() => togglePreference(preference)}
                >
                  {TOPIC[preference]}
                </span>
              ))}
            </div>

            <div className="mt-8 mb-6">
              <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-4">
                <FaClock className="inline-block mr-2 dark:text-white" /> Email
                Thông báo
              </h2>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="daily-emails"
                  className="mr-2 w-5 h-5 accent-orange-500"
                  checked={receiveDailyEmails}
                  onChange={() => setReceiveDailyEmails(!receiveDailyEmails)}
                />
                <label
                  htmlFor="daily-emails"
                  className="text-lg text-gray-700 dark:text-white"
                >
                  Nhận email hàng ngày
                </label>
              </div>
              <AnimatePresence>
                {receiveDailyEmails && (
                  <motion.div
                    className="mb-6 pl-7"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                      Thời gian nhận email:
                    </h3>
                    <Time
                      className="text-gray-700 dark:text-slate-50"
                      setTime={setTime}
                      time={time}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handlePreferencesUpdate}
              disabled={isSubmitting}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition focus:outline-none focus:ring focus:ring-orange-300 flex items-center"
            >
              <FaCheckCircle className="mr-2" />
              {isSubmitting ? "Đang lưu" : "Lưu"}
            </button>
          </div>
        )}
      </div>
    </div >
  );
};

export default UserProfilePage;
