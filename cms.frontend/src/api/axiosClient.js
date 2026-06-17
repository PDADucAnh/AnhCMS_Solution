import axios from 'axios';
import tokenService from '../services/tokenService';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'https://localhost:7224/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor — attach Bearer token
axiosClient.interceptors.request.use(
    (config) => {
        const token = tokenService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            tokenService.removeToken();
            window.location.href = '/login';
        }
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
