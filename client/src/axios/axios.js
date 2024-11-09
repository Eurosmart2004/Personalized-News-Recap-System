import { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/reducer/authReducer';

export const useAxios = () => {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const publicAxios = axios.create({
        baseURL: 'http://localhost:5000/api',
        withCredentials: true,
    });

    const privateAxios = axios.create({
        baseURL: 'http://localhost:5000/api',
        withCredentials: true,
    });

    useEffect(() => {
        // Set the default Authorization header if the access token is available
        if (auth.accessToken) {
            privateAxios.defaults.headers.common['Authorization'] = `Bearer ${auth.accessToken}`;
        }

        // Response interceptor
        const interceptor = privateAxios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                console.log(error);
                if (error.response.status === 403 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const response = await publicAxios.post('/token/refresh');
                        dispatch(setAuth({ accessToken: response.data.accessToken }));
                        privateAxios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
                        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                        return privateAxios(originalRequest);
                    } catch (err) {
                        return Promise.reject(err);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            privateAxios.interceptors.response.eject(interceptor);
        };
    }, [auth.accessToken, dispatch, publicAxios, privateAxios]);

    return { publicAxios, privateAxios };
};