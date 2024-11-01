import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';

export const publicAxios = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

export const privateAxios = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

// Response interceptor
privateAxios.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    console.log(error);
    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {

            const response = await publicAxios.post('/token/refresh');
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return privateAxios(originalRequest);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    return Promise.reject(error);
});