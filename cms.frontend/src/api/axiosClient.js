import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7224/api', // Updated to match launchSettings.json
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
